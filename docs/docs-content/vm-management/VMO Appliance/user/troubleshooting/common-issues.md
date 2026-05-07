# Common Issues

This page describes frequent issues encountered with VMO Manager and how to resolve them.

---

## OTel Metrics: "No historical data available"

**Symptom:** Dashboard panels show "No historical data available" or "OTel collector required" even though the OTel collector is running.

**Root cause:** The OTel collector exports metrics to VMO Manager at `http://<service-name>.<namespace>.svc.cluster.local:8080/otlp/v1/metrics`. When VMO Manager is deployed via Helm, the Service name follows the Helm fullname pattern (e.g., `vmo-vmo-manager` for release `vmo`, chart `vmo-manager`), not the default `vmo-manager`. If the OTel collector ConfigMap uses the wrong service name, DNS resolution fails and metrics are not delivered.

**Fix:**

1. Confirm the actual VMO Manager Service name:
   ```bash
   kubectl get svc -n vm-dashboard
   ```
2. Update the OTel collector ConfigMap so that `metrics_endpoint` or the OTLP exporter target uses the correct service name, e.g.:
   ```
   http://vmo-vmo-manager.vm-dashboard.svc.cluster.local:8080/otlp/v1/metrics
   ```
3. Ensure `VMO_SERVICE_NAME` is set in the VMO Manager deployment (the Helm chart sets this automatically).

**Verification:**

```bash
kubectl get svc -n vm-dashboard   # Confirm actual service name
kubectl logs -n kube-system -l app.kubernetes.io/name=otel-collector | grep -i 'Exporting failed'
```

---

## VirtIO DataVolume Stuck in Pending

**Symptom:** The `vmo-virtio-win` DataVolume in the golden-images namespace is stuck in `Pending` with `N/A` progress.

**Root cause:** The DataVolume is created without a `storageClassName`. If no StorageClass in the cluster has the `storageclass.kubernetes.io/is-default-class: "true"` annotation, the underlying PVC cannot be provisioned and stays Pending indefinitely.

**Fix:**

1. Annotate one StorageClass as default:
   ```bash
   kubectl annotate sc <storageclass-name> storageclass.kubernetes.io/is-default-class=true --overwrite
   ```
2. Delete the stuck DataVolume so it can be recreated on the next bootstrap:
   ```bash
   kubectl delete dv vmo-virtio-win -n vmo-golden-images
   ```

> **Tip:** VMO Manager auto-detects the StorageClass from its own bound PVC (`DetectStorageClassFromPVC`) and applies it when creating the VirtIO DV. If VMO has no PVC (ephemeral storage), the VirtIO DV may not be created. Ensure VMO Manager has a persistent data volume.

**Verification:**

```bash
kubectl get dv -n vmo-golden-images
kubectl get pvc -n vmo-golden-images
```

---

## CDI Upload TLS Errors

**Symptom:** Disk image uploads fail with TLS verification errors such as "x509: certificate signed by unknown authority" or "certificate verify failed".

**Root cause:** The CDI upload proxy uses self-signed certificates by default. VMO Manager verifies TLS connections to the CDI proxy using the platform CA trust store. If the CDI certs are not signed by the platform CA (or a trusted CA), verification fails.

**Fix:**

1. Add the CDI upload proxy CA to the trusted CA store: Settings > Certificates > Add Trusted CA. Upload the PEM for the CA that signed the CDI upload proxy certificate. See [Certificates](../system/certificates) for details.
2. Alternatively, configure CDI to use cert-manager-issued certificates signed by the platform CA so they are trusted automatically.
3. Restart the VMO Manager pod after adding a trusted CA.

**Verification:**

```bash
# Check CDI upload proxy certificate
kubectl get secret -n cdi cdi-uploadproxy-server-cert -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -noout -issuer -subject
```

---

## Golden Image Build Stuck or Failing

**Symptom:** Golden image build process hangs, fails repeatedly, or the builder VM never completes auto-install.

**Root cause:** Common causes include:
- Auto-install script issues (syntax errors, wrong package names, missing dependencies)
- ISO compatibility (wrong architecture, corrupted ISO, or unsupported OS)
- Network or cloud-init configuration problems in the builder VM

**Fix:**

1. **Auto-install script:** Review the auto-install script for the customization template (see [Customization Templates](../image-catalog/image-templates)). Ensure package names are correct and the script exits successfully. Test with a minimal script (e.g., `touch /tmp/done`) to isolate script vs. ISO issues.
2. **ISO compatibility:** Verify the ISO is for the correct architecture (amd64) and is a supported OS. Check that cloud-init or the installer can run unattended.
3. **Builder VM:** Inspect the builder VM via VNC or console. Check cloud-init logs (`/var/log/cloud-init-output.log`) for errors.
4. **Network:** Ensure the builder VM can reach package repositories (or use air-gapped packages if applicable).

**Verification:**

```bash
kubectl get vmi -n vmo-golden-images
kubectl logs -n vmo-golden-images -l <builder-label>  # if applicable
```

