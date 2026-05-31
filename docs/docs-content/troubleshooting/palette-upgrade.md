---
sidebar_label: "Palette Upgrade"
title: "Palette Upgrade"
description: "Troubleshooting steps for errors encountered with upgrade actions."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["troubleshooting", "palette-upgrade"]
---

We recommend you review the [Release Notes](../release-notes/release-notes.md) and the
[Upgrade Notes](../enterprise-version/upgrade/upgrade.md) before attempting to upgrade Palette. Use this information to
address common issues that may occur during an upgrade.

## `configserver` Stuck on `init-rootdomain-traefik` After Upgrade to 4.9.14+

After upgrading [self-hosted Palette](../enterprise-version/enterprise-version.md) or
[Palette VerteX](../vertex/vertex.md) to version 4.9.14 or later, the `configserver` pod may remain in
`Init:CrashLoopBackOff` for the `init-rootdomain-traefik` init container. This happens when leftover Nginx ingress
controller pods on the same nodes hold host ports 80, 443, and 9090, which prevents the new Traefik DaemonSet pods from
scheduling. The automatic Nginx cleanup script that runs at `configserver` startup cannot run because `configserver`
itself never reaches **Ready**, so the leftover Nginx resources must be removed manually.

This scenario applies only to Enterprise installs of self-hosted Palette and Palette VerteX.

:::warning

Do not delete the `default-ssl-certificate` Secret in the `ingress-nginx` namespace, and do not delete the
`ingress-nginx` namespace itself. The Enterprise cert-bridge continues to copy your uploaded Transport Layer Security
(TLS) certificate from the `default-ssl-certificate` Secret into Traefik on every `configserver` restart. Deleting
either resource breaks ingress TLS.

:::

### Debug Steps

1. Connect to the cluster using the cluster's kubeconfig file. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

2. Verify that the `configserver` pod is in the `Init:CrashLoopBackOff` state and inspect the init container logs.

   ```shell
   kubectl get pod --namespace hubble-system --selector component=configserver
   kubectl logs <configserver-pod> --namespace hubble-system --container init-rootdomain-traefik --previous | tail
   ```

   ```bash hideClipboard title="Example output"
   NAME                            READY   STATUS                  RESTARTS   AGE
   configserver-685fcc5b6d-t8f8h   0/1     Init:CrashLoopBackOff   5          8m
   level=fatal msg="not able to get the host ip. got NotFound: Resource 'websecure' not found of type 'pod'"
   ```

3. Confirm that the Traefik DaemonSet pods are stuck in `Pending` because the host ports are unavailable.

   ```shell
   kubectl get pods --namespace ingress-traefik
   ```

   ```bash hideClipboard title="Example output"
   NAME                               READY   STATUS    RESTARTS   AGE
   traefik-ingress-controller-dkjs5   0/1     Pending   0          8m
   traefik-ingress-controller-nltlh   0/1     Pending   0          8m
   ```

   If the scheduler events for those pods show `didn't have free ports for the requested pod ports`, leftover Nginx pods
   are holding host ports 80, 443, and 9090 on the same nodes.

4. Delete the cluster-scoped Nginx resources.

   ```shell
   kubectl delete validatingwebhookconfiguration ingress-nginx-admission --ignore-not-found
   kubectl delete clusterrole ingress-nginx ingress-nginx-admission --ignore-not-found
   kubectl delete clusterrolebinding ingress-nginx ingress-nginx-admission --ignore-not-found
   kubectl delete ingressclass nginx --ignore-not-found
   ```

   ```bash hideClipboard title="Example output"
   validatingwebhookconfiguration.admissionregistration.k8s.io "ingress-nginx-admission" deleted
   clusterrole.rbac.authorization.k8s.io "ingress-nginx" deleted
   clusterrole.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
   clusterrolebinding.rbac.authorization.k8s.io "ingress-nginx" deleted
   clusterrolebinding.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
   ingressclass.networking.k8s.io "nginx" deleted
   ```

