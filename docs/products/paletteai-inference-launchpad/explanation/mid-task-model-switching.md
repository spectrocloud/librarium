---
sidebar_label: "Mid-Task Model Switching"
title: "Mid-Task Model Switching"
description:
  "How Mid-Task Model Switching moves the hard turns of a coding assistant's task from an efficient model to a capable
  model, what its switching settings do, and when the efficient model answers."
hide_table_of_contents: false
sidebar_position: 7.3
tags: ["paletteai-inference-launchpad", "explanation", "routing"]
keywords:
  [
    "launchpad",
    "ai",
    "mid-task model switching",
    "efficient model",
    "capable model",
    "confidence threshold",
    "judge model",
    "coding assistant",
    "tool results",
  ]
---

Mid-Task Model Switching lets a [coding assistant's](../reference/glossary.md#coding-assistant) task move to a stronger
model for its hard turns. The task runs on an efficient model. When the tool results show that the task is struggling,
the turn moves to a capable model. The efficient model and the capable model form a pair.

A platform administrator turns the feature on and tunes it in **Settings**, under **Request handling**. Then, on a
client's **Routing** tab, the administrator sets an alias to the feature and chooses the pair. To set up the feature,
refer to [Set Up Mid-Task Model Switching](../how-to-guides/set-up-mid-task-model-switching.md).

## How a Turn Moves

A coding assistant works through a task in turns. It runs tools along the way. The tool results show how the task is
going.

For each turn, a decision service on the appliance reads those tool results. When they show that the task is struggling,
the turn moves to the capable model. After a move, the task stays on the capable model for a set number of turns. All
other turns stay on the efficient model. The [switching settings](#the-switching-settings) set how strongly the tool
results must show that the task is struggling before a turn moves. They also set how long a move lasts.

## The Model Pair

A client's pair is set on its **Mid-Task Model Switching** card. The card appears on the client's **Routing** tab after
an alias in the **Tier map** is set to **Use Mid-Task Model Switching for routing**.

| **Model**           | **What it does**                                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Efficient model** | Serves every turn that does not move.                                                                                                                                                                       |
| **Capable model**   | Serves the turns that the tool results move to it. It can be a local model or an external model that the client can reach. In the **Capable model** drop-down menu, each external model shows its endpoint. |

You pick one specific model for each side. You can pick the same model for both sides. In that case, the card notes that
no turn moves until you pick a stronger capable model.

On the client's **Tier map**, one **Save** stores the alias rules and the pair together.

## The Switching Settings

The switching settings appear only while Mid-Task Model Switching is on.

| **Setting**                         | **What it sets**                                                                         | **Default** |
| ----------------------------------- | ---------------------------------------------------------------------------------------- | ----------- |
| **Confidence threshold (%)**        | How strongly the tool results must show that the task is struggling before a turn moves. | 50          |
| **Turns held on the capable model** | How many turns stay on the capable model after a move.                                   | 2           |
| **Judge model**                     | Whether the semantic router decides the turns that the tool results leave unclear.       | Off         |

**Reset to defaults** restores these three values.

**Judge model** is offered only while the semantic router is ready. When the semantic router is not ready, the toggle is
unavailable, and the console shows why.

A change to a switching setting restarts the decision service. The console asks you to confirm the restart first.

## When the Efficient Model Answers

Mid-Task Model Switching is always installed, and it is off by default. In these cases, the efficient model serves the
turns of an alias that uses the feature:

- While the **Use Mid-Task Model Switching on Inference Launchpad** toggle is off.

- For a few seconds after a change to a switching setting, while the decision service restarts.

- When the decision service cannot answer. No request fails. The console counts those turns separately.

## Next Steps

- [Set Up Mid-Task Model Switching](../how-to-guides/set-up-mid-task-model-switching.md) walks through turning the
  feature on, changing the switching settings, and choosing a client's model pair.

- [Routing Behavior](./routing-behavior.md) explains how the Tier map routes a client's other aliases.
