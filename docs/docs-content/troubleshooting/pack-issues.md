---
sidebar_label: "Packs"
title: "Troubleshooting steps for errors during a cluster deployment"
description: "Troubleshooting steps for errors during a cluster deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["troubleshooting", "packs"]
---

The following are common scenarios that you may encounter when using Packs.

## Scenario - AWS EKS Cluster Deployment Fails when Cilium is Used as CNI

<!-- prettier-ignore -->
When deploying AWS EKS clusters using the <VersionedLink text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss"/>
pack, worker node provisioning fails as the AWS VPC CNI and Cilium CNI clash with each other. This is because installation
of the AWS VPC CNI cannot be disabled by default on EKS cluster nodes.

To resolve this, you will need to make the following additions and changes:

- Kube-proxy must be replaced with eBPF.
- Specific Cilium configuration parameters must be set.
- An additional manifest must be included with the Cilium pack.
- The `charts.cilium.k8sServiceHost` parameter value must be manually changed to the cluster API server endpoint during
  deployment.

Use the following debug steps to learn how to make these configuration changes and additions.

:::warning

- You must use a pre-created static VPC for EKS deployments using Cilium.
- This workaround has only been validated on Cilium 1.15.3 and above.

:::

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your EKS cluster profile that uses Cilium as the network pack.

4. Click on the Cilium pack to view the **Edit Pack** page.

5. Click on the **Presets** button to expand the options drawer.

6. Scroll down the presets option menu and enable **Replace kube-proxy with eBPF**.

7. Review the following parameters and adjust to the required values as needed. Some of these parameters are changed
   automatically after enabling **Replace kube-proxy with eBPF**.

   | Parameter                                           | Required Value      | Description                                                                                                                                                                                                                                                            | Change Required After Enabling Preset? |
   | --------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
   | `charts.cilium.bpf.masquerade`                      | `false`             | Disables eBPF masquerading because AWS handles NAT and IP masquerading through the ENI interface.                                                                                                                                                                      | **True**                               |
   | `charts.cilium.endpointRoutes.enabled`              | `true`              | Enables per-endpoint routing to allow direct pod-to-pod communication in ENI mode without encapsulation.                                                                                                                                                               | **True**                               |
   | `charts.cilium.eni.enabled`                         | `true`              | Enables AWS ENI integration for direct networking instead of using an overlay network.                                                                                                                                                                                 | **True**                               |
   | `charts.cilium.ipam.mode`                           | `"eni"`             | Uses AWS ENI-based IP address management (IPAM) to allocate pod IPs directly from AWS VPC subnets.                                                                                                                                                                     | **True**                               |
   | `charts.cilium.enableIPv4Masquerade`                | `false`             | Disables IPv4 masquerading for outgoing packets because AWS ENI mode provides direct pod-to-pod routing without NAT.                                                                                                                                                   | **True**                               |
   | `charts.cilium.enableIPv6Masquerade`                | `false`             | Disables IPv6 masquerading for outgoing packets because AWS handles IPv6 routing without the need for masquerading.                                                                                                                                                    | **True**                               |
   | `charts.cilium.k8sServiceHost`                      | `auto`              | Ensures Cilium correctly connects to the EKS control plane. This value will be changed during cluster deployment.                                                                                                                                                      | **False**                              |
   | `charts.cilium.k8sServicePort`                      | `"443"`             | Uses port 443 to connect to the Kubernetes API server because EKS API server communication happens over HTTPS.                                                                                                                                                         | **True**                               |
   | `charts.cilium.kubeProxyReplacement`                | `"true"`            | Enables eBPF-based kube-proxy replacement because kube-proxy is disabled, and Cilium must handle service load balancing.                                                                                                                                               | **False**                              |
   | `charts.cilium.kubeProxyReplacementHealthzBindAddr` | `0.0.0.0:10256`     | Binds the health check service to `0.0.0.0:10256` for the kube-proxy replacement.                                                                                                                                                                                      | **False**                              |
   | `charts.cilium.autoDirectNodeRoutes`                | `false`             | Disables automatic direct routing between nodes because AWS ENI mode already manages routing, making additional direct routes unnecessary.                                                                                                                             | **True**                               |
   | `charts.cilium.ipv4NativeRoutingCIDR`               | `<POD_SUBNET_CIDR>` | Set this to a CIDR block that covers all AWS VPC subnets where your worker nodes will be deployed. For example, if your worker node subnets are `10.0.64.0/18`, `10.0.128.0/18`, and `10.0.192.0/18`, set this to `10.0.0.0/16` to ensure all ranges are encapsulated. | **True**                               |
   | `charts.cilium.routingMode`                         | `native`            | Uses native routing mode because AWS ENI mode supports direct pod-to-pod routing, making encapsulation unnecessary.                                                                                                                                                    | **False**                              |