5. Delete the Nginx resources inside the `ingress-nginx` namespace. Do not delete the namespace itself or the
   `default-ssl-certificate` Secret.

   ```shell
   kubectl delete daemonset ingress-nginx-controller --namespace ingress-nginx --ignore-not-found
   kubectl delete service ingress-nginx-controller --namespace ingress-nginx --ignore-not-found
   kubectl delete service ingress-nginx-controller-admission --namespace ingress-nginx --ignore-not-found
   kubectl delete configmap ingress-nginx-controller --namespace ingress-nginx --ignore-not-found
   kubectl delete serviceaccount ingress-nginx ingress-nginx-admission --namespace ingress-nginx --ignore-not-found
   kubectl delete role ingress-nginx ingress-nginx-admission --namespace ingress-nginx --ignore-not-found
   kubectl delete rolebinding ingress-nginx ingress-nginx-admission --namespace ingress-nginx --ignore-not-found
   kubectl delete secret ingress-nginx-admission --namespace ingress-nginx --ignore-not-found
   kubectl delete lease ingress-nginx-leader --namespace ingress-nginx --ignore-not-found
   kubectl delete certificate ingress-nginx-admission --namespace ingress-nginx --ignore-not-found
   ```

   ```bash hideClipboard title="Example output"
   daemonset.apps "ingress-nginx-controller" deleted
   service "ingress-nginx-controller" deleted
   service "ingress-nginx-controller-admission" deleted
   configmap "ingress-nginx-controller" deleted
   serviceaccount "ingress-nginx" deleted
   serviceaccount "ingress-nginx-admission" deleted
   role.rbac.authorization.k8s.io "ingress-nginx" deleted
   role.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
   rolebinding.rbac.authorization.k8s.io "ingress-nginx" deleted
   rolebinding.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
   secret "ingress-nginx-admission" deleted
   lease.coordination.k8s.io "ingress-nginx-leader" deleted
   certificate.cert-manager.io "ingress-nginx-admission" deleted
   ```

6. Delete the legacy `nginx-tls` Secret and `nginx` Certificate from each application namespace.

   ```shell
   for ns in hubble-system ui-system cp-system; do
     kubectl delete certificate nginx --namespace "$ns" --ignore-not-found
     kubectl delete secret nginx-tls --namespace "$ns" --ignore-not-found
   done
   ```

   ```bash hideClipboard title="Example output"
   certificate.cert-manager.io "nginx" deleted
   secret "nginx-tls" deleted
   certificate.cert-manager.io "nginx" deleted
   secret "nginx-tls" deleted
   certificate.cert-manager.io "nginx" deleted
   secret "nginx-tls" deleted
   ```

7. Verify that the cluster-scoped Ingress Nginx resources are gone.

   ```shell
   kubectl get validatingwebhookconfiguration ingress-nginx-admission
   kubectl get clusterrole ingress-nginx ingress-nginx-admission
   kubectl get clusterrolebinding ingress-nginx ingress-nginx-admission
   kubectl get ingressclass nginx
   ```

   ```bash hideClipboard title="Example output"
   Error from server (NotFound): validatingwebhookconfigurations.admissionregistration.k8s.io "ingress-nginx-admission" not found
   Error from server (NotFound): clusterroles.rbac.authorization.k8s.io "ingress-nginx" not found
   Error from server (NotFound): clusterrolebindings.rbac.authorization.k8s.io "ingress-nginx" not found
   Error from server (NotFound): ingressclasses.networking.k8s.io "nginx" not found
   ```

8. Verify that the `ingress-nginx` namespace and `default-ssl-certificate` Secret are preserved.

   ```shell
   kubectl get namespace ingress-nginx
   kubectl get secret default-ssl-certificate --namespace ingress-nginx
   ```

   ```bash hideClipboard title="Example output"
   NAME            STATUS   AGE
   ingress-nginx   Active   42d

   NAME                      TYPE                DATA   AGE
   default-ssl-certificate   kubernetes.io/tls   2      42d
   ```

