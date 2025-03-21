---
sidebar_label: "Nginx"
title: "Nginx"
description: "Nginx Ingress pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["ingress", "amd64", "arm64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/nginx/blobs/sha256:a36bf7e8023f018298ddbf0c82a49c38e872db4b0e480a39c285ae002916a83f?type=image.webp"
tags: ["packs", "nginx", "network"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.4.x" value="1.4.x">

## Components

Integration creates the following components:

- Ingress Controller.
- Default Backend.

## Default SSL Certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match
any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have
a secretName option. Below steps will come in handy to set the default certificate.

1. Create a secret with key and certificate
   ```bash
   kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
   ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret
   created above
   ```bash
   charts:
     nginx-ingress:
       fullnameOverride: "nginx-ingress"
       controller:
         ...
         ...
         extraArgs:
           default-ssl-certificate: "kube-system/ingress-tls"
   ```

</TabItem>

<TabItem label="1.3.x" value="1.3.x">

## Components

Integration creates the following components:

- Ingress Controller.
- Default Backend.

## Default SSL Certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match
any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have
a secretName option. Below steps will come in handy to set the default certificate.

1. Create a secret with key and certificate
   ```bash
   kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
   ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret
   created above
   ```bash
   charts:
     nginx-ingress:
       fullnameOverride: "nginx-ingress"
       controller:
         ...
         ...
         extraArgs:
           default-ssl-certificate: "kube-system/ingress-tls"
   ```

</TabItem>

<TabItem label="1.2.x" value="1.2.x">

## Components

Integration creates the following components:

- Ingress Controller.
- Default Backend.

## Default SSL Certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match
any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have
a secretName option. Below steps will come in handy to set the default certificate.

1. Create a secret with key and certificate
   ```bash
   kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
   ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret
   created above
   ```bash
   charts:
     nginx-ingress:
       fullnameOverride: "nginx-ingress"
       controller:
         ...
         ...
         extraArgs:
           default-ssl-certificate: "kube-system/ingress-tls"
   ```

</TabItem>

<TabItem label="1.0.x" value="1.0.x">

## Components

Integration creates the following components:

- Ingress Controller.
- Default Backend.

## Default SSL Certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match
any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have
a secretName option. Below steps will come in handy to set the default certificate.

1. Create a secret with key and certificate
   ```bash
   kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
   ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret
   created above
   ```bash
   charts:
     nginx-ingress:
       fullnameOverride: "nginx-ingress"
       controller:
         ...
         ...
         extraArgs:
           default-ssl-certificate: "kube-system/ingress-tls"
   ```

</TabItem>

<TabItem label="0.26.x" value="0.26.x">

## Components

Integration creates the following components:

- Ingress Controller.
- Default Backend.

## Default SSL Certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match
any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have
a secretName option. Below steps will come in handy to set the default certificate.

1. Create a secret with key and certificate
   ```bash
   kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
   ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret
   created above
   ```bash
   charts:
     nginx-ingress:
       fullnameOverride: "nginx-ingress"
       controller:
         ...
         ...
         extraArgs:
           default-ssl-certificate: "kube-system/ingress-tls"
   ```

</TabItem>

<TabItem label="0.43.x" value="0.43.x">

## Components

Integration creates the following components:

- Ingress Controller.
- Default Backend.

## Default SSL Certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match
any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have
a secretName option. Below steps will come in handy to set the default certificate.

1. Create a secret with key and certificate
   ```bash
   kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
   ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret
   created above
   ```bash
   charts:
     nginx-ingress:
       fullnameOverride: "nginx-ingress"
       controller:
         ...
         ...
         extraArgs:
           default-ssl-certificate: "kube-system/ingress-tls"
   ```

</TabItem>

</Tabs>

## Terraform

You can reference the nginx pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "nginx" {
  name    = "nginx"
  version = "1.10.0"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
