import { Client, Context, PullRequestPayload } from './types'

export default async function prHandler(client: Client, context: Context) {
    const pr = context.payload.pull_request as PullRequestPayload
    const {
        number,
        head: { sha },
        mergeable,
    } = pr
    if (!mergeable) {
        return
    }
    await client.pulls.merge({
        ...context.repo,
        pull_number: number,
        sha,
    })
}