9. Once the leftover Ingress Nginx pods are removed, the scheduler places the Traefik DaemonSet pods, `configserver`
   reaches **Ready**, and the remaining automatic cleanup completes on the next `configserver` start. Confirm that the
   Traefik pods are running and that `configserver` is **Ready**.

   ```shell
   kubectl get pods --namespace ingress-traefik
   kubectl get pod --namespace hubble-system --selector component=configserver
   ```

   ```bash hideClipboard title="Example output"
   NAME                               READY   STATUS    RESTARTS   AGE
   traefik-ingress-controller-9dmzq   1/1     Running   0          3m
   traefik-ingress-controller-tpwtf   1/1     Running   0          3m
   traefik-ingress-controller-xz4jf   1/1     Running   0          3m

   NAME                            READY   STATUS    RESTARTS   AGE
   configserver-685fcc5b6d-t8f8h   1/1     Running   0          2m
   ```

## Self-Hosted Palette or Palette VerteX Upgrade Hangs

Upgrading [self-hosted Palette](../enterprise-version/enterprise-version.md) or [Palette VerteX](../vertex/vertex.md)
from version 4.6.x to 4.7.x can cause the upgrade to hang if any member of a MongoDB ReplicaSet is not fully synced and
in a healthy state prior to the upgrade.

### Debug Steps

To verify the health status of each MongoDB ReplicaSet member, use the following procedure based on whether you are
upgrading Palette or Palette VerteX.

