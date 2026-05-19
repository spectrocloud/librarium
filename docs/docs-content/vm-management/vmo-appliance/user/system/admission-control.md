# Admission Control

VMO Manager enforces CPU and memory overcommit policies at VM create and update time via a Kubernetes ValidatingWebhook. This prevents overcommitment beyond configured ratios and helps avoid node resource exhaustion.

## Overview

When a user creates or updates a VirtualMachine, the admission webhook evaluates the VM's CPU and memory requests against the allocatable capacity of the target node(s). If the total requested resources exceed the configured ratio, the webhook can either warn (log only) or enforce (reject the request).

## VmoAdmissionPolicy CRD

Admission policies are stored as `VmoAdmissionPolicy` custom resources. A single cluster-wide policy is typically used, with optional per-namespace overrides (when supported).

Policy fields:

| Field | Description |
|-------|-------------|
| Preset | Built-in preset name or `custom` |
| Enforce | If true, reject violating VMs; if false, log a warning only |
| CPURatioMax | Maximum ratio of total VM CPU requests to node allocatable CPU (e.g., `2.0` = 2:1) |
| MemRatioMax | Maximum ratio of total VM memory requests to node allocatable memory |
| Scope | `cluster` (default) or namespace-scoped |
| ExcludeNamespaces | Namespaces excluded from policy (e.g., `kube-system`, `vm-dashboard`) |

## Presets

Three built-in presets are available:

| Preset | CPU Ratio | Memory Ratio | Use Case |
|--------|-----------|--------------|----------|
| **None** | 1:1 | 1:1 | No overcommit; VM requests must not exceed node capacity |
| **Normal** | 2:1 | 1.5:1 | Moderate overcommit for typical workloads |
| **Aggressive** | 4:1 | 2:1 | High overcommit for bursty or low-utilization VMs |

You can also select **Custom** and specify your own `CPURatioMax` and `MemRatioMax` values.

## Per-Namespace Policies

When the policy scope is `cluster`, the same ratios apply to all namespaces except those in `ExcludeNamespaces`. Per-namespace policies (when supported) allow different overcommit ratios for different namespaces, e.g., stricter limits for production and looser limits for development.

## Warn-Only vs Enforce Mode

By default, the admission policy runs in **warn-only** mode (`Enforce: false`):

- Violations are logged but do not block VM create/update.
- Useful for evaluating overcommit behavior before enabling enforcement.

In **enforce** mode (`Enforce: true`):

- Violating create/update requests are rejected with an admission error.
- The user sees an error message indicating the policy limit was exceeded.

> **Tip:** Start with warn-only mode, monitor logs for violations, then switch to enforce once you are comfortable with the ratios.

## ValidatingWebhook Behavior

The admission webhook is registered for `VirtualMachine` create and update operations. When a request arrives:

1. The webhook fetches the current admission policy from the store.
2. It computes the total CPU and memory requests for VMs already scheduled on each node.
3. It adds the new/updated VM's requests and checks against the policy ratios.
4. If the ratio is exceeded and `Enforce` is true, the request is rejected.
5. If the ratio is exceeded and `Enforce` is false, the request is allowed and a warning is logged.

## Configuring Admission Control

1. Go to **Settings > Admission Control** (under the Platform section).
2. Select a preset (None, Normal, Aggressive) or choose Custom and enter ratios.
3. Toggle **Enforce** if you want to block violating requests.
4. Optionally adjust **Exclude Namespaces** to skip system namespaces.
5. Save.

Changes take effect immediately for new VM create/update requests.
