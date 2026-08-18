---
sidebar_label: "Model Placement"
title: "Model Placement"
description:
  "An explanation of how PaletteAI Inference Launchpad places a model on cluster nodes, when to pin a model to a subset
  of nodes, and how the Cluster view reports that placement."
hide_table_of_contents: false
sidebar_position: 1.2
tags: ["paletteai-inference-launchpad", "explanation", "models", "nodes"]
keywords: ["launchpad", "ai", "placement", "nodes", "multi-node", "GPU", "weights"]
---

When you deploy a model, you decide which nodes run it. On a single-node appliance that choice is one node. On a
multi-node appliance, mixed hardware, reserved capacity, and locally staged weights often mean that not every Ready node
should run every model.

This page explains that choice. To deploy a model and change which nodes run it, refer to
[Deploy a Model](../how-to-guides/deploy-a-model.md).

## Why Choose Specific Nodes

A model with no recorded node list runs on every Ready node. That is the original behavior, and it still applies when
you never record a list. Choosing nodes narrows the model to exactly those nodes.

Pin a model when nodes are not interchangeable:

- **Mixed hardware.** An H200 pool beside L40S nodes, or GPU workers beside a CPU-only control plane. Deploying the
  model on every node puts engines on machines that cannot serve the model.
- **Reserved capacity.** Keep a large model off nodes you want free for other work.
- **Staged weights.** For a disk-backed model, only nodes that already hold the weights can serve it.

Leave the list unset when the nodes are equivalent and you want a newly added node to pick the model up automatically.
A console deploy always records the nodes you selected, so that unset path is an API action. Refer to
[Return a Model to Every Ready Node](../how-to-guides/deploy-a-model.md#return-a-model-to-every-ready-node).

## How Placement Works

The appliance creates one inference engine per chosen node and exposes those engines through a single per-model
endpoint. Clients keep calling the model by name. They do not choose a node.

The deploy dialog lists every cluster node with its hardware, its free GPUs, and whether it can run the model you
picked. Nothing is pre-selected. **Select all eligible** selects what is eligible at that moment. It does not follow
nodes added later.

The same eligibility checks run again when you confirm. If a node degrades between selecting and confirming, the
appliance holds the deployment with the reason instead of placing an engine where it cannot run. Nothing falls back to
another node, and unreadable capacity counts as unusable rather than free.

Placement width is the node list. The appliance does not scale a multi-node model by changing replica count.

## How the Cluster View Reports Placement

A model with a recorded node list reads `N of M nodes`. `N` is how many nodes you chose. `M` is the cluster size. The
health chip counts serving against the chosen set, so `1/2 healthy` means one chosen node is not up yet.

Expanding the row lists only the nodes that belong to the model:

- Chosen nodes always appear.
- A node you never selected does not appear. That absence is not a fault.
- A node you de-selected stays visible while its engine is still shutting down. It reads **Removing** with the message
  `No longer chosen. Its engine is shutting down.` The row disappears once the engine is gone.
- A chosen node that has not started an engine yet reads **Waiting to start**. Investigate that state if it persists.

A model with no recorded node list reads a plain count such as `2 nodes` and still runs on every Ready node, including
nodes added later.

## Why a Node Cannot Be Chosen

An ineligible node is not selectable and states why.

| **What you see**                                                                  | **What it means**                                                    |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `2 free GPU(s), needs 4`                                                          | Fewer free GPUs than the model requires.                             |
| `has L40S, model requires H200`                                                   | The model is pinned to a GPU product this node lacks.                |
| `cordoned — a new engine pod would never be scheduled here`                       | Nothing new will schedule here.                                      |
| `NotReady`                                                                        | The node is not Ready.                                               |
| `not in the cluster's node roster`                                                | Not a node in this cluster.                                          |
| `GPU capacity unknown on this node — cannot confirm it can run the model`         | GPU count unreadable. Treated as unusable, never as free.            |
| `GPU product unknown on this node — cannot confirm it matches …`                  | GPU model unreadable, so a hardware match cannot be proven.          |
| `the model's weights are not staged on this node`                                 | Disk-backed model, weights absent here.                              |
| `only the model's metadata is staged on this node, not its weights`               | The upload is incomplete on this node.                               |
| `local-weights state unreadable for this node — cannot confirm the model is staged here` | The scanner has not reported this node.                         |

## How Local Weights Affect the Choice

Node selection decides where a model runs, not where its weights are staged. Choosing a node does not copy weights to
it.

Only **disk-backed** models are gated on staged weights. A model that pulls weights at start-up needs nothing staged, so
weights never restrict its node choice.

For a disk-backed model, "the scanner has not reported this node" and "the weights are absent here" are different
answers, and neither counts as a yes. Stage the weights first. Then the **Nodes** list includes the node. For the upload
procedure, refer to [Upload a Model](../how-to-guides/upload-a-model.md).

## What Model Placement Is Not

- **Not a weight copy.** Stage weights on a node before you select it for a disk-backed model.
- **Not automatic rebalancing.** A pinned model does not follow new hardware. Add the node to the model's list, as
  described in [Add a Model to More Nodes](../how-to-guides/deploy-a-model.md#add-a-model-to-more-nodes).
- **Not replica scaling.** Placement width is the node list.
- **Not a taint check.** A Ready node with a `NoSchedule` taint can still appear eligible, and an engine placed there
  stays pending. Check taints yourself when a chosen node never starts.
- **Not a substitute for per-node drain, resume, or replace.** Those actions apply to the appliance, not to one node's
  engine. Per-node **Remove** and **Retry** do target a single node.

## Next Steps

- [Deploy a Model](../how-to-guides/deploy-a-model.md) walks through choosing nodes, verifying placement, adding nodes,
  and removing a model from one node.
- [Architecture Overview](./architecture.md) explains the deploy lifecycle after you confirm.
- [Certified Models by Hardware](../reference/certified-models-by-hardware.md) lists which models fit which GPUs.
