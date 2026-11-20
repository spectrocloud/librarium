---
sidebar_label: "IPv6 EKS Installation"
title: "Install Palette on an IPv6 EKS Cluster"
description: "Learn how to install self-hosted Palette on an Amazon EKS cluster that uses the IPv6 IP address family."
icon: ""
hide_table_of_contents: false
sidebar_position: 15
tags: ["self-hosted", "enterprise", "eks", "ipv6"]
keywords: ["self-hosted", "enterprise"]
---

<!--
RELEASE DAY. Confirm that 4.10.46 is the 4.10 patch version that ships the global.ipFamily Helm values, once the final
tag exists. Update the version in Prerequisites if it changed.
-->

You can install self-hosted Palette on an Amazon EKS cluster that uses the IPv6 IP address family. In an IPv6 EKS
cluster, pods and services receive IPv6 addresses only. You enable IPv6 support through a parameter in the Palette Helm
chart values file.

This guide contains the complete installation procedure. It follows the
[Install Non-Airgap Self-Hosted Palette](./install.md) guide and adds the steps that an IPv6 EKS cluster requires.

This guide uses an Amazon EKS cluster that has EKS Auto Mode enabled.

## Limitations

- This guide covers non-airgap installations with Helm. It does not cover airgap installations or the
  [Palette Management Appliance](../palette-management-appliance.md).

- Some of the registries that Palette downloads packs and images from are reachable over IPv4 only. The nodes of the EKS
  cluster must have an IPv4 route to these registries, for example, through a Network Address Translation (NAT) gateway.
  If the route is missing, pack registry synchronization fails.

- Amazon EKS does not allow you to change the IP address family of an existing cluster. You cannot convert an existing
  IPv4 installation to IPv6.

## Prerequisites

:::warning

Do not use a Palette-managed Kubernetes cluster when installing Palette. Palette-managed clusters contain the Palette
agent and Palette-created Kubernetes resources that will interfere with the installation of Palette.

:::

### IPv6 and Amazon EKS

- The Helm charts for Palette 4.10.46 or later.

