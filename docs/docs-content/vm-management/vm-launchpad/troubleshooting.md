---
sidebar_label: "Troubleshooting"
title: "Troubleshooting VM Launchpad"
description: "Troubleshooting steps for common PaletteAI VM Launchpad scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm launchpad", "troubleshooting"]
---

This page provides troubleshooting guidance for common scenarios you may encounter when using the
[PaletteAI VM Launchpad](./vm-launchpad.md).

## Scenario - Keycloak, VMO, and Headlamp Consoles Become Inaccessible on Piraeus Storage

On appliances that use Piraeus storage, network disruptions can cause the DRBD replicas that back the Keycloak
PostgreSQL database to lose their connection. When this happens, the Keycloak login page hangs, and because the Virtual
Machine Orchestrator and Headlamp consoles authenticate through Keycloak, they also become inaccessible, even though the
Keycloak and PostgreSQL pods report a `Ready` status.

This occurs because the DRBD resource path is missing or uses different network interfaces on its peer nodes, which
suspends database I/O. Use the following steps to restore the connection manually.

VM Launchpad ships two Piraeus storage variants, and some values in this scenario differ between them. Select your
variant in the tabs throughout the procedure. The FIPS profile stores PostgreSQL data in a `pgdata-postgres-0` volume,
while the non-FIPS CloudNativePG profile uses a `keycloak-db-*` volume.

### Prerequisites

- You have `kubectl` access to the affected VM Launchpad cluster. From the cluster **Overview** tab, download the
  [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) file, and then set the `KUBECONFIG` environment variable
  to point to it.

- Run every command in this scenario from the same terminal session. The steps set environment variables, such as `NS`,
  `RESOURCE`, `NODE_A`, and `NODE_B`, that later steps reuse.

### Identify the LINSTOR Resource

Find the PostgreSQL data PVC, resolve it to its LINSTOR resource, and confirm that at least one replica reports an
`UpToDate` state. If no replica is `UpToDate`, investigate replica health instead of changing the path.

1. Set the namespace that hosts Keycloak.

   ```bash
   NS=keycloak
   ```

2. List the persistent volume claims in the namespace.

   ```bash
   kubectl --namespace "$NS" get pvc
   ```

3. Assign the PostgreSQL data PVC to a variable, based on your storage variant.

   <Tabs groupId="piraeus-profile">

   <TabItem value="fips" label="FIPS">

   ```bash
   PVC=pgdata-postgres-0
   ```

   </TabItem>

   <TabItem value="non-fips" label="Non-FIPS (CloudNativePG)">

   Replace `<postgres-data-pvc>` with the `keycloak-db-*` claim name from the previous step.

   ```bash
   PVC=<postgres-data-pvc>
   ```

   </TabItem>

   </Tabs>

4. Resolve the claim to its persistent volume.

   ```bash
   PV=$(kubectl --namespace "$NS" get pvc "$PVC" --output jsonpath='{.spec.volumeName}')
   ```

5. Resolve the persistent volume to its LINSTOR resource.

   ```bash
   RESOURCE=$(kubectl get pv "$PV" --output jsonpath='{.spec.csi.volumeHandle}')
   ```

6. List the LINSTOR resource and confirm that at least one replica reports an `UpToDate` state.

   ```bash
   kubectl --namespace piraeus-system exec deploy/linstor-controller -- \
     linstor resource list --resources "$RESOURCE"
   ```

7. List the resource connections, grouped by source and target.

   ```bash
   kubectl --namespace piraeus-system exec deploy/linstor-controller -- \
     linstor resource-connection list "$RESOURCE" --groupby source target properties port
   ```

### Inspect the DRBD Connection Paths

List every declared connection path and its interface, then inspect the interfaces on each source and target node pair.

1. List every connection path and its interface.

   ```bash
   kubectl get linstornodeconnection \
     --output go-template='{{printf "PATH_NAME\tINTERFACE\n"}}{{range .items}}{{range .spec.paths}}{{printf "%s\t%s\n" .name .interface}}{{end}}{{end}}'
   ```

2. Assign the path name, interface, and node names to variables. Replace `<path-name>` with the connection path,
   `<interface>` with the DRBD interface, and `<source-node>` and `<target-node>` with the peer node names from the
   previous step.

   ```bash
   PATH_NAME=<path-name>
   DRBD_IF=<interface>
   NODE_A=<source-node>
   NODE_B=<target-node>
   ```

3. Inspect the interfaces on the source node.

   ```bash
   kubectl --namespace piraeus-system exec deploy/linstor-controller -- linstor node interface list "$NODE_A"
   ```

4. Inspect the interfaces on the target node.

   ```bash
   kubectl --namespace piraeus-system exec deploy/linstor-controller -- linstor node interface list "$NODE_B"
   ```

