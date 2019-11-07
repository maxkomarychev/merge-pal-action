import { Client, Context, PullRequestPayload, Config } from './types'
import mergeIfReady from './mergeIfReady'

export default async function prHandler(
    client: Client,
    context: Context,
    config: Config,
) {
    const {
        repo: { repo, owner },
    } = context
    const pr = context.payload.pull_request as PullRequestPayload
    const {
        number,
        head: { sha },
    } = pr
    await mergeIfReady(client, owner, repo, number, sha, config)
}
