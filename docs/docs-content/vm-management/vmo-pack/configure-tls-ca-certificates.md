---
sidebar_label: "Configure TLS and CA Certificates"
title: "Configure TLS and CA Certificates"
description:
  "Serve the Virtual Machine Orchestrator UI with your own TLS certificate, and make VMO trust a private certificate
  authority, in VMO pack version 4.10.x and later."
icon: " "
hide_table_of_contents: false
sidebar_position: 29
tags: ["vmo", "vmo pack", "tls"]
---

Virtual Machine Orchestrator (VMO) pack version 4.10.x and later uses two separate certificate settings. You can
configure each one on its own.

| **Setting**         | **Purpose**                                                                                                                                                                                         | **Pack Values**        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Serving certificate | The TLS certificate that VMO Manager presents to browsers and other clients that connect to the VMO UI.                                                                                             | `vmo-manager.tls.*`    |
| Trusted CA bundle   | Additional certificate authorities (CAs) that VMO Manager trusts when it connects to other services over HTTPS, such as the OpenID Connect (OIDC) identity provider (IdP) that it uses for sign-in. | `vmo-manager.caCert.*` |

Pack version 4.9.x and earlier configures certificates differently. If your cluster runs one of those versions, refer to
[Configure Private CA Certificate](./configure-private-ca-certificate.md).

## Prerequisites

- A workload cluster with VMO pack version 4.10.x or later deployed. Refer to
  [Create a VMO Profile](./create-vmo-profile.md) for guidance.

