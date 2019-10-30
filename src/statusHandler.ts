import { Client, Context, StatusPayload } from './types'
import mergeIfReady from './mergeIfReady'

export default async function statusHandler(client: Client, context: Context) {
    const event = context.payload as StatusPayload
    const branchNames = event.branches.map((branch) => branch.name)
    console.log('Commit belongs to branches: ', branchNames)
    const prs = await Promise.all(
        branchNames.map((branch) =>
            client.pulls.list({
                ...context.repo,
                head: branch,
                state: 'open',
            }),
        ),
    )
    const flatPRs = prs.flatMap((item) => {
        return item.data.map((pr) => pr)
    })
    await Promise.all(
        flatPRs.map((pr) =>
            mergeIfReady(
                client,
                context.repo.owner,
                context.repo.repo,
                pr.number,
                event.sha,
            ),
        ),
    )
}
