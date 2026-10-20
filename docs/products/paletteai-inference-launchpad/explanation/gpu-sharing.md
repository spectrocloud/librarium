---
sidebar_label: "GPU Sharing"
title: "GPU Sharing"
description:
  "An explanation of how PaletteAI Inference Launchpad lets two or more models share a GPU, how the console judges each
  model's GPU memory share, and why one appliance runs one sharing group."
hide_table_of_contents: false
sidebar_position: 1.3
tags: ["paletteai-inference-launchpad", "explanation", "models", "gpu"]
keywords: ["launchpad", "ai", "gpu sharing", "gpu memory share", "group", "accelerator", "semantic router"]
---

A model that takes a whole GPU holds all that GPU's memory, even when the model needs only a small part of it. GPU
sharing lets two or more models load onto the same GPU, and each model reserves its own part of the GPU's memory. The
appliance can then run more models than it has GPUs, and a small model, such as the semantic router, does not hold a
large GPU on its own.

This page explains how models share a GPU, how the console judges a sharing plan, and why one appliance runs one sharing
group. To deploy a model that shares a GPU, or to change the share of a model that already runs, refer to
[Share a GPU Between Models](../how-to-guides/share-a-gpu-between-models.md).

The console calls each GPU an accelerator. This page uses _GPU_, and it quotes the console's own wording where that
wording says _accelerator_.

## Whole GPUs or a Shared GPU

When you deploy a model, you decide how it takes a GPU. The **GPU sharing** toggle on the deploy wizard's **GPU
sharing** step makes that decision.

| **GPU sharing** | **What the model gets**                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Off             | Whole GPUs of its own. No other model runs on them.                                                     |
| On              | A share of a GPU that it holds together with the other models of a group. Each model has its own share. |

Models that share a GPU run on the vLLM engine. For what an inference engine is, refer to
[Inference Engines](./inference-engines.md).

## GPU Sharing Groups

A sharing group is the set of models that share the same GPUs. Each model in a sharing group is a group member. The
**Group** column on the **Models** tab names the group of each model. A model that takes whole GPUs reads `—` in that
column.

### One Group per Appliance

A group holds the GPUs that it claims. The semantic router refuses a second group on the same appliance, so one
appliance runs one group. The group's name, such as `text-router`, matches the appliance's mode, unless the appliance
names the group after a model. For the two modes and how a model's catalog entry decides its mode, refer to
[One Mode per Appliance](./routing-behavior.md#one-mode-per-appliance).

### How the Appliance Names the Group

You never type a group name. The appliance decides which group a new model uses, and the **GPU sharing** step states
that group in one line.

| **What shares a GPU on the appliance** | **What the model's recipe names** | **What the deploy does**                                                                                                  |
| -------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| A group of models                      | The same group, or none           | The model joins that group. The step reads `This model joins <group>. Inference Launchpad runs one mode, and this is it.` |
| A group of models                      | A different group                 | The appliance refuses the deploy. Refer to [One Mode per Appliance](./routing-behavior.md#one-mode-per-appliance).        |
| Only the semantic router               | No group                          | The model joins the semantic router's group.                                                                              |
| Only the semantic router               | A group                           | The model starts the group that its recipe names, and the semantic router moves into that group.                          |
| Nothing                                | A group                           | The model starts the group that its recipe names.                                                                         |
| Nothing                                | No group                          | The appliance names a new group after the model. The step reads `Inference Launchpad names the group after this model.`   |

In the table, `<group>` is the name of the group that the appliance runs. After the deploy, the **Group** column shows
the name.

## GPU Memory Shares

A GPU memory share is a model's part of one GPU's memory, in percent. Every share in a group is a percentage of the same
single GPU's memory, so the shares of all members add up to one total. The console judges that total against 100 percent
of one GPU.

The **Shared GPU memory** panel on the **GPU sharing** step lists every member of the group with its share. A **Free**
row shows the part of the GPU that is left, and a bar draws each share and the free part.

### How the Panel Judges the Total

The panel names one of three results for the total.

| **Total of the shares**                 | **Result**                     |
| --------------------------------------- | ------------------------------ |
| 90 percent or less                      | The plan fits.                 |
| More than 90 percent, up to 100 percent | The plan fits, with a warning. |
| More than 100 percent                   | The panel refuses the plan.    |

The band over 90 percent is a warning, not a refusal. The plan fits in memory, but a running engine also needs memory
for its own overhead. The warning asks you to keep 10 percent of the GPU free for that overhead.

### Refused Plans

The panel refuses three plans. When the panel refuses a plan, **Deploy** and **Save** are unavailable, and the panel
states which problem applies.

| **Plan**                              | **Why the panel refuses it**                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| A member has a share of zero          | The engine has no memory to load that model into.                                     |
| A member of the group states no share | The panel cannot add up a total that is missing a share, so it cannot judge the plan. |
| The total is more than 100 percent    | The members ask for more memory than one GPU holds.                                   |

### Where the Group Members Sit

The panel also states where the appliance places the members of the group. When the members sit on one GPU, their shares
divide that GPU. When the members sit on GPUs of their own, the panel reports that no single GPU holds more than 100
percent. **Deploy** still requires the total of all shares to be 100 percent or less, wherever the members sit.

## Shares of Other Group Members

The shares of the other members of the group are not fixed. In the **Shared GPU memory** panel, you can lower the share
of a model that already runs to make room for a new model. A model whose share changes restarts with its new share.
Before the appliance writes the change, a dialog names each model that restarts.

A member whose share the appliance sets is marked **not editable**. Its share counts in the total, and you cannot change
it.

## The Semantic Router as a Group Member

The semantic router is a model that the appliance runs, so it holds a share of a GPU like any other member. In the
panel, its row reads **Semantic Router** and never names the model that it runs. The row is marked **not editable**, and
its share counts in the total.

The semantic router is a member only while its engine runs. When you turn the semantic router off, its engine stops and
holds no memory. It is then not a member of the group, its share does not count, and that memory counts as free. To turn
it off, refer to
[Configure Semantic Routing](../how-to-guides/configure-semantic-routing.md#turn-the-semantic-router-on-or-off).

The panel counts the semantic router only on the nodes where its engine runs. When the semantic router runs on some of
the nodes that a model is deployed to, the panel states
`The semantic router runs on some of the nodes this model is going to, and its share counts here.`

## Changes to a Running Model

The model's row on the **Models** tab opens the same steps as the deploy wizard, and each step opens on the values that
the model runs with today. The same refusals apply to a save and to a deploy.

The model's nodes and GPU width open on the placement that the model already has. An edit skips the deploy-time check
for a free GPU, so the placement stands even on a node that has no free GPU.

## Next Steps

To deploy a model that shares a GPU, or to change a running model's share, refer to
[Share a GPU Between Models](../how-to-guides/share-a-gpu-between-models.md). For how a model is placed on cluster
nodes, refer to [Model Placement](./model-placement.md). For why one appliance runs one mode, refer to
[Routing Behavior](./routing-behavior.md#one-mode-per-appliance).
