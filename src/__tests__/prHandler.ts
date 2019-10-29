import prHandler from '../prHandler'
import { Client, Context } from '../types'

describe('merge processor', () => {
    it('should attempt to merge with sha if it is mergeable', async () => {
        const client = {
            pulls: {
                merge: jest.fn(),
            },
        }
        const repo = 'nyan cat'
        const owner = 'john doe'
        const context = {
            repo: {
                repo,
                owner,
            },
            payload: {
                pull_request: {
                    number: 100500,
                    head: { sha: 'abcdef' },
                    mergeable: true,
                },
            },
        }
        await prHandler(
            (client as unknown) as Client,
            (context as unknown) as Context,
        )
        expect(client.pulls.merge).toHaveBeenCalledWith({
            repo,
            owner,
            pull_number: 100500,
            sha: 'abcdef',
        })
    })
    it('should not attempt to merge with sha if it is not mergeable', async () => {
        const client = {
            pulls: {
                merge: jest.fn(),
            },
        }
        const repo = 'nyan cat'
        const owner = 'john doe'
        const context = {
            repo: {
                repo,
                owner,
            },
            payload: {
                pull_request: {
                    number: 100500,
                    head: { sha: 'abcdef' },
                    mergeable: false,
                },
            },
        }
        await prHandler(
            (client as unknown) as Client,
            (context as unknown) as Context,
        )
        expect(client.pulls.merge).toBeCalledTimes(0)
    })
})
