const isEnabledForPR = jest.fn()
jest.mock('../isEnabledForPR', () => isEnabledForPR)
const canMerge = jest.fn()
jest.mock('../canMerge', () => canMerge)
import mergeIfReady from '../mergeIfReady'
import { Client, Config } from '../types'
const merge = jest.fn()
const get = jest.fn()

const client = {
    pulls: {
        merge,
        get,
    },
}

describe('mergeIfReady', () => {
    beforeEach(() => {
        merge.mockClear()
        get.mockClear()
        canMerge.mockClear()
        isEnabledForPR.mockClear()
    })
    it('exits early if automation is not enabled', async () => {
        const prNumber = 42
        const repo = 'repo'
        const owner = 'owner'
        const sha = 'abcdef'
        canMerge.mockReturnValue(false)
        const mockPR = {
            data: {
                number: prNumber,
                mergeable: false,
                mergeable_state: 'clean',
            },
        }
        const whitelist = []
        const blacklist = []
        const config: Config = {
            whitelist,
            blacklist,
        }
        isEnabledForPR.mockReturnValueOnce(false)
        get.mockReturnValueOnce(mockPR)
        await mergeIfReady(
            (client as unknown) as Client,
            owner,
            repo,
            prNumber,
            sha,
            config,
        )
        expect(isEnabledForPR).toHaveBeenCalledTimes(1)
        expect(isEnabledForPR).toHaveBeenCalledWith(
            mockPR.data,
            config.whitelist,
            config.blacklist,
        )
        expect(get).toHaveBeenCalledTimes(1)
        expect(get).toHaveBeenCalledWith({
            owner,
            repo,
            pull_number: prNumber,
        })
        expect(canMerge).toHaveBeenCalledTimes(0)
        expect(merge).toHaveBeenCalledTimes(0)
    })
    it.each`
        method
        ${undefined}
        ${'merge'}
        ${'squash'}
        ${'rebase'}
    `('merges pr with $method if it can be merged', async ({ method }) => {
        const prNumber = 42
        const repo = 'repo'
        const owner = 'owner'
        const sha = 'abcdef'
        const mockPR = {
            data: {
                number: prNumber,
                mergeable: true,
                mergeable_state: 'clean',
            },
        }
        isEnabledForPR.mockReturnValueOnce(true)
        get.mockReturnValue(mockPR)
        canMerge.mockReturnValue(true)
        const whitelist = []
        const blacklist = []
        const config: Config = {
            whitelist,
            blacklist,
            method,
        }
        await mergeIfReady(
            (client as unknown) as Client,
            owner,
            repo,
            prNumber,
            sha,
            config,
        )
        expect(isEnabledForPR).toHaveBeenCalledWith(
            mockPR.data,
            config.whitelist,
            config.blacklist,
        )
        expect(get).toHaveBeenCalledTimes(1)
        expect(get).toHaveBeenCalledWith({
            owner,
            repo,
            pull_number: prNumber,
        })
        expect(canMerge).toHaveBeenCalledTimes(1)
        expect(canMerge).toHaveBeenCalledWith(mockPR.data, whitelist, blacklist)
        expect(merge).toHaveBeenCalledTimes(1)
        expect(merge).toHaveBeenCalledWith({
            owner,
            repo,
            pull_number: prNumber,
            sha,
            merge_method: method,
        })
    })
    it('does not merge pr if it is not allowed to merge', async () => {
        const prNumber = 42
        const repo = 'repo'
        const owner = 'owner'
        const sha = 'abcdef'
        canMerge.mockReturnValue(false)
        const mockPR = {
            data: {
                number: prNumber,
                mergeable: false,
                mergeable_state: 'clean',
            },
        }
        const whitelist = []
        const blacklist = []
        const config: Config = {
            whitelist,
            blacklist,
        }
        isEnabledForPR.mockReturnValueOnce(true)
        get.mockReturnValueOnce(mockPR)
        await mergeIfReady(
            (client as unknown) as Client,
            owner,
            repo,
            prNumber,
            sha,
            config,
        )
        expect(isEnabledForPR).toHaveBeenCalledTimes(1)
        expect(isEnabledForPR).toHaveBeenCalledWith(
            mockPR.data,
            config.whitelist,
            config.blacklist,
        )
        expect(get).toHaveBeenCalledTimes(1)
        expect(get).toHaveBeenCalledWith({
            owner,
            repo,
            pull_number: prNumber,
        })
        expect(canMerge).toHaveBeenCalledTimes(1)
        expect(canMerge).toHaveBeenCalledWith(mockPR.data, whitelist, blacklist)
        expect(merge).toHaveBeenCalledTimes(0)
    })
})
