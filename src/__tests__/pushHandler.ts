import pushHandler from '../pushHandler'
import { Client, Context, Config } from '../types'

const mockList = jest.fn()
const merge = jest.fn()
const get = jest.fn()

const client = {
    pulls: {
        list: mockList,
        // merge,
        get,
    },
}

describe('pushHandler', () => {
    it('updates all pull requests whose target branch is the one that was pushed', async () => {
        const repo = 'repo'
        const owner = 'johndoe'
        const context = {
            repo: { repo, owner },
            eventName: 'pull_request_review',
            payload: {
                ref: 'refs/heads/master',
                after: 'abcdef',
                // pull_request: {
                //     number: 42,
                //     head: { sha: 'abcdef' },
                // },
            },
        }
        const config = {}
        await pushHandler(
            (client as unknown) as Client,
            (context as unknown) as Context,
            (config as unknown) as Config,
        )
        expect(mockList).toHaveBeenCalledWith({
            owner,
            repo,
            state: 'open',
            base: 'master',
        })
    })
})
