import prHandler from '../prHandler'
import { Client, Context } from '../types'

describe('merge processor', () => {
    it('should attempt to merge with sha', async () => {
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
})
