import {
    Client,
    Context,
    StatusPayload,
    PullRequestReviewPayload,
    Config,
} from './types'
import mergeIfReady from './mergeIfReady'

export default async function reviewHandler(
    client: Client,
    context: Context,
    config: Config,
) {
    const event = context.payload as PullRequestReviewPayload
    await mergeIfReady(
        client,
        context.repo.owner,
        context.repo.repo,
        event.pull_request.number,
        event.pull_request.head.sha,
        config,
    )
}