1. Log in to the [Palette](../enterprise-version/system-management/system-management.md#access-the-system-console) or
   [Palette VerteX](../vertex/system-management/system-management.md#access-the-system-console) system console.

2. From the left main menu, select **Enterprise Cluster**.

3. On the **Overview** tab, download the **Kubernetes Config File**.

4. Open a terminal window and set the environment variable `KUBECONFIG` to point to kubeconfig file you downloaded.

   ```shell title="Example command" hideClipboard
   export KUBECONFIG=~/Downloads/spectro-mgmt-cluster.kubeconfig
   ```

<Tabs>

<TabItem label="Palette" value="palette">

5. Issue the following command to query the ReplicaSet for its current primary host, extract the Pod name, and save its
   value as `MONGO_PRIMARY`.

   :::info

   The values for `MONGODB_INITDB_ROOT_USERNAME` and `MONGODB_INITDB_ROOT_PASSWORD` do not need to be exported, as they
   are already defined within the MongoDB Pods.

   :::

   ```shell
   MONGO_PRIMARY=$(
      kubectl exec \
         --namespace hubble-system \
         mongo-1 \
         --container mongo \
         -- \
         mongosh \
            --username "$MONGODB_INITDB_ROOT_USERNAME" \
            --password "$MONGODB_INITDB_ROOT_PASSWORD" \
            admin \
            --quiet \
            --eval "print(JSON.stringify(rs.hello()))" \
      | jq --raw-output .primary \
      | awk -F. '{print $1}'
   )
   ```

6. Issue the following command to connect to the primary Pod and print each ReplicaSet member’s host, state, and health
   status.

   ```shell
   kubectl exec \
      --namespace hubble-system \
      "${MONGO_PRIMARY}" \
      --container mongo \
      -- bash -c \
      'mongosh \
         --username "$MONGO_INITDB_ROOT_USERNAME" \
         --password "$MONGO_INITDB_ROOT_PASSWORD" \
         --host "$HOSTNAME" \
         admin \
         --quiet \
   --eval "rs.status().members.forEach(m => printjson({host:m.name,state:m.stateStr,health:m.health}))"'
   ```

   All healthy members should have a `health` status of `1`. If the ReplicaSet members are healthy, proceed with
   upgrading self-hosted Palette or VerteX.

   ```shell title="Example output" hideClipboard {4,9,14}
   {
      host: 'mongo-1.mongo.hubble-system.svc.cluster.local:27017',
      state: 'PRIMARY',
      health: 1
   }
   {
      host: 'mongo-0.mongo.hubble-system.svc.cluster.local:27017',
      state: 'SECONDARY',
      health: 1
   }
   {
      host: 'mongo-2.mongo.hubble-system.svc.cluster.local:27017',
      state: 'SECONDARY',
      health: 1
   }
   ```

</TabItem>

<TabItem label="Palette VerteX" value="vertex">

5. Issue the following command to query the ReplicaSet for its current primary host, extract the Pod name, and save its
   value as `MONGO_PRIMARY`.

   :::info

   The values for `MONGODB_INITDB_ROOT_USERNAME` and `MONGODB_INITDB_ROOT_PASSWORD` do not need to be exported, as they
   are already defined within the MongoDB Pods.

   :::

   ```shell
   MONGO_PRIMARY=$(
      kubectl exec \
         --namespace hubble-system \
         mongo-1 \
         --container mongo \
         -- bash -c \
            'mongosh \
               --username "$MONGODB_INITDB_ROOT_USERNAME" \
               --password "$MONGODB_INITDB_ROOT_PASSWORD" \
               --host "$HOSTNAME" \
               --tls \
               --tlsCAFile /var/mongodb/tls/ca.crt \
               --tlsCertificateKeyFile /var/mongodb/tls/tls-combined.pem \
               --tlsAllowInvalidHostnames \
               admin \
               --quiet \
               --eval "print(JSON.stringify(rs.isMaster()))"'
   ) | jq --raw-output .primary | awk -F. '{print $1}'
   ```

6. Issue the following command to connect to the primary Pod and print each ReplicaSet member’s host, state, and health
   status.

   ```shell
   kubectl exec \
      --namespace hubble-system \
      "${MONGO_PRIMARY}" \
      --container mongo \
      -- bash -c \
         'mongosh \
            --username "$MONGODB_INITDB_ROOT_USERNAME" \
            --password "$MONGODB_INITDB_ROOT_PASSWORD" \
            --host "$HOSTNAME" \
            --tls \
            --tlsCAFile /var/mongodb/tls/ca.crt \
            --tlsCertificateKeyFile /var/mongodb/tls/tls-combined.pem \
            --tlsAllowInvalidHostnames \
            admin \
            --quiet \
            --eval "rs.status().members.forEach(m => printjson({host:m.name,state:m.stateStr,health:m.health}))"'
   ```

   All healthy members should have a `health` status of `1`. If the ReplicaSet members are healthy, proceed with
   upgrading self-hosted Palette or VerteX.

   ```shell title="Example output" hideClipboard {4,9,14}
   {
      host: 'mongo-1.mongo.hubble-system.svc.cluster.local:27017',
      state: 'PRIMARY',
      health: 1
   }
   {
      host: 'mongo-0.mongo.hubble-system.svc.cluster.local:27017',
      state: 'SECONDARY',
      health: 1
   }
   {
      host: 'mongo-2.mongo.hubble-system.svc.cluster.local:27017',
      state: 'SECONDARY',
      health: 1
   }
   ```

</TabItem>

</Tabs>

## Ingress Errors

If you receive the following error message when attempting to upgrade to Palette versions greater than Palette 3.4.X in
a Kubernetes environment, use the debugging steps to address the issue.

```text hideClipboard
Error: UPGRADE FAILED: failed to create resource: admission webhook "validate.nginx.ingress.kubernetes.io" denied the request: host "_" and path "/v1/oidc" is already defined in ingress default/hubble-auth-oidc-ingress-resource
```

### Debug Steps

1. Connect to the cluster using the cluster's kubeconfig file. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Identify all Ingress resources that belong to _Hubble_ - an internal Palette component.

   ```shell
   kubectl get ingress --namespace default
   ```

3. Remove each Ingress resource listed in the output that starts with the name Hubble. Use the following command to
   delete an Ingress resource. Replace `REPLACE_ME` with the name of the Ingress resource you are removing.

   ```shell
   kubectl delete ingress --namespace default <REPLACE_ME>
   ```

4. Restart the upgrade process.

## Mongo DNS ConfigMap Value is Incorrect

In VMware vSphere VerteX installations, if you encounter an error during the upgrade process where the MongoDB DNS
ConfigMap value is incorrect, use the following steps to resolve the issue.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the Kubernetes cluster. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Verify that the pods in the `hubble-system` namespace are not starting correctly by issuing the following command.

   ```shell
   kubectl get pods --namespace=hubble-system
   ```

3. Verify that the ConfigMap for the `configserver` in the `hubble-system` namespace contains the incorrect host value
   `mongo-1.mongohubble-system.svc.cluster`. Use the following command to describe the ConfigMap and search for the host
   value.

   ```shell
   kubectl describe configmap configserver --namespace hubble-system | grep host
   ```

   ```shell hideClipboard
    host: mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongohubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
   ```

4. If the host value is incorrect, log in to the System Console. You can find guidance on how to access the System
   Console in the
   [Access the System Console](../vertex/system-management/system-management.md#access-the-system-console)
   documentation.

5. Navigate to the **Main Menu** and select **Enterprise Cluster**. From the **System Profiles** page, select the
   **Spectro** pack.

   ![A view of the Spectro pack in the System Profiles page](/troubleshooting_enterprise_install_system-profile-pack.webp)

6. In the YAML editor, locate the parameter `databaseUrl` and update the value
   `mongo-1.mongohubble-system.svc.cluster.local` to `mongo-1.mongo.hubble-system.svc.cluster.local`.

   Below is what the updated `databaseUrl` value should look like.

   ```yaml
   databaseUrl: "mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongo.hubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local"
   ```

7. Click **Save** to apply the changes.

8. Verify the system pods are starting correctly by issuing the following command.

   ```shell
   kubectl get pods --namespace=hubble-system
   ```

   ```hideClipboard text
     NAME                                   READY   STATUS    RESTARTS   AGE
     auth-64b88d97dd-5z7ph                  1/1     Running   0          31m
     auth-64b88d97dd-bchr7                  1/1     Running   0          31m
     cloud-b8796c57d-5r7d9                  1/1     Running   0          31m
     cloud-b8796c57d-xpbx7                  1/1     Running   0          31m
     configserver-778bd7c4c9-mrtc6          1/1     Running   0          31m
     event-5869c6bd75-2n7jl                 1/1     Running   0          31m
     event-5869c6bd75-xnvmj                 1/1     Running   0          31m
     foreq-679c7b7f6b-2ts2v                 1/1     Running   0          31m
     hashboard-9f865b6c8-c52bb              1/1     Running   0          31m
     hashboard-9f865b6c8-rw6p4              1/1     Running   0          31m
     hutil-54995bfd6b-sh4dt                 1/1     Running   0          31m
     hutil-54995bfd6b-tlqbj                 1/1     Running   0          31m
     memstore-7584fdd94f-479pj              1/1     Running   0          31m
     mgmt-68c8dbfd58-8gxsx                  1/1     Running   0          31m
     mongo-0                                2/2     Running   0          29m
     mongo-1                                2/2     Running   0          30m
     mongo-2                                2/2     Running   0          30m
     msgbroker-7d7655559b-zxxfq             1/1     Running   0          31m
     oci-proxy-6fdf95885f-qw58g             1/1     Running   0          31m
     reloader-reloader-845cfd7fdf-2rq5t     1/1     Running   0          31m
     spectrocluster-5c4cb4ff58-658w9        1/1     Running   0          31m
     spectrocluster-5c4cb4ff58-fn8g5        1/1     Running   0          31m
     spectrocluster-5c4cb4ff58-zvwfp        1/1     Running   0          31m
     spectrocluster-jobs-5b54bf6bcf-mtgh8   1/1     Running   0          31m
     system-6678d47874-464n6                1/1     Running   0          31m
     system-6678d47874-rgn55                1/1     Running   0          31m
     timeseries-6564699c7d-b6fnr            1/1     Running   0          31m
     timeseries-6564699c7d-hvv94            1/1     Running   0          31m
     timeseries-6564699c7d-jzmnl            1/1     Running   0          31m
     user-866c7f779d-drf9w                  1/1     Running   0          31m
     user-866c7f779d-rm4hw                  1/1     Running   0          31m
   ```
