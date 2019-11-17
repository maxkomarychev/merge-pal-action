import pushHandler from '../pushHandler'
import { Client, Context, Config } from '../types'

const mockList = jest.fn()
const mockUpdateBranch = jest.fn()
const get = jest.fn()

const client = {
    pulls: {
        list: mockList,
        updateBranch: mockUpdateBranch,
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
            },
        }
        const config = {}
        mockList.mockResolvedValueOnce({
            data: [
                {
                    number: 10,
                    head: { sha: 'def' },
                },
                {
                    number: 100,
                    head: { sha: 'xyz' },
                },
            ],
        })
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
        expect(mockUpdateBranch).toHaveBeenNthCalledWith(1, {
            repo,
            owner,
            pull_number: 10,
            expected_head_sha: 'def',
        })
        expect(mockUpdateBranch).toHaveBeenNthCalledWith(2, {
            repo,
            owner,
            pull_number: 100,
            expected_head_sha: 'xyz',
        })
    })
})
