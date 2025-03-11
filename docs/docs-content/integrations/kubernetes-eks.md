---
sidebar_label: "Kubernetes"
title: "Kubernetes"
description: "Learn about the Kubernetes pack and how you can use it with your host clusters."
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "kubernetes"]
---

Palette supports various configuration options for the EKS Kubernetes pack. These are explained in the following
sections.

## Configure Managed Control Plane Settings

The following sections relate to the customizable options within the `managedControlPlane.*` section.

### Disable IAM OIDC identity provider

Use this parameter to disable creation of the Identity and Access Management (IAM) OpenID Connect (OIDC) identity
provider.

| Parameter                      | Description                                                                                                                                                                    | Default |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `disableAssociateOIDCProvider` | When set to `true`, this parameter prevents the creation of an IAM OIDC identity provider for the EKS cluster. Once the cluster is created, changing this field has no effect. | `false` |

<details>

<summary> Example </summary>

```yaml
disableAssociateOIDCProvider: true
```

</details>

### Configure Logging

Use the following parameters to control the logging for the managed control plane services.

:::tip

You can use the **Control Plane Logging** preset to enable or disable all of these parameters.

:::

| Parameter                   | Description                                                                                                                                          | Default |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `logging.apiServer`         | Toggles logging for the [Kubernetes API server](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/).                  | `false` |
| `logging.audit`             | Toggles Kubernetes API audit logging.                                                                                                                | `false` |
| `logging.authenticator`     | Toggles cluster authenticator logging.                                                                                                               | `false` |
| `logging.controllerManager` | Toggles logging for the [Kubernetes controller manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/). | `false` |
| `logging.scheduler`         | Toggles logging for the [Kubernetes scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/).                   | `false` |

<details>

<summary> Example </summary>

```yaml
managedControlPlane:
  logging:
    apiServer: true
    audit: true
    authenticator: true
    controllerManager: true
    scheduler: false
```

</details>

### Configure IAM Roles for Service Accounts

Use the following parameters to assign IAM roles to Kubernetes service accounts using IAM Roles for Service Accounts
(IRSA).

| Field                      | Description                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `irsaRoles.name`           | The name of the IAM role to be created for IRSA. This typically includes the cluster name for uniqueness.                                                                                                |
| `irsaRoles.policies`       | A list of [AWS Managed Policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/policy-list.html) Amazon Resource Names (ARNs) or custom policy ARNs that should be attached to the role. |
| `irsaRoles.serviceAccount` | Optional object specifying the service account `name` and `namespace` that the role should trust. If omitted, it defaults to the audience `sts.amazonaws.com`.                                           |

<details>

<summary> Example </summary>

```yaml
irsaRoles:
  - name: "{{.spectro.system.cluster.name}}-irsa-cni"
    policies:
      - arn:aws:iam::123456789012:policy/MyCustomCNIForEKS
    serviceAccount:
      name: aws-node
      namespace: kube-system

  - name: "mycluster-irsa-csi"
    policies:
      - arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy
```

</details>

### Configure Security Group Overrides

Use the following parameters to override the default security groups for the Amazon EKS components.

| Parameter                                    | Description                                                                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `securityGroupOverrides.controlplane`        | The security group ID for the EKS control plane instances. If not provided, one is automatically created. |
| `securityGroupOverrides.bastion`             | The security group ID for the bastion host, if configured.                                                |
| `securityGroupOverrides.node`                | The primary security group for worker nodes, either self-managed or managed.                              |
| `securityGroupOverrides.node-eks-additional` | Additional security group for worker nodes, if needed.                                                    |
| `securityGroupOverrides.apiserver-lb`        | The security group for the API server load balancer, which is the public endpoint to your cluster.        |
| `securityGroupOverrides.lb`                  | The security group for any other load balancers used by the cluster.                                      |

<details>

<summary> Example </summary>

```yaml
securityGroupOverrides:
  controlplane: "sg-11111111"
  bastion: "sg-22222222"
  node: "sg-33333333"
  node-eks-additional: "sg-44444444"
  apiserver-lb: "sg-55555555"
  lb: "sg-66666666"
```

</details>

### Configure OIDC Identity Provider

Use these parameters to configure an external
[OpenID Connect (OIDC) identity provider](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-flags)
for Amazon EKS, such as Okta or Auth0.

| Parameter                                         | Description                                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `oidcIdentityProvider.identityProviderConfigName` | The display name for the OIDC provider config in EKS.                                                                           |
| `oidcIdentityProvider.issuerUrl`                  | The base URL of the external OIDC identity provider.                                                                            |
| `oidcIdentityProvider.clientId`                   | The OIDC client application identifier.                                                                                         |
| `oidcIdentityProvider.usernameClaim`              | Specifies which JWT claim is mapped to the Kubernetes username.                                                                 |
| `oidcIdentityProvider.usernamePrefix`             | An optional string prepended to the username. This helps avoid collision with existing names.                                   |
| `oidcIdentityProvider.groupsClaim`                | Specifies which JWT claim is mapped to the Kubernetes groups.                                                                   |
| `oidcIdentityProvider.groupsPrefix`               | An optional string prepended to group names.                                                                                    |
| `oidcIdentityProvider.requiredClaims`             | A map of key-value pairs that must be present in the token. The token is only accepted if all these claim requirements are met. |