- A Virtual Private Cloud (VPC) that has both an IPv4 and an IPv6 Classless Inter-Domain Routing (CIDR) block. The
  **Enable auto-assign IPv6 address** setting must be enabled on the private subnets that host the cluster. Refer to
  [Learn about IPv6 addresses to clusters, Pods, and services](https://docs.aws.amazon.com/eks/latest/userguide/cni-ipv6.html)
  in the AWS documentation for the complete list of AWS requirements and considerations.

- An Identity and Access Management (IAM) policy that allows the Amazon VPC Container Network Interface (CNI) plugin to
  assign IPv6 addresses. Attach the policy to the IAM role that the Amazon VPC CNI add-on uses. AWS does not provide a
  managed policy for the IPv6 IP address family, so you must create the policy. This guide uses the policy name
  `AmazonEKS_CNI_IPv6_Policy`. Refer to
  [Configure Amazon VPC CNI plugin to use IRSA](https://docs.aws.amazon.com/eks/latest/userguide/cni-iam-role.html) in
  the AWS documentation for the policy contents and the command to create it.

- The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured
  with credentials for the AWS account that hosts the cluster.

### Kubernetes Cluster

You create the EKS cluster as part of this guide. Ensure that the cluster you create meets the following requirements.

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-cluster-prereqs"
  edition="palette"
  version="Palette"
  helm="palette"
/>

### Local Environment

<PartialsComponent category="self-hosted" name="kubernetes-install-local-prereqs" edition="palette" version="Palette" />

<PartialsComponent category="self-hosted" name="helm-client-version" />

- An image pull secret from Spectro Cloud customer support, required to pull images from Spectro Cloud OCI registries.
  This is not required if you plan to use [mirror registries](../../system-management/registry-override.md) or
  [image swap](../../../clusters/cluster-management/image-swap.md) when pulling images. Refer to
  [Configure Image Pull Secret for Security-Hardened Images](../../system-management/configure-image-pull-secret.md) for
  more information.

### Other Prerequisites

<PartialsComponent category="self-hosted" name="kubernetes-install-other-prereqs" edition="palette" version="Palette" />

## Create the EKS Cluster

1. Create an Amazon EKS cluster with the following settings. Configure the remaining settings to match the
   [Kubernetes cluster prerequisites](#kubernetes-cluster) and your environment.

   | **Setting**                   | **Value**                                                                                                                                                   |
   | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **EKS Auto Mode**             | Enabled.                                                                                                                                                    |
   | **Kubernetes version**        | A version that your Palette version supports. Refer to [Kubernetes Requirements](../install-palette.md#kubernetes-requirements).                            |
   | **VPC** and **Subnets**       | The VPC that has an IPv6 CIDR block, and its private subnets.                                                                                               |
   | **Cluster IP address family** | **IPv6**.                                                                                                                                                   |
   | **Add-ons**                   | **Amazon EKS Pod Identity Agent**, **Amazon VPC CNI**, **CoreDNS**, and **kube-proxy**. Do not select **Metrics Server**, because Palette installs its own. |
   | **Amazon VPC CNI** IAM role   | The IAM role that has the `AmazonEKS_CNI_IPv6_Policy` policy attached.                                                                                      |

2. Update your kubeconfig file so that you can access the cluster with `kubectl`.

   ```shell
   aws eks update-kubeconfig --region <region> --name <eks-cluster-name>
   ```

   Replace `<region>` with the AWS region of the cluster and `<eks-cluster-name>` with the name of the EKS cluster.

3. Create a default StorageClass for the cluster. EKS Auto Mode does not create a StorageClass for you, and the
   StorageClass must use the `ebs.csi.eks.amazonaws.com` provisioner. Refer to
   [Create a storage class](https://docs.aws.amazon.com/eks/latest/userguide/create-storage-class.html) in the AWS
   documentation for guidance.

4. Create a ConfigMap that contains the name of the EKS cluster. Palette reads the name of its management cluster from
   this ConfigMap, which is a prerequisite for
   [EKS Pod Identity](../../../clusters/public-cloud/aws/add-aws-accounts.md#eks-pod-identity).

   ```shell
   kubectl create configmap palette-global-config \
     --from-literal=managementClusterName="<eks-cluster-name>" \
     --namespace kube-system
   ```

   Replace `<eks-cluster-name>` with the name of the EKS cluster.

## Install Palette

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-begin"
  edition="palette"
  version="Palette"
  helm="palette"
/>

### Cert-Manager Helm Chart

3. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-cert-manager-non-airgap"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### Spectro Management CRDs Helm Chart

6. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-spectro-mgmt-crds"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### Palette Helm Chart

7. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-main-chart-non-airgap"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### IPv6 Settings

10. In the `palette/values.yaml` file, configure the following IPv6 settings. Save the file when you are done. For more
    information about the `global.ipFamily` parameters, refer to the [IP Family](./palette-helm-ref.md#ip-family)
    section of the Helm Chart Configuration Reference.

    | **Parameter**                           | **Value**                                                                 | **Description**                                                                                                                                                                                                                                       |
    | --------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `global.ipFamily.enableIPv6`            | `true`                                                                    | Palette services listen on IPv6 addresses.                                                                                                                                                                                                            |
    | `global.ipFamily.serviceIpFamilyPolicy` | `""`                                                                      | Keep the default empty value. The services of an IPv6 EKS cluster use one IP family and receive IPv6 addresses without a policy. Do not use `RequireDualStack`, because it prevents the ingress and gRPC services from being created on this cluster. |
    | `ingress.ingress.annotations`           | `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: dualstack` | The ingress load balancer accepts both IPv4 and IPv6 traffic.                                                                                                                                                                                         |
    | `grpc.annotations`                      | `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: dualstack` | The gRPC load balancer accepts both IPv4 and IPv6 traffic. Add this annotation only if you set `grpc.external` to `true`.                                                                                                                             |

    ```yaml
    global:
      ipFamily:
        enableIPv6: true
        serviceIpFamilyPolicy: ""
    grpc:
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ip-address-type: dualstack
    ingress:
      ingress:
        annotations:
          service.beta.kubernetes.io/aws-load-balancer-ip-address-type: dualstack
    ```

### Image Swap Helm Chart

11. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-image-swap"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Reach System Helm Chart

12. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-reach-system"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Installation

13. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-end"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Post-Installation Configuration

19. Create a managed node group in the EKS cluster with the following settings. The `cluster-management-agent` pod of
    Palette cannot be scheduled on nodes that EKS Auto Mode manages.

    | **Setting**       | **Value**                       |
    | ----------------- | ------------------------------- |
    | **AMI type**      | Amazon Linux 2023               |
    | **Instance type** | `t3.medium`                     |
    | **Desired size**  | `1`                             |
    | **Minimum size**  | `1`                             |
    | **Maximum size**  | `2`                             |
    | **Subnets**       | The private subnets of the VPC. |

20. _(Optional)_ If you plan to deploy clusters with EKS Pod Identity, complete the steps in the
    [EKS Pod Identity](../../../clusters/public-cloud/aws/add-aws-accounts.md#eks-pod-identity) section of the Register
    and Manage AWS Accounts guide.

## Validate

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-validate"
  edition="palette"
  version="Palette"
  helm="palette"
/>

To confirm that the installation uses IPv6, list the pods with their IP addresses, and verify that the `IP` column
contains IPv6 addresses.

```shell
kubectl get pods --all-namespaces --output wide
```

## Next Steps

<PartialsComponent category="self-hosted" name="install-next-steps" edition="Palette" version="Palette" />

To deploy workload clusters that use the IPv6 IP address family, refer to
[Deploy an IPv6 EKS Cluster](../../../clusters/public-cloud/aws/deploy-ipv6-eks-cluster.md). Keep the IPv6 settings in
your `values.yaml` file when you [upgrade Palette](../../upgrade/upgrade-k8s/non-airgap.md).
