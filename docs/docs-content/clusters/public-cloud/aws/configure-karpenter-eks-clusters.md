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

The following section outlines the prerequisites and steps to install the Karpenter pack on an existing EKS cluster
managed by Palette.

### Prerequisites

- An existing EKS cluster managed by Palette. Refer to [Create and Manage EKS Cluster](./eks.md) for guidance on
  creating an EKS cluster with Palette.

- Your Palette account must have the **Cluster Profile Editor** and **Cluster Editor** permissions to install the
  Karpenter pack. Refer to our
  [Cluster Profile](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) and
  [Cluster](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role reference guides for
  more information about roles and permissions.

- An IAM policy must be created using the following JSON template. This policy grants Karpenter the necessary
  permissions to manage EC2 instances and interact with the EKS cluster. During the
  [Enablement Steps](#enablement-steps) section, you will reference this policy when configuring the Karpenter
  controller role in the cluster profile. For the sake of simplicity, the policy is named `karpenterControllerPolicy`.
  If you choose a different name, ensure you reference that name in the [Enablement Steps](#enablement-steps) section.

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
  discover and use them. The exception to this is the
  [default cluster security group](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html#security-group-default-rules)
  as Amazon EKS automatically removes any user-defined tags when the cluster is updated.

  Ensure the following tag is applied to both the subnets and security groups associated with the EKS cluster. Replace
  `<eks-cluster-name>` with the name of your EKS cluster.

  ```bash
  Key=karpenter.sh/discovery,Value=<eks-cluster-name>
  ```

  :::tip

  The Karpenter documentation provides a quick method to tag the subnets and security groups using the AWS CLI. You can
  find this method in the
  [Karpenter documentation](https://karpenter.sh/docs/getting-started/migrating-from-cas/#add-tags-to-subnets-and-security-groups).

  If using this method, note the following:

  - The command to tag the subnets uses the existing node groups in the cluster to identify the subnets. If your node
    groups are only assigned to use a subset of the cluster's subnets, you may need to manually tag any additional
    subnets that are not associated with the node groups.

  - If you are using a Z shell (ZSH) shell, the final command to tag the security groups needs to be modified slightly.
    Change `--resources "${SECURITY_GROUPS}"` to `--resources "${=SECURITY_GROUPS}"` to ensure proper execution in ZSH.
    This is only required if you have more than one security group to tag.

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
   `<aws-account-id>` with your AWS partition and account ID, respectively. If you named the policy something other than
   `karpenterControllerPolicy`, ensure you use that name in the ARN.

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
   `managedMachinePool.roleName` sections for the IAM node role that will be used by Karpenter provisioned nodes.
   Replace `<aws-partition>`, `<aws-account-id>`, and `<eks-cluster-name>` with your AWS partition, account ID, and EKS
   cluster name, respectively.

   ```yaml title="Entry template" {6-10,13}
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

   ```yaml hideClipboard title="Example entry" {6-10,13}
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

3. On the **Overview** tab, check that the **Cluster Status** is **Running** without a loading icon and the **Health**
   is **Healthy**.

4. Verify that the Karpenter pack is listed under the **Cluster Profiles** section with a green circle indicating that
   it is successfully deployed.

## Configure Karpenter NodePools

### Prerequisites

- Your Palette account must have the **Cluster Profile Editor** and **Cluster Editor** permissions to configure
  Karpenter NodePools. Refer to our
  [Cluster Profile](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) and
  [Cluster](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role reference guides for
  more information about roles and permissions.

### Enablement Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Profiles**.

3. Click **Add Cluster Profile**.

4. Fill in the basic information for the new profile and ensure the **Type** is set to **Add-on**.

   The name of the profile should reflect its purpose, such as `karpenter-node-pool-my-eks-cluster`.

5. Click **Next** when the information is filled out.

6. Click **Add Manifest**.

7. Provide a name for the manifest layer, such as `karpenter-nodepool-layer`.

8. Click the **New manifest** option and provide a name for the manifest, such as `karpenter-nodepool-manifest`. Click
   the tick icon to save the name.

9. In the YAML editor, add a Karpenter NodePool configuration. In this example, we will create a default NodePool. This
   configuration can be customized to fit your specific requirements. Refer to
   [Karpenter NodePool examples](https://github.com/aws/karpenter-provider-aws/tree/main/examples/v1) to view example
   configurations for a variety of use cases. The [Karpenter documentation](https://karpenter.sh/docs/concepts/) also
   provides comprehensive information on the various configuration options.

   ```yaml title="Default NodePool example"
   apiVersion: karpenter.sh/v1
   kind: NodePool
   metadata:
     name: default
   spec:
     template:
       spec:
         requirements:
           - key: kubernetes.io/arch
             operator: In
             values: ["amd64"]
           - key: kubernetes.io/os
             operator: In
             values: ["linux"]
           - key: karpenter.sh/capacity-type
             operator: In
             values: ["on-demand"]
           - key: karpenter.k8s.aws/instance-category
             operator: In
             values: ["c", "m", "r"]
           - key: karpenter.k8s.aws/instance-generation
             operator: Gt
             values: ["2"]
         nodeClassRef:
           group: karpenter.k8s.aws
           kind: EC2NodeClass
           name: al2023-20250920
     disruption:
       consolidationPolicy: WhenEmptyOrUnderutilized
       consolidateAfter: 1m
   ---
   apiVersion: karpenter.k8s.aws/v1
   kind: EC2NodeClass
   metadata:
     name: al2023-20250920
     annotations:
       kubernetes.io/description: "General purpose EC2NodeClass for running Amazon Linux 2023@20250920 AMI nodes"
   spec:
     role: "{{.spectro.system.cluster.name}}-nodeRole" # Must match the node role created in the Kubernetes layer under managedMachinePool.roleName.
     amiSelectorTerms:
       - alias: "al2023@v20250920"
     subnetSelectorTerms:
       - tags:
           karpenter.sh/discovery: "{{.spectro.system.cluster.name}}"
     securityGroupSelectorTerms:
       - tags:
           karpenter.sh/discovery: "{{.spectro.system.cluster.name}}"
   ```

10. Click **Confirm & Create**.

11. Click **Next**, followed by **Finish Configuration** to create the new profile.

12. From the left main menu, click **Clusters** and select your EKS cluster from the list.

13. Select the **Profile** tab.

14. Click the plus icon next to **ADDON LAYERS** to add an add-on profile.

15. Select the new add-on profile you created for the default Karpenter NodePool. Click **Confirm** once selected.

16. Click **Save** to apply the NodePool configuration to your cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Clusters** and select your EKS cluster from the list.

3. In the **Overview** tab, verify that the Karpenter NodePool profile is listed under the **Cluster Profiles** section
   with a green circle indicating that it is successfully deployed.

## Test Karpenter Node Provisioning

To test Karpenter's ability to provision nodes based on workload demands, you can deploy a sample application and scale
the number of replica pods for the deployment manually. This will trigger Karpenter to create new nodes to accommodate
the workload or delete nodes when they are no longer needed.

### Prerequisites

- Your Palette account must have the **Cluster Profile Editor** and **Cluster Editor** permissions to configure
  Karpenter NodePools. Refer to our
  [Cluster Profile](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) and
  [Cluster](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role reference guides for
  more information about roles and permissions.

- AWS CLI must be installed and configured with the necessary permissions to
  [obtain the kubeconfig file](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) for your eks
  cluster. Refer to [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  for installation instructions and
  [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for configuration
  guidance.

- Kubectl must be installed. Refer to
  [Install and Configure kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) for
  instructions.

### Enablement Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Profiles**.

3. Click **Add Cluster Profile**.

4. Fill in the basic information for the new profile and ensure the **Type** is set to **Add-on**.

   The name of the profile should reflect its purpose, such as `karpenter-test-deployment-my-eks-cluster`.

5. Click **Add Manifest**.

6. Provide a name for the manifest layer, such as `karpenter-test-deployment-layer`.

7. Select the **Enter layer values** option and copy the following values into the YAML editor.

   ```yaml title="Layer values"
   pack:
     spectrocloud.com/install-priority: "0"
     namespace: inflate
   ```

8. Click the **New manifest** option and provide a name for the manifest, such as `karpenter-test-deployment`. Click the
   tick icon to save the name.

9. In the YAML editor, add a sample deployment configuration. This example creates a deployment named `inflate` with 0
   replicas of the [pause](https://gallery.ecr.aws/eks-distro/kubernetes/pause) container.

   ```yaml title="Sample deployment"
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: inflate
   spec:
     replicas: 0
     selector:
       matchLabels:
         app: inflate
     template:
       metadata:
         labels:
           app: inflate
       spec:
         terminationGracePeriodSeconds: 0
         securityContext:
           runAsUser: 1000
           runAsGroup: 3000
           fsGroup: 2000
         containers:
           - name: inflate
             image: public.ecr.aws/eks-distro/kubernetes/pause:3.7
             resources:
               requests:
                 cpu: 1
             securityContext:
               allowPrivilegeEscalation: false
   ```

10. Click **Confirm & Create**.

11. From the left main menu, click **Clusters** and select your EKS cluster from the list.

12. Select the **Profile** tab.

13. Click the plus icon next to **ADDON LAYERS** to add an add-on profile.

14. Select the new add-on profile you created for the test deployment. Click **Confirm** once selected.

15. Click **Save** to apply the test deployment to your cluster.

    Wait for the deployment to be applied. This may take a few minutes. Under the **Cluster Profiles** section in the
    **Overview** tab, the test deployment will have a green circle indicating that it is successfully deployed.

### Validate

1. Open a terminal session and issue the following command to connect to your EKS cluster. Replace `<eks-cluster-name>`
   with the name of your EKS cluster and `<aws-region>` with the AWS region your cluster is in.

   ```bash
   aws eks update-kubeconfig --name <eks-cluster-name> --region <aws-region>
   ```

2. Issue the following command to scale the deployment to 10 replicas. The replica count of 10 was tested on an EKS
   cluster with two worker nodes of an instance type [`t3.xlarge`](https://aws.amazon.com/ec2/instance-types/t3/) in a
   single node group. You may need to increase or decrease the number of replicas depending on the current capacity of
   your cluster node groups.

   ```bash
   kubectl scale deployment inflate --namespace inflate --replicas 10
   ```

   ```bash hideClipboard title="Expected output"
   deployment.apps/inflate scaled
   ```

3. Monitor the Karpenter controller logs to observe the node provisioning activity. Issue the following command to view
   the logs.

   ```bash
   kubectl logs --follow --namespace karpenter --selector app.kubernetes.io/name=karpenter --container controller
   ```

   You will notice log entries that indicate Karpenter is provisioning new nodes to accommodate the increased workload.

   ```shell hideClipboard title="Example Karpenter controller logs"
   {"level":"INFO","time":"2025-10-08T16:57:03.613Z","logger":"controller","message":"found provisionable pod(s)","commit":"4ff8cfe","controller":"provisioner","namespace":"","name":"","reconcileID":"a47f6276-1e00-4315-aba5-faaddae6e59f","Pods":"inflate/inflate-5c5f75666d-gkvwm, inflate/inflate-5c5f75666d-vnglw, inflate/inflate-5c5f75666d-pxzxt, inflate/inflate-5c5f75666d-5gnpz, inflate/inflate-5c5f75666d-vtmcn","duration":"97.580831ms"}
   {"level":"INFO","time":"2025-10-08T16:57:03.613Z","logger":"controller","message":"computed new nodeclaim(s) to fit pod(s)","commit":"4ff8cfe","controller":"provisioner","namespace":"","name":"","reconcileID":"a47f6276-1e00-4315-aba5-faaddae6e59f","nodeclaims":1,"pods":5}
   {"level":"INFO","time":"2025-10-08T16:57:03.632Z","logger":"controller","message":"created nodeclaim","commit":"4ff8cfe","controller":"provisioner","namespace":"","name":"","reconcileID":"a47f6276-1e00-4315-aba5-faaddae6e59f","NodePool":{"name":"default"},"NodeClaim":{"name":"default-c54z5"},"requests":{"cpu":"5180m","memory":"120Mi","pods":"8"},"instance-types":"c3.2xlarge, c4.2xlarge, c5.2xlarge, c5.4xlarge, c5a.2xlarge and 55 other(s)"}
   {"level":"INFO","time":"2025-10-08T16:57:06.354Z","logger":"controller","message":"launched nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-c54z5"},"namespace":"","name":"default-c54z5","reconcileID":"09d9e180-2d05-42ea-a55e-ab7b4614d589","provider-id":"aws:///us-east-1a/i-08d0c987a45fcdecd","instance-type":"c6a.2xlarge","zone":"us-east-1a","capacity-type":"on-demand","allocatable":{"cpu":"7910m","ephemeral-storage":"17Gi","memory":"14967996Ki","pods":"58","vpc.amazonaws.com/pod-eni":"38"}}
   {"level":"INFO","time":"2025-10-08T16:57:30.894Z","logger":"controller","message":"registered nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-c54z5"},"namespace":"","name":"default-c54z5","reconcileID":"77c703e0-391a-4368-a391-7166e0459493","provider-id":"aws:///us-east-1a/i-08d0c987a45fcdecd","Node":{"name":"ip-10-11-12-13.ec2.internal"}}
   {"level":"INFO","time":"2025-10-08T16:57:43.744Z","logger":"controller","message":"initialized nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-c54z5"},"namespace":"","name":"default-c54z5","reconcileID":"b0182dc3-a210-406e-8781-576ef5cb0e82","provider-id":"aws:///us-east-1a/i-08d0c987a45fcdecd","Node":{"name":"ip-10-11-12-13.ec2.internal"},"allocatable":{"cpu":"7910m","ephemeral-storage":"18181869946","hugepages-1Gi":"0","hugepages-2Mi":"0","memory":"14967996Ki","pods":"58"}}
   ```

4. Back in Palette, select the **Nodes** tab for your EKS cluster. You will see new nodes being added to the cluster as
   Karpenter provisions them to accommodate the increased workload. You may need to refresh your browser to see the new
   nodes. The Karpenter-provisioned node pools will have the **Managed by Karpenter** banner.

   Alternatively, you can issue the following command in your terminal to view the nodes in your cluster.

   ```bash
   kubectl get nodes
   ```

   The output should be similar to the following, showing the nodes in your cluster, including those provisioned by
   Karpenter.

   ```shell hideClipboard
   NAME                          STATUS   ROLES    AGE   VERSION
   ip-10-11-12-13.ec2.internal   Ready    <none>   5m    v1.32.9-eks-113cf36
   ip-11-12-13-14.ec2.internal   Ready    <none>   13h   v1.32.9-eks-113cf36
   ip-12-13-14-15.ec2.internal   Ready    <none>   13h   v1.32.9-eks-113cf36
   ```

5. Issue the following command to scale down the deployment to 0 replicas. This will trigger Karpenter to terminate the
   nodes that were provisioned for the deployment.

   ```bash
   kubectl scale deployment inflate --namespace inflate --replicas 0
   ```

   ```bash hideClipboard title="Expected output"
   deployment.apps/inflate scaled
   ```

6. Monitor the Karpenter controller logs to observe the node termination activity.

   ```bash
   kubectl logs --follow --namespace karpenter --selector app.kubernetes.io/name=karpenter --container controller
   ```

   You will notice log entries that indicate Karpenter is terminating nodes that are no longer needed and creating new
   nodes if necessary.

   ```shell hideClipboard title="Example Karpenter controller logs"
   {"level":"INFO","time":"2025-10-08T17:25:47.232Z","logger":"controller","message":"disrupting node(s)","commit":"4ff8cfe","controller":"disruption","namespace":"","name":"","reconcileID":"0725c95c-43f8-40f7-b1db-c405b731ef06","command-id":"856c6beb-eb53-4ac3-ab3d-5b6760b3378f","reason":"underutilized","decision":"replace","disrupted-node-count":1,"replacement-node-count":1,"pod-count":1,"disrupted-nodes":[{"Node":{"name":"ip-10-11-12-13.ec2.internal"},"NodeClaim":{"name":"default-c54z5"},"capacity-type":"on-demand","instance-type":"c6a.2xlarge"}],"replacement-nodes":[{"capacity-type":"on-demand","instance-types":"c7a.medium, m7a.medium, m3.medium, r7a.medium, c6a.large and 55 other(s)"}]}
   {"level":"INFO","time":"2025-10-08T17:25:47.285Z","logger":"controller","message":"created nodeclaim","commit":"4ff8cfe","controller":"disruption","namespace":"","name":"","reconcileID":"0725c95c-43f8-40f7-b1db-c405b731ef06","NodePool":{"name":"default"},"NodeClaim":{"name":"default-nc2x2"},"requests":{"cpu":"280m","ephemeral-storage":"256Mi","memory":"220Mi","pods":"4"},"instance-types":"c3.large, c4.large, c5.large, c5.xlarge, c5a.large and 55 other(s)"}
   {"level":"INFO","time":"2025-10-08T17:25:50.661Z","logger":"controller","message":"launched nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-nc2x2"},"namespace":"","name":"default-nc2x2","reconcileID":"cd1e21f8-8ddb-4f86-a173-e17fa9c1953d","provider-id":"aws:///us-east-1a/i-0d1f6ea8255fa6496","instance-type":"c7a.medium","zone":"us-east-1a","capacity-type":"on-demand","allocatable":{"cpu":"940m","ephemeral-storage":"17Gi","memory":"1471060Ki","pods":"8","vpc.amazonaws.com/pod-eni":"4"}}
   {"level":"INFO","time":"2025-10-08T17:26:11.794Z","logger":"controller","message":"registered nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-nc2x2"},"namespace":"","name":"default-nc2x2","reconcileID":"0f2e7c4f-d175-49ce-9816-b20dd9148d1f","provider-id":"aws:///us-east-1a/i-0d1f6ea8255fa6496","Node":{"name":"ip-13-14-15-16.ec2.internal"}}
   {"level":"INFO","time":"2025-10-08T17:26:25.483Z","logger":"controller","message":"initialized nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-nc2x2"},"namespace":"","name":"default-nc2x2","reconcileID":"39205e7b-082c-4bbe-870c-ea1c637f6ca0","provider-id":"aws:///us-east-1a/i-0d1f6ea8255fa6496","Node":{"name":"ip-13-14-15-16.ec2.internal"},"allocatable":{"cpu":"940m","ephemeral-storage":"18181869946","hugepages-1Gi":"0","hugepages-2Mi":"0","memory":"1471060Ki","pods":"8"}}
   {"level":"INFO","time":"2025-10-08T17:26:26.374Z","logger":"controller","message":"tainted node","commit":"4ff8cfe","controller":"node.termination","controllerGroup":"","controllerKind":"Node","Node":{"name":"ip-10-11-12-13.ec2.internal"},"namespace":"","name":"ip-10-11-12-13.ec2.internal","reconcileID":"7839593c-867f-4e54-9648-50805470c1ac","NodeClaim":{"name":"default-c54z5"},"taint.Key":"karpenter.sh/disrupted","taint.Value":"","taint.Effect":"NoSchedule"}
   {"level":"INFO","time":"2025-10-08T17:27:25.574Z","logger":"controller","message":"deleted node","commit":"4ff8cfe","controller":"node.termination","controllerGroup":"","controllerKind":"Node","Node":{"name":"ip-10-11-12-13.ec2.internal"},"namespace":"","name":"ip-10-11-12-13.ec2.internal","reconcileID":"09ebd74f-0806-4265-a8d6-ba3806073430","NodeClaim":{"name":"default-c54z5"}}
   {"level":"INFO","time":"2025-10-08T17:27:25.838Z","logger":"controller","message":"deleted nodeclaim","commit":"4ff8cfe","controller":"nodeclaim.lifecycle","controllerGroup":"karpenter.sh","controllerKind":"NodeClaim","NodeClaim":{"name":"default-c54z5"},"namespace":"","name":"default-c54z5","reconcileID":"c033c44e-c1bb-4be8-99de-23c28b2419cd","provider-id":"aws:///us-east-1a/i-08d0c987a45fcdecd","Node":{"name":"ip-10-11-12-13.ec2.internal"}}
   ```

7. Back in Palette, select the **Nodes** tab for your EKS cluster. You will see nodes being removed from the cluster or
   replaced with smaller instances as Karpenter scales down the node pool. You may need to refresh your browser to see
   the updated node list.

   Issue the following command to view the nodes in your cluster. You will see that the nodes provisioned by Karpenter
   have been terminated and removed from the cluster.

   ```bash
   kubectl get nodes
   ```

   The output should be similar to the following, showing either the original nodes or new nodes if Karpenter replaced
   them with smaller instances.

   ```shell hideClipboard
   NAME                           STATUS   ROLES    AGE     VERSION
   ip-13-14-15-16.ec2.internal    Ready    <none>   7m41s   v1.32.9-eks-113cf36
   ip-11-12-13-14.ec2.internal    Ready    <none>   14h     v1.32.9-eks-113cf36
   ip-12-13-14-15.ec2.internal    Ready    <none>   14h     v1.32.9-eks-113cf36
   ```
