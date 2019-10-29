# Merge Pal

This action will automatically merge your PR once all requirements are met!

# v1 Roadmap

- [ ] handle pr reviews
- [ ] various types of merge: squash and rebase
- [ ] blacklist based on labels
- [ ] whitelist based on labels

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
          - uses: maxkomarychev/merge-pal-action@v0.1.0
            with:
              token: ${{ secrets.GITHUB_TOKEN }}

    ```


3. If you are using other checks maintained by 3rdparty services you'd need to
add another workflow relevant for `status` events. This workflow will be 
executed every time a 3rdparty service finishes the check:


    ```yml
    name: Merge Pal (Status)

    on: status

    jobs:
      print-event:
        runs-on: ubuntu-latest
      merge-pal:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v1
          - uses: maxkomarychev/merge-pal-action@v0.1.0
            with:
              token: ${{ secrets.GITHUB_TOKEN }}

    ```
