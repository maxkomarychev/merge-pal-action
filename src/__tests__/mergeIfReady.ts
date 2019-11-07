const canMerge = jest.fn()
jest.mock('../canMerge', () => canMerge)
import mergeIfReady from '../mergeIfReady'
import { Client, Config } from '../types'
import { canMergeByLabels } from '../canMerge'
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
    })
    it('merges pr it can be merged', async () => {
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
        get.mockReturnValue(mockPR)
        canMerge.mockReturnValue(true)
        const whitelist = []
        const blacklist = []
        const config: Config = {
            whitelist,
            blacklist,
        }
        await mergeIfReady(
            (client as unknown) as Client,
            owner,
            repo,
            prNumber,
            sha,
            config,
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
        get.mockReturnValueOnce(mockPR)
        await mergeIfReady(
            (client as unknown) as Client,
            owner,
            repo,
            prNumber,
            sha,
            config,
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
