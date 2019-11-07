import Octokit = require('@octokit/rest')

export function canMergeByMergeable(pr: Octokit.PullsGetResponse) {
    return pr.mergeable
}
export function canMergeByMergeableState(pr: Octokit.PullsGetResponse) {
    return pr.mergeable_state === 'clean' || pr.mergeable_state === 'unstable'
}
export function canMergeByLabels(
    pr: Octokit.PullsGetResponse,
    whitelist: string[],
    blacklist: string[],
) {
    if (whitelist.length === 0 && blacklist.length === 0) {
        return true
    }
    const labels = pr.labels.map((label) => label.name)
    if (blacklist.length) {
        const matchedBlack = labels.filter((label) => blacklist.includes(label))
        if (matchedBlack.length > 0) {
            return false
        } else {
            return true
        }
    }
    if (whitelist.length) {
        const matchedWhite = labels.filter((label) => whitelist.includes(label))
        return matchedWhite.length > 0
    }
}

export default function canMerge(
    pr: Octokit.PullsGetResponse,
    whitelist: string[],
    blacklist: string[],
) {
    const byMergeable = canMergeByMergeable(pr)
    const byMergeableState = canMergeByMergeableState(pr)
    const byLabels = canMergeByLabels(pr, whitelist, blacklist)
    console.log('by mergeable', byMergeable)
    console.log('by mergeable state', byMergeableState)
    console.log('by labels', byLabels)
    return byMergeable && byMergeableState && byLabels
}
