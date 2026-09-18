---
sidebar_position: 30
sidebar_label: "Troubleshoot an Edge Host with Palette MCP"
title: "Troubleshoot an Edge Host with Palette MCP: Edge Triage"
description:
  "Enable the edge diagnostic tools, connect to an edge host over SSH, and run the same first-10-minutes triage sequence
  field engineers use manually, through natural-language prompts."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The Palette MCP Server ships a small, fixed catalog of read-only diagnostic commands for edge hosts, using
`systemctl status` and `journalctl` against a closed list of systemd units. Every command in this catalog is fixed: the
`service` argument is validated against a closed enum _before_ the server opens an SSH connection, so a typo or an
out-of-range argument fails safely instead of running something unexpected on a host you do not fully control. The same
flag also registers `run_edge_command`, a separately allowlist-gated free-text tool, so it appears in your client's tool
list too.

In this tutorial, you enable the edge diagnostic tools, connect to an edge host over direct SSH, run the same
first-10-minutes triage sequence field engineers use manually, and learn to read the two exit-code conventions the
catalog relies on. This tutorial uses Claude Code, but the same prompts work with any MCP-capable client.

## What You Will Learn

- How to enable the edge diagnostic tools (`--allow-direct-ssh`)
- How to identify an edge host, including when Palette-side auto-discovery is not available
- How to run the fixed status/logs catalog and read its two exit-code conventions correctly
- How the catalog rejects bad input before dialing the host, and what a host-key mismatch looks like
- How to map catalog output onto common edge failure patterns (registration, boot deadlock, NotReady nodes)
- When to escalate from host-level checks to Palette's API-tier tools

## Prerequisites

**Software to install locally:**

- Completed [Get Started with Palette MCP](./get-started-palette-mcp.md)—this tutorial assumes your MCP server and
  client are already configured.
- A `palette-mcp` server registered with your client, started with `--allow-direct-ssh` (Step 1 below).

**Account / access requirements:**

- SSH key-based access to at least one edge host, as a user permitted to run `systemctl status` and `sudo -n journalctl`
  (passwordless sudo for journal reads—the catalog never prompts for a sudo password).
- Optional: a Palette API key with visibility into the edge host's fleet, for auto-discovery via `read_edge_hosts`. Not
  required—you can always supply the host directly (Step 2).

:::info

The examples below use `<EDGE_HOST_IP>`, `<EDGE_HOST_NAME>`, `<EDGE_HOST_USER>`, and `<PRIVATE_KEY_PATH>` as
placeholders—substitute your own values throughout.

:::

## Tools Used in This Tutorial

| Tool                                                        | What it does                                                                                                                                                                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `read_edge_hosts`                                           | Lists edge hosts known to Palette, with `state` and `health_state`. Requires Palette API reachability—Step 2 covers the fallback if it is not reachable from where you are running this.                                    |
| `run_edge_diagnostic`                                       | Runs one fixed diagnostic (`status` or `logs`) against one systemd unit, over direct SSH or the Hubble tunnel—whichever transport is enabled and supplied with credentials. This is the tool this tutorial uses throughout. |
| `read_edge_service_status` / `read_edge_service_logs`       | The same catalog, pinned to the direct-SSH transport only. `run_edge_diagnostic` is the transport-flexible superset—prefer it unless you specifically need to pin direct SSH.                                               |
| `read_events`                                               | Palette-side events for an edge host object—registration failures, heartbeat timeouts. API-tier, not SSH.                                                                                                                   |
| `read_cluster_status` / `read_attached_profiles_to_cluster` | Once an edge host is attached to a cluster, these show provisioning state and pack health. API-tier.                                                                                                                        |

All of these are read-only. `run_edge_diagnostic` registers when the server starts with either `--allow-direct-ssh` or
`--allow-tunnel-ssh`; its pinned direct-SSH siblings need `--allow-direct-ssh`.

## Step 1—Enable the Edge Diagnostic Tools

Edge SSH tools are off by default, alongside the write tools. Add `--allow-direct-ssh` to your server's launch args.

```json
"args": [
  "run", "--rm", "-i",
  "-e", "PALETTE_HOST",
  "-e", "PALETTE_API_KEY",
  "public.ecr.aws/palette-ai/palette-mcp-server:latest",
  "--allow-direct-ssh"
]
```

