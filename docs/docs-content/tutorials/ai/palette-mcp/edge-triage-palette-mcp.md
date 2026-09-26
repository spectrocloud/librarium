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

The Palette MCP server ships a small, fixed catalog of read-only diagnostic commands for edge hosts, built on
`systemctl status` and `journalctl` against a closed list of systemd units. Every command in the catalog is fixed. The
server validates the `service` argument against a closed enumeration before it opens an SSH connection, so a typo or an
out-of-range argument fails safely instead of running something unexpected on a host you do not fully control. The
`--allow-direct-ssh` flag also registers `run_edge_diagnostic`, the transport-flexible tool this tutorial uses to run
one diagnostic against one systemd unit.

In this tutorial, you enable the edge diagnostic tools, connect to an edge host over direct SSH, and run the same
first-10-minutes triage sequence field engineers use manually. Along the way, you learn to read the two exit-code
conventions the catalog relies on, recognize how it rejects invalid input, verify host keys, and map the results onto
common edge failure patterns. This tutorial uses Claude Code, but the same prompts work with any MCP-capable client.

## Prerequisites

- Completion of the [Get Started with Palette MCP](./get-started-palette-mcp.md) tutorial. This tutorial assumes your
  MCP server and client are already configured.

- A `palette-mcp` server registered with your client and started with the `--allow-direct-ssh` flag. The
  [Enable the Edge Diagnostic Tools](#enable-the-edge-diagnostic-tools) section covers this.

- SSH key-based access to at least one edge host, as a user permitted to run `systemctl status` and
  `sudo -n journalctl`. The catalog reads journals non-interactively, so the user requires passwordless sudo for journal
  reads.

- (Optional) A Palette API key with visibility into the edge host fleet, for auto-discovery through the
  `read_edge_hosts` tool. This is not required, because you can supply the host directly. The
  [Identify the Edge Host](#identify-the-edge-host) section covers both approaches.

:::info

The examples in this tutorial use `<EDGE_HOST_IP>`, `<EDGE_HOST_NAME>`, `<EDGE_HOST_USER>`, and `<PRIVATE_KEY_PATH>` as
placeholders. Substitute your own values throughout.

:::

## Enable the Edge Diagnostic Tools

The edge SSH tools are off by default, alongside the write tools. Add the `--allow-direct-ssh` flag to your server's
launch arguments.

```json
"args": [
  "run", "--rm", "-i",
  "-e", "PALETTE_HOST",
  "-e", "PALETTE_API_KEY",
  "public.ecr.aws/palette-ai/palette-mcp-server:latest",
  "--allow-direct-ssh"
]
```

Restart your client and confirm that `run_edge_diagnostic` appears among the available tools. In Claude Code, use the
`/mcp` command, or the equivalent in your client.

:::warning

Enable `--allow-direct-ssh` only on servers that need edge access. Like `--allow-write`, it is off by default. The
diagnostic catalog is read-only by construction, a fixed command enumeration with no free-text input, so it does not
need `--allow-write` and ignores that flag. For the Palette MCP server's full security model, refer to
[Palette MCP Architecture](../../../automation/palette-mcp/architecture.md#security).

:::

:::info

The `--allow-direct-ssh` and `--allow-tunnel-ssh` flags are independent. This tutorial uses only direct SSH.

:::

## Identify the Edge Host

If your Palette API is reachable, ask your client to list edge hosts. This calls the `read_edge_hosts` tool.

```shell title="Example Prompt"
List my edge hosts and their health.
```

The response surfaces `state` (`unpaired`, `ready`, or `in-use`) and `health_state` (`healthy` or `unhealthy`) for each
host. No heartbeat timestamp is returned. The `health_state` value is the connectivity signal.

If you would rather not rely on Palette-side discovery, for example when a host is on a network segment without Palette
egress, or because you already know the address, supply the host directly instead.

```shell title="Example Prompt"
Run a status check for stylus-agent on <EDGE_HOST_IP>, SSH user <EDGE_HOST_USER>, using the key
at <PRIVATE_KEY_PATH>.
```

Every example from here on assumes you supply `target: {host, user, private_key_path}` directly, whether or not
`read_edge_hosts` worked for you.

:::warning

Provide the SSH private key by path with `private_key_path`, not as an inline value. Treat the key as a credential. Set
restrictive file permissions, keep it out of version control, and rotate it if you suspect exposure.

:::

## Run the First Diagnostic Pass

The catalog's `service` argument is a fixed enumeration of twelve systemd units that cover both appliance and agent-mode
deployments.

```text
stylus-agent, palette-agent, k3s, k3s-agent, rke2-server, rke2-agent,
containerd, cloud-init, local-ui, kairos-agent, remote-shell, kubelet
```

You do not need to know in advance which of these units run on your host. Running `op=status` across the list is the
identification step. The following is an example response.

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

Both calls succeeded (`ok: true`). The `ok` value reflects the tool call, not the systemd unit's health. Read
`exit_code` for the unit itself.

- **`exit_code: 0`**: the unit exists. Read `stdout` for its actual state, such as `active (running)`, `activating`, or
  `failed`.

- **`exit_code: 4`**: `systemctl status` ran against a unit that does not exist on this host. This is normal when you
  probe a fixed enumeration against a host that runs only a subset of it. By itself, it is not evidence of a problem.

Run the same `op=status` sweep across the units you expect for your deployment mode. Appliance mode uses `stylus-agent`,
and agent mode uses `palette-agent`. Include `kubelet` and `cloud-init`, which are present in both modes. A `0` you did
not expect, or a `4` on a unit you expected to exist, is your starting signal for where to dig next.

## Read Logs and Interpret Exit Codes

The `op=logs` operation runs `journalctl` for the requested unit and tail-line count through `sudo`, non-interactively.
The default is 100 lines, and the maximum is 500. Its exit-code convention differs from `status`.

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

This host has no `stylus-agent` unit at all, and a `status` call for it returns `exit_code: 4`. Yet `journalctl` on the
same missing unit returns `exit_code: 0` with `-- No entries --`. A `journalctl` exit code of `0` does not mean the unit
exists or is healthy. It means the query itself succeeded and found nothing. The exit code from `status`, not from
`logs`, indicates whether the unit exists.

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

## Read Validation Rejections

The catalog validates `service` and `tail_lines` before it opens any SSH connection. The following examples show two
validation rejections.

The first response shows an unrecognized service name.

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

The second response shows an out-of-range `tail_lines` value.

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

## Verify the Host Key

Direct-SSH host-key verification is always enforced. There is no flag to turn it off. If you pin a
`host_key_fingerprint` and the host presents a different key, for example in a man-in-the-middle scenario or when a host
was rebuilt since you pinned it, the call fails loudly instead of silently trusting whatever key it receives.

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

If you do not pin a fingerprint, the host key is checked against your operator's `~/.ssh/known_hosts` file. A host that
is not already listed there fails the call. Add it first, for example with
`ssh-keyscan <host> -t ed25519 >> ~/.ssh/known_hosts` from a trusted network, or pin `host_key_fingerprint`.
Verification cannot be disabled either way.

:::warning

Never disable host-key verification. If you pin `host_key_fingerprint`, obtain it from an out-of-band source, not from
the host itself on first contact.

:::

## Map Findings to Common Edge Patterns

The status and logs sweep from the previous sections is the entry point into the broader edge-triage workflow. The
following table lists a few common patterns and how they present through this catalog.

| Symptom                                                   | Check with `run_edge_diagnostic`                                                                                                                                            | What it means                                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Host shows `unpaired` or `unhealthy` in `read_edge_hosts` | `op=logs`, `service=stylus-agent` (or `palette-agent` in agent mode), then grep the returned text for `register`, `tls`, or `certificate`                                   | Registration or pairing failure, often a VIP certificate missing a SAN, or a duplicate device UID blocking re-registration |
| Agent fails to start after a reboot                       | `op=status`, `service=stylus-agent`, with `No entries` on the paired `op=logs` call, combined with `status` never reaching `active`                                         | A hung `systemctl` PID blocking the start chain                                                                            |
| Node stuck `NotReady` in Kubernetes                       | `op=status`, `service=kubelet`, showing a non-zero, non-4 exit or a `failed` state in `stdout`                                                                              | Check the reported failure reason in `stdout` against your cgroup version and CNI setup                                    |
| `containerd` or `rke2-*` fail to come up                  | `op=status` across `containerd`, `rke2-server`, `rke2-agent`, `k3s`, and `k3s-agent` (whichever your deployment uses), then `op=logs` on the one that is active but failing | Narrows the issue to a specific layer, either the container runtime or the Kubernetes distribution running on top of it    |

## Escalate to the API Tier

Host-level checks answer what a host is doing locally. For anything that also depends on Palette's view of the host,
such as pairing state, the cluster it is attached to, or pack health, escalate to the API-tier tools.

```shell title="Example Prompt"
What events has Palette recorded for this edge host?
```

This calls the `read_events` tool with `object_kind="edgehost"` and the host's `uid` from the
[Identify the Edge Host](#identify-the-edge-host) section, plus the host's `project_uid`. Edge-host event reads are
project-scoped. If the host is attached to a cluster, follow up with the `read_cluster_status` and
`read_attached_profiles_to_cluster` tools for provisioning state and pack compatibility. These are the same tools the
`diagnose-edge` skill uses when it drives a full triage from start to finish.

## Troubleshooting

| Symptom                                                           | Likely cause                                                                                | Fix                                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `run_edge_diagnostic` does not appear in your client's tool list  | Server not started with `--allow-direct-ssh` or `--allow-tunnel-ssh`                        | Add the flag and restart the client. Refer to [Enable the Edge Diagnostic Tools](#enable-the-edge-diagnostic-tools).                |
| `read_edge_hosts` times out or errors                             | Palette API not reachable from your network path, common on a secondary or DR profile       | Supply the host directly with `target` instead of relying on discovery.                                                             |
| Every service in the catalog returns `exit_code: 4`               | You are probing the wrong deployment-mode units, or the host does not run the Palette stack | Confirm the host's actual role before assuming a failure. Check `kubelet` and `cloud-init` first, because both exist in every mode. |
| `op=logs` returns `-- No entries --` and you expected real output | The unit name does not exist on this host, and `journalctl` exits `0` on a missing unit     | Confirm the unit exists first with `op=status`. A `4` there means the unit was never installed.                                     |
| `PALETTE_VALIDATION_FAILED` on `service` or `tail_lines`          | Value outside the fixed enumeration or bounds                                               | Use one of the twelve listed units. The `tail_lines` value must be `0` (default) or between `1` and `500`.                          |
| `PALETTE_UPSTREAM_ERROR` with a host key mismatch                 | The host was rebuilt, or the pinned fingerprint does not match                              | Confirm out-of-band which key the host should present before proceeding. Never lower verification to work around this.              |

## Validate

Confirm that you can perform edge triage through the Palette MCP server.

1. In your client's tool list, verify that `run_edge_diagnostic` and its pinned direct-SSH siblings appear after you
   start the server with `--allow-direct-ssh`.

2. Run an `op=status` sweep across the catalog and confirm that you can identify which units exist on your host from
   each response's `exit_code`.

3. Request an out-of-range `tail_lines` value or an unrecognized `service` name, and confirm the server returns a
   `PALETTE_VALIDATION_FAILED` response without opening an SSH connection.

## Cleanup

This tutorial does not create or modify anything on the edge host or in Palette. Every call is read-only. If you
provisioned a temporary SSH key or credential specifically for this tutorial, remove it from the host's
`~/.ssh/authorized_keys` file and delete the local private key when you are done.

## Wrap-up

In this tutorial, you enabled the edge diagnostic tools, connected to an edge host over direct SSH, and ran the
first-pass triage sequence that field engineers use manually. You ran the fixed status and logs catalog, interpreted its
two exit-code conventions, observed how the catalog rejects invalid input before it dials the host, and mapped the
results onto common edge failure patterns. You also learned when to escalate from host-level checks to Palette's
API-tier tools.

Because the diagnostic catalog is read-only and validated against a fixed command enumeration, you can run this sequence
safely against a host you do not fully control.

To continue, refer to the following tutorials:

- [Get Started with Palette MCP](./get-started-palette-mcp.md) for cluster-level, non-edge triage.

- [Morning Fleet Check with Palette MCP](./fleet-health-palette-mcp.md) and
  [Troubleshoot a Cloud Cluster with Palette MCP](./cloud-triage-palette-mcp.md) for the rest of the Palette MCP
  troubleshooting series.
