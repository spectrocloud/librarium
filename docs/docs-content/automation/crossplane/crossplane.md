---
sidebar_label: "Crossplane"
title: "Crossplane"
description: "Learn how to use Crossplane with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
tags: ["crossplane", "iac", "automation", "infrastructure as code"]
---

Palette supports the open source Cloud Native Computing Foundation (CNCF) project
[Crossplane](https://www.crossplane.io/). Crossplane transforms Kubernetes clusters into universal control planes,
extending the Kubernetes API and enabling infrastructure resource provisioning and management across major
infrastructure providers.

These resources, called
[Managed Resources (MR)](https://docs.crossplane.io/v2.3/managed-resources/managed-resources/#managed-resource-fields)
within the Crossplane environment, are essentially Kubernetes Custom Resource Definitions (CRDs) that represent
infrastructure resources as native Kubernetes objects. Because they are Kubernetes objects, you can interact with them
using standard commands like `kubectl describe`. When users create a managed resource, Crossplane interacts with the
infrastructure provider API to request the creation of the resource within the provider's environment.

## Palette Provider

You can use the Palette Crossplane provider to interact with the Palette API and create resources declaratively.

Refer to the [Palette Provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/latest)
page for a complete list of managed resources and examples.

### Configure a Custom CA Certificate and Proxy

If your environment requires the Palette Crossplane provider to trust a custom certificate authority (CA) or route API
calls through a proxy, inject those settings through a `DeploymentRuntimeConfig` resource. The provider mounts the
certificate and picks up the proxy environment variables at startup, so you do not need to rebuild the provider image.

Set your kubeconfig before running the `kubectl` commands in this procedure.

```bash
export KUBECONFIG=<path-to-kubeconfig>
```

1. Store your CA certificate in a `ConfigMap` in the `crossplane-system` namespace, or in the namespace where the
   provider pod runs.

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: cert-map
     namespace: crossplane-system
   data:
     cert: |
       -----BEGIN CERTIFICATE-----
       <ca-certificate-body>
       -----END CERTIFICATE-----
   ```

   Replace `<ca-certificate-body>` with the contents of your CA certificate.

   If preferred, you can use a `Secret` instead of a `ConfigMap`.

2. Create a `DeploymentRuntimeConfig` resource that defines the proxy environment variables and mounts the certificate
   into the `package-runtime` container of the provider. Omit either the `env` block or the certificate volume if you
   only need one of the two.

   ```yaml
   apiVersion: pkg.crossplane.io/v1beta1
   kind: DeploymentRuntimeConfig
   metadata:
     name: palette-provider-runtime
   spec:
     deploymentTemplate:
       spec:
         selector: {}
         template:
           spec:
             containers:
               - name: package-runtime
                 env:
                   - name: HTTP_PROXY
                     value: "<http-proxy-url>"
                   - name: HTTPS_PROXY
                     value: "<https-proxy-url>"
                   - name: NO_PROXY
                     value: "<no-proxy-list>"
                 volumeMounts:
                   - mountPath: /etc/ssl/certs/ca-certificates.crt
                     name: cert-map
                     subPath: cert
                     readOnly: true
                   - name: cache
                     mountPath: /cache
             volumes:
               - name: cert-map
                 configMap:
                   name: cert-map
                   defaultMode: 420
   ```

   Replace each placeholder as follows.

   - Replace `<http-proxy-url>` with your HTTP proxy URL, for example, `http://proxy.example.com:8080`.
   - Replace `<https-proxy-url>` with your HTTPS proxy URL.
   - Replace `<no-proxy-list>` with a comma-separated list of hosts and domains that must bypass the proxy.

   If you used a `Secret` in the previous step, replace the `configMap` block under `volumes` with a `secret` block that
   references the same name.

3. Reference the `DeploymentRuntimeConfig` from your `Provider` resource by setting `spec.runtimeConfigRef.name`.

   ```yaml
   apiVersion: pkg.crossplane.io/v1
   kind: Provider
   metadata:
     name: provider-palette
   spec:
     package: xpkg.upbound.io/crossplane-contrib/provider-palette:<provider-version>
     runtimeConfigRef:
       name: palette-provider-runtime
   ```

   Replace `<provider-version>` with the Palette Crossplane provider version you want to install. Refer to the
   [Palette Provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/latest) page for
   available versions.

4. Apply the manifests to your cluster.

   If you defined the resources in three separate manifests, run the following command for each manifest file.

   ```bash
   kubectl apply --filename <manifest-file>.yaml
   ```

After the provider pod restarts, the CA certificate is mounted at `/etc/ssl/certs/ca-certificates.crt` and the proxy
environment variables are available to the provider process.

## Get Started

You can use the Palette Crossplane Provider to deploy Kubernetes clusters on supported public cloud, data center, and
bare metal infrastructures. For examples of end-to-end cluster provisioning with Crossplane, review the following
guides:

- [Deploy an AWS IaaS Cluster with Crossplane](./deploy-cluster-aws-crossplane.md)
- [Deploy an Azure IaaS Cluster with Crossplane](./deploy-cluster-azure-crossplane.md)
- [Deploy a GCP IaaS Cluster with Crossplane](./deploy-cluster-gcp-crossplane.md)

## Resources

- [Crossplane Documentation](https://docs.crossplane.io/latest/)
