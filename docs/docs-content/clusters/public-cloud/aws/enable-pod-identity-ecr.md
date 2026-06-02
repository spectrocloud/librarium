---
sidebar_label: "Configure EKS Pod Identity for ECR Registries"
title: "Configure EKS Pod Identity for ECR Registries"
description: "Learn how to configure EKS pod identity for ECR registries."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks", "ecr"]
sidebar_position: 50
---

Palette supports
[EKS Pod Identity](https://aws.amazon.com/blogs/containers/amazon-eks-pod-identity-a-new-way-for-applications-on-eks-to-obtain-iam-credentials/)
for [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) authentication. The EKS Pod Identity Agent
generates authentication tokens using temporary, automatically rotated credentials, eliminating the need for static AWS
access keys.

:::warning

Pod Identity for ECR authentication is only supported when the registry is hosted in the same AWS account as the EKS
management cluster. Use static or dynamic access credentials for registries in different AWS accounts. Refer to the
[Register and Manage AWS Accounts](./add-aws-accounts.md) guide for more information.

:::

## Prerequisites

- Self-hosted Palette or Palette VerteX deployed on an Amazon EKS cluster with Kubernetes version 1.24 or later.

  - Ensure that you have [EKS Pod Identity](./add-aws-accounts.md#eks-pod-identity) configured on your cluster.

- Access to the Amazon EKS cluster's kubeconfig file. You must be able to use `kubectl` to perform validation steps on
  the cluster.

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- AWS CLI must be installed and configured with the necessary permissions to access and update pod identity associations
  for your EKS cluster.

## Enablement

1.  Execute the following command to list the pod identity associations in your EKS cluster. Replace the
    `<eks-cluster-name>` with your cluster name and `<region>` with your AWS region.

    ```shell
    aws eks list-pod-identity-associations \
    --cluster-name <eks-cluster-name> \
    --region <region> \
    --output table
    ```

    Make a note of the `RoleArn` corresponding to the `spectro-hubble` service account. You only need the name of the
    IAM role, which is the last part of the ARN after the final slash (`/`). For example, if your `RoleArn` is
    `arn:aws:iam::123456789012:role/SpectroCloudHubbleRole`, the role name is `SpectroCloudHubbleRole`.

    ```shell hideClipboard title="Example Output"
    ----------------------------------------------------------------------------------------------------------------------------------
    |                                          ListPodIdentityAssociations                                                             |
    +-------------------------------+-------------------------+------------------------------- +--------------------------------------+
    | AssociationId                 | Namespace               | ServiceAccount                |  RoleArn                             |
    +-------------------------------+-------------------------+------------------------------- +--------------------------------------+
    | a1b2c3d4-5678-90ab-cdef-11111 | kube-system             | aws-node                      |  arn:aws:iam::123456789012:role/AmazonEKS_CNI_Role |
    | b2c3d4e5-6789-01bc-def0-22222 | hubble-system           | spectro-hubble                |  arn:aws:iam::123456789012:role/SpectroCloudHubbleRole |
    +-------------------------------+-------------------------+------------------------------- +--------------------------------------+
    ```

2.  The IAM role used for the `spectro-hubble` EKS Pod Identity association needs additional permissions to enable
    Palette to generate ECR authentication token, validate registries, and synchronize packs.

    Execute the following command to create the `ecr-permissions-policy.json` file.

    ```shell
    cat > ecr-permissions-policy.json << 'EOF'
    {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Sid": "ECRReadAndToken",
        "Effect": "Allow",
        "Action": [
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:DescribeRepositories",
            "ecr:DescribeImages",
            "ecr:ListImages",
            "ecr:GetRepositoryPolicy",
            "ecr:GetLifecyclePolicy"
        ],
        "Resource": "*"
        }
    ]
    }
    EOF
    ```

3.  Execute the following command to add the permissions defined in the `ecr-permissions-policy.json` file to your
    `spectro-hubble` EKS Pod Identity association. Replace `<hubble-role-name>` with the role name identified in **Step
    1** (for example, `SpectroCloudHubbleRole`).

    ```shell
    aws iam put-role-policy \
    --role-name <hubble-role-name> \
    --policy-name SpectroEcrReadAccess \
    --policy-document file://ecr-permissions-policy.json
    ```

4.  The Spectro Manifest (Specman) service requires its own pod identity association to synchronize manifests directly
    from ECR using OCI Registry As Storage (ORAS). Execute the following command to use the same IAM role as the
    `spectro-hubble` association.

    - Replace `<eks-cluster-name>` with the name of your Amazon EKS Cluster.
    - Replace `<aws-account-id>` with your AWS account ID.
    - Replace `<hubble-role-name>` with the role name identified in **Step 1** (for example, `SpectroCloudHubbleRole`).
    - Replace `<region>` with your AWS region.

    ```shell
    aws eks create-pod-identity-association \
    --cluster-name <eks-cluster-name> \
    --namespace hubble-system \
    --service-account spectro-specman \
    --role-arn arn:aws:iam::<aws-account-id>:role/<hubble-role-name> \
    --region <region>
    ```

5.  Open a terminal session and ensure you have access to the kubeconfig file for the Amazon EKS cluster where Palette
    or Palette VerteX is deployed. Set the `KUBECONFIG` environment variable to point to the file.

    ```bash
    export KUBECONFIG=/path/to/kubeconfig/file
    ```

6.  Issue the following command to restart the Specman service in order to apply all updates.

    ```shell
    kubectl rollout restart statefulset specman --namespace hubble-system
    kubectl rollout status statefulset specman --namespace hubble-system
    ```

    ```shell hideClipboard title="Example Output"
    statefulset.apps/specman restarted
    Waiting for 3 pods to be ready...
    partitioned roll out complete: 3 new pods have been updated...
    ```

7.  Issue the following commands to verify that EKS Pod Identity has set the required environment variables for the
    Hubble and Specman services.

    ```bash
    kubectl get pods --namespace hubble-system --selector component=cloud \
    --output jsonpath='{.items[0].spec.containers[0].env[*].name}' | tr ' ' '\n' | grep AWS_CONTAINER
    ```

    ```bash
    kubectl get pod specman-0 --namespace hubble-system \
    --output jsonpath='{.spec.containers[0].env[*].name}' | tr ' ' '\n' | grep AWS_CONTAINER
    ```

    Both the `AWS_CONTAINER_CREDENTIALS_FULL_URI` and `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` environment variables
    should be present in the output of both commands, indicating that Amazon EKS has injected the
    [necessary configuration for EKS Pod Identity](https://docs.aws.amazon.com/sdkref/latest/guide/feature-container-credentials.html).

8.  Edit the `values.yaml` file for your
    [self-hosted Palette](../../../enterprise-version/install-palette/install-on-kubernetes/install.md) or
    [VerteX](../../../vertex/install-palette-vertex/install-on-kubernetes/install.md) installation. Set the following
    fields and values.

         ```yaml
         config:
             ociPackEcrRegistry:
              accessKey: ""
              secretKey: ""
              credentialType: "pod-identity"
         ```

9.  Issue the following command to apply changes. Replace the `<version>` with the Palette release version installed on
    your Palette or VerteX environment. If you are unsure, you can retrieve the version using the
    `helm list --namespace hubble-system` command.

    ```shell
    helm upgrade palette spectro-mgmt-plane-<version>.tgz \
    --values values.yaml --namespace hubble-system
    ```

    ```shell hideClipboard title="Example Output"
    Release "palette" has been upgraded. Happy Helming!
    NAME: palette
    LAST DEPLOYED: Tue Apr 28 12:34:56 2026
    NAMESPACE: hubble-system
    STATUS: deployed
    REVISION: 5
    TEST SUITE: None
    ```

10. Issue the following command to restart the `cloud` and `specman` services in order to apply all updates.

    ```shell
    kubectl rollout restart deployment cloud --namespace hubble-system
    kubectl rollout restart statefulset specman --namespace hubble-system
    ```

    ```shell hideClipboard title="Example Output"
    deployment.apps/cloud restarted
    statefulset.apps/specman restarted
    ```

## Validation

1. Log in to Palette as a [tenant admin](../../../tenant-settings/tenant-settings.md).

2. Navigate to **Tenant Settings** > **Registries**. The system ECR registry should show a valid timestamp in the **Last
   Synced** column. Registry packs are available for
   [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) creation.

3. Open a terminal session and ensure you have access to the kubeconfig file for the Amazon EKS cluster where Palette or
   Palette VerteX is deployed. Set the `KUBECONFIG` environment variable to point to the file.

   ```bash
   export KUBECONFIG=/path/to/kubeconfig/file
   ```

4. Execute the following command to view the log lines of the Specman service. Ensure that there are no errors.

   ```shell
   kubectl logs specman-0 --namespace hubble-system --tail=10
   ```
