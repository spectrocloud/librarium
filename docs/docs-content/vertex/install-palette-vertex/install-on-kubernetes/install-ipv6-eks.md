---
sidebar_label: "IPv6 EKS Installation"
title: "Install Palette VerteX on an IPv6 EKS Cluster"
description:
  "Learn how to install self-hosted Palette VerteX on an Amazon EKS cluster that uses the IPv6 IP address family."
icon: ""
hide_table_of_contents: false
sidebar_position: 15
tags: ["vertex", "enterprise", "eks", "ipv6"]
keywords: ["self-hosted", "vertex"]
---

You can install self-hosted Palette VerteX on an Amazon EKS cluster that uses the IPv6 IP address family. In an IPv6 EKS
cluster, pods and services receive IPv6 addresses only. The Palette VerteX Helm charts require changes before you can
install them on an IPv6 EKS cluster. These Helm chart changes are available upon request.

This guide contains the complete installation procedure. It follows the
[Install Non-Airgap Self-Hosted Palette VerteX](./install.md) guide and adds the steps that an IPv6 EKS cluster
requires.

The steps in this guide were validated with Palette VerteX 4.10.27 on an Amazon EKS cluster that uses EKS Auto Mode and
Kubernetes 1.36.

## Limitations

- You must apply the IPv6 Helm chart changes each time you download the Helm charts, including before every upgrade of
  Palette VerteX.

- This guide covers non-airgap installations with Helm. It does not cover airgap installations or the
  [VerteX Management Appliance](../vertex-management-appliance.md).

- Some of the registries that Palette VerteX downloads packs and images from are reachable over IPv4 only. The nodes of
  the EKS cluster must have an IPv4 route to these registries, for example, through a Network Address Translation (NAT)
  gateway. If the route is missing, pack registry synchronization fails.

- Amazon EKS does not allow you to change the IP address family of an existing cluster. You cannot convert an existing
  IPv4 installation to IPv6.

## Prerequisites

:::warning

Do not use a VerteX-managed Kubernetes cluster when installing VerteX. VerteX-managed clusters contain the VerteX agent
and VerteX-created Kubernetes resources that will interfere with the installation of VerteX.

:::

### IPv6 and Amazon EKS

- The Helm charts for Palette VerteX 4.10.27 or later.

