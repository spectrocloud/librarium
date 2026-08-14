---
id: known-issues
title: Known Issues
description: >
  Known issues that operators may encounter during PaletteAI Inference Launchpad installation and validation, and the
  workarounds for each.
sidebar_label: Known Issues
sidebar_position: 9
tags:
  - paletteai-inference-launchpad
  - reference
  - troubleshooting
keywords: ["launchpad", "ai", "install", "known issues", "workaround", "troubleshooting", "hpe", "pci"]
---

This page lists the known issues that operators may encounter during installation and validation of the PaletteAI
Inference Launchpad appliance, and the workaround for each. For the ordered procedure, refer to
[Install the Appliance](../how-to-guides/install-the-appliance.md).

## GPUs do not enumerate on HPE servers

<!-- vale off -->

**Symptom.** On some HPE servers, for example the DL380a Gen11, the GPUs do not enumerate on the PCI bus. Each GPU
reports `Region 0/2/4: Memory at ignored` when you run `lspci` with `-vv`, and the kernel logs `NVRM: BAR0 is 0M @ 0x0`
with a probe failure for every device.

**Workaround.** Add `pci=realloc=off` to the GRUB kernel command line.

1. Boot into GRUB and append `pci=realloc=off` to `GRUB_CMDLINE_LINUX_DEFAULT` so that it reads
   `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash pci=realloc=off"`, then reboot.
2. Verify the GPUs by running `lspci` with `-v` and `-s <bus:device.function>`, then confirm with `nvidia-smi`.
3. For better performance, enable Resizable BAR in the BIOS. On HPE Gen11 servers, go to **PCIe Device Configuration >
   Advanced PCIe Configuration**. An RBSU BIOS upgrade may be required.

**Side effect: NIC rename.** The workaround renames the NICs. Update the interface names in the `/etc/systemd/network`
and `/oem` directories afterward.

<!-- vale on -->

## Installation stalls during cluster deployment

**Symptom.** The cluster does not reach a **Running** and **Healthy** state during deployment, and one or more packs
stay in a pending or installing state.

