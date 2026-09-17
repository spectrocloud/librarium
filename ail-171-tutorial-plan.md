# Tutorial: "Serve Your First Model to Claude Code"

## First draft preview

- You don't have to read this end-to-end. This is just for you to glance through.
- <https://deploy-preview-11981--docs-spectrocloud.netlify.app/paletteai-inference-launchpad/tutorials/serve-your-first-model>

## What they do vs what they learn

| What they do | What they learn |
| --- | --- |
| Deploy a model from the catalog | The catalog is what's on their appliance, not a vendor's menu |
| Watch GPU memory climb while weights load | "deployed" and "serving" aren't the same thing |
| Map three aliases on the **Routing** step | Claude Code asks by kind of work, and they decide what answers |
| Mint an API token | Access is per client, not per appliance |
| Paste the generated config | The appliance speaks the Anthropic API, so their tools just work |
| Ask a question, then ask another | Their appliance answers it, and every answer gets metered |

## Prerequisites

### The appliance

| They need | How they check | If they don't have it |
| --- | --- | --- |
| Inference Launchpad 1.1.5 | Version's at the bottom of the left main menu, under the **Grafana** link | Upgrade first. Point them to Upgrade the Platform |
| The console answering at `https://<appliance-address>` | Sign-in page loads in a browser | Get the address from whoever installed it |
| Installation completed, with a local admin account | Signing in lands on **Overview**, not **Settings > Setup** | Finish setup. Point them to Install the Appliance |
| At least one model uploaded to the node | **Cluster > Deploy model** lists at least one model | Upload weights. Point them to Upload a Model |

### On learner's laptop

| They need | How they check | If they don't have it |
| --- | --- | --- |
| Claude Code, already working against Anthropic's API | `claude` starts a session and answers something | Install it first. Point them to Claude Code docs. |
| A terminal: bash, zsh, or PowerShell | Any of the three is fine, AIL generates a block for each | n/a |
| `curl` and `jq` | `curl --version` and `jq --version` both answer | Install both |
| A network route to the appliance | Console loads in a browser on the same machine as the terminal | Ask their network admin |
| A small code repo on disk | Any project with a few files in it | Clone anything small, or make a folder with two or three files |

### Two credentials that could cause confusion

Tutorial will need to explain the difference.

| Credential | What it actually does |
| --- | --- |
| Admin sign-in | Gets you into the console. Created during installation, so they should already have it. Not used for API requests. |
| Client API token | Authenticates Claude Code. Minted in step 5, shown once. Won't sign you into the console. |

### Things they do not need

- A frontier provider key. Everything in this tutorial gets answered on their box.
- An API token — they mint one in step 5.
- A deployed model — they deploy one in step 3.
- Kubernetes, `kubectl`, or Helm.

### Starting state of the appliance

| The box has | The box does not have |
| --- | --- |
| Setup done and a working admin sign-in | Any model deployed. The **Cluster** page **Model** table is empty |
| At least one model uploaded, showing in the deploy catalog | Any clients. **Access & Policy > Clients** is empty |
| GPUs idle at `0` MiB | Any API tokens |
| Quota enforcement on, which is the default | Any traffic yet, so usage reads `0` |
| No frontier provider key, so it serves everything itself | Any frontier target in the routing picker, since egress is closed by default |

## Outline

If someone starts the tutorial with a model already serving, they skip 3 and 4. One line in the page handles that, no branching.

| # | Step | Result |
| --- | --- | --- |
| 1 | Sign in | **Overview**, status reading `all clear` |
| 2 | Hit the health endpoint | Real JSON from their appliance, no token needed, first win, ~1 min in |
| 3 | Deploy a model | It lands in the **Model** table, pending |
| 4 | Watch the weights load | GPU memory going up every time they re-run it — repeatable = good |
| 5 | Add a client, route it, mint a token | Three aliases pointing at their model, plus a token |
| 6 | Wire up Claude Code and request something | An answer in the terminal, off their own GPUs |
| 7 | Ask again, then find it in **Usage** | Requests and tokens under the client they named — repeatable = good. |

## How it ends

Two things they can change and watch happen, neither of which can break anything.

- Switch the sonnet tier to thinking on, ask the same question again. Now it reasons first, and takes longer.
- Reduce `CLAUDE_CODE_MAX_OUTPUT_TOKENS`, ask again. Answers get shorter.

## Decisions to make

### One tutorial covering deploy plus connect, or two shorter ones?

**Decision: one tutorial.**

### Do we specifically name a model to deploy, or just say "the smallest one in your catalog"?

**Decision: don't name one.**

### What do we do about telling people to switch off TLS verification?

**Decision: do not switch off TLS. Download the platform CA certificate and set `NODE_EXTRA_CA_CERTS`.**

### Which AIL version do we build the tutorial against?

**Decision: 1.1.5.**

### Should we incorporate the new interactive walkthrough?

