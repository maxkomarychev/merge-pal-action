import {
    canMergeByMergeable,
    canMergeByMergeableState,
    canMergeByLabels,
} from '../canMerge'
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

describe('canMergeByLabels', () => {
    it('allows merge with any labels if blacklist and whitelist are empty', () => {
        expect(canMergeByLabels(createPR(false, '', []), [], [])).toBe(true)
        expect(canMergeByLabels(createPR(false, '', ['white']), [], [])).toBe(
            true,
        )
        expect(canMergeByLabels(createPR(false, '', ['black']), [], [])).toBe(
            true,
        )
        expect(
            canMergeByLabels(createPR(false, '', ['white', 'black']), [], []),
        ).toBe(true)
    })
    it('allows merge if whitelist label exists while blacklist is empty', () => {
        const whitelist = ['white']
        const blacklist = []
        expect(
            canMergeByLabels(
                createPR(false, '', ['white', 'black']),
                whitelist,
                blacklist,
            ),
        ).toEqual(true)
    })
    it('disallows merge if no labels match whitelist', () => {
        const whitelist = ['white']
        const blacklist = []
        expect(
            canMergeByLabels(
                createPR(false, '', ['yellow', 'black']),
                whitelist,
                blacklist,
            ),
        ).toEqual(false)
    })
    it('disallows merge when whitelist and blacklists exist but labels are empty', () => {
        const whitelist = ['white']
        const blacklist = ['black']
        expect(
            canMergeByLabels(createPR(false, '', []), whitelist, blacklist),
        ).toEqual(false)
    })
    it('disallows merge even if one label matches blacklist', () => {
        const whitelist = []
        const blacklist = ['black']
        expect(
            canMergeByLabels(
                createPR(false, '', ['yellow', 'white', 'black']),
                whitelist,
                blacklist,
            ),
        ).toEqual(false)
    })
    it('allows merge when none of pr labels match blacklist', () => {
        const whitelist = []
        const blacklist = ['black']
        expect(
            canMergeByLabels(
                createPR(false, '', ['yellow', 'white']),
                whitelist,
                blacklist,
            ),
        ).toEqual(true)
    })
    it('disallows merge when both black and white labels match', () => {
        const whitelist = ['white']
        const blacklist = ['black']
        expect(
            canMergeByLabels(
                createPR(false, '', ['white', 'black']),
                whitelist,
                blacklist,
            ),
        ).toBe(false)
    })
})
