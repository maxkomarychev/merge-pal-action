import { Client } from './types'

export default async function mergeIfReady(
    client: Client,
    owner: string,
    repo: string,
    number: number,
    sha: string,
) {
    const pr = await client.pulls.get({
        owner,
        repo,
        pull_number: number,
    })
    console.log('raw pr', pr)
    console.log(
        'pr and mergeable',
        pr.data.number,
        pr.data.mergeable,
        pr.data.mergeable_state,
    )
    if (pr.data.mergeable && pr.data.mergeable_state === 'clean') {
        await client.pulls.merge({
            owner,
            repo,
            pull_number: number,
            sha,
        })
    }
}
