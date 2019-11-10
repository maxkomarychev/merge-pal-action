# Merge Pal

This action will automatically merge your PR once all requirements are met!

# v1 Roadmap

- [x] handle pr reviews
- [x] various types of merge: squash and rebase
- [x] blacklist based on labels
- [x] whitelist based on labels

# Usage

1. Specify desired mergeability rules in branch settings in your repository

2. If you already have another github actions executed on PR just add Merge Pal 
action in the end of the execution by specifying other jobs via `needs` key.
Or if you just starting: simply add file `.github/workflows/merge-pal-pr.yml` 
with the content:


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
          - uses: maxkomarychev/merge-pal-action@v0.3.0
            with:
              token: ${{ secrets.GITHUB_TOKEN }}

    ```


3. Rest of the events (labels, 3rdparty statuses etc) will be handled with 
separate workflow: `.github/workflows/merge-pal-other.yml` 


    ```yml
    name: Merge Pal (Other)

    on:
      status: {}
      pull_request_review:
        types:
          - submitted
          - edited
          - dismissed
      pull_request:
        types:
          - labeled
          - unlabeled

    jobs:
      print-event:
        runs-on: ubuntu-latest
      merge-pal:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v1
          - uses: maxkomarychev/merge-pal-action@v0.3.0
            with:
              token: ${{ secrets.GITHUB_TOKEN }}

    ```

## Configuration

Create file `.mergepal.yml` in root folder of your repo.
It can hold the following fields:

| field | type | description |
| --- | --- | --- |
| whitelist | string[] | whitelisted labels to perform automerge |
| blacklist | string[] | blacklisted labels to forbid automerge |
| method | "merge" \| "squash" \| "rebase" | method to use when merging |

## Friendly actions

- [PR updater](https://github.com/maxkomarychev/pr-updater-action) - keeps your pull requests in sync with main branch