- Kubectl installed and access to the **kubeconfig** file for the VMO cluster. Refer to the
  [Kubectl](../../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide to learn how to set up
  `kubectl` and get the **kubeconfig** file. Export its path so that the commands on this page can use it, and run the
  commands in the same terminal session.

  ```shell
  export KUBECONFIG=<path-to-kubeconfig>
  ```

  Replace `<path-to-kubeconfig>` with the path to the **kubeconfig** file of your VMO cluster.

## Use Your Own Serving Certificate

In [Direct](./deployment-modes.md#direct) mode, users reach the VMO UI through a `LoadBalancer` or `NodePort` Service,
and VMO Manager serves TLS itself. By default, Direct mode issues a self-signed certificate that covers only the
in-cluster Service names, so browsers display a certificate warning. Use a certificate that your users' browsers trust
instead.

In [Proxied](./deployment-modes.md#proxied) mode, only the in-cluster Spectro Proxy uses the serving certificate, so you
do not need to replace it.

1. Obtain a TLS certificate and its private key in PEM format. The certificate's Subject Alternative Names (SANs) must
   include the DNS name or IP address that users reach the VMO UI at, which is the address in
   `charts.virtual-machine-orchestrator.vmo-manager.platform.baseUrl`. If an intermediate CA signed the certificate,
   append the intermediate certificates to the certificate file so that clients receive the full chain.

2. Create a Secret of type `kubernetes.io/tls` in the `vm-dashboard` namespace. The Secret holds only the certificate
   and the private key, in the `tls.crt` and `tls.key` keys. Unlike pack version 4.9.x and earlier, it does not hold a
   CA certificate.

   ```shell
   kubectl create secret tls vmo-tls \
     --cert=<path-to-certificate> \
     --key=<path-to-private-key> \
     --namespace vm-dashboard
   ```

   Replace `<path-to-certificate>` with the path to the certificate file, and `<path-to-private-key>` with the path to
   the private key file.

   ```shell hideClipboard title="Example Output"
   secret/vmo-tls created
   ```

3. Log in to [Palette](https://console.spectrocloud.com).

4. From the left main menu, select **Clusters**, and select your VMO cluster.

5. Select the **Profile** tab, select the **Virtual Machine Orchestrator** layer, and then select **Values**. The values
   editor appears.

6. Set `charts.virtual-machine-orchestrator.vmo-manager.tls.existingSecret` to the name of the Secret that you created
   in step 2.

   ```yaml hideClipboard title="Example"
   charts:
     virtual-machine-orchestrator:
       vmo-manager:
         tls:
           enabled: true
           existingSecret: "vmo-tls"
   ```

   When `existingSecret` is set, VMO does not request a certificate from cert-manager, and the `tls.certManager.*`
   values have no effect. In [Custom](./deployment-modes.md#custom) mode, also set `tls.certManager.enabled` to `false`,
   so that the cluster does not switch back to cert-manager if you remove `existingSecret` later.

7. Select **Save**. Wait for Palette to complete the cluster update.

### Validate

1. Confirm that the VMO Manager pod reports a `Running` status.

   ```shell
   kubectl get pods --namespace vm-dashboard --selector app.kubernetes.io/name=vmo-manager
   ```

2. Open the VMO UI in a browser at the address in `vmo-manager.platform.baseUrl`. The browser does not display a
   certificate warning, and the certificate details show your certificate's subject and issuer.

## Trust a Private Certificate Authority

VMO Manager trusts the CAs in its container image, the CA of its Kubernetes cluster, and the CAs in the `ca.crt` key of
the ConfigMap that `vmo-manager.caCert.configMapName` names. This ConfigMap is `platform-ca-cert` in the `vm-dashboard`
namespace by default, and the **Proxied** and **Direct** modes always set this name. VMO Manager reads these CAs when it
starts.

If your OIDC IdP, such as a self-hosted Palette or Palette VerteX instance, presents a certificate that a private CA
signed, add that CA to the ConfigMap. Otherwise, VMO Manager cannot reach the IdP, and the `vmo-manager` pod restarts
with a `Failed to initialize OIDC provider` error that includes `x509: certificate signed by unknown authority`.

<!-- TODO(DOC-3164): confirm with Ahmed or Shubham whether Palette creates or manages platform-ca-cert in vm-dashboard
on a workload cluster, and whether it already holds the self-hosted Palette or VerteX CA. If Palette manages the
ConfigMap, these steps must not edit it. -->

1. Export the DNS name of your IdP, without the `https://` prefix. For a self-hosted Palette or Palette VerteX IdP, use
   the DNS name of the instance.

   ```shell
   export IDP_DNS_NAME=<idp-dns-name>
   ```

   Replace `<idp-dns-name>` with the DNS name of your IdP, such as `palette.example.com`.

2. Extract the certificate chain that the IdP presents.

   ```shell
   openssl s_client -connect $IDP_DNS_NAME:443 -showcerts </dev/null \
     | awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/' > idp-chain.pem
   ```

3. Split the chain into one file per certificate. The command creates files named `cert-<number>.pem`.

   ```shell
   awk 'BEGIN {c=0;} /BEGIN CERTIFICATE/ {out=sprintf("cert-%02d.pem", c++);} {print > out}' idp-chain.pem
   ```

4. Display the issuer and subject of each certificate.

   ```shell
   for f in cert-*.pem; do echo "$f:" && openssl x509 -noout -issuer -subject < "$f" && echo; done
   ```

   ```shell hideClipboard title="Example Output"
   cert-00.pem:
   issuer=C=US, O=Example Corp, CN=Example Intermediate CA
   subject=CN=palette.example.com

   cert-01.pem:
   issuer=C=US, O=Example Corp, CN=Example Root CA
   subject=C=US, O=Example Corp, CN=Example Intermediate CA
   ```

5. Save the root CA certificate to a file named `root-ca.pem`. The root CA is the last certificate in the chain, the one
   whose issuer is not the subject of another certificate in the output. If the chain does not include the root CA,
   obtain it from your certificate administrator.

   ```shell
   cp cert-01.pem root-ca.pem
   ```

6. Check whether the `platform-ca-cert` ConfigMap already exists.

   ```shell
   kubectl get configmap platform-ca-cert --namespace vm-dashboard
   ```

   If the output contains `NotFound`, the ConfigMap does not exist. Otherwise, it exists.

7. _(Existing ConfigMap only)_ Combine the CAs that the ConfigMap already holds with your root CA, so that VMO Manager
   keeps trusting them.

   ```shell
   kubectl get configmap platform-ca-cert --namespace vm-dashboard --output jsonpath='{.data.ca\.crt}' > ca-bundle.pem
   cat root-ca.pem >> ca-bundle.pem
   ```

8. Create or update the ConfigMap. If you completed step 7, use `ca-bundle.pem`. Otherwise, use `root-ca.pem`.

   ```shell
   kubectl create configmap platform-ca-cert \
     --from-file=ca.crt=<ca-file> \
     --namespace vm-dashboard \
     --dry-run=client --output yaml \
     | kubectl apply --filename -
   ```

   Replace `<ca-file>` with `ca-bundle.pem` or `root-ca.pem`.

9. Restart VMO Manager so that it reads the updated CAs.

   ```shell
   kubectl rollout restart deployment vmo-manager --namespace vm-dashboard
   ```

In Custom mode, you can store the CAs in a ConfigMap with a different name. Set
`charts.virtual-machine-orchestrator.vmo-manager.caCert.configMapName` to the ConfigMap name, and
`charts.virtual-machine-orchestrator.vmo-manager.caCert.key` to the key that holds the CAs.

### Validate

1. Confirm that the VMO Manager pod reports a `Running` status and that its restart count does not increase.

   ```shell
   kubectl get pods --namespace vm-dashboard --selector app.kubernetes.io/name=vmo-manager
   ```

2. Review the VMO Manager logs.

   ```shell
   kubectl logs --namespace vm-dashboard --selector app.kubernetes.io/name=vmo-manager --tail=50
   ```

   The logs do not contain `could not read CA file`, `no valid certs found`, or `Failed to initialize OIDC provider`.

3. Log in to the VMO UI through your IdP.

## Next Steps

To learn how each deployment mode sets the `tls.*` and `caCert.*` values, refer to
[Deployment Modes](./deployment-modes.md). To configure a third-party IdP, refer to
[Configure External OIDC](./configure-external-oidc.md).
