const mergeIfReady = jest.fn()
jest.mock('../mergeIfReady', () => mergeIfReady)

import reviewHandler from '../reviewHandler'
import { Client, Context, Config } from '../types'

const mockList = jest.fn()
const merge = jest.fn()
const get = jest.fn()

const client = {
    pulls: {
        list: mockList,
        merge,
        get,
    },
}

describe('review handler', () => {
    it('should try to merge pr for which review has been given', async () => {
        const owner = 'john doe'
        const repo = 'repo'
        const context = {
            repo: { repo, owner },
            eventName: 'pull_request_review',
            payload: {
                pull_request: {
                    number: 42,
                    head: { sha: 'abcdef' },
                },
            },
        }
        const fakeConfig = {}
        await reviewHandler(
            (client as unknown) as Client,
            (context as unknown) as Context,
            (fakeConfig as unknown) as Config,
        )
        expect(mergeIfReady).toHaveBeenCalledTimes(1)
        expect(mergeIfReady).toHaveBeenCalledWith(
            client,
            owner,
            repo,
            42,
            'abcdef',
            fakeConfig,
        )
    })
})
