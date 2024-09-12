---
sidebar_label: "Renew Cluster PKI Certificates"
title: "Renew Cluster PKI Certificates"
description: "Learn about auto-renewal of control certificates in Palette and how to renew the certificates manually. "
hide_table_of_contents: false
sidebar_position: 50
tags: ["clusters", "cluster management"]
---

In Kubernetes, Public Key Infrastructure (PKI) certificates are used to secure communications and authenticate
components within the cluster. Certificates have an expiry date and need to be renewed periodically. You can view the
issue and expiry date of the cluster by click on **View K8s Certificates** in the cluster details page.

This page focuses on how to renew the PKI certificates through Palette. You have two options for how you can renew the
cluster PKI certificates:

- [Automatic Certificate Renewal](#automatic-certificate-renewal)
- [Manual Certificate Renewal](#manual-certificate-renewal)

:::info

Certificates created by kubeadm expire after 365 days. The Root Certificate Authority (CA) is valid for 3652 days or 10
years.

:::

## Certificate Renewal Impact on Cluster Availability

After the new certificates are generated, the cluster needs to restart the control plane components in order to pick up
the new certificates. Depending on your cluster structure, this restart period may impact the cluster management
availability of your cluster, but will not affect your cluster workloads:

- If you have a single-node control plane, this will cause a short period of downtime for the control plane components,
  meaning that cluster management availability will be temporarily impacted. However, your worker nodes will continue to
  operate normally in the meantime and their workloads will not be impacted.
- If you have three nodes or more in your control plane, certificate renewal will not cause downtown for neither the
  control plane components nor worker nodes.

## Limitations

- Both automatic and manual certificate renewal will renew control plane certificates only. Worker node certificate
  renewal is not supported.

- Airgapped Edge clusters are not managed by Palette. To renew the certificates for airgapped Edge clusters, refer to
  [Renew Certificates for Airgap Clusters](../edge/cluster-management/certificate-renewal.md).

## Automatic Certificate Renewal

Palette will automatically update the cluster PKI certificates 30 days before they expire. You can view the issue and
expiry date of the cluster by click on **View K8s Certificates** in the cluster details page.

Another scenario that results in new PKI certificates is upgrading a cluster's Kubernetes version. Upgrading a cluster's
Kubernetes version, whether a minor patch or a major release, results in renewed PKI certificates. We recommend
regularly updating your clusters to stay current with security fixes and best practices.

:::info

You can upgrade the Kubernetes version of a cluster by updating the Kubernetes layer of the cluster profile and applying
the cluster profile update to the cluster. For guidelines on updating pack versions, review
[Update the Pack Version](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#update-the-pack-version).

:::

## Manual Certificate Renewal

You can renew the cluster PKI certificates on-demand using the Palette API or the Palette User Interface (UI). Palette
uses the same process to renew the cluster PKI certificates as the automatic renewal process. The only difference is
that the manual renewal is triggered by the user.

Review the following sections to learn how to manually renew the cluster PKI certificates. Choose your preferred update
method, using the Palette UI or the API.

### Prerequisites

<Tabs groupId="manual">

<TabItem label="UI" value="ui">

- A deployed host cluster.

- Access to the host cluster.

</TabItem>
<TabItem label="API" value="api">

- A Palette API key. You can learn how to create a Palette API key by reviewing the
  [API Key](../../user-management/authentication/authentication.md) documentation.

- A deployed host cluster.

- Access to the host cluster.

</TabItem>
</Tabs>

### Renew Cluster Certificate

<Tabs groupId="manual">

<TabItem label="UI" value="ui">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster to renew its PKI certificates.

4. From the cluster details page, click on **View K8s Certificates**.

![A view of the Palette UI with an arrow pointing to the **View K8s Certificates** button.](/clusters_cluster-management_certificate-management_cluster-details-page.webp)

5. Next, select **Renew All** to start the renewal process.

![A view of the cluster certificates displaying the expiration date](/clusters_cluster-management_certificate-management_certificate-renew-page.webp)

The renewal process may take several minutes, depending on the number of cluster nodes.

</TabItem>
<TabItem label="API" value="api">

1. Set your Palette API key as an environment variable. Add your actual API key in place of `REPLACE_ME`.

   ```shell
   export API_KEY=REPLACE_ME
   ```

2. Set the project ID as an environment variable. Add your project ID in place of `REPLACE_ME`. You can find the project
   ID on the Palette landing page. The project ID is displayed in the top right corner of the page.

   ```shell
   export PROJECT_ID=REPLACE_ME
   ```

3. Set the cluster ID as an environment variable. Add your cluster's ID in place of `REPLACE_ME`. You can get the
   cluster ID from the cluster detail's page URL. The value after `clusters/` is the cluster ID.

   ```shell
   export CLUSTER_ID=REPLACE_ME
   ```

4. Use the Palette API endpoint `https://api.spectrocloud.com/v1/spectroclusters/{uid}/k8certificates/renew` to renew a
   cluster's PKI certificates. The endpoint accepts the HTTP method `PATCH`, and the only required parameter is the
   cluster ID.

   ```shell
   curl --request PATCH \
     --url  'https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID/k8certificates/renew' \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "ApiKey: $API_KEY" \
     --header "ProjectUid: $PROJECT_ID"
   ```

5. No output is returned and an HTTP status `204` is expected.

The renewal process may take several minutes, depending on the number of cluster nodes.

</TabItem>
</Tabs>

### Validate

<Tabs groupId="manual">

<TabItem label="UI" value="ui">

Using the following steps, you can validate that the cluster's PKI certificates were renewed.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster with the renewed PKI certificates.

4. From the cluster details page, click on **View K8s Certificates**.

5. Review the expiration date for each component. Each component's expiration date will have a status of **365d** with a
   date that is one year away.

</TabItem>
<TabItem label="API" value="api">

Using the following steps, you can validate that the cluster's PKI certificates were renewed.

1. Set your Palette API key as an environment variable. Add your actual API key in place of `REPLACE_ME`.

   ```shell
   export API_KEY=REPLACE_ME
   ```

2. Set the project ID as an environment variable. Add your project ID in place of `REPLACE_ME`.

   ```shell
   export PROJECT_ID=REPLACE_ME
   ```

3. Set the cluster ID as an environment variable. Add your cluster's ID in place of `REPLACE_ME`.

   ```shell
   export CLUSTER_ID=REPLACE_ME
   ```

4. Retrieve the cluster's certificate information from Palette by using the
   `https://api.spectrocloud.com/v1/spectroclusters/{uid}/k8certificates` endpoint.

   ```shell
   curl \
   --url  'https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID/k8certificates' \
   --header 'Content-Type: application/json' \
   --header 'Accept: application/json' \
   --header "ApiKey: $API_KEY" \
   --header "ProjectUid: $PROJECT_ID"
   ```

5. Validate the output and confirm the expiration date is one year away.

   ```json hideClipboard
   {
     "machineCertificates": [
       {
         "certificateAuthorities": [
           {
             "certificates": [
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "front-proxy-client"
               }
             ],
             "expiry": "2033-05-23T16:45:22.209Z",
             "name": "front-proxy-ca"
           },
           {
             "certificates": [
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "kube-apiserver"
               },
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "kube-apiserver-kubelet-client"
               }
             ],
             "expiry": "2033-05-23T16:45:22.209Z",
             "name": "ca"
           },
           {
             "certificates": [
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "kube-apiserver-etcd-client"
               },
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "kube-etcd-healthcheck-client"
               },
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "kube-etcd-peer"
               },
               {
                 "expiry": "2024-05-23T16:51:05.000Z",
                 "name": "kube-etcd-server"
               }
             ],
             "expiry": "2033-05-23T16:45:22.209Z",
             "name": "etcd-ca"
           }
         ],
         "name": "ip-10-0-1-120.ec2.internal"
       }
     ]
   }
   ```

</TabItem>
</Tabs>
