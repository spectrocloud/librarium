---
sidebar_label: "Configure Private CA Certificate"
title: "Configure Private CA Certificate to enable trust with Self-Hosted Palette or Palette VerteX"
description:
  "Learn how to configure a private CA certificate for VMO that enables trust with your self-hosted Palette TLS
  certificate."
sidebar_position: 30
tags: ["vmo"]
---

This guide provides step-by-step instructions on how to configure a private CA certificate for the Virtual Machine
Orchestrator (VMO) that enables trust with your self-hosted Palette or Palette VerteX TLS certificate. This is necessary
to ensure that VMO can securely communicate with your self-hosted Palette or Palette VerteX instance.

## Prerequisites

- A self-hosted Palette installation. Refer to the [Self-Hosted Palette](../enterprise-version/enterprise-version.md) or
  [Palette VerteX](../vertex/vertex.md) guides for installation instructions.

- A workload cluster with VMO installed and configured. Refer to the [VMO](./vm-management.md) guide for details.

<!--prettier-ignore-start-->

  - The VMO cluster must use <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes"/> for the Kubernetes
    layer and the OpenID Connect (OIDC) identity provider must be set to **Palette**.

<!--prettier-ignore-end-->

- Command line access to your VMO cluster.

- Kubectl installed and access to the **kubeconfig** file for the VMO cluster. The file needs to be accessible from the
  machine where you perform the [Enablement Steps](#enablement-steps). Refer to the
  [Kubectl](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide to learn how to set up
  `kubectl` and get the **kubeconfig** file for your VMO cluster.

## Enablement Steps

1. Use the following command to extract the TLS certificate chain from your self-hosted Palette or Palette VerteX
   instance. Replace `<palette-dns-name>` with the DNS name of your self-hosted Palette or Palette VerteX instance. Do
   not include the `https://` prefix in the DNS name.

   ```bash
   openssl s_client -connect <palette-dns-name>:443 -showcerts </dev/null \
   | awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/' > palette-ca.crt
   ```

   ```shell hideClipboard title="Example Output"
   Connecting to 10.11.12.13
   depth=2 C=US, O=Amazon, CN=Amazon Root CA 1
   verify return:1
   depth=1 C=US, O=Amazon, CN=Amazon RSA 2048 M02
   verify return:1
   depth=0 CN=tenant.company.com
   verify return:1
   DONE
   ```

2. Use the following command to split the certificate chain into individual certificates. This command will create files
   named `cert-<number>.pem` containing the individual certificates from the chain.

   ```bash
   awk 'BEGIN {c=0;} /BEGIN CERTIFICATE/ {out=sprintf("cert-%02d.pem", c++);} {print > out}' palette-ca.crt
   ```

3. After creating the individual certificate files, use the following command to inspect their contents.

   ```bash
   for f in cert-*.pem; \
   do echo "$f:" && openssl x509 -in "$f" -noout -issuer -subject && echo; \
   done
   ```

   ```shell hideClipboard title="Example Output"
   cert-00.pem:
   issuer=C=US, O=Amazon, CN=Amazon RSA 2048 M02
   subject=CN=tenant.company.com

   cert-01.pem:
   issuer=C=US, O=Amazon, CN=Amazon Root CA 1
   subject=C=US, O=Amazon, CN=Amazon RSA 2048 M02

   cert-02.pem:
   issuer=C=US, ST=Arizona, L=Scottsdale, O=Starfield Technologies, Inc., CN=Starfield Services Root Certificate Authority - G2
   subject=C=US, O=Amazon, CN=Amazon Root CA 1
   ```

4. Identify the intermediate or root CA certificate that you need from the output in step 3. In this example, the
   `cert-02.pem` file contains the root CA certificate.

5. Save the identified root CA certificate to a file named `root-ca.pem`.

   ```bash
   cp cert-02.pem root-ca.pem
   ```

6. Set the environment variable `KUBECONFIG` to point to the kubeconfig file for your self-hosted Palette or Palette
   VerteX cluster.

   ```bash
   export KUBECONFIG=/path/to/your/kubeconfig
   ```

7. Use the following command to create a ConfigMap in the `vm-dashboard` namespace with the root CA certificate.

   ```bash
   kubectl create configmap custom-ca \
   --from-file=cert=root-ca.pem \
   --namespace vm-dashboard
   ```

   ```shell hideClipboard title="Example Output"
   configmap/custom-ca created
   ```

8. Log in to your self-hosted Palette or Palette VerteX tenant console.

9. In the left main menu, click **Profiles** and find the profile for your VMO cluster.

10. Click on the profile name to open the profile details.

11. Create a new version of the profile. For more information, refer to
    [Version a Cluster Profile](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

12. Select the **virtual-machine-orchestrator** layer to view the **Edit pack** page.

13. Click **Values** under **Pack Details** and find the `charts.virtual-machine-orchestrator.privateCaCertificate` key.

14. Change the `enabled` value to `true`.

    ```yaml hideClipboard title="Example"
    privateCaCertificate:
      enabled: true
      configmapName: custom-ca
      certificateKey: cert
      mountPath: /etc/ssl/certs/
    ```

15. Click **Confirm Updates**, and then click **Save Changes** in the cluster profile page.

16. In the left main menu, click **Clusters** and click on the cluster where you want to apply the changes.

17. Select the **Profile** tab and click the version drop-down menu for the **ADDON LAYERS**. Select the version of the
    profile you modified in step 10.

18. Click **Review & Save**, and then click **Review changes in Editor** when the pop-up window appears.

19. Review the changes and click **Apply Changes** when satisfied.

## Validate

1. Use the following command to confirm that the VMO pod has successfully reconciled.

   ```bash
   kubectl get pods --namespace vm-dashboard
   ```

   The output should show the `virtual-machine-orchestrator-<uid>` pod in a `Running` state with `2/2` containers ready.

   ```shell hideClipboard title="Example Output"
   NAME                                           READY   STATUS    RESTARTS   AGE
   virtual-machine-orchestrator-cb46b4849-fv8q8   2/2     Running   0          3m30s
   ```

   :::tip

   If there are only `0/2` or `1/2` containers ready, you can check the logs of the pod for any TLS errors using the
   following command.

   ```bash
   kubectl logs --namespace vm-dashboard <pod-name> -c virtual-machine-orchestrator
   ```

   :::

2. Check that the CA certificate is present by using the following command.

   ```bash
   kubectl exec --namespace vm-dashboard <pod-name> -- ls /etc/ssl/certs/
   ```

   The output should include the Common Name (CN) of the certificate you specified in the ConfigMap.

   ```shell hideClipboard title="Example Output"
   ...
   Starfield_Root_Certificate_Authority_-_G2.pem
   ...
   ```

3. Check that the VMO pod now trusts the self-hosted Palette or Palette VerteX TLS certificate by issuing the following
   command. Replace `<palette-dns-name>` with the DNS name of your self-hosted Palette or Palette VerteX instance.

   ```bash
   kubectl exec --namespace vm-dashboard <pod-name> -- curl --verbose https://<palette-dns-name>
   ```

   The output should have the `SSL certificate verify ok.` and `HTTP/1.1 200 OK` messages, indicating that the VMO pod
   trusts the self-hosted Palette or Palette VerteX TLS certificate.

   ````shell hideClipboard title="Example Output"
   ...
   * Server certificate:
   *  subject: CN=tenant.company.com
   *  start date: Jun 16 00:00:00 2025 GMT
   *  expire date: Jul 15 23:59:59 2026 GMT
   *  subjectAltName: host "tenant.company.com" matched cert's "*.company.com"
   *  issuer: C=US; O=Amazon; CN=Amazon RSA 2048 M02
   *  SSL certificate verify ok.
   ...
   < HTTP/1.1 200 OK
   ```
   ````