Restart your client and confirm `run_edge_diagnostic` appears among the available tools (`/mcp` in Claude Code, or your
client's equivalent).

:::info

`--allow-direct-ssh` and `--allow-tunnel-ssh` are independent flags. This tutorial only uses direct SSH.

:::

## Step 2—Identify the Edge Host

If your Palette API is reachable, ask your client to list edge hosts.

```shell title="Example Prompt"
List my edge hosts and their health.
```

This calls `read_edge_hosts` and surfaces `state` (`unpaired` / `ready` / `in-use`) and `health_state` (`healthy` /
`unhealthy`) per host—no heartbeat timestamp is returned; `health_state` is the connectivity signal.

If you would rather not rely on Palette-side discovery—for example, a host on a network segment without Palette egress,
or because you already know the address—supply the host directly instead.

```shell title="Example Prompt"
Run a status check for stylus-agent on <EDGE_HOST_IP>, SSH user <EDGE_HOST_USER>, using the key
at <PRIVATE_KEY_PATH>.
```

Every example from here on assumes you are supplying `target: {host, user, private_key_path}` directly, whether or not
`read_edge_hosts` worked for you.

## Step 3—Run the First Diagnostic Pass

The catalog's `service` argument is a fixed enum—twelve systemd units covering both appliance and agent-mode
deployments.

```
stylus-agent, palette-agent, k3s, k3s-agent, rke2-server, rke2-agent,
containerd, cloud-init, local-ui, kairos-agent, remote-shell, kubelet
```

You do not need to already know which of these run on your host. Running `op=status` across the list _is_ the
identification step—a real, observed pass against a live host returned the following.

```shell title="Example Prompt"
Check the status of kubelet on <EDGE_HOST_IP>.
```

```json title="Example Output"
{
  "ok": true,
  "transport_used": "direct",
  "host": "<EDGE_HOST_IP>",
  "service": "kubelet",
  "command": "systemctl status --no-pager kubelet",
  "exit_code": 0,
  "exit_known": true,
  "stdout": "● kubelet.service - kubelet: The Kubernetes Node Agent\n     Loaded: loaded (...)\n     Active: active (running) since Wed 2026-08-26 07:58:53 UTC; 3 weeks 1 day ago\n   Main PID: 15752 (kubelet)\n...",
  "duration_ms": 3115
}
```

```shell title="Example Prompt"
Check the status of k3s on <EDGE_HOST_IP>.
```

```json title="Example Output"
{
  "ok": true,
  "transport_used": "direct",
  "host": "<EDGE_HOST_IP>",
  "service": "k3s",
  "command": "systemctl status --no-pager k3s",
  "exit_code": 4,
  "exit_known": true,
  "stdout": "",
  "stderr": "Unit k3s.service could not be found.\n",
  "duration_ms": 2819
}
```

Both calls succeeded (`ok: true`). `ok` reflects the _tool call_, not the systemd unit's health. Read `exit_code` for
the unit itself.

- **`exit_code: 0`**—the unit exists; read `stdout` for its actual state (`active (running)`, `activating`, `failed`,
  etc.).
- **`exit_code: 4`** means `systemctl status` ran against a unit that does not exist on this host at all. This is normal
  when probing a fixed enum against a host that only runs a subset of it—by itself it is not evidence of a problem.

Run the same `op=status` sweep across the units you expect for your deployment mode (appliance: `stylus-agent`; agent
mode: `palette-agent`) plus `kubelet` and `cloud-init`, which are present in both modes. A `0` you did not expect, or a
`4` on a unit you expected to exist, is your starting signal for where to dig next.

## Step 4—Read Logs and the Exit-Code Difference

`op=logs` runs `journalctl` for the requested unit and tail-line count (default 100 lines, max 500) via `sudo`,
non-interactively. Its exit-code convention differs from `status`.

```shell title="Example Prompt"
Show me the last 50 log lines for stylus-agent on <EDGE_HOST_IP>.
```

```json title="Example Output"
{
  "ok": true,
  "transport_used": "direct",
  "host": "<EDGE_HOST_IP>",
  "service": "stylus-agent",
  "exit_code": 0,
  "exit_known": true,
  "stdout": "-- No entries --\n",
  "duration_ms": 2854
}
```

This host has no `stylus-agent` unit at all (a `status` call for it returns `exit_code: 4`)—yet `journalctl` on the same
missing unit returns `exit_code: 0` with `-- No entries --`. `journalctl` exiting `0` does not mean the unit exists or
is healthy—it means the query itself succeeded and found nothing. `status`'s exit code, not `logs`'s, tells you whether
the unit exists.

For a unit that does exist, `op=logs` returns its actual journal.

```shell title="Example Prompt"
Show me the last 15 log lines for kubelet on <EDGE_HOST_IP>.
```

```json title="Example Output"
{
  "ok": true,
  "exit_code": 0,
  "exit_known": true,
  "stdout": "Sep 10 06:35:08 <EDGE_HOST_NAME> bash[15752]: I0910 06:35:08... reconciler_common.go:163 ...\n...",
  "duration_ms": 2854
}
```

## Step 5—Reading Safe Rejections

The catalog validates `service` and `tail_lines` before opening any SSH connection at all. Two real rejections,
unchanged from what the server actually returned.

An unrecognized service name.

```json title="Example Output"
{
  "ok": false,
  "error": {
    "code": "PALETTE_VALIDATION_FAILED",
    "message": "Validation failed. See diagnostics.",
    "retryable": false
  },
  "diagnostics": [
    {
      "code": "enum",
      "severity": "error",
      "path": "service",
      "message": "value notaservice is not in the allowed set",
      "details": { "allowed": ["stylus-agent", "palette-agent", "k3s", "..."], "received": "notaservice" }
    }
  ]
}
```

An out-of-range `tail_lines`.

```json title="Example Output"
{
  "ok": false,
  "error": {
    "code": "PALETTE_VALIDATION_FAILED",
    "message": "Validation failed. See diagnostics.",
    "retryable": false
  },
  "diagnostics": [
    {
      "code": "range",
      "severity": "error",
      "path": "tail_lines",
      "message": "tail_lines must be 0 (default 100) or between 1 and 500",
      "details": { "max": 500, "min": 0, "received": 999 }
    }
  ]
}
```

The diagnostics tell you exactly what to fix, and you can retry immediately with a corrected argument.

## Step 6—Host-Key Verification

Direct-SSH host-key verification is always enforced—there is no flag to turn it off. If you pin a `host_key_fingerprint`
and the host presents a different key (a real man-in-the-middle scenario, or a host that was rebuilt since you pinned
it), the call fails loudly instead of silently trusting whatever key shows up.

```json title="Example Output"
{
  "ok": false,
  "error": {
    "code": "PALETTE_UPSTREAM_ERROR",
    "message": "ssh handshake <EDGE_HOST_IP>:22: ssh: handshake failed: host key mismatch: pinned SHA256:<pinned>, host presented SHA256:<actual>",
    "retryable": false
  }
}
```

If you do not pin a fingerprint, the host key is checked against your operator's `~/.ssh/known_hosts`. A host that is
not already listed there fails the call—add it first (for example, `ssh-keyscan <host> -t ed25519 >> ~/.ssh/known_hosts`
from a trusted network) or pin `host_key_fingerprint`. Verification cannot be disabled either way.

## Step 7—Map Findings to Common Edge Patterns

The status/logs sweep from Steps 3–4 is the entry point into the broader edge-triage playbook. A few common patterns,
and how they present through this catalog.

| Symptom                                                   | Check via `run_edge_diagnostic`                                                                                                                                         | What it means                                                                                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Host shows `unpaired` or `unhealthy` in `read_edge_hosts` | `op=logs`, `service=stylus-agent` (or `palette-agent` in agent mode), grep the returned text for `register`/`tls`/`certificate`                                         | Registration/pairing failure—often a VIP certificate missing a SAN, or a duplicate device UID blocking re-registration |
| Agent will not start after a reboot                       | `op=status`, `service=stylus-agent`, with `No entries` on the paired `op=logs` call, combined with `status` never reaching `active`                                     | A hung `systemctl` PID blocking the start chain                                                                        |
| Node stuck `NotReady` in Kubernetes                       | `op=status`, `service=kubelet`—a non-zero, non-4 exit or a `failed` state in `stdout`                                                                                   | Check the reported failure reason in `stdout` against your cgroup version and CNI setup                                |
| `containerd`/`rke2-*` will not come up                    | `op=status` across `containerd`, `rke2-server`, `rke2-agent`, `k3s`, `k3s-agent` (whichever your deployment uses), then `op=logs` on the one that is active but failing | Narrows the issue to the specific layer (container runtime vs. the Kubernetes distribution on top of it)               |

## Step 8—Escalate to the API Tier

Host-level checks answer what a box is doing locally. For anything that also depends on Palette's view of the
host—pairing state, the cluster it is attached to, pack health—escalate.

```shell title="Example Prompt"
What events has Palette recorded for this edge host?
```

Calls `read_events` with `object_kind="edgehost"` and the host's `uid` from Step 2, plus the host's
`project_uid`—edge-host event reads are project-scoped. If the host is attached to a cluster, follow up with
`read_cluster_status` and `read_attached_profiles_to_cluster` for provisioning state and pack compatibility—the same
tools the `diagnose-edge` skill uses when driving a full triage end-to-end.

## Troubleshooting

| Symptom                                                           | Likely cause                                                                                | Fix                                                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `run_edge_diagnostic` does not appear in your client's tool list  | Server not started with `--allow-direct-ssh` (or `--allow-tunnel-ssh`)                      | Add the flag (Step 1) and restart the client.                                                                                |
| `read_edge_hosts` times out or errors                             | Palette API not reachable from your network path (common on a secondary/DR profile)         | Supply the host directly via `target` instead of relying on discovery (Step 2).                                              |
| Every service in the catalog returns `exit_code: 4`               | You are probing the wrong deployment-mode units, or the host does not run the Palette stack | Confirm the host's actual role before assuming a failure; check `kubelet`/`cloud-init` first since both exist in every mode. |
| `op=logs` returns `-- No entries --` and you expected real output | The unit name does not exist on this host, and `journalctl` exits `0` on a missing unit     | Confirm the unit exists first via `op=status`; a `4` there means the unit was never installed.                               |
| `PALETTE_VALIDATION_FAILED` on `service` or `tail_lines`          | Value outside the fixed enum / bounds                                                       | Use one of the twelve listed units; `tail_lines` must be `0` (default) or between `1` and `500`.                             |
| `PALETTE_UPSTREAM_ERROR`, host key mismatch                       | Host was rebuilt, or the pinned fingerprint does not match                                  | Confirm out-of-band which key the host should present before proceeding—never lower verification to work around this.        |

## Security Best Practices

- Prefer `private_key_path` over `password` for direct-SSH credentials.
- Never disable host-key verification; if you pin `host_key_fingerprint`, get it from an out-of-band source, not from
  the host itself on first contact.
- Only enable `--allow-direct-ssh` / `--allow-tunnel-ssh` on servers that actually need edge access—like
  `--allow-write`, each is off by default.
- Treat SSH private keys the same as any other credential: correct file permissions, never committed, rotated if you
  suspect exposure.
- This catalog is read-only by construction (fixed enum, no free-text commands)—it does not need `--allow-write` and
  ignores that flag entirely.

## Validate

You have completed this tutorial if you can:

- [ ] View `run_edge_diagnostic` (and its pinned siblings) in your client's tool list after enabling
      `--allow-direct-ssh`.
- [ ] Run an `op=status` sweep across the catalog and correctly identify which units exist on your host from the
      `exit_code`.
- [ ] Explain why `op=logs` on a nonexistent unit still returns `exit_code: 0`.
- [ ] Reproduce a validation rejection (bad `service` or out-of-range `tail_lines`) and confirm no SSH connection was
      attempted.
- [ ] Know which two flags gate edge SSH access, and that neither is on by default.

## Cleanup

This tutorial does not create or modify anything on the edge host or in Palette—every call is read-only. If you
provisioned a temporary SSH key or credential specifically for this tutorial, remove it from the host's
`~/.ssh/authorized_keys` and delete the local private key when you are done.

## Next Steps

- [Get Started with Palette MCP](./get-started-palette-mcp.md)—if you have not already, start there for cluster-level
  (non-edge) triage.
- [Morning Fleet Check with Palette MCP](./fleet-health-palette-mcp.md) and
  [Access Review with Palette MCP](./access-review-palette-mcp.md)—the rest of the Palette MCP troubleshooting series.
