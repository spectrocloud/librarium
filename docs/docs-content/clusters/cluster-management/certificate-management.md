---
sidebar_label: "Certificate Management"
title: "Certificate Management"
description: "Learn how to manage the cluster certificates through Palette."
hide_table_of_contents: false
sidebar_position: 50
tags: ["clusters", "cluster management"]
---

Palette installs Kubernetes through the tool, [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm). As a
result, all deployed clusters include auto-generated Public Key Infrastructure (PKI) certificates created by kubeadm. We
recommend you review the
[PKI certificates and requirement](https://kubernetes.io/docs/setup/best-practices/certificates) Kubernetes
documentation to learn more about the auto-generated certificates and to better understand their purpose.

This reference page focuses on how to renew the PKI certificates through Palette. You have two options for how you can
renew the cluster PKI certificates:

<br />

- Automatic Certificate Renewal

- Manual Certificate Renewal

:::info

Certificates created by kubeadm expire after 365 days. The Root Certificate Authority (CA) is valid for 3652 days or 10
years.

:::

You can learn more about each option in the following sections.

## Automatic Certificate Renewal

Palette will automatically update the cluster PKI certificates 30 days before they expire. The automatic renewal process
will not cause a cluster repave. The automatic renewal process will only renew the certificates for the control plane
nodes.

Another scenario that results in new PKI certificates is upgrading a cluster's Kubernetes version. Upgrading a cluster's
Kubernetes version, whether a minor patch or a major release, results in renewed PKI certificates. We recommend
regularly updating your clusters to stay current with security fixes and best practices.

<br />

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

<br />

![A view of the Palette UI with an arrow pointing to the **View K8s Certificates** button.](/clusters_cluster-management_certificate-management_cluster-details-page.webp)

5. Next, select **Renew All** to start the renewal process.

<br />

![A view of the cluster certificates displaying the expiration date](/clusters_cluster-management_certificate-management_certificate-renew-page.webp)

The renewal process may take several minutes, depending on the number of cluster nodes.

</TabItem>
<TabItem label="API" value="api">

1. Set your Palette API key as an environment variable. Add your actual API key in place of `REPLACE_ME`.

<br />

```shell
export API_KEY=REPLACE_ME
```

2. Set the project ID as an environment variable. Add your project ID in place of `REPLACE_ME`. You can find the project
   ID on the Palette landing page. The project ID is displayed in the top right corner of the page.

<br />

```shell
export PROJECT_ID=REPLACE_ME
```

3. Set the cluster ID as an environment variable. Add your cluster's ID in place of `REPLACE_ME`. You can get the
   cluster ID from the cluster detail's page URL. The value after `clusters/` is the cluster ID.

<br />

```shell
export CLUSTER_ID=REPLACE_ME
```

4. Use the Palette API endpoint `https://api.spectrocloud.com/v1/spectroclusters/{uid}/k8certificates/renew` to renew a
   cluster's PKI certificates. The endpoint accepts the HTTP method `PATCH`, and the only required parameter is the
   cluster ID.

<br />

```shell
curl --request PATCH \
  --url  'https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID/k8certificates/renew' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header "ApiKey: $API_KEY" \
  --header "ProjectUid: $PROJECT_ID"
```

3. No output is returned and an HTTP status `204` is expected.

The renewal process may take several minutes, depending on the number of cluster nodes.

</TabItem>
</Tabs>

### Validate

<Tabs groupId="manual">

<TabItem label="UI" value="ui">

Using the following steps, you can validate that the cluster's PKI certificates were renewed.

<br />

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster with the renewed PKI certificates.

4. From the cluster details page, click on **View K8s Certificates**.

5. Review the expiration date for each component. Each component's expiration date will have a status of **365d** with a
   date that is one year away.

</TabItem>
<TabItem label="API" value="api">

Using the following steps, you can validate that the cluster's PKI certificates were renewed.

<br />

1. Set your Palette API key as an environment variable. Add your actual API key in place of `REPLACE_ME`.

<br />

```shell
export API_KEY=REPLACE_ME
```

2. Set the project ID as an environment variable. Add your project ID in place of `REPLACE_ME`.

<br />

```shell
export PROJECT_ID=REPLACE_ME
```

3. Set the cluster ID as an environment variable. Add your cluster's ID in place of `REPLACE_ME`.

<br />

```shell
export CLUSTER_ID=REPLACE_ME
```

4. Retrieve the cluster's certificate information from Palette by using the
   `https://api.spectrocloud.com/v1/spectroclusters/{uid}/k8certificates` endpoint.

<br />

```shell
curl \
 --url  'https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID/k8certificates' \
 --header 'Content-Type: application/json' \
 --header 'Accept: application/json' \
 --header "ApiKey: $API_KEY" \
 --header "ProjectUid: $PROJECT_ID"
```

5. Validate the output and confirm the expiration date is one year away.

<br />

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

<br />

## Advanced - Only Renew Control Plane Nodes

You can configure Palette to only renew the PKI certificates for the control plane nodes. You can achieve this by using
the annotation `spectrocloud.com/cert-renew-controlplane-only` and setting the value to `true`. To enable this behavior,
you must use `kubectl` and apply the update to a Custom Resource Definition (CRD) created by Palette during the cluster
deployment process.

Use the following steps to configure Palette only to renew the certificates for control plane nodes.

### Prerequisites

- Kubectl is installed in your system.

- A host cluster deployed.

- Access to the host cluster's kubeconfig file. Refer to the [Access Cluster with CLI](palette-webctl.md) guide to learn
  how to use your cluster's kubeconfig file.

### Configure Cluster

1. Set your cluster name as an environment variable. Add your cluster's name in place of `REPLACE_ME`.

<br />

```shell
export CLUSTER_NAME=REPLACE_ME
```

1. Use the following command to retrieve the namespace of the CRD Palette created in your cluster.

<br />

```shell
namespace=$(kubectl get spc --all-namespaces --output jsonpath='{range .items[?(@.metadata.name=="'"$CLUSTER_NAME"'")]}{.metadata.namespace}{"\n"}{end}')
```

2. Use `kubectl` to update the CRD to include the `spectrocloud.com/cert-renew-controlplane-only` annotation.

<br />

```shell
kubectl annotate spc/certificate-renew --namespace $namespace spectrocloud.com/cert-renew-controlplane-only="true"
```

3. Verify the annotation was set correctly with the command below. The expected output is `true`.

<br />

```shell
kubectl get spc/$CLUSTER_NAME --namespace $(kubectl get spc --all-namespaces --output jsonpath='{range .items[?(@.metadata.name=="'"$CLUSTER_NAME"'")]}{.metadata.namespace}{"\n"}{end}') --output jsonpath='{.metadata.annotations.spectrocloud\.com/cert-renew-controlplane-only}'
```

Output

```
true
```

4. Next, trigger a certificate renewal using either [Automatic Certificate Renewal](#automatic-certificate-renewal) or
   [Manual Certificate Renewal](#manual-certificate-renewal).

The renewal process may take several minutes, depending on the number of cluster nodes.

### Validate

Using the following steps, you can validate that the cluster's PKI certificates are renewed only for the control plane
nodes.

<br />

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster to renew its PKI certificates.

4. From the cluster details page, click on **View K8s Certificates**.

5. Review the expiration date for each component. Each component's expiration date will have a status of **365d** with a
   date that is one year away.

6. Navigate to the **Nodes** tab and verify the **Worker Pool** nodes' **Age** is not updated recently.

<br />

![View of the cluster nodes where only the control plane nodes are modified](/clusters_cluster-management_certificate-management_control-plane-only-change.webp)

<br />
