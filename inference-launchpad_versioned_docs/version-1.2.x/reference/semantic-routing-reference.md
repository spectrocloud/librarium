---
sidebar_label: "Semantic Routing Reference"
title: "Semantic Routing Reference"
description:
  "Reference of the Semantic router card, the guard toggles, the reasons the semantic router is unavailable, the routing
  rules, the Complexity threshold, and the decision recording controls on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 4.75
tags: ["paletteai-inference-launchpad", "routing", "semantic-routing", "reference"]
keywords:
  [
    "launchpad",
    "ai",
    "semantic routing",
    "semantic router",
    "guard",
    "complexity threshold",
    "fallback",
    "decision recording",
  ]
---

This reference lists the semantic router controls on a PaletteAI Inference Launchpad appliance, their defaults, and what
each value does. For the concepts behind them, refer to [Routing Behavior](../explanation/routing-behavior.md). For the
steps to set them, refer to [Configure Semantic Routing](../how-to-guides/configure-semantic-routing.md).

## Semantic Router Card

The **Semantic router** card is on the **Configurations** tab of the **Settings** page.

| **Control**                                                  | **Type** | **Default**                           | **What it does**                                                                                                                                                                  |
| ------------------------------------------------------------ | -------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Run the semantic router on this box**                      | Toggle   | On, wherever the appliance can run it | Runs the semantic router. Off stops its engine and frees its GPU memory. The main model keeps serving without a restart. On again redeploys the copy that stays on the appliance. |
| **Refuse jailbreak attempts**                                | Toggle   | On                                    | Turns the jailbreak check on or off. For both states, refer to [Guard Toggles](#guard-toggles).                                                                                   |
| **Scan prompts for personal data before they leave the box** | Toggle   | On                                    | Turns the personal data check on or off. For both states, refer to [Guard Toggles](#guard-toggles).                                                                               |
| **Apply semantic router settings**                           | Button   | Not applicable                        | Applies the toggle changes. It reads **Turn on semantic router** or **Turn off semantic router** when the router toggle changed.                                                  |

## Semantic Router States

| **State** | **Effect**                                                                                                                                                                                                                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| On        | The semantic router reads each routed request, picks a rule, and runs the guard's checks on the request.                                                                                                                                                                                                                                 |
| Off       | The category and **Thinking** columns of the routing rules have no effect, decision recording records nothing new, and `auto` requests go to the box default model. The **Semantic routing** card shows `The semantic router is not serving this box, so category rules have nothing to match and auto requests follow the box default.` |

## Console Messages

| **Message**                                       | **When it appears**                |
| ------------------------------------------------- | ---------------------------------- |
| `Started deploying the semantic router.`          | The semantic router is turned on.  |
| `Stopped the semantic router. It stays deployed.` | The semantic router is turned off. |

## Guard Toggles

| **Toggle**                                                   | **When on**                                                                                                  | **When off**                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| **Refuse jailbreak attempts**                                | The semantic router refuses a request that it reads as a jailbreak attempt.                                  | The semantic router no longer refuses requests as jailbreak attempts. |
| **Scan prompts for personal data before they leave the box** | A prompt bound for a provider is read in full first, and a prompt with personal data stays on the appliance. | No scan runs, and prompts reach providers unread.                     |

The personal data check applies only to requests that would leave the appliance for a frontier provider or an external
inference endpoint. A request that a local model answers is not held back for personal data.

## Reasons the Semantic Router Is Unavailable

The **Run the semantic router on this box** toggle is unavailable in the following cases. The **Why the semantic router
is unavailable** tooltip on the toggle names the case.

| **Case**                                                   | **What it means**                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| The cluster has no GPU                                     | The semantic router needs a GPU and cannot run on this cluster.                                     |
| Every GPU is too small                                     | No GPU has enough memory for the semantic router.                                                   |
| The semantic router does not fit beside the deployed model | The GPUs the main model uses have no room left for the semantic router, so it is not deployed.      |
| The appliance cannot yet tell whether it fits              | The semantic router is held until the appliance can read whether it fits beside the deployed model. |

When the cluster has GPUs but the GPU driver is not publishing them, the card shows an error that names the driver to
install. The toggle stays available.

<!-- vale off -->

## Routing Rules

<!-- vale on -->

Each category on the **Semantic routing** card has three rules. Each rule has a **Model** column and a **Thinking**
column.

| **Rule**     | **Console hint**               | **When the rule answers**                                                            |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------ |
| **Simple**   | `below <n>%`                   | The request scores below the Complexity threshold, and the rule names a model.       |
| **Complex**  | `<n>% and above`               | The request scores at or above the Complexity threshold, and the rule names a model. |
| **Fallback** | `when a request is not scored` | The request is not scored, or its **Simple** or **Complex** rule names no model.     |

In each hint, `<n>` is the Complexity threshold. When the **Fallback** rule also names no model, the request goes to the
box default model.

The six categories in the routing editors are **Code planning**, **Code development**, **Code refactoring**, **Code
review**, **Code test generation**, and **General**. For the **Thinking** values, refer to
[Thinking Directive Modes](./thinking-modes.md#thinking-values-on-semantic-routing-rules).

Every rule starts filled with the model and reasoning depth that apply to the client today. A rule that follows the
defaults is tagged `default`.

## Complexity Threshold

<!-- vale Vale.Spelling = NO -->

| **Where it is set**                            | **Precedence** | **Value**                                                           |
| ---------------------------------------------- | -------------- | ------------------------------------------------------------------- |
| The client's **Routing** tab                   | First          | A percentage set with the **Complexity threshold** slider.          |
| The **Routing** step of the workspace's policy | Second         | A percentage set with the policy's **Complexity threshold** slider. |
| Default                                        | Last           | 50%.                                                                |

<!-- vale Vale.Spelling = YES -->

**Use default** clears the client's own value, and the client follows the next layer.

## Decision Recording Controls

Only a platform administrator can view or change these controls.

| **Control**                                              | **Where**                                                       | **Default**                  | **What it does**                                                                                               |
| -------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Record the classified turns of this policy's clients** | The **Routing** step of a policy                                | Off                          | Records the classified requests of every client in the workspaces that follow the policy.                      |
| **Turns kept per client**                                | The **Routing** step of a policy                                | 1,000                        | Sets how many requests each client keeps. When a client holds that many, each new request replaces its oldest. |
| **Recording** column                                     | The **Policies** tab                                            | Not applicable               | Shows each policy's setting, such as `Off` or `Last 1,000 per client`.                                         |
| **Record this client's classified turns**                | The **Decision recording** card on the client's **Routing** tab | On, while the policy records | Off excludes the client from its policy's recording. The requests already recorded stay available to download. |
| **Turns recorded**, **Space used**, **Dates covered**    | The **Decision recording** card                                 | Not applicable               | Report the requests recorded for the client.                                                                   |
| **Download CSV**                                         | The **Decision recording** card                                 | Not applicable               | Downloads the client's recorded requests.                                                                      |
| **Delete records**                                       | The **Decision recording** card                                 | Not applicable               | Deletes the client's recorded requests after confirmation. Deleted requests cannot be recovered.               |

The following table describes what is recorded.

| **Case**            | **Detail**                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Which requests      | Only the requests the semantic router reads, which are those that send `auto` or come through an alias set to **Use Semantic Router rules**. |
| Personal data       | A request with personal data is stored with its prompt withheld.                                                                             |
| Semantic router off | Nothing new is recorded. The requests recorded before stay available to download or delete.                                                  |
| A failed record     | The appliance drops that record rather than slow the request.                                                                                |
| Where records stay  | Recorded rows stay on the appliance. They are not a compliance audit log.                                                                    |
