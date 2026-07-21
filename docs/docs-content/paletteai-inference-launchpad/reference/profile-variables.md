---
id: profile-variables
title: Cluster Profile Variables
description: >
  Reference for the PaletteAI Inference Launchpad cluster profile variables collected by the Profile Config wizard —
  networking, OS and metrics, container registry, local admin, storage, and certificates — with types, required fields,
  defaults, and validation rules.
sidebar_label: Cluster Profile Variables
sidebar_position: 2.7
tags:
  - paletteai-inference-launchpad
  - reference
  - install
  - profile
keywords: ["launchpad", "ai", "profile", "cluster", "variables", "wizard", "kubernetes", "metallb"]
---

When you deploy the cluster from Local UI, the **Profile Config** step opens a PaletteAI Inference Launchpad custom
wizard that collects the settings the platform packs need in order to install correctly on your hardware and network.
This page documents every variable the wizard collects, in six sections, in the order the wizard presents them.

For the step-by-step procedure, refer to
[Install the Appliance](../how-to-guides/install-the-appliance.md#deploy-the-cluster).

## Networking

| Variable                  | Type      | Required | Default          | Description                                                                                                                       |
| ------------------------- | --------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Pod Network Range**     | IPv4 CIDR | Yes      | `100.64.0.0/18`  | Kubernetes pod network CIDR. Read-only after day 1. Pick a range that will not collide with your existing network.                |
| **Service Network Range** | IPv4 CIDR | Yes      | `100.64.64.0/18` | Kubernetes ClusterIP service CIDR. Read-only after day 1. Must not overlap the Pod Network Range or your existing network.        |
| **Platform IP Address**   | IPv4      | Yes      | —                | Single IPv4 address drawn from the MetalLB range on the bond. Traefik claims this address; the console and API are reached at it. |

## OS and metrics

| Variable                      | Type   | Required | Default | Description                                                                                                                                                         |
| ----------------------------- | ------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **System Reserved CPU Cores** | string | Yes      | `0-1`   | Range of CPU cores kubelet reserves for the operating system (`--reserved-cpus`). Validated against the regex `\d-\d`, so only single-digit endpoints are accepted. |
| **Maximum Pods per Node**     | number | Yes      | `110`   | Kubelet `--max-pods` setting.                                                                                                                                       |
| **Metrics Retention Period**  | string | Optional | `30d`   | How long Victoria Metrics keeps time-series data.                                                                                                                   |
| **Metrics Storage Size**      | string | Optional | `20Gi`  | Size of the persistent volume Victoria Metrics uses for retained metrics. Increase in step with the retention period.                                               |

## Container registry (Zot)

| Variable              | Type               | Required | Default | Description                                                                                                                    |
| --------------------- | ------------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Registry Username** | string             | Yes      | `admin` | Username for the on-cluster Zot registry that hosts platform and application images.                                           |
| **Registry Password** | string (sensitive) | Yes      | —       | Password for the Zot registry account. Must satisfy the [password complexity requirements](#password-complexity-requirements). |

## Local admin

| Variable                 | Type               | Required | Default | Description                                                                                                                                                 |
| ------------------------ | ------------------ | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local Admin Username** | string             | Yes      | `admin` | Administrator username shared by the appliance console and the Grafana dashboard.                                                                           |
| **Local Admin Password** | string (sensitive) | Yes      | —       | Administrator password shared by the appliance console and Grafana. Must satisfy the [password complexity requirements](#password-complexity-requirements). |

## Storage (Piraeus)

| Variable                  | Type   | Required | Default | Description                                                                                                                                                                                             |
| ------------------------- | ------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Storage Replica Count** | string | Optional | `1`     | Number of Piraeus replicas kept for each stored volume. Allowed values are `1`, `2`, or `3`. Values above `1` require a matching number of nodes in the cluster, so a single-node install must use `1`. |

## Certificates

| Variable         | Type   | Required | Default | Description                                                  |
| ---------------- | ------ | -------- | ------- | ------------------------------------------------------------ |
| **OIDC CA cert** | base64 | Yes      | —       | Base64-encoded CA certificate.                               |
| **OIDC CA key**  | base64 | Yes      | —       | Base64-encoded private key that pairs with the OIDC CA cert. |

## Password complexity requirements

The **Registry Password** and **Local Admin Password** must both satisfy all of the following (rules inherited from
[PVM-723](https://spectrocloud.atlassian.net/browse/PVM-723)):

- Between **15** and **64** characters long.
- At least **1 uppercase letter**.
- At least **1 lowercase letter**.
- At least **1 digit**.
- At least **1 special character**.
- Must **not** contain a double quote (`"`), single quote (`'`), backslash (`\`), or any whitespace.