---

## VM Not Getting Network IP

**Symptom:** A VM is running but has no IP address or shows "Pending" for network.

**Root cause:** The VM's network interface may not be configured correctly. Common causes:
- NetworkAttachmentDefinition (NAD) not found or misconfigured
- MetalLB or L2 load balancer not assigning an address
- DHCP server not responding or not reachable from the VM's network
- Multus CNI not attaching the secondary network

**Fix:**

1. **NAD:** Verify the NAD exists in the VM's namespace and matches the network specified in the VM spec (see [Networking](../infrastructure/networking)). Check `kubectl get nad -n <namespace>`.
2. **MetalLB:** For L2 mode, ensure MetalLB has an IP pool and the service is correctly configured. Check MetalLB controller logs.
3. **DHCP:** Ensure a DHCP server is available on the network the VM is attached to. For bare-metal or bridge networks, the DHCP server may be external to the cluster.
4. **Multus:** Verify Multus is installed and the CNI config is correct. Check `kubectl get network-attachment-definitions`.

**Verification:**

```bash
kubectl get vmi <vm-name> -n <namespace> -o jsonpath='{.status.interfaces}'
kubectl get nad -n <namespace>
```

---

## OIDC Login Redirect Loops

**Symptom:** After login, the browser redirects back to the login page repeatedly, or the session never establishes.

**Root cause:** Common causes:
- Session key rotation (e.g., pod restart with a new `SESSION_KEY`) invalidates existing sessions
- `vmo-auth-retry` cookie prevents redirect loops but can also block valid retries if stale
- Expired or invalid OIDC state parameter in the callback URL

**Fix:**

1. **Session key:** Ensure `SESSION_KEY` is stable across pod restarts (see [Configuration Reference](../system/configuration)). In Helm deployments, set it via a secret or values so it persists. If the key changes, all users must log in again.
2. **Clear cookies:** Clear cookies for the platform domain, including `vmo-sid` and `vmo-auth-retry`. Try an incognito/private window.
3. **OIDC callback:** Verify `BASE_URL` and `OIDC_ISSUER_URL` match the actual URLs. Ensure the OIDC client in Keycloak has the correct redirect URI.
4. **State parameter:** If the callback URL is bookmarked or stale, the state parameter may be expired. Use a fresh login link from the main page.

**Verification:**

- Check browser network tab for redirect chain (302 responses).
- Check server logs for auth errors (e.g., "invalid state", "session not found").

---

## User Logged Out in Keycloak Still Appears Authenticated in VMO

**Symptom:** An administrator logs a user out from the Keycloak admin console (or the user logs out from another SSO application, or has their password reset), but the user's VMO Manager session keeps working. The user can still load pages and make API calls until the session TTL expires.

**Root cause:** OIDC back-channel logout is not reaching VMO Manager. Common causes:

- **Backchannel Logout URL not configured** on the VMO client in Keycloak — Keycloak does not know where to send the logout notification.
- **Network path blocked** — Keycloak cannot reach VMO's Service or ingress at `/auth/backchannel-logout`.
- **HA caveat** — in multi-replica deployments, the logout invalidates the session only on the replica that received it; the user's next request can hit a different replica where the session still lives.

**Fix:**

