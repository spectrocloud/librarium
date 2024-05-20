---
sidebar_label: "Renew Certificates for Air-gap Clusters"
title: "Renew Certificates for Air-gap Clusters"
description: "Learn how to renew certificates for different Kubernetes components in your cluster."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge", "architecture"]
---

Kubernetes uses certificates to secure the communication between different components of a cluster. Using these
certificates allows Kubernetes to secure API connections, verifying the authenticity of the nodes, and encrypting
connections. All certificates have an expiry date, and need to be renewed periodically.

This page guides you through the different methods used to renew certificates in an air-gapped Palette Edge cluster. An
air-gapped cluster means a cluster that has no connection to a Palette instance.

## Automatic Renewal

Palette Edge will automatically renew all certificates used by your cluster for you 30 days before they expire. You can
follow the steps below to check when the next automatic renewal will happen.

### Prerequisite

### Check Next Auto Renewal Time

1. Log in to local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Select the **Overview** tab on the **Cluster** page.

4. In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
   certificates currently in use by your cluster.

5. The next renewal time, which is 30 days before the expiry date, for your certificates is at the top of the pop-up
   box.

### Validate

In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
certificates currently in use by your cluster. You can confirm that the certificates have been renewed by looking at the
issue date of certificates.

## Manual Renewal

You can also manually renew your certificates whenever you want. You can do this through the local UI or through the
API.

### Prerequisite

### Manually Renew Certificates

1. Log in to local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Select the **Overview** tab on the **Cluster** page.

4. In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
   certificates currently in use by your cluster.

5. Click **Renew** to renew all certificates used by the cluster.

### Validate

In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
certificates currently in use by your cluster. You can confirm that the certificates have been renewed by looking at the
issue date of certificates.
