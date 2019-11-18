const isEnabledForPR = jest.fn()
jest.mock('../isEnabledForPR', () => isEnabledForPR)
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
    beforeEach(() => {
        mockList.mockClear()
        mockUpdateBranch.mockClear()
        get.mockClear()
        isEnabledForPR.mockClear()
    })
    it('exits early if not enabled for pr', async () => {
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
        isEnabledForPR.mockReturnValueOnce(false)
        const mockPR = {
            number: 10,
            head: { sha: 'def' },
        }
        mockList.mockResolvedValueOnce({
            data: [mockPR],
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
        expect(isEnabledForPR).toBeCalledTimes(1)
        expect(isEnabledForPR).lastCalledWith(mockPR, undefined, undefined)
        expect(mockUpdateBranch).toHaveBeenCalledTimes(0)
    })
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
        const mockPR1 = {
            number: 10,
            head: { sha: 'def' },
        }
        const mockPR2 = {
            number: 100,
            head: { sha: 'xyz' },
        }
        mockList.mockResolvedValueOnce({
            data: [mockPR1, mockPR2],
        })
        isEnabledForPR.mockReturnValue(true)
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
        expect(isEnabledForPR).toBeCalledTimes(2)
        expect(isEnabledForPR).toHaveBeenNthCalledWith(
            1,
            mockPR1,
            undefined,
            undefined,
        )
        expect(isEnabledForPR).toHaveBeenNthCalledWith(
            2,
            mockPR2,
            undefined,
            undefined,
        )
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
