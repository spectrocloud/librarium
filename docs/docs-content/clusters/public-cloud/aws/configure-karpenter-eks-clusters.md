---
sidebar_label: "Configure Karpenter on EKS Clusters"
title: "Configure Karpenter on EKS Clusters"
description: "Learn how to configure Karpenter on EKS clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks", "karpenter"]
sidebar_position: 46
---

The <VersionedLink text="Karpenter" url="/integrations/packs/?pack=karpenter"/> pack can be installed on EKS clusters to
provide enhanced node provisioning and management. Karpenter automatically adjusts the size and capacity of your cluster
based on the workload demands, ensuring optimal performance and resource utilization.

## Install the Karpenter Pack

### Prerequisites

- An existing EKS cluster managed by Palette. Refer to [Create and Manage EKS Cluster](./eks.md) for guidance on
  creating an EKS cluster with Palette.

- AWS CLI must be installed and configured with the necessary permissions to manage your EKS cluster and
  [obtain the kubeconfig file](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html). Refer to
  [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) for installation
  instructions and [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for
  configuration guidance.

- Kubectl must be installed. Refer to
  [Install and Configure kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) for
  instructions.

- An IAM policy named `karpenterControllerPolicy` must be created using the following JSON template. This policy grants
  Karpenter the necessary permissions to manage EC2 instances and interact with the EKS cluster.

  Replace the following placeholders in the policy template:

  - `<aws-partition>` - The AWS partition. This is usually `aws` for standard regions, `aws-cn` for China regions, or
    `aws-us-gov` for GovCloud.
  - `<aws-account-id>` - Your AWS account ID.
  - `<eks-cluster-name>` - The name of your EKS cluster.
  - `<aws-region>` - The AWS region where your EKS cluster is located.

  <br />

  ```json title="Policy template"
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "ssm:GetParameter",
          "ec2:DescribeImages",
          "ec2:RunInstances",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeLaunchTemplates",
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeInstanceTypeOfferings",
          "ec2:DeleteLaunchTemplate",
          "ec2:CreateTags",
          "ec2:CreateLaunchTemplate",
          "ec2:CreateFleet",
          "ec2:DescribeSpotPriceHistory",
          "pricing:GetProducts"
        ],
        "Effect": "Allow",
        "Resource": "*",
        "Sid": "Karpenter"
      },
      {
        "Action": "ec2:TerminateInstances",
        "Condition": {
          "StringLike": {
            "ec2:ResourceTag/karpenter.sh/nodepool": "*"
          }
        },
        "Effect": "Allow",
        "Resource": "*",
        "Sid": "ConditionalEC2Termination"
      },
      {
        "Effect": "Allow",
        "Action": "iam:PassRole",
        "Resource": "arn:<aws-partition>:iam::<aws-account-id>:role/KarpenterNodeRole-<eks-cluster-name>",
        "Sid": "PassNodeIAMRole"
      },
      {
        "Effect": "Allow",
        "Action": "eks:DescribeCluster",
        "Resource": "arn:<aws-partition>:eks:<aws-region>:<aws-account-id>:cluster/<eks-cluster-name>",
        "Sid": "EKSClusterEndpointLookup"
      },
      {
        "Sid": "AllowScopedInstanceProfileCreationActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": ["iam:CreateInstanceProfile"],
        "Condition": {
          "StringEquals": {
            "aws:RequestTag/kubernetes.io/cluster/<eks-cluster-name>": "owned",
            "aws:RequestTag/topology.kubernetes.io/region": "<aws-region>"
          },
          "StringLike": {
            "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*"
          }
        }
      },
      {
        "Sid": "AllowScopedInstanceProfileTagActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": ["iam:TagInstanceProfile"],
        "Condition": {
          "StringEquals": {
            "aws:ResourceTag/kubernetes.io/cluster/<eks-cluster-name>": "owned",
            "aws:ResourceTag/topology.kubernetes.io/region": "<aws-region>",
            "aws:RequestTag/kubernetes.io/cluster/<eks-cluster-name>": "owned",
            "aws:RequestTag/topology.kubernetes.io/region": "<aws-region>"
          },
          "StringLike": {
            "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*",
            "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*"
          }
        }
      },
      {
        "Sid": "AllowScopedInstanceProfileActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": ["iam:AddRoleToInstanceProfile", "iam:RemoveRoleFromInstanceProfile", "iam:DeleteInstanceProfile"],
        "Condition": {
          "StringEquals": {
            "aws:ResourceTag/kubernetes.io/cluster/<eks-cluster-name>": "owned",
            "aws:ResourceTag/topology.kubernetes.io/region": "<aws-region>"
          },
          "StringLike": {
            "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*"
          }
        }
      },
      {
        "Sid": "AllowInstanceProfileReadActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": "iam:GetInstanceProfile"
      },
      {
        "Sid": "AllowUnscopedInstanceProfileListAction",
        "Effect": "Allow",
        "Resource": "*",
        "Action": "iam:ListInstanceProfiles"
      }
    ]
  }
  ```

  <details>

  <summary> Click to see an example policy with placeholders replaced </summary>

  ```json hideClipboard
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "ssm:GetParameter",
          "ec2:DescribeImages",
          "ec2:RunInstances",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeLaunchTemplates",
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeInstanceTypeOfferings",
          "ec2:DeleteLaunchTemplate",
          "ec2:CreateTags",
          "ec2:CreateLaunchTemplate",
          "ec2:CreateFleet",
          "ec2:DescribeSpotPriceHistory",
          "pricing:GetProducts"
        ],
        "Effect": "Allow",
        "Resource": "*",
        "Sid": "Karpenter"
      },
      {
        "Action": "ec2:TerminateInstances",
        "Condition": {
          "StringLike": {
            "ec2:ResourceTag/karpenter.sh/nodepool": "*"
          }
        },
        "Effect": "Allow",
        "Resource": "*",
        "Sid": "ConditionalEC2Termination"
      },
      {
        "Effect": "Allow",
        "Action": "iam:PassRole",
        "Resource": "arn:aws:iam::123456789012:role/my-eks-cluster-nodeRole",
        "Sid": "PassNodeIAMRole"
      },
      {
        "Effect": "Allow",
        "Action": "eks:DescribeCluster",
        "Resource": "arn:aws:eks:us-east-1:123456789012:cluster/my-eks-cluster",
        "Sid": "EKSClusterEndpointLookup"
      },
      {
        "Sid": "AllowScopedInstanceProfileCreationActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": ["iam:CreateInstanceProfile"],
        "Condition": {
          "StringEquals": {
            "aws:RequestTag/kubernetes.io/cluster/my-eks-cluster": "owned",
            "aws:RequestTag/topology.kubernetes.io/region": "us-east-1"
          },
          "StringLike": {
            "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*"
          }
        }
      },
      {
        "Sid": "AllowScopedInstanceProfileTagActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": ["iam:TagInstanceProfile"],
        "Condition": {
          "StringEquals": {
            "aws:ResourceTag/kubernetes.io/cluster/my-eks-cluster": "owned",
            "aws:ResourceTag/topology.kubernetes.io/region": "us-east-1",
            "aws:RequestTag/kubernetes.io/cluster/my-eks-cluster": "owned",
            "aws:RequestTag/topology.kubernetes.io/region": "us-east-1"
          },
          "StringLike": {
            "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*",
            "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*"
          }
        }
      },
      {
        "Sid": "AllowScopedInstanceProfileActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": ["iam:AddRoleToInstanceProfile", "iam:RemoveRoleFromInstanceProfile", "iam:DeleteInstanceProfile"],
        "Condition": {
          "StringEquals": {
            "aws:ResourceTag/kubernetes.io/cluster/my-eks-cluster": "owned",
            "aws:ResourceTag/topology.kubernetes.io/region": "us-east-1"
          },
          "StringLike": {
            "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*"
          }
        }
      },
      {
        "Sid": "AllowInstanceProfileReadActions",
        "Effect": "Allow",
        "Resource": "*",
        "Action": "iam:GetInstanceProfile"
      },
      {
        "Sid": "AllowUnscopedInstanceProfileListAction",
        "Effect": "Allow",
        "Resource": "*",
        "Action": "iam:ListInstanceProfiles"
      }
    ]
  }
  ```

  </details>

- The subnets and security groups associated with your EKS cluster must be tagged appropriately to allow Karpenter to
  discover and use them. Ensure the following tag is applied to both the subnets and security groups. Replace
  `<eks-cluster-name>` with the name of your EKS cluster.

  ```bash
  Key=karpenter.sh/discovery,Value=<eks-cluster-name>
  ```

  :::tip

  The Karpenter documentation provides a quick method to tag the subnets and security groups using the AWS CLI. You can
  find this method
  [here](https://karpenter.sh/docs/getting-started/migrating-from-cas/#add-tags-to-subnets-and-security-groups).

  If you are using a ZSH shell, the final command in the Karpenter documentation needs to be modified slightly. Change
  `--resources "${SECURITY_GROUPS}"` to `--resources "${=SECURITY_GROUPS}"` to ensure proper execution in ZSH. This is
  only required if you have more than one security group to tag.

  :::

### Enablement Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Profiles**.

3. Select the profile associated with your EKS cluster.

4. Click on the version drop-down and select **Create new version**.

5. Create a new version of the profile. For more information, refer to
   [Version a Cluster Profile](../../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

6. Click on the **Kubernetes** layer to edit the configuration.

7. In **Pack Details**, select the **Values** option.

8. In the YAML editor, add an entry to the `managedControlPlane.irsaRoles` section for the Karpenter controller role.
   This entry references the IAM policy you created for the prerequisites. Replace `<aws-partition>` and
   `<aws-account-id>` with your AWS partition and account ID, respectively.

   ```yaml title="Entry template" {5-10}
   managedControlPlane:
   ...
     irsaRoles:
     ...
     - name: "{{.spectro.system.cluster.name}}-karpenterControllerRole"
       policies:
         - arn:<aws-partition>:iam::<aws-account-id>:policy/karpenterControllerPolicy
       serviceAccount:
         name: karpenter
         namespace: karpenter
   ```

   ```yaml hideClipboard title="Example entry" {5-10}
   managedControlPlane:
   ...
     irsaRoles:
     ...
     - name: "{{.spectro.system.cluster.name}}-karpenterControllerRole"
       policies:
         - arn:aws:iam::123456789012:policy/karpenterControllerPolicy
       serviceAccount:
         name: karpenter
         namespace: karpenter
   ```

   The IAM role named `{{.spectro.system.cluster.name}}-karpenterControllerRole` will be created automatically by
   Palette when the Karpenter pack is deployed to your cluster. For example, `my-eks-cluster-karpenterControllerRole`.

9. In the YAML editor, add an entry to the `managedControlPlane.iamAuthenticatorConfig.mapRoles` and
   `managedMachinePool.roleName` sections for the IAM node role that is used by Karpenter provisioned nodes. Replace
   `<aws-partition>`, `<aws-account-id>`, and `<eks-cluster-name>` with your AWS partition, account ID, and EKS cluster
   name, respectively.

   ```yaml title="Entry template" {5-10, 13}
   managedControlPlane:
   ...
     iamAuthenticatorConfig:
       mapRoles:
       ...
         - rolearn: arn:<aws-partition>:iam::<aws-account-id>:role/{{.spectro.system.cluster.name}}-nodeRole"
           username: system:node:{{EC2PrivateDNSName}}
           groups:
           - system:bootstrappers
           - system:nodes
   ...
   managedMachinePool:
     roleName: "{{.spectro.system.cluster.name}}-nodeRole"
   ```

   ```yaml hideClipboard title="Example entry" {5-10}
   managedControlPlane:
   ...
     iamAuthenticatorConfig:
       mapRoles:
       ...
         - rolearn: arn:aws:iam::123456789012:role/{{.spectro.system.cluster.name}}-nodeRole
           username: system:node:{{EC2PrivateDNSName}}
           groups:
           - system:bootstrappers
           - system:nodes
   ...
   managedMachinePool:
     roleName: "{{.spectro.system.cluster.name}}-nodeRole"
   ```

   The IAM role named `{{.spectro.system.cluster.name}}-nodeRole` will be created automatically by Palette when the
   Karpenter pack is deployed to your cluster. For example, `my-eks-cluster-nodeRole`.

10. Click **Confirm Updates** to save the changes to the Kubernetes layer.

11. On the cluster profile page, click **Add New Pack**.

12. Enter `Karpenter` in the search box and select the Karpenter pack from the list.

13. In **Pack Details**, select the **Values** option.

14. In the YAML editor, add your AWS Account ID to the `awsAccountNumber` field.

    ```yaml hideClipboard title="Example entry"
    awsAccountNumber: "123456789012"
    ```

15. Click **Confirm & Create**.

16. Click **Save Changes** to save the new profile version.

17. From the left main menu, click **Clusters** and select your EKS cluster from the list.

18. Select the **Profile** tab.

19. Click the version drop-down for the **INFRASTRUCTURE LAYERS** and select the new profile version you created. The
    Karpenter pack should then display under the **ADDON LAYERS** section.

20. Click **Review & Save**, followed by **Review changes in Editor** in the pop-up window.

21. Review the changes and click **Update** to apply the new profile version to your cluster.

    :::caution

    A [**Full cluster repave**](../../cluster-management/node-pool.md#repave-behavior-and-configuration) is required to
    apply the changes, which can affect cluster availability. Ensure you plan accordingly.

    :::

Wait for the cluster repave to complete and the Karpenter pack to be deployed. This may take up to 10 minutes or more
depending on the amount of worker nodes in your cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Clusters** and select your EKS cluster from the list.

3. On the **Overview** tab, check that the cluster status is **Running** without a loading icon and the health is
   **Healthy**.

4. Verify that the Karpenter pack is listed under the **Cluster Profiles** section with a green circle indicating that
   it is successfully deployed.

5. Open a terminal session and issue the following command to connect to your EKS cluster. Replace `<eks-cluster-name>`
   with the name of your EKS cluster and `<aws-region>` with the AWS region your cluster is in.

   ```bash
   aws eks update-kubeconfig --name <eks-cluster-name> --region <aws-region>
   ```

6. Issue the following command to verify that Karpenter has active pods running in the `karpenter` namespace.

   ```bash
   kubectl get pods --namespace karpenter
   ```

   The output should be similar to the following, indicating that the Karpenter pods are in a `Running` state.

   ```bash hideClipboard
   NAME                         READY   STATUS    RESTARTS   AGE
   karpenter-545d4f9f76-bjp2q   1/1     Running   0          13m
   karpenter-545d4f9f76-j6tns   1/1     Running   0          13m
   ```

## Configure Karpenter NodePools

### Prerequisites

### Enablement Steps

### Validate
