---
sidebar_label: "Troubleshooting"
title: "Troubleshooting the VMO Pack"
description: "Troubleshooting steps for common Virtual Machine Orchestrator (VMO) pack scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["vmo", "vmo pack", "troubleshooting"]
---

This page provides troubleshooting guidance for common scenarios you might encounter when using the
[VMO pack](./vmo-pack.md).

## Scenario - Pack Upgrade Fails with an Invalid Ownership Metadata Error

<!-- vale off -->

When you trigger an upgrade of the `virtual-machine-orchestrator` pack from Palette, the upgrade does not complete. The
following symptoms indicate this scenario.

- The cluster page displays the **Virtual Machine Orchestrator** layer in an error state.

- Events on the workload cluster report a `ReconcileError` from `atop-controller` that contains the text
  `invalid ownership metadata`.

- Retrying the upgrade produces the same error on every reconcile cycle.

Use the following command to display the events, replacing `<cluster-uid>` with the unique identifier of your cluster.

```bash
kubectl get events --namespace cluster-<cluster-uid>
```

The following text is an example of the error.

```text hideClipboard title="Example Output"
Warning  ReconcileError  atop-controller
  failed to reconcile charts ...: helm upgrade failed for release
  virtual-machine-orche-virtual-machine-orche:
  Error: UPGRADE FAILED: unable to continue with update:
  Role "vmo-cdi-clone-source" in namespace "default" exists and cannot be
  imported into the current release: invalid ownership metadata;
    label validation error: key "app.kubernetes.io/managed-by" must equal "Helm":
      current value is "vmo-manager";
    annotation validation error: missing key "meta.helm.sh/release-name":
      must be set to "virtual-machine-orche-virtual-machine-orche";
    annotation validation error: missing key "meta.helm.sh/release-namespace":
      must be set to "vm-dashboard"
```

The object named in the error can be a `Role`, `RoleBinding`, `ClusterRole`, or `ClusterRoleBinding`, but the error
always takes the form `X exists and cannot be imported into the current release: invalid ownership metadata`.

This occurs because the upgrade brings a set of Kubernetes role-based access control (RBAC) objects under Helm
management. Helm 3 refuses to adopt an existing object unless that object already carries the metadata that identifies
it as part of the target release.

| **Field**                                   | **Required Value**          |
| ------------------------------------------- | --------------------------- |
| Label `app.kubernetes.io/managed-by`        | `Helm`                      |
| Annotation `meta.helm.sh/release-name`      | Your Helm release name      |
| Annotation `meta.helm.sh/release-namespace` | Your Helm release namespace |

If any of the RBAC objects that the pack templates already exist with different values, such as
`app.kubernetes.io/managed-by: vmo-manager` from an earlier installation, or with no metadata because someone created
them manually, the ownership check fails and the upgrade stops before it starts. This check runs before any Helm
pre-upgrade hook, so the pack cannot correct the state on its own. Correct the metadata before you trigger the upgrade.

### Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/) version 1.28 or later, configured against the workload cluster and
  not the Palette management cluster. Refer to
  [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) to obtain access.

- Permission to create ServiceAccounts, ClusterRoles, ClusterRoleBindings, and Jobs in the `default` namespace if you
  use the Kubernetes Job, or permission to patch RBAC objects cluster-wide if you use the Bash script.

- An existing cluster with the VMO pack installed. This procedure does not install the pack. It prepares an existing
  installation for its next upgrade.

### Find Your Release Values

The default values in the following procedures match a standard Palette installation. If your release uses different
names, use the following steps to look them up.

1. Display your Helm release name and namespace.

   ```bash
   helm list --all-namespaces | grep virtual-machine-orche
   ```

   ```text hideClipboard title="Example Output"
   NAME                                         NAMESPACE     REVISION  CHART                                APP VERSION
   virtual-machine-orche-virtual-machine-orche  vm-dashboard  2         virtual-machine-orchestrator-1.0.16  ...
   ```

   The first column is your release name, and the second column is your release namespace.

