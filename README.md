# Merge Pal

This action will help your prs to get merged!

# Features

- relises on mergability rules defined in your repository
- automatically updates your PR to be up to date with base branch
- supports whie and black lists through labels
- supports various types of merge: normal, squash and rebase
- integrates seamlessly into GitHub Actions workflows as well as any 3rdparty

# Usage

1. Specify desired mergeability rules in branch settings in your repository

2. Create workflow to handle various events that affect mergeability of PR (`.github/workflows/merge-pal-events.yml`):

    ```yml
    name: Merge Pal (events)

    on:
      push: {} # listen to push events and update prs depending on a branch
      status: {} # listen to commit status updates from 3rdparty integrations
      pull_request_review: # listen to reviews given to PR
        types:
          - submitted
          - edited
          - dismissed
      pull_request: # this is needed to support white/black lists
        types:
          - labeled
          - unlabeled

    jobs:
      # thats's all. single step is needed - if PR is mergeable according to
      # branch protection rules it will be merged automatically
      mergepal:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v1
          - uses: maxkomarychev/merge-pal-action@vX.Y.Z
            with:
              token: ${{ secrets.GITHUB_TOKEN }}

    ```

3. Add Merge Pal to the end of your existing check (if any) with GitHub Actions


    ```yml
    name: Merge Pal (PR)

    on:
      pull_request:
        types:
          - synchronize
          - opened

    jobs:
      test-this:
        runs-on: ubuntu-latest
        steps:
          - run: echo "All ok"
      test-that:
        runs-on: ubuntu-latest
        steps:
          - run: echo "All ok"
      mergepal-merge:
        runs-on: ubuntu-latest
        needs:
          # make sure all required jobs are listed here
          - test1-this
          - test1-that
        steps:
          - uses: actions/checkout@v1
          - uses: maxkomarychev/merge-pal-action@vX.Y.Z
            with:
              token: ${{ secrets.GITHUB_TOKEN }}

    ```


## Configuration

Various aspects of Merge Pal's behavior are configured thorugh configuration file.

Create file `.mergepal.yml` in root folder of your repo.
It can hold the following fields:

| field | type | description |
| --- | --- | --- |
| whitelist | string[] | whitelisted labels to perform automerge |
| blacklist | string[] | blacklisted labels to forbid automerge |
| method | "merge" \| "squash" \| "rebase" | method to use when merging |

example:

```yml
whitelist:
  - good-to-merge
blacklist:
  - wip
  - do-not-merge
method: squash
```
