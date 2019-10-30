const mockPRHandler = jest.fn()
jest.mock('../prHandler', () => mockPRHandler)
const mockStatusHandler = jest.fn()
jest.mock('../statusHandler', () => mockStatusHandler)
const mockReviewHandler = jest.fn()
jest.mock('../reviewHandler', () => mockReviewHandler)

import main from '../main'
import { CoreModule, GitHubModule } from '../types'

describe('main behavior', () => {
    afterEach(() => {
        mockStatusHandler.mockClear()
        mockPRHandler.mockClear()
        mockReviewHandler.mockClear()
    })
    describe('basic things', () => {
        it('should read inputs and initialize client', async () => {
            const mockInput = jest.fn().mockReturnValueOnce('token-123')
            const core = {
                getInput: mockInput,
            }
            const github = {
                context: {},
                GitHub: jest.fn(),
            }
            await main(
                (core as unknown) as CoreModule,
                (github as unknown) as GitHubModule,
            )
            expect(mockInput).toHaveBeenCalledWith('token')
            expect(github.GitHub).toHaveBeenCalledWith('token-123')
        })
    })
    describe('behavior on pull request', () => {
        it('should call merge processor', async () => {
            const mockInput = jest.fn().mockReturnValueOnce('token-123')
            const core = {
                getInput: mockInput,
            }
            const fakeClient = {}
            const github = {
                context: {
                    eventName: 'pull_request',
                },
                GitHub: jest.fn().mockReturnValue(fakeClient),
            }
            await main(
                (core as unknown) as CoreModule,
                (github as unknown) as GitHubModule,
            )
            expect(mockPRHandler).toHaveBeenCalledWith(
                fakeClient,
                github.context,
            )
            expect(mockStatusHandler).toHaveBeenCalledTimes(0)
            expect(mockReviewHandler).toHaveBeenCalledTimes(0)
        })
    })
    describe('behavior on status', () => {
        it('should call status handler on status event', async () => {
            const mockInput = jest.fn().mockReturnValueOnce('token-123')
            const core = {
                getInput: mockInput,
            }
            const fakeClient = {}
            const github = {
                context: {
                    eventName: 'status',
                },
                GitHub: jest.fn().mockReturnValue(fakeClient),
            }
            await main(
                (core as unknown) as CoreModule,
                (github as unknown) as GitHubModule,
            )
            expect(mockPRHandler).toHaveBeenCalledTimes(0)
            expect(mockReviewHandler).toHaveBeenCalledTimes(0)
            expect(mockStatusHandler).toHaveBeenCalledWith(
                fakeClient,
                github.context,
            )
        })
    })
    describe('behavior on review', () => {
        it('should call review handler on review event', async () => {
            const mockInput = jest.fn().mockReturnValueOnce('token-123')
            const core = {
                getInput: mockInput,
            }
            const fakeClient = {}
            const github = {
                context: {
                    eventName: 'pull_request_review',
                },
                GitHub: jest.fn().mockReturnValue(fakeClient),
            }
            await main(
                (core as unknown) as CoreModule,
                (github as unknown) as GitHubModule,
            )
            expect(mockPRHandler).toHaveBeenCalledTimes(0)
            expect(mockStatusHandler).toHaveBeenCalledTimes(0)
            expect(mockReviewHandler).toHaveBeenCalledWith(
                fakeClient,
                github.context,
            )
        })
    })
})
