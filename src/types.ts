import * as github from '@actions/github'
import * as core from '@actions/core'

export type CoreModule = typeof core
export type GitHubModule = typeof github
export type Context = typeof github.context
export type Client = github.GitHub

export interface PullRequestPayload {
    number: number
    head: {
        sha: string
    }
    mergeable: boolean
}

interface StatusBranch {
    name: string
    commit: { sha: string }
}

export interface StatusPayload {
    sha: string
    state: 'pending' | 'success' | 'failure' | 'error'
    branches: StatusBranch[]
}

export interface PullRequestReviewPayload {
    pull_request: {
        number: number
        head: {
            sha: string
        }
    }
}
