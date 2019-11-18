import Octokit = require('@octokit/rest')

export function canMergeByMergeable(pr: Octokit.PullsGetResponse) {
    return pr.mergeable
}
export function canMergeByMergeableState(pr: Octokit.PullsGetResponse) {
    return pr.mergeable_state === 'clean' || pr.mergeable_state === 'unstable'
}
export default function canMerge(
    pr: Octokit.PullsGetResponse,
    whitelist: string[],
    blacklist: string[],
) {
    const byMergeable = canMergeByMergeable(pr)
    const byMergeableState = canMergeByMergeableState(pr)
    console.log('by mergeable', byMergeable)
    console.log('by mergeable state', byMergeableState)
    return byMergeable && byMergeableState
}