Interactive onboarding and tutorials serve different purposes. Tutorials should be thorough, repeatable learning experiences that users can search, follow, and revisit. Interactive onboarding should be short, contextual guidance inside the product.

**Decision: do not incorporate walkthrough.**

## Live walkthrough log

Filled in as I run the tutorial end-to-end against a fresh appliance. One row per H2 step in the tutorial. For each row, capture **Expected** from the tutorial text, **Observed** from the live run, and **Deviation** as `none` or a short note. Screenshots go in `walkthrough-screenshots/` at the worktree root (also untracked, deleted before merge) and are referenced by filename.

### Environment

| Field | Value |
| --- | --- |
| Appliance version | 1.1.5 |
| Walk date | (fill in on start) |
| Walker | Brent |
| GPU count and model | (fill in from `/healthz`) |
| Model uploaded to the node | (name, size) |
| Fresh install or reset | (which, and how) |
| Cert type on the appliance | platform-issued / publicly trusted / plain HTTP |

### Cross-cutting observations to capture once

| Item | Answer |
| --- | --- |
| Console version string, exactly as rendered | |
| Does **Overview** show `all clear` on a healthy box? | |
| Does the **Connect a coding agent** panel open from **Overview**? | |
| Is the **Claude Code** tab labelled that, or **Claude Code CLI**? | |
| Does the panel show a **CA certificate** step for this cert type? | |
| What filename does the browser save the CA cert as? | |
| Does the **Connect Coding Agent** control render in title case? | |
| `/healthz` response shape, verbatim | (paste JSON) |
| Does an `ANTHROPIC_DEFAULT_FABLE_MODEL=claude-fable-5` alias route by default? | |
| Does any surface still print "Anthropic model aliases return not served"? | |
| Does the **Tier Map** row have an `edit` control matching `set-tier-thinking.md`? | |
| Does the **Usage** page show a **Data window** control? | |

### Step-by-step log

| # | Step (H2) | Expected | Observed | Deviation | Screenshot |
| --- | --- | --- | --- | --- | --- |
| 0 | Prereqs (What You Need) | Version 1.1.5+, admin sign-in, one uploaded model, curl+jq | | | n/a |
| 1 | Sign In to the Console | Overview loads; status reads `all clear` | | | `01-overview.png` |
| 2 | Download the Platform CA Certificate | **Connect a coding agent** opens from Overview; **Claude Code** tab; **CA certificate** step saves `palette-ai-inference-launchpad-ca.crt` to Downloads | | | `02-connect-panel.png`, `02-ca-download.png` |
| 3 | Ask the Appliance About Its GPUs | `curl --cacert …/healthz \| jq '.gpus'` returns an array; every `mem_used_mib` is `0` | | | `03-healthz-first.png` (terminal) |
| 4 | Deploy a Model | **Cluster > Models > Deploy New Model** dialog; select chat model + node; **Confirm & Apply** puts a row in the **Model** table with state `deploying` or `smoke-testing` | | | `04-deploy-dialog.png`, `04-model-pending.png` |
| 5 | Watch the Weights Load | Same `curl` shows `mem_used_mib` climbing on one GPU and `temp_c` rising; console **Model** row settles to `ready`/`serving` with `1/1 healthy` | | | `05-healthz-climbing.png`, `05-model-serving.png` |
| 6 | Create a Client and Its API Token | 9-step wizard runs; **Routing** step accepts the three aliases; **Create client** reveals a `lpai_` token exactly once | | | `06-wizard-routing.png`, `06-token-reveal.png` |
| 7 | Point Claude Code at the Appliance | Panel emits a block matching the example (values may differ per appliance); `claude --print "reply with exactly CC_OK and nothing else"` returns `CC_OK` | | | `07-panel-config.png`, `07-cc-ok.png` (terminal) |
| 8 | Ask a Question, and Then Ask Another | `claude` starts; both coding questions answered by the local model | | | `08-claude-answer.png` (terminal) |
| 9 | Monitor Your Token Usage | **Usage > Overview** **Totals** card non-zero; **Local vs external** shows zero external; **By Client** row for `coding-agent` non-zero | | | `09-usage-totals.png`, `09-usage-by-client.png` |
| 10 | Change Two Things and Watch — sonnet thinking on | **Routing > Tier Map > claude-sonnet- row > edit > Thinking on > Apply tier**; same question takes noticeably longer | | | `10-thinking-on.png`, `10-longer-reply.png` (terminal) |
| 11 | Change Two Things and Watch — lower output ceiling | `export CLAUDE_CODE_MAX_OUTPUT_TOKENS=1024` then restart `claude`; reply visibly shorter | | | `11-short-reply.png` (terminal) |

### Product bugs and doc bugs found

Free-form list, filed as I go.

- (none yet)

### Tutorial edits queued from the walk

Grouped by tutorial section, so the follow-up commit is easy to write.

- (none yet)