<details>

<summary> Example </summary>

```yaml
oidcIdentityProvider:
  identityProviderConfigName: "eks-oidc"
  issuerUrl: "https://tenant.okta.com"
  clientId: "my-oidc-client-id"
  usernameClaim: "email"
  usernamePrefix: "-"
  groupsClaim: "groups"
  groupsPrefix: "-"
  requiredClaims:
    email_verified: "true"
```

</details>

### Configure Additional Control Plane Policies

Use this parameter to attach extra policies in ARN format to the Amazon EKS control plane role.

| Parameter                | Description                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `roleAdditionalPolicies` | A list of AWS IAM Policy ARNs to attach to the control plane’s IAM role in addition to the default AWS-managed ones. |

<details>

<summary> Example </summary>

```yaml
roleAdditionalPolicies:
  - "arn:aws:iam::123456789012:policy/MyCustomPolicy"
  - "arn:aws:iam::123456789012:policy/AnotherCustomPolicy"
```

</details>

### Map IAM Identities to Kubernetes RBAC Groups

Use the following parameters to map IAM users and roles to Kubernetes Role-based Access Control (RBAC) groups, enabling
fine-grained access control.

| Parameter                         | Description                                                                |
| --------------------------------- | -------------------------------------------------------------------------- |
| `iamAuthenticatorConfig.mapRoles` | A list that maps one or more IAM roles to Kubernetes usernames and groups. |
| `iamAuthenticatorConfig.mapUsers` | A list that maps one or more IAM users to Kubernetes usernames and groups. |

<details>

<summary> Example </summary>

```yaml
iamAuthenticatorConfig:
  mapRoles:
    - rolearn: arn:aws:iam::000000000000:role/KubernetesNode
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
  mapUsers:
    - userarn: arn:aws:iam::000000000000:user/Alice
      username: alice
      groups:
        - system:masters
```

</details>

## Configure Managed Machine Pool Settings

The following sections relate to the customizable options within the `managedMachinePool.*` section.

### Configure Custom IAM Role and Policies for Worker Nodes