1. **Keycloak client settings:** In Keycloak admin, open the VMO client and verify **Settings > Logout Settings**:
   - **Backchannel Logout URL** is set to `<VMO base URL>/auth/backchannel-logout`.
   - **Backchannel Logout Session Required** is ON.
   See [Authentication > Back-channel Logout](../architecture/auth-modes#back-channel-logout) for details.
2. **Network path:** If Keycloak runs outside the cluster, confirm it can reach VMO's ingress. Test with `curl` from a host that shares Keycloak's network path. In-cluster Keycloak can reach VMO's Service directly.
3. **HA deployments:** Sessions are pod-local. Either reduce the session TTL or enable sticky sessions at the ingress so a user consistently returns to the same replica. A future release will centralize session state.

**Verification:**

- Trigger a Keycloak-initiated logout (for example, revoke the user's session in the admin console) and check VMO Manager logs on the replica that received the callback — you should see the session invalidation. The user's next request should redirect to `/auth/login`.

---

## Access Denied After Palette Deployment

**Symptom:** After deploying VMO Manager via Palette, you see an Access Denied page and cannot log in.

**Root cause:** In Palette-managed deployments, OIDC may not be configured yet (Day 0). The `cluster-admins` group mapping used for OIDC users does not apply before identity provider setup.

**Fix:**

1. When local auth is enabled (default in Palette mode), the Access Denied page shows a **"Sign in with a local account"** link.
2. Click the link to go to `/local-login` and sign in with the Day 0 admin credentials (configured via `features.localAuth.adminUsername` and `features.localAuth.adminPassword` in the Helm chart).
3. Ensure `palette.enabled: true` and `features.localAuth.adminPassword` are set in the VMO Manager Helm values so the admin account is seeded on first startup.

**Verification:**

- Confirm local auth is enabled: Settings > Local Users should be visible when logged in as the local admin.
- See [Local Auth](../access-management/local-auth) for full setup details.

---

## Permission Denied on API Calls

**Symptom:** User receives a 403 Forbidden or "permission required" error when performing an action (e.g., creating a VM, editing config).

**Root cause:** IAM permissions are enforced at both the API and UI layers. The error can be caused by:
- IAM role missing the required permission for the domain (e.g., `vmo:config:write` for config changes)
- Kubernetes RBAC: the user's group is mapped to a ClusterRole or RoleBinding that does not grant the necessary K8s resource permissions
- Mismatch between IAM role and K8s RBAC (e.g., IAM role grants access but the K8s RoleBinding is missing or points to the wrong ClusterRole)

**Fix:**

1. **IAM role:** Verify the user's group is mapped to a VMO role that has the required permission. Check Settings > Access Management > IAM Roles and the group-to-role mapping. See [IAM Roles & Permissions](../access-management/iam-roles).
2. **K8s RBAC:** Ensure the user's group has a ClusterRoleBinding or RoleBinding to the appropriate ClusterRole (e.g., `spectro-vmo-admin` for full access). Check `kubectl get clusterrolebindings` and `kubectl get rolebindings -A`.
3. **Access policy:** If using VMO access policies, ensure the policy grants the correct scope (cluster vs. namespace) and permissions.

**Verification:**

```bash
# Check user's groups (from OIDC token or Keycloak)
# Check ClusterRoleBindings for the user's group
kubectl get clusterrolebinding -o wide | grep <group-name>
kubectl get rolebinding -A -o wide | grep <group-name>
```

---

## CPU Model Shows "unsupported in current cluster"

**Symptom:** When editing an instance type or creating a VM from an imported template, the **CPU Model** dropdown (Hardware step or Instance Type Create/Edit modal) shows the selected model as `<ModelName> (unsupported in current cluster)` with the warning *"This CPU model is not available on any cluster node. VMs may fail to schedule."*

**Root cause:** The CPU Model dropdown is populated from KubeVirt's `cpu-model-migration.node.kubevirt.io/<Model>` node labels, which the node-labeller writes based on each node's physical CPU features. If the template or instance type was imported from another cluster whose nodes expose CPU models not present on any node in the current cluster, the referenced model cannot be honored. VMO Manager preserves the original value rather than dropping it, so you can see what was intended and choose a replacement.

**Fix:**

1. Open the Hardware step (VM wizard) or the Create/Edit Instance Type modal.
2. Pick a supported model from the **CPU Model** dropdown (only supported models are listed). `host-model` is a safe default for most workloads.
3. If the original model is required, add a worker node with a compatible CPU. KubeVirt's node-labeller will advertise the new model after the node registers.
4. After adding a node, wait up to 3 minutes for VMO Manager to re-discover the model list (the cache refreshes automatically on the next capabilities request after the TTL expires).

A second warning, *"This model is not supported by all nodes. Live migration may be restricted,"* means the model is available on some nodes but not all. VMs can schedule, but live migration is constrained to the node subset that supports the model.

**Verification:**

```bash
# List CPU models advertised by nodes
kubectl get nodes -o json | jq -r '.items[] | .metadata.labels | to_entries[] | select(.key | startswith("cpu-model-migration.node.kubevirt.io/")) | .key' | sort -u

# Confirm which nodes advertise a specific model
kubectl get nodes -l cpu-model-migration.node.kubevirt.io/<ModelName>=true
```

> **Refresh cadence:** The model list is cached for up to 3 minutes. Node additions, removals, and cordon changes reflect in the dropdown within one cache window.

---

## Dashboard Panels Showing "No data"

**Symptom:** Dashboard widgets show "No data" or empty charts.

**Root cause:**

- **Victoria Metrics not configured:** Long-range time-series queries require `EXTERNAL_METRICS_URL` to point to Victoria Metrics. Without it, only recent ring-buffer data is available.
- **Ring buffer timeout:** The in-memory ring buffer holds only recent data (typically minutes). If the selected time range exceeds what the ring buffer has, queries return no data.
- **OTel metrics not reaching VMO:** See "OTel Metrics: No historical data available" above.

**Fix:**

1. Configure `EXTERNAL_METRICS_URL` for long-range queries (e.g., `http://victoria-metrics.monitoring.svc.cluster.local:8428`). See [Monitoring & Dashboards](../system/monitoring) for configuration details.
2. For short-range charts, ensure the OTel collector is correctly configured and metrics are flowing (see OTel troubleshooting above).
3. Select a shorter time range (e.g., "Last 5 minutes") to test with ring-buffer data.

**Verification:**

```bash
# Check if Victoria Metrics is running and reachable
kubectl get svc -n monitoring | grep victoria
curl -s "http://<victoria-metrics-svc>:8428/api/v1/query?query=up"  # from within cluster
```
