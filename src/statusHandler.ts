import { Client, Context, StatusPayload } from './types'
import { REPL_MODE_SLOPPY } from 'repl'
import Octokit = require('@octokit/rest')

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
        console.log('item', JSON.stringify(item))
        return item.data.map((pr) => pr)
    })
    console.log('found prs', flatPRs.map((pr) => pr.number))
    const fullPRs = await Promise.all(
        flatPRs.map((pr) =>
            client.pulls.get({
                ...context.repo,
                pull_number: pr.number,
            }),
        ),
    )
    console.log(
        'prs mergeability',
        fullPRs.map((pr) => `${pr.data.number} :: ${pr.data.mergeable}`),
    )
    await Promise.all(
        fullPRs
            .filter((pr) => pr.data.mergeable)
            .map((pr) =>
                client.pulls.merge({
                    ...context.repo,
                    pull_number: pr.data.number,
                    sha: event.sha,
                }),
            ),
    )
}