**Workaround.** Confirm that the `piraeus-operator` and `nvidia-gpu-operator-ai` packs install correctly. GPU driver
installation can take extra time on the first boot, so wait before you treat a slow pack as stalled. If the GPUs do not
enumerate as expected, refer to [GPUs do not enumerate on HPE servers](#gpus-do-not-enumerate-on-hpe-servers).

## Node stuck at login prompt after first boot

**Symptom.** After the first boot following the OS install, the console shows a plain login prompt with a
UUID-derived hostname (for example `edge-<uuid> login:`), and no user account exists. Every credential you try fails
with `Login incorrect`. The Palette TUI never paints.

**Root cause.** At the first-boot GRUB menu, the **Registration** entry was selected (either explicitly or by
countdown timeout). Registration runs Kairos onboarding and marks first-boot complete without launching the Palette
TUI, so no interactive account creation happens and the node is left at a login prompt with no account.

**Workaround.** Boot the state-reset entry to clear the first-boot marker, then boot the primary entry.

1. From the [baseboard management controller (BMC)](../reference/glossary.md#bmc), power-cycle the node.
2. When the GRUB menu paints, press an arrow key immediately to freeze the countdown. Move the highlight to
   **Palette eXtended Kubernetes Edge state reset (auto)** and press **ENTER**. The node runs a state cleanup and
   reboots itself; do not intervene during the mid-cycle reboot.
3. When the GRUB menu paints the second time, select **Palette eXtended Kubernetes Edge** (the first entry, with no
   suffix) and press **ENTER**. The Palette TUI paints, and you can create the initial user account.

If the state-reset entry does not restore first-boot behavior, boot the **recovery** entry, drop to a shell by
editing the GRUB entry (press `e`, append `init=/bin/bash` to the `linux` line, and press **Ctrl-X** to boot), and
run `kairos-agent reset` from the shell. The node reboots into a fresh first-boot state.

## SSH, Local UI, or Kubernetes API unreachable after cluster deploy

<!-- vale off -->

**Symptom.** After the cluster reaches a **Running** and **Healthy** state, TCP connections from the
[jumpbox](../reference/glossary.md#jumpbox) to the node's Host IP time out on port 22 (SSH), 5080 (Local UI), and
6443 (Kubernetes API), while port 443 on the platform IP (Traefik) continues to serve the appliance console. ICMP
ping to the Host IP still succeeds. The failure appears to be partial rather than a complete outage.

**Root cause.** On a single-node install, the platform IP was set equal to the node's Host IP during the cluster
profile wizard. Local UI wires the MetalLB `IPAddressPool first-pool` to include the Host IP as a `/32` and sets the
Traefik Service `spec.loadBalancerIP` to the same address. The MetalLB speaker then announces the Host IP on the
node's bond interface through gratuitous ARP, and inbound traffic to the Host IP is delivered to MetalLB rather than
to the host's own services. Traefik's ports 80 and 443 remain reachable because they traverse the
kube-proxy-replacement DNAT path before MetalLB's L2 handling; host services on ports 22, 5080, and 6443 do not.

**Discriminating diagnostic.** From a shell on the node (reached through the BMC serial console), inspect the
MetalLB pool:

```bash
sudo kubectl -n metallb-system get ipaddresspool first-pool -o yaml
```

If `spec.addresses` contains the node's Host IP, this issue applies.

**Workaround.** Move the platform IP off the Host IP, and refresh Cilium's load-balancer state.

1. Patch the MetalLB pool to a distinct unused IP from your reserved MetalLB range. Replace `<new-platform-ip>` with
   your chosen address.

   ```bash
   sudo kubectl -n metallb-system patch ipaddresspool first-pool --type='json' \
     -p='[{"op":"replace","path":"/spec/addresses/0","value":"<new-platform-ip>/32"}]'
   ```

2. Point the Traefik Service at the same new IP. Use a strategic merge patch; a JSON Patch on
   `spec.loadBalancerIP` is rejected by the API server.

   ```bash
   sudo kubectl -n traefik patch svc traefik \
     -p '{"spec":{"loadBalancerIP":"<new-platform-ip>"}}'
   ```

3. Restart the Cilium daemonset so its BPF load-balancer tables pick up the new mapping. This step is required:
   without it, external clients continue to reach the old address.

   ```bash
   sudo kubectl -n kube-system rollout restart daemonset/cilium
   ```

4. Confirm the node is reachable again from the jumpbox.

   ```bash
   nc -zv <node-ip> 22
   ```

To prevent this on future installs, choose a platform IP that is not the node's Host IP when you complete the
cluster profile wizard. Refer to
[Install the Appliance: Deploy the Cluster](../how-to-guides/install-the-appliance.md#deploy-the-cluster) for the
inline guidance.

<!-- vale on -->

## Appliance console unreachable from the jumpbox after cluster deploy

**Symptom.** The Traefik Service reports the expected platform IP as its external IP, and pods are all Running, but
`https://<platform-ip>/` times out from the jumpbox. Requests from a browser on the same host as the node succeed.

**Discriminating diagnostic.** Inspect the Traefik Service's source-range allowlist:

```bash
sudo kubectl -n traefik get svc traefik -o jsonpath='{.spec.loadBalancerSourceRanges}'
```

If the output contains a single `/32` range that does not include the jumpbox's source IP, this issue applies.

**Root cause.** Local UI sets `spec.loadBalancerSourceRanges` on the Traefik Service to a `/32` range containing
only the platform IP. Because `loadBalancerSourceRanges` is a load-balancer-level ACL, source IPs outside the range
are rejected before reaching Traefik.

**Workaround.** Remove the allowlist so external clients can reach the appliance console, or replace it with a CIDR
that includes your jumpbox network.

```bash
sudo kubectl -n traefik patch svc traefik --type='json' \
  -p='[{"op":"remove","path":"/spec/loadBalancerSourceRanges"}]'
```

## Anthropic model aliases return "not served"

**Symptom.** A `GET /v1/models` response advertises Anthropic tier aliases alongside the deployed model, for
example:

```json
{
  "data": [
    {"id": "<model-name>", "object": "model", "owned_by": "launchpad-ai"},
    {"id": "claude-opus-4-8", "object": "model", "owned_by": "launchpad-ai-tier-alias"},
    {"id": "claude-sonnet-4-5", "object": "model", "owned_by": "launchpad-ai-tier-alias"},
    {"id": "claude-haiku-4-5", "object": "model", "owned_by": "launchpad-ai-tier-alias"}
  ]
}
```

A request that uses one of the aliases as `model` returns `{"error":"model '' is not served by this box"}`.

**Root cause.** The alias entries are advertised by the gateway, but the router-to-engine mapping is not wired for
them in the current build.

**Workaround.** Use the native model ID (the entry with `owned_by: launchpad-ai`) in every request. For clients that
hard-code an Anthropic model name, map the alias to the native ID at the client side.

## "Model artifacts verified" step remains at "not present" after model loads

**Symptom.** After a model is uploaded, deployed, and serving requests successfully, the appliance console's
model boot-sequence view shows *Model artifacts verified* stuck at *No model artifacts present yet — nothing to
verify*.

**Workaround.** This is a cosmetic reporting gap and does not affect model serving. Use the vLLM pod status and a
successful `GET /v1/models` response as the ground truth that the model is ready:

```bash
sudo kubectl get pods -A | grep vllm
curl -sk https://<platform-ip>/v1/models -H "Authorization: Bearer <token>"
```

## Typing is unreliable in the iLO HTML5 Console

<!-- vale off -->

**Symptom.** On HPE servers with iLO 7, typing longer strings (passwords, hostnames, GRUB edit-line modifications)
in the HTML5 Remote Console results in dropped or duplicated characters. Escape sequences such as `Ctrl-Alt-F2` or
`Esc + (` may not register.

**Root cause.** Browser HTML5 keyboard emulation over iLO's WebSocket transport drops keystrokes under load. HPE's
Virtual Serial Port (`vsp`) over iLO SSH delivers raw scancodes and is not affected.

**Workaround.** From the jumpbox, SSH into iLO and attach `vsp` for any text-heavy interaction:

```bash
ssh <ipmi-user>@<ilo-ip>
```

At the iLO prompt, run:

```
vsp
```

Return to the iLO prompt with `Esc` then `(`. Exit iLO with `exit`.

To skip the hostname field in the Palette TUI, leave the auto-generated `edge-<uuid>` value and rename the node
later from Local UI. This avoids the worst of the HTML5 typing problem during initial configuration.

## Stale iLO Virtual Serial Port session on iLO 7

**Symptom.** On HPE iLO 7, running `stop /system1/oemhp_vsp1` at the iLO CLI to clear a stale Virtual Serial Port
session returns `unknown command`. The SMASH CLP path documented for iLO 4 and iLO 5 does not apply.

**Workaround.** Reset the iLO management processor. This restarts iLO itself, not the server, and takes
approximately 30 seconds.

```
reset /map1
```

Any HTML5 Remote Console session is dropped by the reset and must be re-launched from the iLO web UI after iLO
finishes restarting. The server operating system is not affected.

<!-- vale on -->