2. Display the golden images namespace, replacing `<cluster-uid>` with the unique identifier of your cluster. The
   default value is `vmo-golden-images`.

   ```bash
   kubectl get pack virtual-machine-orchestrator \
     --namespace cluster-<cluster-uid> \
     --output jsonpath='{.spec.packRef.values}' | grep --after-context=1 goldenImagesNamespace
   ```

### Stamp the Helm Ownership Metadata

The following procedures add the missing Helm ownership metadata to the RBAC objects that the pack templates. Refer to
[RBAC Objects This Procedure Modifies](#rbac-objects-this-procedure-modifies) for the complete list. Both procedures
perform the same work, so choose the one that fits your environment.

- **Kubernetes Job** - Runs inside the cluster. Use this option unless the `default` namespace enforces `restricted`
  PodSecurity.

- **Bash script** - Runs from a workstation that has `kubectl` access to the cluster. Use this option when PodSecurity
  blocks the Job.

Both are idempotent, so you can run either one as many times as you need. Objects that already carry the correct
metadata remain unchanged, objects that exist without the metadata receive it while their existing labels and
annotations are preserved, and objects that do not exist yet are skipped. Helm creates those during the upgrade. No
rules, subjects, or role references are modified.

:::info

The `RESOURCES` list in the Job and the script contains the eight objects that Spectro Cloud tested this procedure
against. If your environment includes additional custom Roles, RoleBindings, ClusterRoles, or ClusterRoleBindings that
must come under Helm management, add them to the `RESOURCES` list. Each entry uses the format `Kind:Namespace:Name`.
Leave the namespace field empty for cluster-scoped objects, such as `ClusterRole::vmo-manager`.

:::

<Tabs groupId="method">

<TabItem label="Kubernetes Job" value="job">

1. Save the following manifest as `stamp-vmo-rbac-job.yaml`. If your release uses non-default names, edit the three
   `env` values to match the values you found in [Find Your Release Values](#find-your-release-values).

   ```yaml
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: vmo-rbac-adopt
     namespace: default
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: vmo-rbac-adopt
   rules:
     - apiGroups: ["rbac.authorization.k8s.io"]
       resources: ["roles", "rolebindings", "clusterroles", "clusterrolebindings"]
       verbs: ["get", "patch"]
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: vmo-rbac-adopt
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: vmo-rbac-adopt
   subjects:
     - kind: ServiceAccount
       name: vmo-rbac-adopt
       namespace: default
   ---
   apiVersion: batch/v1
   kind: Job
   metadata:
     name: vmo-rbac-adopt
     namespace: default
   spec:
     backoffLimit: 2
     ttlSecondsAfterFinished: 3600
     template:
       spec:
         serviceAccountName: vmo-rbac-adopt
         restartPolicy: OnFailure
         containers:
           - name: adopt
             image: us-docker.pkg.dev/palette-images/third-party/spectro-kubectl:1.36.2-spectro-4.9.c
             imagePullPolicy: IfNotPresent
             env:
               - name: RELEASE_NAME
                 value: "virtual-machine-orche-virtual-machine-orche"
               - name: RELEASE_NS
                 value: "vm-dashboard"
               - name: GOLDEN_IMAGES_NAMESPACE
                 value: "vmo-golden-images"
             command:
               - /bin/sh
               - -c
               - |
                 set -o nounset
                 kctl() {
                   n=0
                   while [ "$n" -lt 3 ]; do
                     if out=$(kubectl "$@"); then
                       printf '%s' "$out"
                       return 0
                     fi
                     n=$((n + 1))
                     sleep 2
                   done
                   return 1
                 }
                 RESOURCES=$(cat <<EOF
                 ClusterRole::vmo-manager
                 ClusterRole::vmo-manager-node-agent
                 ClusterRoleBinding::vmo-manager
                 ClusterRoleBinding::vmo-manager-node-agent
                 Role:default:vmo-cdi-clone-source
                 Role:$GOLDEN_IMAGES_NAMESPACE:vmo-cdi-clone-source
                 RoleBinding:default:vmo-cdi-clone-source
                 RoleBinding:$GOLDEN_IMAGES_NAMESPACE:vmo-cdi-clone-source
                 EOF
                 )
                 echo "Stamping Helm ownership for release $RELEASE_NS/$RELEASE_NAME"
                 echo
                 echo "$RESOURCES" | sed 's/^[[:space:]]*//' | while IFS=: read -r kind ns name; do
                   [ -z "$kind" ] && continue
                   if [ -n "$ns" ]; then ns_flag="--namespace $ns"; target="$kind $ns/$name"
                   else ns_flag=""; target="$kind $name"; fi
                   echo "  -> $target"
                   kctl $ns_flag annotate "$kind" "$name" \
                     "meta.helm.sh/release-name=$RELEASE_NAME" \
                     "meta.helm.sh/release-namespace=$RELEASE_NS" \
                     --overwrite >/dev/null \
                     || echo "     annotate skipped (missing or unreachable)"
                   kctl $ns_flag label "$kind" "$name" \
                     "app.kubernetes.io/managed-by=Helm" \
                     --overwrite >/dev/null \
                     || echo "     label skipped (missing or unreachable)"
                 done
                 echo
                 echo "Done."
             securityContext:
               runAsNonRoot: false
               allowPrivilegeEscalation: false
               capabilities:
                 drop:
                   - ALL
               seccompProfile:
                 type: RuntimeDefault
   ```

   :::warning

   On clusters where the `default` namespace enforces `restricted` PodSecurity, which applies to Kubernetes version 1.25
   and later, this Pod is blocked and the Job remains in a `Pending` state. Either use the Bash script instead, or set
   `runAsNonRoot` to `true` and add `runAsUser: 65532` to the `securityContext`. The `spectro-kubectl` image runs
   `kubectl` as a non-root user.

   :::

2. Apply the manifest and wait for the Job to complete.

   ```bash
   kubectl apply --filename stamp-vmo-rbac-job.yaml
   kubectl wait --namespace default --for=condition=complete --timeout=120s job/vmo-rbac-adopt
   ```

3. Review the Job logs.

   ```bash
   kubectl logs --namespace default job/vmo-rbac-adopt
   ```

   The output contains one line per resource and ends with `Done.`. Resources that do not exist yet display
   `annotate skipped (missing or unreachable)` or `label skipped (missing or unreachable)`. This outcome is expected.

4. Remove the Job after the upgrade succeeds.

   ```bash
   kubectl delete --filename stamp-vmo-rbac-job.yaml
   ```

</TabItem>

<TabItem label="Bash Script" value="script">

1. Save the following script as `stamp-vmo-rbac.sh`.

   ```shell
   #!/usr/bin/env bash
   set -o nounset

   RELEASE_NAME="${1:-virtual-machine-orche-virtual-machine-orche}"
   RELEASE_NS="${2:-vm-dashboard}"
   GOLDEN_IMAGES_NAMESPACE="${3:-vmo-golden-images}"

   kctl() {
     local n=0 out=""
     while [ "$n" -lt 3 ]; do
       if out=$(kubectl "$@"); then
         printf '%s' "$out"
         return 0
       fi
       n=$((n + 1))
       sleep 2
     done
     return 1
   }

   RESOURCES=$(cat <<EOF
   ClusterRole::vmo-manager
   ClusterRole::vmo-manager-node-agent
   ClusterRoleBinding::vmo-manager
   ClusterRoleBinding::vmo-manager-node-agent
   Role:default:vmo-cdi-clone-source
   Role:${GOLDEN_IMAGES_NAMESPACE}:vmo-cdi-clone-source
   RoleBinding:default:vmo-cdi-clone-source
   RoleBinding:${GOLDEN_IMAGES_NAMESPACE}:vmo-cdi-clone-source
   EOF
   )

   echo "Stamping Helm ownership for release ${RELEASE_NS}/${RELEASE_NAME}"
   echo

   echo "$RESOURCES" | while IFS=: read -r kind ns name; do
     [ -z "$kind" ] && continue
     if [ -n "$ns" ]; then ns_flag="--namespace $ns"; target="$kind $ns/$name"
     else ns_flag=""; target="$kind $name"; fi
     echo "  -> $target"
     kctl $ns_flag annotate "$kind" "$name" \
       "meta.helm.sh/release-name=$RELEASE_NAME" \
       "meta.helm.sh/release-namespace=$RELEASE_NS" \
       --overwrite >/dev/null \
       || echo "     annotate skipped (missing or unreachable)"
     kctl $ns_flag label "$kind" "$name" \
       "app.kubernetes.io/managed-by=Helm" \
       --overwrite >/dev/null \
       || echo "     label skipped (missing or unreachable)"
   done

   echo
   echo "Done."
   ```

2. Make the script executable.

   ```bash
   chmod +x stamp-vmo-rbac.sh
   ```

3. Run the script. If your release uses non-default names, pass them as positional arguments in the order release name,
   release namespace, and golden images namespace.

   ```bash
   ./stamp-vmo-rbac.sh
   ```

   ```bash
   ./stamp-vmo-rbac.sh <release-name> <release-namespace> <golden-images-namespace>
   ```

   The output contains one line per resource and ends with `Done.`. Resources that do not exist yet display
   `annotate skipped (missing or unreachable)` or `label skipped (missing or unreachable)`. This outcome is expected.

</TabItem>

</Tabs>

### Validate the Metadata

1. Confirm that the object named in the original error now carries the Helm ownership metadata. The following example
   uses the `vmo-cdi-clone-source` Role in the `default` namespace. If your error named a different object, substitute
   its kind, namespace, and name.

   ```bash
   kubectl get role vmo-cdi-clone-source --namespace default \
     --output jsonpath='{"managed-by:   "}{.metadata.labels.app\.kubernetes\.io/managed-by}{"\nrelease-name: "}{.metadata.annotations.meta\.helm\.sh/release-name}{"\nrelease-ns:   "}{.metadata.annotations.meta\.helm\.sh/release-namespace}{"\n"}'
   ```

   ```text hideClipboard title="Example Output"
   managed-by:   Helm
   release-name: virtual-machine-orche-virtual-machine-orche
   release-ns:   vm-dashboard
   ```

2. If every resource reports `skipped (missing or unreachable)`, including `Role default/vmo-cdi-clone-source`, then
   either the cluster carries no legacy state, in which case the upgrade already works and you can retry it, or your
   `kubectl` session cannot reach the API server. Check your kubeconfig file and network path.

### Trigger the Upgrade

1. Trigger the VMO pack upgrade from Palette. Refer to
   [Update a Cluster](../../clusters/cluster-management/cluster-updates.md) for guidance.

2. Confirm that the pack reconciles without the `invalid ownership metadata` error. The pack transitions through the
   reconcile cycle before it reports a healthy status.

If the upgrade fails again with the same error, compare the release name and namespace you used against the output of
`helm list --all-namespaces` and run the procedure again with the corrected values. If the upgrade fails with the same
form of error but names an object that you have not added to the `RESOURCES` list, add that object to the list, run the
procedure again, and retry the upgrade. If the error persists, contact
[Spectro Cloud support](https://support.spectrocloud.io/) and provide the full `ReconcileError` message, the Job or
script output, and the output of `helm list --all-namespaces` filtered to your VMO release.

### RBAC Objects This Procedure Modifies

The Job and the script apply the label `app.kubernetes.io/managed-by: Helm` and the annotations
`meta.helm.sh/release-name` and `meta.helm.sh/release-namespace` to the following eight objects.

| **Kind**           | **Namespace**           | **Name**                 |
| ------------------ | ----------------------- | ------------------------ |
| ClusterRole        | Cluster-scoped          | `vmo-manager`            |
| ClusterRole        | Cluster-scoped          | `vmo-manager-node-agent` |
| ClusterRoleBinding | Cluster-scoped          | `vmo-manager`            |
| ClusterRoleBinding | Cluster-scoped          | `vmo-manager-node-agent` |
| Role               | `default`               | `vmo-cdi-clone-source`   |
| Role               | Golden images namespace | `vmo-cdi-clone-source`   |
| RoleBinding        | `default`               | `vmo-cdi-clone-source`   |
| RoleBinding        | Golden images namespace | `vmo-cdi-clone-source`   |

<!-- vale on -->
