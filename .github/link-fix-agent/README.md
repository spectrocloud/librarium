# Link Fix Agent

Every Monday, the `URL checks` workflow reports the docs' broken external links, and a writer fixes them by hand. The
link fix agent does that fix on a GitHub runner instead: it fixes the links, has a second agent review the fix, opens a
PR, tests the deploy preview, and merges when every check agrees.

The workflow is `.github/workflows/link-fix-agent.yaml`. This folder holds everything it runs.

## How a Run Works

| Step | What runs                                                          | What it decides                                         |
| ---- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| 1    | linkinator, with the weekly report's config                        | Which external links are broken                         |
| 2    | Fixer agent (Opus) with `fix-broken-links/SKILL.md`                | The edits                                               |
| 3    | `check-link-fix-diff.mjs`                                          | Whether the edits follow the rules (informs step 5)     |
| 4    | Reviewer agent (Haiku) with `pr-review-buddy`, in a new session    | Review findings                                         |
| 5    | Fixer agent, same session, with `prompts/address-review.md`        | Fixes for the findings, and whether it is confident     |
| 6    | `check-link-fix-diff.mjs` again                                    | Whether a PR may open at all                            |
| 7    | `backport-labels.mjs`, `write-pr-text.mjs`, `open-pr.mjs`          | Backport labels, the PR text, and the PR                |
| 8    | `wait-for-ci.mjs`                                                  | Whether every CI check passed and the preview built     |
| 9    | `check-preview.mjs`, then the fixer with `prompts/test-preview.md` | Whether the preview shows the fix, and final confidence |
| 10   | `merge-or-hand-off.mjs`                                            | Merge, or hand off to a human                           |

The agents decide what to edit. The scripts decide whether the edits are acceptable, so a bad fix cannot talk its way
into a PR.

**Merging.** The PR merges only when every CI check passed, the preview check passed, and the fixer is still confident.
The master ruleset requires a docs-education code-owner approval and allows no bypass, so the direct merge fails today.
The job then turns on auto-merge, and the PR merges on its first approval. If the bot ever gets a bypass, the same step
merges with no code change.

**Dry runs.** A PR that changes this folder or the workflow runs the whole flow without pushing or opening a PR, in two
cases: `live` (today's docs) and `replay-nov02` (the docs before the human fix in 516ac87b5, as an answer key).
Production stands in for the deploy preview in the replay.

## Files

| File                        | Purpose                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `fix-broken-links/SKILL.md` | The fixer's instructions                                                           |
| `prompts/`                  | The reviewer's CI instructions, the fixer's later prompts, and the decision schema |
| `check-link-fix-diff.mjs`   | The diff rules: which files may change, which URLs may go, and new URLs must load  |
| `check-preview.mjs`         | Finds the preview pages for each changed file and checks their links               |
| `gather-review.mjs`         | Prepares the reviewer's inputs: the diff, added lines, and Vale results            |
| `backport-labels.mjs`       | Labels the version branches where the fix applies cleanly                          |
| `write-pr-text.mjs`         | Writes the PR description and the review comment                                   |
| `open-pr.mjs`               | Commits, pushes, and opens or updates the PR                                       |
| `wait-for-ci.mjs`           | Waits for CI and finds the deploy preview                                          |
| `merge-or-hand-off.mjs`     | Merges or hands off, and comments why                                              |
| `agent-run.mjs`             | Checks each agent run's tools and output, and prints its cost                      |
| `job-summary.mjs`           | Writes the job summary                                                             |
| `lib/`                      | Helpers the scripts share: URLs, running commands, and command-line plumbing       |
| `test/`                     | Unit tests                                                                         |

Each script exports its logic as small functions and runs as a command only when Node starts it directly, so the tests
import the functions without side effects. Each script's header comment gives its usage.

## Tests

Run the unit tests from the repository root. They need no network, no `node_modules`, and no GitHub token.

```shell
node --test ".github/link-fix-agent/test/*.test.mjs"
```

The workflow runs them before every agent run.

## Security

- Neither agent holds a GitHub token. The checkout keeps no credentials, and the Vault token stays in step outputs that
  only the checkout and GitHub steps read.
- Each agent gets an exact tool set, and `agent-run.mjs` fails the job if a run started with anything else. The fixer
  has no shell. The reviewer's shell runs only Vale and read-only git.
- Fetched web pages are untrusted input. The diff check and the preview check decide, not the prompts.
