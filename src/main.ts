import prHandler from './prHandler'
import { CoreModule, GitHubModule } from './types'
import statusHandler from './statusHandler'
import reviewHandler from './reviewHandler'
import pushHandler from './pushHandler'
import readConfig from './readConfig'

export default async function main(core: CoreModule, github: GitHubModule) {
    const token = core.getInput('token')
    const client = new github.GitHub(token)
    const config = readConfig('.mergepal.yml')
    console.log('config', JSON.stringify(config))
    console.log('context', JSON.stringify(github.context))
    const event = github.context.eventName
    switch (event) {
        case 'pull_request':
            await prHandler(client, github.context, config)
            break
        case 'status':
            await statusHandler(client, github.context, config)
            break
        case 'pull_request_review':
            await reviewHandler(client, github.context, config)
            break
        case 'push':
            await pushHandler(client, github.context, config)
            break
    }
}