- The IPv6 Helm chart changes for your Palette VerteX version. These changes are available upon request. To request
  them, [open a support ticket](https://support.spectrocloud.io/).

- A Virtual Private Cloud (VPC) that has both an IPv4 and an IPv6 CIDR block. The **Enable auto-assign IPv6 address**
  setting must be enabled on the private subnets that host the cluster. Refer to
  [Learn about IPv6 addresses to clusters, Pods, and services](https://docs.aws.amazon.com/eks/latest/userguide/cni-ipv6.html)
  in the AWS documentation for the complete list of AWS requirements and considerations.

- An Identity and Access Management (IAM) policy for the Amazon VPC Container Network Interface (CNI) plugin that allows
  it to assign IPv6 addresses, attached to the IAM role that the Amazon VPC CNI add-on uses. AWS does not provide a
  managed policy for the IPv6 IP address family, so you must create the policy. This guide uses the policy name
  `AmazonEKS_CNI_IPv6_Policy`. Refer to
  [Configure Amazon VPC CNI plugin to use IRSA](https://docs.aws.amazon.com/eks/latest/userguide/cni-iam-role.html) in
  the AWS documentation for the policy contents and the command to create it.

- The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured
  with credentials for the AWS account that hosts the cluster.

### Kubernetes Cluster

You create the EKS cluster as part of this guide. Ensure the cluster that you create meets the following requirements.

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-cluster-prereqs"
  edition="vertex"
  version="Palette VerteX"
  helm="vertex"
/>

- _(FIPS compliance only)_ The OS and Kubernetes cluster you are installing Palette VerteX onto must be FIPS-compliant.
  Otherwise, Palette VerteX and its operations will not be FIPS-compliant.

### Local Environment

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-local-prereqs"
  edition="vertex"
  version="Palette VerteX"
/>

<PartialsComponent category="self-hosted" name="helm-client-version" />

- An image pull secret from Spectro Cloud customer support, required to pull images from Spectro Cloud OCI registries.
  This is not required if you plan to use [mirror registries](../../system-management/registry-override.md) or
  [image swap](../../../clusters/cluster-management/image-swap.md) when pulling images. Refer to
  [Configure Image Pull Secret for Security-Hardened Images](../../system-management/configure-image-pull-secret.md) for
  more information.

### Other Prerequisites

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-other-prereqs"
  edition="vertex"
  version="Palette VerteX"
/>

## Create the EKS Cluster

1. Create an Amazon EKS cluster with the following settings. Configure the remaining settings to match the
   [Kubernetes cluster prerequisites](#kubernetes-cluster) and your environment.

   | **Setting**                   | **Value**                                                                                                                                                          |
   | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **EKS Auto Mode**             | Enabled.                                                                                                                                                           |
   | **Kubernetes version**        | A version that your Palette VerteX version supports. Refer to [Kubernetes Requirements](../install-palette-vertex.md#kubernetes-requirements).                     |
   | **VPC** and **Subnets**       | The VPC that has an IPv6 CIDR block, and its private subnets.                                                                                                      |
   | **Cluster IP address family** | **IPv6**.                                                                                                                                                          |
   | **Add-ons**                   | **Amazon EKS Pod Identity Agent**, **Amazon VPC CNI**, **CoreDNS**, and **kube-proxy**. Do not select **Metrics Server**, because Palette VerteX installs its own. |
   | **Amazon VPC CNI** IAM role   | The IAM role that has the `AmazonEKS_CNI_IPv6_Policy` policy attached.                                                                                             |

2. Update your kubeconfig file so that you can access the cluster with `kubectl`.

   ```shell
   aws eks update-kubeconfig --region <region> --name <eks-cluster-name>
   ```

   Replace `<region>` with the AWS region of the cluster and `<eks-cluster-name>` with the name of the EKS cluster.

3. Create a default StorageClass for the cluster. EKS Auto Mode does not create a StorageClass for you, and the
   StorageClass must use the `ebs.csi.eks.amazonaws.com` provisioner. Refer to
   [Create a storage class](https://docs.aws.amazon.com/eks/latest/userguide/create-storage-class.html) in the AWS
   documentation for guidance.

4. Create a ConfigMap that contains the name of the EKS cluster. Palette VerteX reads the name of its management cluster
   from this ConfigMap, which is a prerequisite for
   [EKS Pod Identity](../../../clusters/public-cloud/aws/add-aws-accounts.md#eks-pod-identity).

   ```shell
   kubectl create configmap palette-global-config \
     --from-literal=managementClusterName="<eks-cluster-name>" \
     --namespace kube-system
   ```

   Replace `<eks-cluster-name>` with the name of the EKS cluster.

## Install Palette VerteX

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-begin"
  edition="vertex"
  version="Palette VerteX"
  helm="vertex"
/>

### IPv6 Helm Chart Changes

3. Apply the IPv6 Helm chart changes that you received from our support team to the extracted Helm charts. Follow the
   instructions provided with the changes.

### Cert-Manager Helm Chart

4. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-cert-manager-non-airgap"
     edition="vertex"
     version="Palette VerteX"
     helm="vertex"
   />

### Spectro Management CRDs Helm Chart

7. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-spectro-mgmt-crds"
     edition="vertex"
     version="Palette VerteX"
     helm="vertex"
   />

### VerteX Helm Chart

8. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-main-chart-non-airgap"
     edition="vertex"
     version="Palette VerteX"
     helm="vertex"
   />

### IPv6 Load Balancer Annotation

11. In the `vertex/values.yaml` file, add the following annotation to the ingress load balancer so that it accepts both
    IPv4 and IPv6 traffic. If you set `grpc.external` to `true`, add the same annotation to the gRPC load balancer. Save
    the file when you are done.

    ```yaml
    grpc:
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ip-address-type: dualstack
    ingress:
      ingress:
        annotations:
          service.beta.kubernetes.io/aws-load-balancer-ip-address-type: dualstack
    ```

### Image Swap Helm Chart

12. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-image-swap"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### Reach System Helm Chart

13. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-reach-system"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### Installation

14. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-end"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### Post-Installation Configuration

20. Create a managed node group in the EKS cluster with the following settings. The `cluster-management-agent` pod of
    Palette VerteX cannot be scheduled on nodes that EKS Auto Mode manages.

    | **Setting**       | **Value**                       |
    | ----------------- | ------------------------------- |
    | **AMI type**      | Amazon Linux 2023               |
    | **Instance type** | `t3.medium`                     |
    | **Desired size**  | `1`                             |
    | **Minimum size**  | `1`                             |
    | **Maximum size**  | `2`                             |
    | **Subnets**       | The private subnets of the VPC. |

21. (Optional) If you plan to deploy clusters with EKS Pod Identity, complete the steps in the
    [EKS Pod Identity](../../../clusters/public-cloud/aws/add-aws-accounts.md#eks-pod-identity) section of the Register
    and Manage AWS Accounts guide.

## Validate

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-validate"
  edition="vertex"
  version="Palette VerteX"
  helm="vertex"
/>

To confirm that the installation uses IPv6, list the pods with their IP addresses, and verify that the **IP** column
contains IPv6 addresses.

```shell
kubectl get pods --all-namespaces --output wide
```

## Next Steps

- [Deploy an IPv6 EKS Cluster](../../../clusters/public-cloud/aws/deploy-ipv6-eks-cluster.md)

- [Upgrade Palette VerteX on Kubernetes](../../upgrade/upgrade-k8s/non-airgap.md)

- [Helm Configuration Reference](./vertex-helm-ref.md)