| Parameter                | Description                                                                                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `roleName`               | A custom IAM role name for the worker node group. Must be a self-managed role with EKS worker policies attached. The role name cannot start with `ng-role_` as this is reserved for roles generated by Spectro Cloud.             |
| `roleAdditionalPolicies` | A list of additional policy ARNs to attach to the worker node group’s IAM role in addition to the [required EKS worker policies](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html#create-worker-node-role). |

<details>

<summary> Example </summary>

```yaml
managedMachinePool:
  roleName: "eks-workers-mycluster"
  roleAdditionalPolicies:
    - "arn:aws:iam::123456789012:policy/MyExtraPolicy"
    - "arn:aws:iam::123456789012:policy/AnotherPolicy"
```

</details>

## Configure Client Configuration Settings

The following sections relate to the customizable options within the `clientConfig.*` section.

### Configure OIDC-Based Authentication in Kubeconfig

Use the following parameters to configure OIDC-based authentication when generating a kubeconfig for CLI access and
other client tools.

| Parameter            | Description                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `oidc-issuer-url`    | The OIDC issuer URL used in the generated kubeconfig.                                                                       |
| `oidc-client-id`     | The OIDC client ID. This should match the [Amazon EKS OIDC identity provider client ID](#configure-oidc-identity-provider). |
| `oidc-client-secret` | The OIDC client secret. This is only required if the provider requires `client_secret` authentication.                      |
| `oidc-extra-scope`   | The additional OAuth scopes to request. These are specific categories of user data, such as email or user profile.          |

<details>

<summary> Example </summary>

```yaml
clientConfig:
  oidc-issuer-url: "https://tenant.okta.com"
  oidc-client-id: "my-oidc-client-id"
  oidc-client-secret: "<your oidc client secret>"
  oidc-extra-scope: "profile,email"
```

</details>

## Required IAM Permissions for Configuration

You must ensure the AWS IAM user or role performing these actions has sufficient privileges. The following table is an
overview of the the permissions required for each configuration section.

| Configuration Section                                                                                               | IAM Permissions Required                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Disable IAM OIDC identity provider](#disable-iam-oidc-identity-provider)                                           | `iam:CreateOpenIDConnectProvider`, `iam:DeleteOpenIDConnectProvider`, `iam:GetOpenIDConnectProvider`, `iam:TagOpenIDConnectProvider`                                                                                        |
| [Configure Logging](#configure-logging)                                                                             | `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`, `eks:UpdateClusterConfig`                                                                                                                               |
| [Configure IAM Roles for Service Accounts](#configure-iam-roles-for-service-accounts)                               | `iam:CreateRole`, `iam:AttachRolePolicy`, `iam:PassRole`, `iam:GetRole`, `iam:ListRoles`                                                                                                                                    |
| [Configure Security Group Overrides](#configure-security-group-overrides)                                           | `ec2:DescribeSecurityGroups`, `ec2:CreateSecurityGroup`, `ec2:AuthorizeSecurityGroupIngress`, `ec2:AuthorizeSecurityGroupEgress`, `ec2:DeleteSecurityGroup`                                                                 |
| [Configure OIDC Identity Provider](#configure-oidc-identity-provider)                                               | `eks:AssociateIdentityProviderConfig`, `eks:DisassociateIdentityProviderConfig`, `eks:DescribeIdentityProviderConfig`, `iam:CreateOpenIDConnectProvider`, `iam:DeleteOpenIDConnectProvider`, `iam:TagOpenIDConnectProvider` |
| [Configure Additional Control Plane Policies](#configure-additional-control-plane-policies)                         | `iam:AttachRolePolicy`, `iam:DetachRolePolicy`, `iam:PassRole`                                                                                                                                                              |
| [Map IAM Identities to Kubernetes RBAC Groups](#map-iam-identities-to-kubernetes-rbac-groups)                       | Dependent on the [cluster authentication mode](https://docs.aws.amazon.com/eks/latest/userguide/grant-k8s-access.html#set-cam), EKS API mode may require `eks:DescribeCluster` and `eks:UpdateClusterConfig`.               |
| [Configure Custom IAM Role and Policies for Worker Nodes](#configure-custom-iam-role-and-policies-for-worker-nodes) | `iam:CreateRole`, `iam:AttachRolePolicy`, `iam:PassRole`, `iam:GetRole`, `iam:ListRoles`                                                                                                                                    |
| [Configure OIDC-Based Authentication in Kubeconfig](#configure-oidc-based-authentication-in-kubeconfig)             | `eks:DescribeCluster`                                                                                                                                                                                                       |

### Core IAM Policies Coverage

If using the [Core IAM Policies](../clusters/public-cloud/aws/required-iam-policies.md#core-iam-policies) including the
[Controllers EKS Policy](../clusters/public-cloud/aws/required-iam-policies.md#controllers-eks-policy), you may need the
following additional IAM permissions:

| Configuration Section                    | Missing Permissions                                                |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Configure Logging                        | `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents` |
| Configure IAM Roles for Service Accounts | `iam:ListRoles`                                                    |
| Configure Security Group Overrides       | `ec2:AuthorizeSecurityGroupEgress`                                 |

### Minimum Permissions Coverage

If using [Minimum Permissions](../clusters/public-cloud/aws/required-iam-policies.md#minimum-permissions), either
dynamic or static, you may need the following additional IAM permissions:

| Configuration Section                                   | Missing Permissions                                                                                                                                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disable IAM OIDC identity provider                      | `iam:CreateOpenIDConnectProvider`, `iam:DeleteOpenIDConnectProvider`, `iam:GetOpenIDConnectProvider`, `iam:TagOpenIDConnectProvider`                                                                                        |
| Configure Logging                                       | `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`, `eks:UpdateClusterConfig`                                                                                                                               |
| Configure IAM Roles for Service Accounts                | `iam:CreateRole`, `iam:AttachRolePolicy`, `iam:GetRole`, `iam:ListRoles`                                                                                                                                                    |
| Configure Security Group Overrides                      | `ec2:AuthorizeSecurityGroupEgress`                                                                                                                                                                                          |
| Configure OIDC Identity Provider                        | `eks:AssociateIdentityProviderConfig`, `eks:DisassociateIdentityProviderConfig`, `eks:DescribeIdentityProviderConfig`, `iam:CreateOpenIDConnectProvider`, `iam:DeleteOpenIDConnectProvider`, `iam:TagOpenIDConnectProvider` |
| Configure Additional Control Plane Policies             | `iam:AttachRolePolicy`, `iam:DetachRolePolicy`                                                                                                                                                                              |
| Map IAM Identities to Kubernetes RBAC Groups            | `eks:UpdateClusterConfig`                                                                                                                                                                                                   |
| Configure Custom IAM Role and Policies for Worker Nodes | `iam:CreateRole`, `iam:AttachRolePolicy`, `iam:GetRole`, `iam:ListRoles`                                                                                                                                                    |

## Terraform

You can retrieve details about the Kubernetes pack for AWS EKS by using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-eks"
  version = "1.29"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
