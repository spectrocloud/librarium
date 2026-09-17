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

Someone with no model deployed can't connect anything, so a connect-only tutorial either assumes a state first-timers aren't in, or finishes without a working result.

**My suggestion: one tutorial.**

### Do we specifically name a model to deploy, or just say "the smallest one in your catalog"?

Since there is no curated catalog, an appliance box can only deploy weights someone uploaded to it. So naming a model quietly adds "go upload these weights first" to the prerequisites, which is a multi-hour job with its own how-to, and it makes the page wrong on any box that doesn't have that model.

**My suggestion: don't name one.**

### What do we do about telling people to switch off TLS verification?

Our lab boxes have a self-signed cert with no hostname on it, so Claude Code flat refuses to connect without `NODE_TLS_REJECT_UNAUTHORIZED=0`. But anyone with a proper cert shouldn't be setting it. I'm uneasy about "turn off certificate checking" being a step in our flagship tutorial.

**My suggestion: keep `NODE_TLS_REJECT_UNAUTHORIZED=0`, and add one sentence saying delete it if your appliance has a real certificate.**

### Which AIL version do we build the tutorial against?

Our public docs show 1.1.3, the lab boxes are on 1.1.4 and 1.1.5 is coming out soon.

**My suggestion: 1.1.5.**
