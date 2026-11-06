---
sidebar_label: "Pack Values Reference"
title: "Pack Values Reference"
description:
  "Learn which top-level keys Palette reads from the values of a pack, which packs use each key, and where to find more
  information."
hide_table_of_contents: false
sidebar_position: 25
tags: ["packs", "profiles", "reference"]
---

<!-- TODO(DOC-3379): Draft. Open questions for engineering are marked with TODO comments. -->

Every pack has a `values.yaml` file that holds its configuration. When you add a pack to a cluster profile, Palette
displays these values in the YAML editor of the profile layer, where you can review and change them. Palette reads a set
of top-level keys from the values to decide how to install and configure the pack. It passes the rest of the values to
the Helm charts or manifests of the pack.

This page describes each top-level key that Palette reads, the packs that use it, and where to find more information.
For the `pack.json` file that defines a custom pack, refer to [JSON Schema](./add-custom-packs.md#json-schema). For the
constraints that a pack can place on its values, refer to [Pack Constraints](./pack-constraints.md).

## Key Names

Write each key exactly as it appears on this page, including its capitalization. Palette ignores capitalization when it
reads a top-level key, but other Palette components match the exact key name, and every key below a top-level key is
case-sensitive. For example, Spectro Cloud Kubernetes packs use `kubeadmconfig` in lowercase, so use the same spelling
when you add or change Kubernetes settings.

<!-- TODO(DOC-3379): Confirm with engineering that the docs should require exact key spellings. -->

## Top-Level Keys

The following table lists the top-level keys that Palette reads and the packs that use them.

| **Key**                                                                   | **Used By**                                        | **Purpose**                                                                      |
| ------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`pack`](#pack)                                                           | All packs                                          | Namespaces, install order, release names, and the content of the pack.           |
| [`charts`](#charts)                                                       | Helm chart packs, including many CNI and CSI packs | Values for each Helm chart in the pack.                                          |
| [`manifests`](#manifests)                                                 | Manifest packs, including some CNI packs           | Values for each manifest template in the pack.                                   |
| [`readinessCheck`](#readinesscheck)                                       | Add-on packs                                       | Conditions that the pack must meet before Palette marks it as ready.             |
| [`kubeadmconfig`](#kubeadmconfig)                                         | Palette eXtended Kubernetes (PXK) packs            | The kubeadm configuration of the cluster.                                        |
| [`canonicalK8sConfig`](#canonicalk8sconfig)                               | Canonical Kubernetes packs                         | Bootstrap and control plane settings of the cluster.                             |
| [`cloud`](#cloud)                                                         | Kubernetes packs on AWS, Azure, and MAAS           | Infrastructure settings for the cloud that hosts the cluster.                    |
| [`imageSwap`](#imageswap)                                                 | Kubernetes packs of managed Kubernetes clusters    | Registry mappings for the Image Swap webhook.                                    |
| [`manageCloudFormationStackManually`](#managecloudformationstackmanually) | Kubernetes packs on AWS                            | Use a CloudFormation stack that you manage, instead of one that Palette creates. |
| [`managedControlPlane`](#managedcontrolplane)                             | EKS and AKS packs                                  | Settings of the managed control plane.                                           |
| [`managedMachinePool`](#managedmachinepool)                               | EKS and AKS packs                                  | Settings of the managed node pools.                                              |
| [`nodeCustomization`](#nodecustomization)                                 | EKS packs                                          | Customizations to how EKS nodes bootstrap.                                       |
| [`postReadinessHooks`](#postreadinesshooks)                               | Palette Dev Engine app profile templates           | Values that a tier exposes to the other tiers of an app profile.                 |
| [`containerService`](#containerservice)                                   | Palette Dev Engine container tiers                 | The container that the tier deploys.                                             |
| [`zarf`](#zarf)                                                           | Zarf packs                                         | Zarf deployment options.                                                         |

## Keys for All Packs

### `pack`

The `pack` key holds settings that Palette applies to the pack as a whole. The following table describes the sub-keys
that you are most likely to set.

| **Sub-Key**                                                       | **Description**                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace`                                                       | The namespace that Palette installs the pack in.                                                                                                                                                                                                                             |
| `additionalNamespaces`, `namespaceLabels`, `namespaceAnnotations` | Additional namespaces for Palette to create, and the labels and annotations of the namespaces. Refer to [Pack Labels and Annotations](../profiles/profile-customization.md#pack-labels-and-annotations).                                                                     |
| `releaseNameOverride`                                             | The Helm release name of each chart in the pack. Use it to add the same pack more than once to a cluster profile. Refer to [Create a Cluster Profile with Repeated Packs](../profiles/cluster-profiles/create-cluster-profiles/duplicate-pack-in-profile.md).                |
| `spectrocloud.com/install-priority`                               | The install order of the pack among the add-on layers of a cluster profile. Refer to [Install Order](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md#install-order).                                                       |
| `content`                                                         | The images, charts, and artifacts that the pack uses, so that Palette can pull them from a primary registry. Refer to [Deploy with a Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/deploy-primary-registry.md#deploy-with-a-primary-registry). |

The following example installs an add-on pack in the `topolvm-system` namespace and gives it an install priority of `1`.

```yaml
pack:
  namespace: topolvm-system
  spectrocloud.com/install-priority: "1"
```

Kubernetes packs also use `pack` for cluster networking, with the `podCIDR`, `serviceClusterIpRange`, and
`serviceDomain` sub-keys. You cannot change `serviceDomain` after you create the cluster.

## Keys for Add-on Packs

### `charts`

Helm chart packs nest the values of each chart under `charts.<chart-name>`. Palette passes these values to Helm when it
installs the chart, in the same way as `helm install --values`. The following example sets a value of the `cilium`
chart.

```yaml
charts:
  cilium:
    namespaceOverride: ""
```

Packs that you add from a Helm registry have no `charts` key. Their values are the values of the chart, at the top level
of the file. For more information, refer to [Helm Registries](./registries/helm-charts.md).

### `manifests`

Manifest packs nest the values of each manifest under `manifests.<manifest-name>`, where `<manifest-name>` is the
filename of the manifest without its extension. Palette substitutes these values into the manifest template before it
applies the manifest. The following example sets the image values of the `calico` manifest.

```yaml
manifests:
  calico:
    images:
      calico: ""
      thirdPartyCniPlugins: ""
      node: ""
```

### `readinessCheck`

The `readinessCheck` key makes Palette wait until a custom resource that the pack deploys reaches the state that you
specify, before Palette marks the pack as ready. Refer to
[Pack Readiness Checks](./pack-constraints.md#pack-readiness-checks).

## Keys for Kubernetes Packs

### `kubeadmconfig`

PXK packs hold the kubeadm configuration of the cluster under `kubeadmconfig`. Its sub-keys include `apiServer`,
`controllerManager`, `scheduler`, `kubeletExtraArgs`, `files`, `preKubeadmCommands`, and `postKubeadmCommands`. For the
full set of options and examples, refer to the

<VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> pack.

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
```

### `canonicalK8sConfig`

Canonical Kubernetes packs hold the bootstrap and control plane settings of the cluster under `canonicalK8sConfig`, such
as `bootCommands`, `preRunCommands`, `postRunCommands`, `extraSANs`, `nodeTaints`, and `datastoreType`. The section is
commented out in the pack by default. Changing it after you create the cluster repaves the nodes, and some fields, such
as `datastoreType`, take effect only when you create the cluster.

### `cloud`

Kubernetes packs on AWS, Azure, and MAAS hold settings for the cloud infrastructure of the cluster under `cloud.aws`,
`cloud.azure`, and `cloud.maas`. For example, `cloud.aws.nodePortCIDRBlocks` sets the source ranges that can reach
NodePort services, and `cloud.maas.customEndpoint` sets a custom API server endpoint. Refer to
[Custom Security Group Ingress Rules](../clusters/public-cloud/aws/architecture.md#custom-security-group-ingress-rules)
and to the <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> pack.

<!-- TODO(DOC-3379): Confirm with engineering which cloud.azure and cloudControllerManager options customers can set, and document them here. -->

### `imageSwap`

The `imageSwap` key maps image registries to mirror registries for the Image Swap webhook, which rewrites the image
references of the workloads in the cluster. Refer to [Image Swap](../clusters/cluster-management/image-swap.md).

### `manageCloudFormationStackManually`

Set `manageCloudFormationStackManually.enabled` to `true` to use a CloudFormation stack that you create and manage,
instead of one that Palette creates. The setting of the cloud account takes precedence over the pack value. Refer to
[Step 2: Choose CloudFormation Stack Management Option](../clusters/public-cloud/aws/required-iam-policies/minimum-permissions-policies.md#step-2-choose-cloudformation-stack-management-option).

<!-- TODO(DOC-3379): Confirm with engineering whether this key applies only to PXK packs, as the minimum permissions page says, or to all AWS Kubernetes packs. Fix the other page if needed. -->

## Keys for Managed Kubernetes Packs

### `managedControlPlane`

EKS and AKS packs hold the settings of the managed control plane under `managedControlPlane`. For EKS, these include
`logging`, `oidcIdentityProvider`, `irsaRoles`, `roleName`, and `roleAdditionalPolicies`. For AKS, they include
`userAssignedIdentities`, `aadProfile`, `apiServerAccessProfile`, and `oidcIssuerProfile`. For the available settings,
refer to [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md) and
[Create and Manage Azure AKS Cluster](../clusters/public-cloud/azure/aks.md).

```yaml
managedControlPlane:
  logging:
    apiServer: false
```

### `managedMachinePool`

EKS packs use `managedMachinePool.roleName` and `managedMachinePool.roleAdditionalPolicies` to set the IAM role of the
node groups. AKS packs use `managedMachinePool.maxPodPerNode` to set the maximum number of pods on each node. The packs
comment out these settings by default.

### `nodeCustomization`

EKS packs use `nodeCustomization` to customize how the nodes bootstrap, for example with a user data script for Amazon
Linux 2023 nodes. Refer to the <VersionedLink text="Amazon EKS" url="/integrations/packs/?pack=kubernetes-eks" /> pack.

<!-- TODO(DOC-3379): Confirm with engineering which nodeCustomization options are supported besides al2023.userDataScript, and document them here. -->

## Keys for Palette Dev Engine

### `postReadinessHooks`

App profile templates use `postReadinessHooks.outputParameters` to expose values, such as the namespace of a service or
a secret, to the other tiers of an app profile. The other tiers reference these values through macros. Each output
parameter has a `name`, a `type`, and a `spec`. The `type` is `lookupSecret`, `staticSecret`, or `dynamicSecret`.

```yaml
postReadinessHooks:
  outputParameters:
    - name: POSTGRESMSTR_SVC_NAMESPACE
      type: lookupSecret
      spec:
        namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
        secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
        ownerReference:
          apiVersion: v1
          kind: Service
          name: "{{.spectro.system.appdeployment.tiername}}-postgres"
        keyToCheck: metadata.namespace
```

If an output parameter has an unknown `type` or is missing a required field, Palette cannot read the values of the pack.
For an app profile that uses output parameters, refer to the [Deploy an App](../tutorials/pde/deploy-app.md) tutorial.

### `containerService`

Container tiers of an app profile use `containerService` to describe the container to deploy, such as its `image`,
`ports`, `env`, and `replicas`. For an example, refer to the [Deploy an App](../tutorials/pde/deploy-app.md) tutorial.

## Other Keys

### `zarf`

Zarf packs use the `zarf` key for Zarf initialization and deployment options. For Zarf packs, refer to
[Add OCI Zarf Registry](./registries/oci-registry/add-oci-zarf.md).

<!-- TODO(DOC-3379): Confirm with engineering whether customers set zarf options or Palette sets them. -->

### Reserved Keys

Palette also recognizes the `palettePatch`, `cloudService`, `ansibleRoles`, and `microk8sConfig` keys. Palette reserves
these keys for internal use. Do not add them to your packs.

<!-- TODO(DOC-3379): Confirm with engineering that these keys are reserved for internal use. -->

Other Palette components read keys that this page does not cover, such as `cluster` in Edge Kubernetes packs and
`stages` in OS packs.

## Next Steps

To build a pack that uses these keys, refer to [Add a Custom Pack](./add-custom-packs.md). To add an existing pack to a
cluster profile, refer to [Add an Add-on Pack](./adding-add-on-packs.md).
