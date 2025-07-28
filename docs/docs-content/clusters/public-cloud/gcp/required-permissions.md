---
sidebar_label: "Required IAM Permissions"
title: "Required IAM Permissions"
description: "A list of required IAM permissions that Palette requires for GCP deployments."
hide_table_of_contents: false
sidebar_position: 40
tags: ["public cloud", "gcp", "iam"]
---

## Required API Services

Ensure the following Google Cloud Platform (GCP) API services are enabled in your Google Cloud Platform (GCP) project to
deploy a host cluster:

- [Cloud Resource Manager API](https://cloud.google.com/resource-manager/reference/rest)
- [Compute Engine API](https://cloud.google.com/compute/docs/reference/rest/v1)
- [Kubernetes Engine API](https://cloud.google.com/kubernetes-engine/docs/reference/rest)

:::tip

If you need help enabling a Google Cloud API service, check out the
[Enable and disable APIs](https://support.google.com/googleapi/answer/6158841?hl=en) guide from the official Google
Cloud documentation.

:::

## Required Permissions

The following snippet defines a custom GCP role with the permissions required by Palette to deploy and manage GCP
workload clusters. Refer to the [Create a custom role](https://cloud.google.com/iam/docs/creating-custom-roles#creating)
guide for instructions on how to create GCP custom roles.

<PartialsComponent category="permissions" name="gcp-deployment-role" />
