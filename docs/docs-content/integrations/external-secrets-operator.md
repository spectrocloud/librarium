---
sidebar_label: "external-secrets-operator"
title: "External Secrets Operator"
description: "external-secrets-operator pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["authentication", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/external-secrets-operator/blobs/sha256:ee6f7f347d381852582f688c70b2564b0a346c2b2ed1221310889075a4453c6d?type=image.webp"
tags: ["packs", "external-secrets-operator", "security"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="0.9.x" value="0.9.x">

#### Example Configuration

```yml
apiVersion: [external-secrets.io/v1beta1](http://external-secrets.io/v1beta1)
kind: ExternalSecret
metadata:
  name: vault-example # Custom name
spec:
  refreshInterval: "15s"
  secretStoreRef:
    name: vault-backend # Custom value
    kind: SecretStore
  target:
    name: mysecretfoobar
  data:
  - secretKey: foobar
    remoteRef:
      key: secret/foo   # custom value
      property: my-value # custom value

```

```yml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: custom-name
spec:
  provider:
    vault:
      server: "http://12.34.567.133:0000" # custom server end point
      path: "secret" # custom path
      version: "v2" # custom version
      auth:
        # points to a secret that contains a vault token
        # https://www.vaultproject.io/docs/auth/token
        tokenSecretRef:
          name: "vault-token1" # Custom name and key
          key: "token1"
---
apiVersion: v1
kind: Secret
metadata:
  name: vault-token1
data:
  token: cm9vdA== # "root"   # custome value
```

</TabItem>

<TabItem label="0.6.x" value="0.6.x">

#### Example Configuration

```yml
apiVersion: [external-secrets.io/v1beta1](http://external-secrets.io/v1beta1)
kind: ExternalSecret
metadata:
  name: vault-example # Custom name
spec:
  refreshInterval: "15s"
  secretStoreRef:
    name: vault-backend # Custom value
    kind: SecretStore
  target:
    name: mysecretfoobar
  data:
  - secretKey: foobar
    remoteRef:
      key: secret/foo   # custom value
      property: my-value # custom value

```

```yml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: custom-name
spec:
  provider:
    vault:
      server: "http://12.34.567.133:0000" # custom server end point
      path: "secret" # custom path
      version: "v2" # custom version
      auth:
        # points to a secret that contains a vault token
        # https://www.vaultproject.io/docs/auth/token
        tokenSecretRef:
          name: "vault-token1" # Custom name and key
          key: "token1"
---
apiVersion: v1
kind: Secret
metadata:
  name: vault-token1
data:
  token: cm9vdA== # "root"   # custome value
```

</TabItem>

<TabItem label="0.5.x" value="0.5.x">

#### Example Configuration

```yml
apiVersion: [external-secrets.io/v1beta1](http://external-secrets.io/v1beta1)
kind: ExternalSecret
metadata:
  name: vault-example # Custom name
spec:
  refreshInterval: "15s"
  secretStoreRef:
    name: vault-backend # Custom value
    kind: SecretStore
  target:
    name: mysecretfoobar
  data:
  - secretKey: foobar
    remoteRef:
      key: secret/foo   # custom value
      property: my-value # custom value

```

```yml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: custom-name
spec:
  provider:
    vault:
      server: "http://12.34.567.133:0000" # custom server end point
      path: "secret" # custom path
      version: "v2" # custom version
      auth:
        # points to a secret that contains a vault token
        # https://www.vaultproject.io/docs/auth/token
        tokenSecretRef:
          name: "vault-token1" # Custom name and key
          key: "token1"
---
apiVersion: v1
kind: Secret
metadata:
  name: vault-token1
data:
  token: cm9vdA== # "root"   # custome value
```

</TabItem>
</Tabs>

## Terraform

You can reference the External Secrets Operator pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "palette_registry" {
  name = "Palette Registry"
}

data "spectrocloud_pack" "external-secrets-operator" {
  name         = "external-secrets-operator"
  version      = "0.9.16"
  registry_uid = data.spectrocloud_registry.palette_registry.id
}
```
