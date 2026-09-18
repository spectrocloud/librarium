---
sidebar_position: 10
sidebar_label: "Get Started with the Palette MCP Server"
title: "Get Started with Palette MCP: List Clusters and Check Health"
description:
  "Configure the Palette MCP Server, list your clusters, download a kubeconfig, and check cluster and workload
  health—all through natural-language prompts."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The [Palette MCP Server](../../../automation/palette-mcp/palette-mcp.md) is an abstraction layer over the Palette API
that lets you interact with your Palette resources through natural language. Instead of navigating the Palette UI or
scripting against the API directly, you describe what you want in plain language to an MCP-capable client, and the
server translates that intent into API calls and returns a structured response. This tutorial confirms your MCP setup
works before moving on to more advanced workflows, such as automated troubleshooting or agentic pipelines.

This tutorial uses [Claude Code](https://code.claude.com/docs/en/overview), but the same prompts work with any
MCP-capable client—refer to the [Claude](../../../automation/palette-mcp/setup/mcp-setup-claude.md),
[Cursor](../../../automation/palette-mcp/setup/mcp-setup-cursor.md), or
[Antigravity](../../../automation/palette-mcp/setup/mcp-setup-antigravity.md) setup guides to configure the server with
these popular clients.

## What This Tutorial Covers

- How to configure the Palette MCP Server for your tenant
- How to list and identify clusters using natural-language prompts
- How to download a cluster's kubeconfig, and when to save it locally versus not
- How to verify both Palette-reported cluster status and actual in-cluster workload health
- How to troubleshoot the most common setup mistakes

## Prerequisites

**Software to install locally:**

- [Docker](https://docs.docker.com/get-docker/), to run the MCP server as a container—or a native binary if you prefer
  not to use Docker. Refer to the [Architecture](../../../automation/palette-mcp/architecture.md) page for the native
  binary and container image options.
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl), to verify workload health in Step 6.
- An MCP-capable client (Claude Code, Claude Desktop, Cursor, Antigravity, and so on)

**Account requirements:**

- A Palette account with access to the project containing your clusters.
- A Palette API key. Use a **project-scoped** key rather than a tenant-admin key—everything in this tutorial only needs
  project-level read access, and a project-scoped key limits the impact if the key is ever exposed. Refer to the
  [Create API Key](../../../user-management/authentication/api-key/create-api-key.md) guide.
- At least one existing cluster in that project (this tutorial does not create one).

:::info

The sample outputs below use `dev-sandbox`, `prod-us-east`, and `staging-eu` as illustrative cluster names—substitute
your own cluster and project names throughout.

:::

## Tools Used in This Tutorial

The Palette MCP Server exposes each Palette capability as a discrete tool. Your MCP client picks the right one
automatically based on your prompt—you do not call these directly—but knowing what is happening under the hood makes it
easier to interpret results and troubleshoot.

| Tool                      | What it does                                                                                                                                                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `read_clusters`           | Lists clusters, or fetches one by UID.                                                                                                                                                                                                                                                              |
| `read_cluster_status`     | A cluster's state and health—also the underlying tool used to poll a cluster's progress.                                                                                                                                                                                                            |
| `read_cluster_kubeconfig` | Fetches a cluster's [kubeconfig](../../../clusters/cluster-management/kubeconfig.md). `mode=readonly` (default) returns the standard kubeconfig, routed through the cluster's reverse proxy automatically if the `spectro-proxy` pack is installed. `mode=admin` returns cluster-admin credentials. |

All three are read-only and available without any special server flags. This tutorial does not use any tool that
creates, modifies, or deletes resources. Refer to the
[Palette MCP Server Operations](../../../automation/palette-mcp/palette-mcp-operations.md) page for the complete tool
list and more example use cases.

## Step 1—Get Your Palette Credentials

You need two things before configuring the server.

| Credential  | Required | Where to find it                                                                                       |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------ |
| **Host**    | Yes      | The hostname you use to sign in to Palette—for example, `your-tenant.spectrocloud.com`. No `https://`. |
| **API key** | Yes      | Palette UI → user menu → **API Keys** → create one.                                                    |

:::info

**Host format:** bare hostname only—no `https://` prefix, no trailing slash, no path. A malformed host fails loudly the
first time it is used (config save or first tool call) and never sends requests to the wrong host. Use the tenant
subdomain you sign in with (for example, `your-tenant.spectrocloud.com`).

:::

:::info

The server operates at **tenant scope** by default—every read returns results across every project your credential can
access. To scope a specific request to one project, mention the project by name or
[Project ID](../../../tenant-settings/projects/projects.md#project-id) in your prompt. If your account or API key lacks
tenant-wide access, a read without a project scope can return `OperationForbidden`—refer to
[Troubleshooting](#troubleshooting).

:::

## Step 2—Configure the Palette MCP Server

Add the Palette MCP server to your client's MCP configuration file, filling in the credentials from Step 1.

```json
{
  "mcpServers": {
    "palette": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "PALETTE_HOST",
        "-e",
        "PALETTE_API_KEY",
        "public.ecr.aws/palette-ai/palette-mcp-server:latest"
      ],
      "env": {
        "PALETTE_HOST": "your-tenant.spectrocloud.com",
        "PALETTE_API_KEY": "your-api-key"
      }
    }
  }
}
```

:::warning

**Upgrading from an older setup?** If your existing config still sets `PALETTE_PROJECT_UID`, remove it—the server
**refuses to start** while that variable is set. Project scoping moved from server-level config to a **per-call**
`project_uid` you mention in your prompt instead (refer to Step 3).

:::

:::info

**These credentials are stored in plaintext in your MCP client's config file.** Do not commit it to version control or
paste it into a shared channel—treat it like the API key itself. If your client supports referencing environment
variables instead of literal values (for example `${env:PALETTE_API_KEY}`), prefer that so the key stays in your shell
environment or OS credential store rather than on disk in this file.

:::

:::info

**Self-hosted Palette with a private CA?** Add `PALETTE_CA_FILE` (path to your CA bundle, mounted into the container)—or
`PALETTE_INSECURE_SKIP_VERIFY: "true"` for a lab only. SaaS tenants need neither.

:::

### Configure Multiple Environments

For dev/prod/RC separation, more than one tenant, or a self-hosted host, use named profiles instead of a single set of
environment variables. Run the interactive wizard from a terminal—not through your MCP client, since an API key or JWT
should not pass through chat context.

```shell
palette-mcp configure
```

The wizard prompts for a profile name, host, and an API key or JWT, validates the credential with a real API call, and
saves the entry to `~/.palette/auth_profiles.yaml` at file permissions `0600`. Run it again with a different name to add
more profiles.

The `configure` wizard and named profiles require the native `palette-mcp` binary (refer to
[Architecture](../../../automation/palette-mcp/architecture.md)); Docker-based setups pass a single set of environment
variables instead, as in Step 2 and in the
[Claude setup guide](../../../automation/palette-mcp/setup/mcp-setup-claude.md).

The resulting file holds one entry per environment.

```yaml
dev:
  host: example.spectrocloud.com
  api_key: your-dev-api-key
prod:
  host: your-tenant.spectrocloud.com
  api_key: your-prod-api-key
```

To keep the profiles file somewhere other than the default location, set `PALETTE_PROFILES_FILE` before starting your
MCP client. To target a specific profile, name it in your prompt—for example, "List clusters using the prod profile"—and
the assistant passes it as that call's `auth_profile` argument. Run `list_auth_profiles` first to view what is loaded
(names and hosts only, never secrets).

:::info

Self-hosted CA trust (`PALETTE_CA_FILE`) is configured once at server startup and applies to every named profile on the
server—it fits dev/prod/RC setups that share one self-hosted trust domain. A profile on a public SaaS host needs no CA
file, and fails TLS verification while one is set—run SaaS and self-hosted profiles on separate server instances.

:::

Restart your MCP client so it picks up the new server or profile. Then verify it connected: in Claude Code, run `/mcp`
and confirm `palette` is listed; in Claude Desktop, open the tools (plug) menu after restarting and confirm Palette
tools appear.

**If the server does not appear as connected**, refer to [Troubleshooting](#troubleshooting) below before continuing.

## Step 3—List Your Clusters

Prompt your MCP client.

```shell title="Example Prompt"
List all my clusters.
```

The assistant renders the response as a table.

| Cluster Name | Cloud | Status  |
| ------------ | ----- | ------- |
| prod-us-east | AWS   | Running |
| dev-sandbox  | AWS   | Running |
| staging-eu   | Azure | Running |

This runs at **tenant scope** by default (refer to the note in Step 1). To scope to one project, name it in your prompt.

```shell title="Example Prompt"
List clusters in project my-project-uid.
```

The assistant passes this as that call's `project_uid` argument. A project-scoped API key (refer to
[Prerequisites](#prerequisites)) cannot read at tenant scope—a call without a project scope returns `OperationForbidden`
(refer to [Troubleshooting](#troubleshooting)).

## Step 4—Identify Your Dev Cluster

Prompt your MCP client.

```shell title="Example Prompt"
Which of these is my dev cluster?
```

```shell hideClipboard title="Example Output"
Based on the naming, `dev-sandbox` looks like your dev cluster.
```

This step relies entirely on naming or tagging conventions—the MCP server has no built-in concept of "dev" vs. "prod."
Two things to watch for:

- **If your clusters are not clearly named or tagged**, tag them in Palette first: **Clusters** → select your cluster →
  **Tags**, then re-run the prompt. A consistent `environment: dev` tag across your fleet makes this and future prompts
  more reliable than relying on naming alone.
- **If more than one cluster could plausibly match** (for example, `dev-sandbox` and `dev-sandbox-2`), be specific in
  your prompt—name the cluster directly rather than asking the assistant to guess.

## Step 5—Download the Cluster's Kubeconfig

By default, `read_cluster_kubeconfig` only returns the [kubeconfig](../../../clusters/cluster-management/kubeconfig.md)
content in the response—nothing is written to disk. To have it saved locally, tell your MCP client where to put it.

```shell title="Example Prompt"
Download the kubeconfig for dev-sandbox and save it to ~/.palette/kubeconfig/dev-sandbox.yaml.
```

Saving to a local file requires the server to be started with `--allow-write` (refer to
[Enable Write Mode](#enable-write-mode) below). Without it, the path is ignored—the response includes a warning saying
so, but the kubeconfig content is still returned.

With write mode enabled, the response confirms the save.

```shell hideClipboard title="Example Output"
Kubeconfig saved to ~/.palette/kubeconfig/dev-sandbox.yaml
```

Step 6 uses `kubectl`, which needs an actual file on disk. To complete this tutorial as written, either enable
`--allow-write` so the assistant saves the file for you, or copy the returned kubeconfig content into a local file
yourself and set its permissions to `600`.

This uses `mode=readonly`—the least-privilege option, and the default. Use `mode=admin` only if you specifically need
cluster-admin access; say so explicitly in your prompt (for example, "download the **admin** kubeconfig for
dev-sandbox").

:::warning

A kubeconfig grants access to your cluster—treat it as a credential. Do not commit a saved file to version control,
paste its contents into a shared channel, or leave it in a world-readable location. Delete it once you no longer need
it.

:::

### Enable Write Mode

The server is read-only by default. Saving a kubeconfig to disk is the one thing in this tutorial that needs write mode.
Write mode also unlocks tools that create, modify, or delete resources (`create_cluster`, `delete_project`, etc.). Add
`--allow-write` after the image name in your Step 2 config.

```json
"args": [
  "run", "--rm", "-i",
  "-e", "PALETTE_HOST",
  "-e", "PALETTE_API_KEY",
  "public.ecr.aws/palette-ai/palette-mcp-server:latest",
  "--allow-write"
]
```

**Using the Docker setup from Step 2?** The server interprets `write_path` inside the container, so a save to
`~/.palette/kubeconfig/dev-sandbox.yaml` would land inside the container—out of reach of host-side `kubectl`. Add
`-v /<home>/.palette/kubeconfig:/tmp/kubeconfig` to the `docker run` arguments in Step 2 (your MCP client runs `docker`
directly, so use your absolute home path rather than `~`), have the prompt save to `/tmp/kubeconfig/dev-sandbox.yaml`,
and point `kubectl` at the host path `~/.palette/kubeconfig/dev-sandbox.yaml`. The server automatically removes
kubeconfig files from the mounted `/tmp/kubeconfig` folder when the container stops.

## Step 6—Check Cluster and Workload Health

Prompt your MCP client.

```shell title="Example Prompt"
Is dev-sandbox and its workloads healthy?
```

```shell hideClipboard title="Example Output"
Cluster dev-sandbox: Running / Healthy

$ kubectl get pods --all-namespaces --kubeconfig ~/.palette/kubeconfig/dev-sandbox.yaml
NAMESPACE     NAME                         READY   STATUS    RESTARTS
kube-system   coredns-6d4b75cb6d-abc12     1/1     Running   0
kube-system   kube-proxy-xyz89             1/1     Running   0
default       hello-universe-7f9c8-def34   1/1     Running   0

All pods are Running and Ready. No restarts detected.
```

This step checks health at two levels, and it is worth understanding the difference:

- **Palette-level status** (via `read_cluster_status`) reflects what Palette's control plane knows—whether the cluster
  is reachable and its declared state matches its actual state. A cluster can report `Running` here even if an
  individual workload inside it has failed.
- **Workload-level status** (via `kubectl`, using the kubeconfig from Step 5) reflects what is actually running inside
  the cluster—pod readiness, restart counts, and failure states like `CrashLoopBackOff` or `ImagePullBackOff`.

For example, if a pod were failing, the same prompt would surface something like this instead.

```shell hideClipboard title="Example Output"
$ kubectl get pods --all-namespaces --kubeconfig ~/.palette/kubeconfig/dev-sandbox.yaml
NAMESPACE   NAME                         READY   STATUS             RESTARTS
default     hello-universe-7f9c8-def34   0/1     ImagePullBackOff   0

1 pod is not ready: hello-universe-7f9c8-def34 (ImagePullBackOff).
```

## Troubleshooting

| Symptom                                                                         | Likely cause                                                      | Fix                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client does not list `palette`, or no Palette tools appear                      | Config not picked up                                              | Restart the client; check the config file path and JSON syntax; confirm Docker is running.                                                                                                                          |
| `OperationForbidden` on cluster reads                                           | Account/API key lacks tenant-wide access                          | Pass `project_uid` on the failing call to scope it to a project you can access—mention the project by name or UID in your prompt (Step 3).                                                                          |
| `401` or "expired API key" errors                                               | Wrong, expired, or revoked key                                    | Create a new key in the Palette UI and update `PALETTE_API_KEY`; re-check `PALETTE_HOST` has no `https://` prefix.                                                                                                  |
| Want to confirm whether the server is running read-only or with `--allow-write` | Mode is not reflected in the tool list itself                     | Call `delete_project` with a nonexistent UID (for example, `does-not-exist`). `PALETTE_WRITE_DISABLED` means read-only mode; `PALETTE_NOT_FOUND` means write mode is active. No real project is touched either way. |
| `PALETTE_NOT_FOUND` when requesting `mode=oidc`                                 | Expected—OIDC is not configured on that cluster's Kubernetes pack | Use the default `mode=readonly` instead, unless you specifically need OIDC-based auth.                                                                                                                              |
| Kubeconfig downloads but `write_path` is ignored                                | Server was not started with `--allow-write`                       | Add `--allow-write` (refer to [Enable Write Mode](#enable-write-mode)), or skip the local file and use the returned content directly.                                                                               |
| Kubeconfig downloads but `kubectl` cannot reach the cluster                     | Cluster is private/edge and lacks the proxy pack                  | Confirm the `spectro-proxy` pack is installed—the read-only kubeconfig relies on it to route traffic through Palette rather than requiring direct network access.                                                   |

## Security Best Practices

- Use a project-scoped API key, not a tenant-admin key, for day-to-day MCP use.
- Default to `mode=readonly` kubeconfig files; reserve `mode=admin` for tasks that specifically require cluster-admin
  privileges.
- Only enable `--allow-write` when you actually need it—everything in this tutorial except saving a kubeconfig locally
  works without it.
- Treat downloaded kubeconfig files as credentials—restrict file permissions, avoid committing them, and delete them
  once you are done.
- Rotate your Palette API key periodically, and immediately if you suspect it was exposed.

## Validate

You have completed this tutorial if you can:

- [ ] View a list of your clusters through a prompt—tenant-wide by default, or scoped to one project if you asked for
      it.
- [ ] Identify which cluster is your dev cluster.
- [ ] Retrieve a kubeconfig for that cluster, saved locally or used directly from the response.
- [ ] View a health summary that reports both Palette-level cluster status and actual pod status, not just one or the
      other.

## Cleanup

If you saved a kubeconfig in Step 5 and no longer need it, delete the local file.

```shell
rm ~/.palette/kubeconfig/dev-sandbox.yaml
```

With the Docker setup, the server automatically removes kubeconfig files from the mounted `/tmp/kubeconfig` folder when
the container stops—the file may already be gone.

## Next Steps

The Palette MCP server has many more capabilities than those explored in this tutorial. Refer to the
[Integrate Palette MCP in an Agentic Workflow](./integrate-palette-mcp-agentic.md) tutorial to build on this by driving
a full deploy-and-verify workflow through Langchain. For focused, skill-driven troubleshooting, refer to the
[cloud cluster](./cloud-triage-palette-mcp.md), [edge host](./edge-triage-palette-mcp.md),
[fleet health](./fleet-health-palette-mcp.md), and [access review](./access-review-palette-mcp.md) tutorials.