5. List the existing connection path for the node pair.

   ```bash
   kubectl --namespace piraeus-system exec deploy/linstor-controller -- \
     linstor resource-connection path list "$NODE_A" "$NODE_B" "$RESOURCE"
   ```

### Restore the Connection Path

If either node is missing the DRBD interface, inspect the `piraeus-netiface-builder` DaemonSet. To change the storage
node interface, update the `csi.storageNodeInterface` variable in the `piraeus-operator` pack in your cluster profile,
and then redeploy the pack. Otherwise, create or correct each declared path. You can safely rerun the command for the
same path name.

```bash
kubectl --namespace piraeus-system exec deploy/linstor-controller -- \
  linstor resource-connection path create "$NODE_A" "$NODE_B" "$RESOURCE" "$PATH_NAME" "$DRBD_IF" "$DRBD_IF"
```

### Verify PostgreSQL

After you restore the path, confirm that the connection recovers and that the database serves requests. A `pg_isready`
check only confirms that the database accepts connections, so run an actual query instead.

1. Confirm that every connection for the resource reports an `Ok` state.

   ```bash
   kubectl --namespace piraeus-system exec deploy/linstor-controller -- \
     linstor resource-connection list "$RESOURCE"
   ```

2. List the PostgreSQL pods.

   ```bash
   kubectl --namespace "$NS" get pods
   ```

3. Set the database pod and credential values for your storage variant.

   <Tabs groupId="piraeus-profile">

   <TabItem value="fips" label="FIPS">

   ```bash
   DB_POD=postgres-0
   DB_SECRET=keycloak-db-credentials
   DB_SECRET_KEY=POSTGRES_PASSWORD
   ```

   </TabItem>

   <TabItem value="non-fips" label="Non-FIPS (CloudNativePG)">

   ```bash
   DB_POD=$(kubectl --namespace "$NS" get pod --selector cnpg.io/instanceRole=primary \
     --output jsonpath='{.items[0].metadata.name}')
   DB_SECRET=keycloak-db-app
   DB_SECRET_KEY=password
   ```

   </TabItem>

   </Tabs>

4. Retrieve the password and run the query. Piping the password into the pod over standard input keeps it out of your
   shell history and the command arguments. Connecting with `--host` uses TCP and password authentication, so the
   command is the same for both variants.

   ```bash
   kubectl --namespace "$NS" get secret "$DB_SECRET" \
     --output jsonpath="{.data.$DB_SECRET_KEY}" | base64 --decode | \
     kubectl --namespace "$NS" exec --stdin "$DB_POD" --container postgres -- \
     sh -c 'PGCONNECT_TIMEOUT=5 PGPASSWORD="$(cat)" \
       psql --host 127.0.0.1 --username keycloak --dbname keycloak --tuples-only --no-align \
       --command "SET statement_timeout=5000; SELECT 1"'
   ```

## Scenario - Federated LDAP Users Cannot Access VM Launchpad

Federated LDAP users sign in to Keycloak successfully, but they have no access once they reach VM Launchpad. The
following symptoms indicate this scenario.

- The user authenticates against Keycloak and the browser redirects back to VM Launchpad, but no resources are
  available.

- Assigning a VMO role to the user appears to succeed, but the role grants no permissions.

- Requests to the Kubernetes API made with the user's credentials are rejected as unauthenticated.

- On the **Settings** > **Access Management** > **Users** page, the **Email** column is empty for the account.

This occurs because the Kubernetes API server in a VM Launchpad cluster runs with `--oidc-username-claim=email`. Tokens
must carry an `email` claim and `email_verified: true`. LDAP directories frequently leave the `mail` attribute empty, so
Keycloak imports the account without an address and issues a token that the API server cannot map to a username.

### Confirm the Missing Email Claim

1. Log in to the Keycloak admin console as an administrator and select your realm.

2. From the left main menu, select **Users**, and then select the affected account.

3. Check the **Email** field and the **Email verified** toggle.

   - If **Email** is empty, the LDAP attribute that you mapped to `email` is not populated for this account.

   - If **Email** is populated but **Email verified** is disabled, the LDAP provider does not trust addresses from the
     directory.

4. Resolve both conditions by mapping an email-formatted LDAP attribute, such as `userPrincipalName`, and enabling
   **Trust Email** on the LDAP provider. Refer to
   [Federate LDAP Users with Keycloak](./access-management/ldap-federation.md) for the full procedure.

