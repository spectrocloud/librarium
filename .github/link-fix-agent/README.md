# Link Fix Agent

Every Monday, the `URL checks` workflow reports the docs' broken external links, and a writer fixes them by hand. The
link fix agent does that fix on a GitHub runner instead. Small agents each do one job: research a link, update the text
around a changed resource, review the fix, answer the review, or test the deploy preview. Scripts do everything else,
including every URL swap and every decision that gates the PR or the merge.

The workflow is `.github/workflows/link-fix-agent.yaml`. This folder holds everything it runs.

## How a Run Works

| Step | What runs                                                     | What it does or decides                                             |
| ---- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1    | linkinator, with the weekly report's config                   | Lists the broken external links                                     |
| 2    | `research-links.mjs`: one **researcher** agent per broken URL | Finds each link's new home, or what changed, with evidence          |
| 3    | `apply-research.mjs`                                          | Swaps the URLs, adds skip patterns, and writes the fix report       |
| 4    | **Guidance editor** agent, only when a resource changed       | Updates the text around that resource's link                        |
| 5    | `check-link-fix-diff.mjs`                                     | Checks the edits against the rules (informs step 7)                 |
| 6    | **Reviewer** agent (Haiku) with `pr-review-buddy`             | Reviews the fix in a fresh context                                  |
| 7    | **Responder** agent                                           | Fixes or declines each finding, and decides whether it is confident |
| 8    | `check-link-fix-diff.mjs` again                               | Whether a PR may open at all                                        |
| 9    | `backport-labels.mjs`, `write-pr-text.mjs`, `open-pr.mjs`     | Backport labels, the PR text, and the PR                            |
| 10   | `wait-for-ci.mjs`                                             | Whether every CI check passed and the preview built                 |
| 11   | `check-preview.mjs`, then the **preview tester** agent        | Whether the preview shows the fix, and final confidence             |
| 12   | `merge-or-hand-off.mjs`                                       | Merge, or hand off to a human                                       |

Each agent starts a fresh session with only the inputs and tools that its job needs:

| Agent           | Model | Tools                                         | Inputs                                                    | Output                         |
| --------------- | ----- | --------------------------------------------- | --------------------------------------------------------- | ------------------------------ |
| Researcher      | Opus  | WebFetch, WebSearch                           | One URL, and the docs lines and sections that use it      | `prompts/research.schema.json` |
| Guidance editor | Opus  | Read, and Edit on the files that use the link | `guidance-tasks.json`, in the prompt                      | A summary for the PR           |
| Reviewer        | Haiku | Read, Grep, Glob, Skill, and Vale and printf  | The `gather-review.mjs` output                            | The review report              |
| Responder       | Opus  | Read, and Edit on the changed docs files      | The review, the diff check, and the fix report            | `prompts/decision.schema.json` |
| Preview tester  | Opus  | WebFetch                                      | The preview check, CI, the diff check, and the fix report | `prompts/decision.schema.json` |

**Merging.** The PR merges only when every CI check passed, the link checker verified every new URL, the fix added no
linkinator skip pattern, the preview check passed, and both the responder and the preview tester are confident. A person
approves every skip-list change. The master ruleset requires a docs-education code-owner approval and allows no bypass,
so the direct merge fails today. The job then turns on auto-merge, and the PR merges on its first approval. If the bot
ever gets a bypass, the same step merges with no code change. Before a run pushes to the rolling PR, it turns off any
auto-merge that an earlier run left on, so an approval cannot merge the new commits before this run's checks pass. If a
person has committed to the rolling PR, the run leaves that PR alone and comments that this week's update was skipped.
The skipped links come back in next week's report.

**Dry runs.** A PR that changes this folder or the workflow runs the whole flow without pushing or opening a PR, in two
cases: `live` (today's docs) and `replay-nov02` (the docs before the human fix in 516ac87b5, as an answer key).
Production stands in for the deploy preview in the replay.

## Files

| File                      | Purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `prompts/`                | Each agent's instructions, and the research and decision schemas                              |
| `research-links.mjs`      | Runs one researcher per broken URL, a few at a time, and checks each result                   |
| `apply-research.mjs`      | Applies the research to the docs, and writes the fix report and the guidance tasks            |
| `render-prompt.mjs`       | Fills a prompt template with values and file contents                                         |
| `check-link-fix-diff.mjs` | The diff rules: which files may change, which URLs may go, new URLs must load, no credentials |
| `check-preview.mjs`       | Finds the preview pages for each changed file and checks their links                          |
| `gather-review.mjs`       | Prepares the reviewer's inputs: the diff, added lines, and Vale results                       |
| `backport-labels.mjs`     | Labels the version branches where the fix applies cleanly                                     |
| `write-pr-text.mjs`       | Writes the PR description and the review comment                                              |
| `open-pr.mjs`             | Commits, pushes, and opens or updates the PR                                                  |
| `wait-for-ci.mjs`         | Waits for CI and finds the deploy preview                                                     |
| `merge-or-hand-off.mjs`   | Merges or hands off, and comments why                                                         |
| `agent-run.mjs`           | Checks each agent run's tools and output, and prints its cost                                 |
| `job-summary.mjs`         | Writes the job summary                                                                        |
| `scan-secrets.mjs`        | Deletes any output file that holds a credential before the upload                             |
| `lib/`                    | Helpers the scripts share: URLs, credentials, running commands, and command-line plumbing     |
| `test/`                   | Unit tests                                                                                    |

Each script exports its logic as small functions and runs as a command only when Node starts it directly, so the tests
import the functions without side effects. Each script's header comment gives its usage.

## Tests

Run the unit tests from the repository root. They need no network, no `node_modules`, and no GitHub token.

```shell
node --test ".github/link-fix-agent/test/*.test.mjs"
```

The workflow runs them before every agent run.

## Security

- No agent holds a GitHub token. The checkout keeps no credentials, and the Vault token stays in step outputs that only
  the checkout and GitHub steps read.
- Each agent run gets an exact tool set, and `agent-run.mjs` and `research-links.mjs` fail the job if a run started with
  anything else.
- The agents that read web pages (the researchers and the preview tester) cannot read or edit files. The agents that
  edit files (the guidance editor and the responder) cannot read the web, and their Edit rules name each file they may
  change. The reviewer's shell runs only Vale and `printf`.
- A script, not an agent, makes every URL swap, from the researchers' results. The guidance editor and the responder
  edit text, so the diff check still compares each file's links in place, and a person approves every merge.
- The agents that can read files are denied `/proc` and `/sys`, where the Claude key lives in the process environment.
  The diff check, the PR step, the job summary, and the artifact upload all refuse text that holds a credential. A
  dedicated, spend-capped Claude key for this workflow is the recommended backstop. That is a follow-up for whoever
  manages the `CLAUDE_API_KEY` secret.
- The reviewer's skills come from the private docs-ai-context repo. The job checks it out just before the reviewer runs
  and deletes it when the reviewer step ends, so no other agent can read it. The reviewer's transcript stays out of the
  uploaded artifacts, so the private text never reaches this public repo's artifacts.
- Fetched web pages are untrusted input. The scripts and checks decide, not the prompts.
