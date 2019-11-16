import { Client, Context, Config, PushPayload } from './types'

export default async function pushHandler(
    client: Client,
    context: Context,
    config: Config,
) {
    const payload = context.payload as PushPayload
    const components = payload.ref.split('/')
    const branchName = components[components.length - 1]
    const openedPrs = client.pulls.list({
        ...context.repo,
        state: 'open',
        base: branchName,
    })
}