5. Run a new synchronization from the LDAP provider so that the mapper applies to accounts that Keycloak already
   imported. A synchronization does not set **Email verified** on accounts that already exist, so correct those accounts
   separately. Refer to
   [Correct Previously Imported Accounts](./access-management/ldap-federation.md#correct-previously-imported-accounts).

6. Ask the affected users to sign out and sign in again. Tokens issued before the change do not carry the new claims.

## Scenario - VM Migration Fails During Guest Conversion on Block-Based Storage

When you use the [VM Migration Assistant](../vm-migration-assistant/vm-migration-assistant.md) to migrate VMs to a VMO
cluster backed by a block-based Container Storage Interface (CSI), such as the LINSTOR/DRBD storage used by the VM
Launchpad, migrations can fail during the guest conversion (`ConvertGuest`) phase. The migration plan reports only a
generic message. The following text is an example of the message.

```text
error: { phase: "ConvertGuest", reasons: ["Guest conversion failed. See pod logs for details."] }
```

This occurs because the destination volumes are provisioned in `Block` volume mode. During conversion, `virt-v2v` serves
the raw block device through `nbdkit`, which probes the device's minimum block size. When the underlying storage reports
a block size outside the range that `nbdkit` accepts, the conversion fails. Linux guests (for example, Ubuntu) are most
commonly affected, while Windows guests may still succeed.

Use the following steps to confirm the cause and apply a workaround.

### Debug Steps

1. [Access the VM Migration Assistant service console](../vm-migration-assistant/create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console)
   and confirm that the affected VMs failed at the **ConvertGuest** phase.

2. Connect to your host cluster using [kubectl](https://kubernetes.io/docs/tasks/tools/). Follow the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide to obtain access.

3. Inspect the logs of the guest conversion pod for the failed migration plan. The conversion pods run in the migration
   namespace and are named after the plan and VM, for example `plan-01-vm-*`.

   ```bash
   kubectl logs --namespace <migration-namespace> <conversion-pod-name>
   ```

4. Confirm the failure signature. Logs that contain the following lines indicate that `nbdkit` is operating on a block
   device whose minimum block size it cannot handle.

   ```text
   nbdkit: file[1]: debug: extents disabled: lseek: SEEK_HOLE: Invalid argument
   nbdkit: file[1]: error: plugin must set minimum block size between 1 and 64K
   ```

5. Route the migration to a `Filesystem`-mode storage class to work around the issue. Create a storage class that uses
   the same provisioner and parameters as your default storage class, and patch its
   [StorageProfile](https://kubevirt.io/user-guide/storage/containerized_data_importer/#storageprofile) to force
   `Filesystem` volume mode.

   ```yaml
   spec:
     claimPropertySets:
       - accessModes: ["ReadWriteOnce"]
         volumeMode: Filesystem
   ```

6. Recreate the migration plan and, in the **Storage map** step, map the source storage to the new `Filesystem`-mode
   storage class. Ensure the storage map specifies `accessMode: ReadWriteOnce` and `volumeMode: Filesystem`. Refer to
   [Create Migration Plans](../vm-migration-assistant/create-migration-plans.md) for guidance, then start the plan
   again.

   :::warning

   This workaround is temporary. On block-based storage such as LINSTOR/DRBD, `Filesystem` mode is `ReadWriteOnce`
   (`RWO`) only. VMs migrated this way **cannot be live-migrated**, because KubeVirt live migration requires
   `ReadWriteMany` (`RWX`), which is only available in `Block` mode on this storage. To restore live migration, apply
   the permanent fix described in the next section.

   :::

### Restore Live Migration with Updated Guest Conversion Image

The workaround in the previous section unblocks migrations by using `Filesystem` volume mode, but it disables live
migration for the migrated VMs. To restore live migration, load an updated `forklift-virt-v2v` content bundle into the
cluster's Zot registry. The updated image contains a newer `nbdkit` that handles the block-size constraints reported by
block-based storage such as LINSTOR/DRBD.

1. Contact your Spectro Cloud support representative to obtain the updated `forklift-virt-v2v` content bundle. The
   bundle replaces the existing image at the following reference.

   ```text
   us-docker.pkg.dev/palette-images/third-party/vm-migration-assistant/forklift-virt-v2v:4.9.2
   ```

2. Remove the existing `forklift-virt-v2v` image from the cluster's Zot registry so that the new image can be uploaded
   in its place. Your Spectro Cloud support representative can guide you through this step for your environment.

3. Upload the updated content bundle to the cluster. Use either the
   [Local UI upload flow](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md#upload-bundle) or the
   [Palette CLI](../../automation/palette-cli/commands/content.md#upload).

4. Recreate the failed migration plan. In the **Storage map** step, map the source storage to your default `Block`-mode
   storage class and remove the `Filesystem`/`ReadWriteOnce` overrides that were added as part of the workaround. Refer
   to [Create Migration Plans](../vm-migration-assistant/create-migration-plans.md) for guidance.

5. Start the migration plan. Confirm that guest conversion completes without the `nbdkit` block-size error, and that the
   migrated VMs support live migration on the destination storage.
