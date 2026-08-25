---
sidebar_label: "Configure External OIDC"
title: "Configure External OIDC"
description:
  "Learn how to configure a third-party OIDC identity provider, such as Okta, for the Virtual Machine Orchestrator pack."
icon: " "
hide_table_of_contents: false
sidebar_position: 24
tags: ["vmo", "vmo pack", "oidc"]
---

The Virtual Machine Orchestrator (VMO) pack can authenticate users against a third-party OpenID Connect (OIDC) identity
provider (IdP) instead of using Palette-managed OIDC. Use this configuration when you want VMO to authenticate against
your own IdP, or against a different application than the one Palette uses.

This page uses [Okta](https://www.okta.com) as the example IdP. The same steps apply to any OIDC-compliant IdP, such as
Microsoft Entra ID or Google, with the IdP-specific console labels changed accordingly.

A Single Sign-On (SSO) sign-in to VMO follows this sequence.

1. The user opens the VMO UI in a browser.

2. VMO redirects the browser to the IdP for authentication.

3. The IdP returns an ID token to the VMO callback endpoint.

4. VMO stores the session and passes the ID token as the `Authorization: Bearer` header on subsequent requests to the
   Kubernetes API server.

5. The Kubernetes API server validates the ID token against the IdP and applies RBAC based on the username and groups
   claims.

Because the Kubernetes API server validates the token, the OIDC settings in the pack must match the OIDC flags that the
API server was started with.

:::info

VMO also supports API key sessions for automation. API key tokens cannot be validated by the Kubernetes API server, so
these requests use the VMO service account token together with impersonation headers that reconstruct the identity of
the user who created the key. This is why the `oidc.k8sUsernamePrefix` and `oidc.k8sGroupPrefix` parameters must mirror
the API server flags.

:::

## Prerequisites

- A cluster provisioned through Palette with the VMO pack in an add-on cluster profile. Refer to
  [Create a VMO Profile](./create-vmo-profile.md) for guidance.

- Administrator access to your IdP, so that you can create or modify the OIDC application registration that represents
  VMO. This registration is what tells the IdP how to handle sign-in requests that arrive from VMO.

- Cluster admin access through a [kubeconfig](../../clusters/cluster-management/kubeconfig.md) file, so that you can
  create cluster role bindings.

- The Kubernetes API server must be configured with OIDC flags that match your IdP application. Issue the following
  command to confirm the flags in use.

  ```shell
  kubectl --namespace kube-system get pod --selector component=kube-apiserver \
    --output jsonpath='{.items[0].spec.containers[0].command}' | tr ',' '\n' | grep -- --oidc
  ```

  ```text hideClipboard title="Example output"
  --oidc-issuer-url=https://<your-okta-domain>
  --oidc-client-id=<your-client-id>
  --oidc-username-claim=email
  --oidc-groups-claim=groups
  ```

  If the output also contains `--oidc-username-prefix` or `--oidc-groups-prefix`, make a note of those values. You must
  mirror them in the pack so that API key impersonation constructs identities with matching prefixes.

## Configure the IdP Application

You can reuse the same OIDC application that the cluster's Kubernetes layer uses, or register a separate one for VMO.

The following steps use Okta console labels. Every setting has an equivalent in any OIDC-compliant IdP, though the field
names differ.

1. Log in to your IdP administration console.

2. Open the OIDC application that represents VMO, or create a new one.

3. Set the application type to **Web**, and enable both the **Authorization Code** and **Refresh Token** grant types.

   Without the **Refresh Token** grant type, users are prompted to sign in again when the access token expires.

4. Add the VMO callback URL to the **Sign-in redirect URIs** field. The callback URL is `<baseUrl>/auth/callback`, where
   `<baseUrl>` is the public URL that users reach the VMO UI at. For example, `https://vmo.example.com/auth/callback`.

   When VMO is reached through the Palette tenant apps proxy, the base URL includes the tenant app path prefix. Enter
   the exact URL that appears in the browser address bar at sign-in time.

5. Assign the users and groups that need access to VMO to the application.

6. Configure the groups claim so that the IdP includes group memberships in the ID token. In Okta, open your application
   and select **Sign On** > **OpenID Connect ID Token** > **Edit**. Then set the following fields.

   | **Field**             | **Value**                                                                                             |
   | --------------------- | ----------------------------------------------------------------------------------------------------- |
   | **Groups claim type** | `Filter`                                                                                              |
   | **Groups claim name** | `groups`, which must match the Kubernetes API server `--oidc-groups-claim` flag                       |
   | **Filter**            | **Matches regex** with a pattern that covers the groups you want to grant access to, such as `vmo-.*` |

7. Save the application configuration.

   New sign-ins include the groups claim. Users with an existing session must sign out and sign in again.

:::warning

Okta limits the number of groups included in a claim, with a default of 100. A broad filter combined with a user who
belongs to many groups can produce a truncated claim. Keep the filter narrow enough that the groups you use for RBAC are
always included.

:::

The groups claim is derived from the user's actual group memberships, not from application assignments. A user must
belong to a group whose name matches the filter for that group to appear in the token.

## Configure the VMO Pack

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**, and select your VMO add-on cluster profile.

3. Select the **Virtual Machine Orchestrator** layer.

4. In the **Presets** panel, locate the **Alternative Authentication** group and select **External OIDC**.

   This sets `oidc.enabled` to `true`, sets `palette.managedOidc` to `false`, and turns local authentication off. Refer
   to [Authentication Options](./authentication-options.md#external-oidc) for the complete list of values applied.

5. Select **Values** and enter the parameters that are specific to your IdP.

   ```yaml
   charts:
     virtual-machine-orchestrator:
       vmo-manager:
         palette:
           enabled: true
           managedOidc: false
         oidc:
           enabled: true
           issuerUrl: "https://<your-okta-domain>"
           clientId: "<your-client-id>"
           clientSecret: "<your-client-secret>"
           # Optional. Defaults to "openid,profile,email,groups". The groups scope
           # is always requested, so removing it from this list has no effect.
           scopes: ""
           # Optional. Set only when the UI is behind a proxy and the default
           # <baseUrl>/auth/callback is not reachable.
           callbackUrl: ""
           # Set to match the API server --oidc-username-prefix flag, such as "oidc:".
           k8sUsernamePrefix: ""
           # Set to match the API server --oidc-groups-prefix flag.
           k8sGroupPrefix: ""
         platform:
           baseUrl: "https://<the-url-users-reach-vmo-at>"
         features:
           localAuth:
             # The External OIDC option turns local authentication off. Set this
             # back to true to keep a Day 0 local admin account as a fallback.
             enabled: true
             adminUsername: "admin"
             adminPassword: "{{ .spectro.var.LOCAL_ADMIN_PASSWORD }}"
   ```

   The pack renders `oidc.clientSecret` into a Kubernetes Secret rather than a ConfigMap.

6. Add a `LOCAL_ADMIN_PASSWORD` variable to the profile and set it to a strong password. Together with
   `features.localAuth.enabled`, this seeds a Day 0 local admin account that you use to verify the deployment before
   OIDC users are mapped to roles. Refer to
   [Define Cluster Profile Variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
   for guidance.

7. Select **Confirm Updates**, and then **Save Changes**.

8. Apply the profile to your cluster and wait for the cluster to report a **Healthy** status.

### Use an Existing Secret

Instead of entering the client secret in the pack values, you can pre-create a Kubernetes Secret and reference it. The
Secret must contain the `OIDC_CLIENT_SECRET` and `SESSION_KEY` keys. The `SESSION_KEY` value must be at least 32
characters. VMO Manager fails to start if the value is shorter.

```yaml
charts:
  virtual-machine-orchestrator:
    vmo-manager:
      secrets:
        create: false
      existingSecret: "vmo-manager-oidc"
```

## Grant Access to Groups

Two authorization layers govern VMO access, and both must recognize the user's IdP group for a session to reach every
part of the product.

- **VMO IAM roles** control what the UI and API expose to the session, such as which pages are visible and which VMO
  actions the session can invoke. Four built-in roles (Platform Admin, Editor, Operator, Viewer) map to fine-grained VMO
  permissions. VMO Manager checks every request against this layer first.
- **Kubernetes RBAC** controls the writes VMO issues to the Kubernetes API server on the user's behalf, along with any
  direct `kubectl` access the user makes. Four `spectro-vm-*` cluster roles cover the common access patterns.

The two layers are complementary, not redundant. VMO IAM decides what the UI exposes. Kubernetes RBAC decides what the
API server accepts. Cluster-wide Settings pages require both layers to recognize the user's group. Refer to
[VM User Roles and Permissions](../rbac/vm-roles-permissions.md) for the full role catalog and permission list.

### VMO IAM Roles

VMO Manager seeds four group mappings when the pack starts. If your IdP group name exactly matches one of the following,
users in that group receive the matching VMO role automatically without further configuration.

| **IdP group name** | **VMO role**   | **What the user can do**                                                                                                                                                                                                         |
| ------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cluster-admins`   | Platform Admin | Full platform control. Every VMO permission, including Users, Groups, Settings, Infrastructure CRUD, and all VM, template, network, storage, namespace, and package operations.                                                  |
| `vmo-editors`      | Editor         | VM workflows and Image Catalog. VM create, update, delete, operate, and snapshot. Templates and packages read and write. Network, storage, and namespace read for the create-VM wizard. No infrastructure write and no Settings. |
| `vmo-operators`    | Operator       | Day-to-day VM operations. VM read, operate, snapshot, and restore. Templates, dashboards, audit, and system or monitoring read. No writes.                                                                                       |
| `cluster-viewers`  | Viewer         | Read-only. VM, template, dashboard, audit, and system or monitoring reads only. No operate, no snapshot, no writes.                                                                                                              |

If your IdP group is named something other than the four above, users in it do not receive a VMO role by default. Extend
the matching `VMORole` custom resource to include your group name.

```shell
kubectl --namespace vm-dashboard edit vmorole vmo-platform-admin
```

Under `spec`, add your IdP group name to the `groupMappings` list.

```yaml
spec:
  groupMappings:
    - cluster-admins # keep the default
    - platform-team # your IdP group name
```

Save the change. The user must sign out and sign in again for the new mapping to take effect.

Per-user mapping is also supported when a group is unavailable or too broad. Set `userMappings` instead of
`groupMappings`, and provide the value that appears in the token's `email`, `sub`, or `preferred_username` claim.

### Kubernetes RBAC

VMO Manager also creates four Kubernetes cluster roles when it starts. Bind these roles to your IdP groups with standard
`ClusterRoleBinding` resources. The group names must match exactly what the IdP emits in the groups claim, including any
prefix that the API server was started with.

1. Open a terminal and set the `KUBECONFIG` environment variable to point at your cluster's kubeconfig file.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

2. Create a manifest that maps your groups to the VMO cluster roles. The following example assumes that the API server
   does not use `--oidc-groups-prefix`.

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: vmo-admins
   subjects:
     - kind: Group
       apiGroup: rbac.authorization.k8s.io
       name: vmo-admins
   roleRef:
     kind: ClusterRole
     name: spectro-vm-admin
     apiGroup: rbac.authorization.k8s.io
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: vmo-operators
   subjects:
     - kind: Group
       apiGroup: rbac.authorization.k8s.io
       name: vmo-operators
   roleRef:
     kind: ClusterRole
     name: spectro-vm-power-user
     apiGroup: rbac.authorization.k8s.io
   ```

   If the API server uses `--oidc-groups-prefix=oidc:`, the subject name becomes `oidc:vmo-admins`, and you must set
   `oidc.k8sGroupPrefix` in the pack to `oidc:` so that API key impersonation reconstructs the same identity.

3. Apply the manifest.

   ```shell
   kubectl apply --filename <your-manifest-file>.yaml
   ```

:::tip

To keep these bindings in place when a cluster is rebuilt, add them as a manifest layer in the cluster profile alongside
the VMO pack. Refer to
[Create a Manifest Add-on Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md)
for guidance.

:::

:::info

For cluster-wide Settings pages to work, both authorization layers must recognize the same group name. Choosing an IdP
group name that lines up with the [VMO IAM seeded defaults](#vmo-iam-roles) (such as `cluster-admins` for administrators
or `vmo-editors` for editors) means a single group grants both the VMO role from the seeded mapping and the Kubernetes
RBAC from the `ClusterRoleBinding` above. For a custom name, add it to both the `VMORole` `groupMappings` list and the
`ClusterRoleBinding` subject.

:::

## Bootstrap Order

The **External OIDC** option turns local authentication off, which means a misconfigured issuer URL or an unreachable
IdP leaves no way to sign in. Use the following order when you bring up a new cluster with a third-party IdP, so that
you always have a way in.

1. Deploy the pack with `features.localAuth.enabled` set to `true` and `LOCAL_ADMIN_PASSWORD` set to a strong value.
   This overrides the value that the **External OIDC** option applies.

2. Wait for the VMO Manager pod to report a `Ready` status.

3. Sign in with the local admin account at the `/local-login` path and confirm that the UI is reachable. VMO requires a
   password change on first sign-in.

4. Apply the cluster role bindings that map your IdP groups to the VMO cluster roles.

5. Sign out of the local account, and sign in through your IdP with a user who belongs to one of the bound groups.

6. Confirm that the user has the expected permissions.

Keep `features.localAuth.enabled` set to `true` afterward if you want a recovery path. Local authentication is a
separate path from OIDC, so an IdP outage cannot lock you out of the cluster.

:::warning

Local sessions authenticate to the Kubernetes API with the VMO Manager service account token rather than with a
user-scoped token, so the per-user Kubernetes RBAC described on this page does not apply to a local admin. If you keep
local authentication on, treat the local admin password as a cluster-admin credential.

:::

## Validate

### Validate the Sign-in Flow

1. Open the VMO UI in a new private browsing session.

2. Confirm that the browser is redirected to your IdP.

3. Sign in, and confirm that the browser returns to the VMO UI with an established session.

### Validate the Groups Claim

The Kubernetes API server records the authenticated identity in its audit log for every request. Use the audit log to
confirm that group memberships reach the API server.

1. Identify the node that runs the API server.

   ```shell
   kubectl --namespace kube-system get pod --selector component=kube-apiserver \
     --output jsonpath='{.items[0].spec.nodeName}'
   ```

2. Open a debug shell on that node. Replace the placeholder with the node name from the previous step.

   ```shell
   kubectl debug node/<node-name> --image=busybox --profile=general --namespace=kube-system --stdin --tty
   ```

3. Read the audit log entries for your user. Replace the placeholder with your own email address. The audit log path can
   differ by Kubernetes distribution.

   ```shell
   grep "<your-email-address>" /host/var/log/apiserver/audit.log | tail --lines=3
   ```

4. Inspect the `user` object in each event. The `groups` array must contain your IdP groups.

   ```json hideClipboard title="Example output"
   {
     "username": "<your-email-address>",
     "groups": ["vmo-admins", "system:authenticated"]
   }
   ```

   If `groups` contains only `system:authenticated`, one of the following is true.

   - The groups claim is not configured on the IdP application, or the user does not match the filter.

   - The user does not belong to any group that matches the filter.

   - The Kubernetes API server was not started with `--oidc-groups-claim=groups`.

### Validate RBAC Enforcement

With a group binding in place and the user's group present in the token, the user can list VMs in the permitted
namespaces. To confirm that RBAC also denies access correctly, delete the binding temporarily and refresh the UI. The
user receives a 403 response with a message similar to the following.

```text hideClipboard title="Example output"
virtualmachines.kubevirt.io is forbidden: User "..." cannot list resource
```

Restore the binding to grant access again.

## Troubleshooting

### Scenario - The IdP Returns an Invalid Redirect URI Error

The sign-in redirect URI configured in the IdP application does not exactly match `<baseUrl>/auth/callback`. Compare the
configured value with the browser address bar during sign-in, including the scheme, the host, and any tenant app path
prefix.

### Scenario - Sign-in Succeeds but the VMs Page Returns 403

Kubernetes RBAC has no binding for the authenticated user or for any of their groups. Check the API server audit log for
the exact `user.username` and `user.groups` values, and then create a matching cluster role binding. Refer to
[Validate the Groups Claim](#validate-the-groups-claim) for guidance.

### Scenario - Groups Appear in Palette but Not in VMO

Each OIDC application carries its own groups claim configuration. Confirm that the groups claim rule is set on the
application that VMO uses, not only on the application that Palette uses.

### Scenario - Repeated Sign-in Prompts

The IdP application does not have the **Refresh Token** grant type enabled. Enable it in the application settings.

### Scenario - Sign-in Breaks After a Client Secret Rotation

Update `oidc.clientSecret` in the pack values, or update the referenced Secret, and then save and apply the profile.
Wait for the reconcile to redeploy the VMO Manager pod.

### Scenario - Authentication Service Unavailable at Sign-in

Sign-in redirects fail with "Authentication service unavailable" in the UI, and the VMO Manager pod log contains
`HandleLogin: oidcProvider is nil`. The pack starts with `oidc.enabled: true` but no issuer URL, so VMO Manager cannot
initialize the OIDC provider.

The most common cause is a configuration mismatch: OIDC values are set on the Kubernetes pack,
`palette.managedOidc: true` is on the `vmo-manager` sub-chart, but the cluster's identity provider is an external IdP
such as Okta rather than Palette Hubble. Palette injects OIDC values into VMO only when Palette Hubble itself is the
identity provider. For any external IdP, VMO needs the values on its own pack.

Set `palette.managedOidc: false` and provide `oidc.issuerUrl`, `oidc.clientId`, and `oidc.clientSecret` explicitly on
the `vmo-manager` sub-chart. Refer to [Configure the VMO Pack](#configure-the-vmo-pack) for the YAML sample.

### Scenario - Settings Menu Missing Despite Platform Admin Role

A user signs in with a role that grants Platform Admin permissions in VMO. VM lifecycle, templates, and dashboards work,
but the Settings group is hidden from the sidebar. Direct navigation to a Settings path such as
`/settings/configuration/kubevirt` returns `403 forbidden: cluster-wide K8s access required for this Setting`, and the
VMO Manager pod log at sign-in contains `Cluster-scope probe: SSAR returned 401`.

The Kubernetes API server does not federate the same OIDC issuer as VMO Manager, so the cluster-scope probe in VMO
Manager cannot validate the user's identity against Kubernetes. VMO IAM authorizes the session at the application layer,
but the Settings pages route Kubernetes API calls through the user's OIDC ID token as a Bearer, and the API server
rejects the token.

Configure the Kubernetes API server with `--oidc-issuer-url` and `--oidc-client-id` values that match the OIDC
application VMO uses. Refer to [Prerequisites](#prerequisites) for the verification command. Then bind the user's group
to `spectro-vm-admin` with a `ClusterRoleBinding`. For a temporary workaround, sign in with the local admin account at
`<baseUrl>/local-login`. Local sessions bypass the cluster-scope probe and reach all Settings pages.

## Next Steps

Review [Authentication Options](./authentication-options.md) to learn how the authentication options interact with the
[Deployment Mode](./deployment-modes.md) selection, and which parameters each option applies.

If you are moving an existing cluster from an earlier VMO pack version, refer to
[Upgrade the VMO Pack](./upgrade-vmo-pack.md) for the differences that affect an existing OIDC configuration.
