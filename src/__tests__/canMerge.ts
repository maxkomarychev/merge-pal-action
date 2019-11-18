import { canMergeByMergeable, canMergeByMergeableState } from '../canMerge'
import Octokit = require('@octokit/rest')

export function createPR(
    mergeable: boolean,
    mergeable_state: string,
    labels: string[],
): Octokit.PullsGetResponse {
    return {
        mergeable_state,
        mergeable,
        labels: labels.map((label) => ({ name: label })) as any,
    } as any
}

describe('canMergeByMergeable', () => {
    it('disallow merge when mergeable is false', () => {
        expect(canMergeByMergeable(createPR(false, '', []))).toEqual(false)
    })
    it('allow merge when mergeable is true', () => {
        expect(canMergeByMergeable(createPR(true, '', []))).toEqual(true)
    })
})

describe('canMergeByMergeableState', () => {
    it("disallow merge if mergeable_state it not equal to 'clean'", () => {
        expect(canMergeByMergeableState(createPR(false, 'dirty', []))).toEqual(
            false,
        )
    })
    it.each([['clean'], ['unstable']])(
        "allow merge if mergeable_state equals to '%s'",
        (state) => {
            expect(
                canMergeByMergeableState(createPR(false, state, [])),
            ).toEqual(true)
        },
    )
})
