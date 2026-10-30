---
id: bond-configuration
title: Bond Configuration Reference
description: >
  Field-by-field reference for the bond form in Local UI: bond name, bond type, members, bonding mode, hash policy, link
  monitoring interval, LACP rate, MTU, IP, gateway and DNS, optional VLAN sub-interface, and Cilium interface selection.
sidebar_label: Bond Configuration
sidebar_position: 2.5
tags:
  - paletteai-inference-launchpad
  - reference
  - install
  - network
keywords: ["launchpad", "ai", "bond", "802.3ad", "LACP", "MIIMonitorSec", "VLAN", "network"]
---

The appliance carries cluster traffic and [Piraeus](./glossary.md#piraeus) storage replication over a bonded interface,
`bond0`, that aggregates two physical NICs into one logical link. This page documents each field of the Local UI
**Network Interfaces > Bonds > Create** form. The values must match how your data-center switch is configured on the
ports the appliance is plugged into; confirm them with your network administrator before you apply them.

For the step-by-step procedure, refer to
[Install the Appliance](../how-to-guides/install-the-appliance.md#create-a-bond). For the rationale for using a bond
rather than a bridge, refer to [Installation Architecture](../explanation/installation-architecture.md#bond-not-bridge).

## Fields

Two fields are often confused. The **Bond type** sets how the bond gets its IP address (`static`, `dhcp`, or `none`),
while the **Bonding mode** sets the link-aggregation algorithm (`802.3ad`). They are separate settings. Set the bond
type to `static` and the bonding mode to `802.3ad`.

### Bond name

Recommended value: a name you type yourself, for example `bond0`.

The name field shows `bond0` as grayed-out placeholder text, not a saved value. Click into the field and type the name
before you continue; otherwise, the bond can be submitted without a name. Use `bond0` unless you already have a bond of
that name.

### Bond type

Recommended value: `static`.

Sets how the bond obtains its IP address: `static` (you enter the IP, subnet, and gateway), `dhcp` (the bond requests an
address), or `none` (no IP, Layer 2 only). Choose `static` so the appliance keeps a fixed address. The IP, gateway, and
DNS fields appear only when the type is `static` or `dhcp`.

### Members

Recommended value: the two data NICs, for example `enP1s3f0np0` and `enP1s3f1np1`.

Select the member NICs manually from the list of physical interfaces. These are the NICs the Palette TUI showed during
initial configuration. Do not include the out-of-band management NIC. Both member NICs must be cabled to switch ports
that belong to the same LAG group.

### Bond mode

Recommended value: `802.3ad`.

Selects dynamic Link Aggregation (LAG), the industry-standard bonding mode negotiated with the switch by the Link
Aggregation Control Protocol (LACP). Both NICs are active at the same time, and the switch treats the pair as one
logical port. This mode requires the switch to be configured with a matching LAG group with LACP enabled on the two
switch ports.

Do not select `active-backup` (uses only one NIC at a time) or `balance-alb` (works without switch configuration but
interacts poorly with Piraeus's continuous replication traffic).

### Hash policy

Recommended value: `layer3+4`.

The rule the bond uses to decide which of the two NICs sends any given outbound packet. `layer3+4` hashes on the source
and destination IP address plus the TCP or UDP port, so many long-lived flows spread evenly across both NICs. The
simpler `layer2` policy (MAC-only) sends all traffic through one NIC when the peer is a single router, which caps the
bond at one NIC's bandwidth. Confirm the switch is set to the same hash policy. This field applies only to the `802.3ad`
bonding mode.

### Link monitoring interval

Recommended value: `100`.

The interval, in milliseconds, at which the bond driver checks each member NIC's link state, set through the
`MIIMonitorSec` option. Local UI populates this field with a default of `100`. Keep the default unless your network team
requires a different value.

### LACP transmit rate

Recommended value: `fast`.

The rate at which the appliance exchanges LACP heartbeat frames with the switch. `fast` sends one heartbeat per second,
so a failed link is detected within a few seconds. `slow` (the LACP default) sends one every 30 seconds; use it only if
your switch team requires it. The overhead of `fast` is negligible. This field applies only to the `802.3ad` bonding
mode.

### Maximum Transmission Unit (MTU)

Recommended value: your network's MTU, for example `1500`, or `9000` for jumbo frames.

The maximum transmission unit applied to the bond interface. Match the value your data-center switch uses on the same
ports. Jumbo frames are optional and are not required for the appliance.

### IP address (static bonds)

Recommended value: the host IP on the bond, as CIDR, for example `10.0.21.106/24`.

The address the node uses on the untagged (native) VLAN, shown only when the bond type is `static`. Local UI moves the
IP you set on the individual NIC in the Palette TUI onto the bond when you apply the form, so the node keeps the same
address, only on a different interface.

### Gateway and DNS servers

Recommended value: the default gateway and DNS servers you set in the Palette TUI.

Local UI carries these over so the node keeps outbound connectivity and name resolution once the bond takes over.

### VLAN sub-interface (optional)

Recommended value (when needed): `bond0.<vlan-id>` with its own CIDR, for example `bond0.393` with `10.0.22.110/24`.

Add one only if you need to reach a tagged VLAN, such as an external NFS storage network. The switch ports that carry
the bond must be configured to trunk the tagged VLAN through to the appliance.

### Cilium interface selection

Recommended value: leave empty.

Cilium is the Kubernetes networking layer the cluster installs later. It auto-detects the interface that owns the
default gateway (the bond) and uses it, so no explicit selection is needed. Only override this if Spectro Cloud support
directs you to.

## Quick reference

```text
Bond name    : type it yourself, for example bond0 (the field shows bond0 as a placeholder)
Bond type    : static
Members      : the data NICs, selected manually, for example enP1s3f0np0 and enP1s3f1np1
Bonding mode : 802.3ad
Hash policy  : layer3+4
Link monitor : 100 (MIIMonitorSec, milliseconds)
LACP rate    : fast
MTU          : your network MTU, for example 1500
IP           : the host IP on the bond, for example 10.0.21.106/24 (untagged, static bonds)
Gateway/DNS  : the default gateway and DNS servers
VLAN (opt.)  : bond0.<vlan-id>, for example bond0.393 with 10.0.22.110/24
```
