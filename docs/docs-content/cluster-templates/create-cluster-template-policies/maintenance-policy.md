---
sidebar_label: "Maintenance Policies"
title: "Maintenance Policies"
description: "Test" # UPDATE
hide_table_of_contents: false
sidebar_position: 10
tags: ["cluster templates", "policies"]
---

:::preview

:::

A maintenance policy is a mandatory policy used with cluster templates. Maintenance policies determine when to perform
rolling updates on the cluster.

## Prerequisites

- X feature flag enabled

- X permissions

## Create Maintenance Policies

## DRAFTING

- What happens if some clusters miss the maintenance window?

  - The template can enter a partially‑applied state and further updates are blocked until all clusters complete the
    previous upgrade, or an operator triggers upgrades where appropriate.

- We say that maintenance policies and upgrades are triggered based on local time, but the tooltip while creating a
  maintenance policy specifies UTC?
