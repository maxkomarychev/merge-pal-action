import prHandler from './prHandler'
import { CoreModule, GitHubModule } from './types'
import statusHandler from './statusHandler'
import reviewHandler from './reviewHandler'

export default async function main(core: CoreModule, github: GitHubModule) {
    const token = core.getInput('token')
    const client = new github.GitHub(token)
    console.log('ctx', JSON.stringify(github.context))
    const event = github.context.eventName
    console.log('EVENT!!!', event)
    switch (event) {
        case 'pull_request':
            await prHandler(client, github.context)
            break
        case 'status':
            await statusHandler(client, github.context)
            break
        case 'pull_request_review':
            await reviewHandler(client, github.context)
            break
    }
}