8. Click the **New manifest** option, and provide a name for the manifest, such as `job-fix-cni`. Click the tick button
   afterwards.

9. Copy the following manifest into the YAML editor. This manifest disables the `kube-proxy` and `aws-node` daemonsets
   by applying a node selector that does not match any nodes. It also removes existing Cilium, `kube-dns`, and
   `cert-manager` pods to ensure a clean state for Cilium deployment.

   ```yaml
   apiVersion: batch/v1
   kind: Job
   metadata:
     name: ds-fix
     namespace: kube-system
   spec:
     template:
       metadata:
         name: ds-fix
       spec:
         serviceAccountName: ds-fix-sa
         hostNetwork: true
         dnsPolicy: ClusterFirstWithHostNet
         initContainers:
           - name: kubectl-init-pod-1
             image: bitnami/kubectl
             args:
               - "-n"
               - "kube-system"
               - "patch"
               - "daemonset"
               - "kube-proxy"
               - "aws-node"
               - --patch={"spec":{"template":{"spec":{"nodeSelector":{"io.cilium/aws-node-enabled":"true"}}}}}
         containers:
           - name: kubectl-pod-1
             image: bitnami/kubectl
             args:
               - "delete"
               - "pod"
               - "-n"
               - "kube-system"
               - "-l app.kubernetes.io/part-of=cilium"
           - name: kubectl-pod-2
             image: bitnami/kubectl
             args:
               - "delete"
               - "pod"
               - "-n"
               - "kube-system"
               - "-l k8s-app=kube-dns"
           - name: kubectl-pod-3
             image: bitnami/kubectl
             args:
               - "delete"
               - "pod"
               - "-n"
               - "cert-manager"
               - "--all"
         restartPolicy: Never
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: ds-fix-sa
     namespace: kube-system
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: ds-fix-role
     namespace: kube-system
   rules:
     - apiGroups:
         - apps
       resources:
         - daemonsets
       resourceNames:
         - kube-proxy
         - aws-node
       verbs:
         - get
         - patch
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: ds-fix-role
   rules:
     - apiGroups:
         - ""
       resources:
         - pods
       verbs:
         - list
         - delete
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: ds-fix-rolebinding
     namespace: kube-system
   subjects:
     - kind: ServiceAccount
       name: ds-fix-sa
       namespace: kube-system
   roleRef:
     kind: Role
     name: ds-fix-role
     apiGroup: rbac.authorization.k8s.io
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: ds-fix-rolebinding
   subjects:
     - kind: ServiceAccount
       name: ds-fix-sa
       namespace: kube-system
   roleRef:
     kind: ClusterRole
     name: ds-fix-role
     apiGroup: rbac.authorization.k8s.io
   ```

10. Click **Confirm Updates** after making the required changes.

11. Click **Save Changes** on the cluster profile page.

12. Click **Deploy** on the cluster profile page, and click **OK** in the pop-up window.

13. Provide the basic information for the cluster and click **Next**.

14. Click **Next** on the **Cluster Profile** page.

15. On the **Cluster Config** page, configure the cluster as required, and ensure you select **Enable static placement
    (Optional)** to provide your AWS VPC details. Click **Next** when complete.

16. Configure the remaining settings as needed, and deploy the cluster. Refer to
    [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md) if you need
    guidance on the available options.

17. As soon as it is available, obtain the **API server endpoint** for the cluster.

    If using the AWS Console, go to **AWS > Clusters > clusterName** and view the **Overview** tab for the cluster.
    Click the clipboard icon next to the **API server endpoint** field.

    If using the AWS CLI, issue the following command to obtain the API endpoint for the cluster. Replace
    `<clusterName>` with the name of your cluster, and `<awsRegion>` with your AWS region.

    ```shell
    aws eks update-kubeconfig --region <awsRegion> --name <clusterName>
    aws eks describe-cluster --name <clusterName> --query "cluster.endpoint" --output text
    ```

    Example output.

    ```shell hideClipboard
    https://MY2567C9923FENDPOINT882F9EXAMPLE.gr7.us-east-1.eks.amazonaws.com
    ```

18. On your cluster page in Palette, click the **Profile** tab.

19. Select the Cilium layer and find the `k8sServiceHost` parameter in the YAML editor.

20. Change the value from `auto` to the cluster API server endpoint discovered in step 17, but _without_ the `https://`
    portion.

    For example, `"MY2567C9923FENDPOINT882F9EXAMPLE.gr7.us-east-1.eks.amazonaws.com"`.

21. Click **Save**.

The EKS cluster will now deploy successfully.
