---
title: "Adding a custom registry"
metaTitle: "Adding a custom registry"
metaDescription: "How to create and use custom made packs and registries in Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Adding custom registries

Setting up a custom pack registry involves the installation of a registry server and configuring it with the tenant console. Once installed, the Spectro Cloud CLI tool can be used to manage the contents of the registry. Pack contents are periodically synchronized with the tenant console.

# Pre Requisites

* Need container runtime docker to be installed on the machine
  
* HTTP utility htpasswd  is required to be installed for user auth encryption
  
* Required minimum machine compute specifications - 1 vCPU and 2GB Memory
  
* Firewall ports 443/80 are required to be opened on the machine to allow traffic from tenant console and Spectro CLI tool

# Deploying a registry server

Spectro Cloud provides a docker image for the registry server. The following steps need to be performed to deploy registry server using this docker image:-

* Configure the user credentials by using the `htpasswd` utility and store the credentials in a file locally. This file will be mounted inside the registry docker container.
    ```
    htpasswd -Bbn admin admin > /root/auth/htpasswd-basic
    ```

* Create a directory for certificates and copy the desired tls certificates into this directory. This directory will be mounted inside the registry docker container. Example : `/root/certs`
* Pack contents in a registry can be stored locally on the host or an external file system. An external file system is recommended so that the pack contents can be easily mounted on another registry instance in the event of restarts and failures. Create a directory or mount an external volume to the desired storage location. Example: `/root/data`
* Pull the latest Spectro registry docker image using docker CLI.

```
    docker pull gcr.io/spectro-images-public/release/spectro-registry:1.0.0
```

* Create the docker container using the docker `run` command:
    * HTTPS mode -
    ```
    docker run -d \
        -p 443:5000 \
        --restart=always \
        --name spectro-registry \
        --mount type=bind,source=/root/auth,target=/auth,readonly \
        --mount type=bind,source=/root/data,target=/data \
        --mount type=bind,source=/root/certs,target=/certs,readonly \
        -e REGISTRY_LOG_LEVEL=info \
        -e REGISTRY_AUTH=htpasswd \
        -e REGSITRY_AUTH_HTPASSWD_REALM="Registry Realm" \
        -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd-basic \
        -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/tls.crt \
        -e REGISTRY_HTTP_TLS_KEY=/certs/tls.key \
        gcr.io/spectro-images-public/release/spectro-registry:1.0.0
    ```
    * HTTP mode - **not recommended**
    ```
    docker run -d \
        -p 80:5000 \
        --restart=always \
        --name spectre-registry \
        --mount type=bind,source=/root/auth,target=/auth,readonly \
        --mount type=bind,source=/root/data,target=/data \
        -e  REGISTRY_LOG_LEVEL=info \
        -e  REGISTRY_AUTH=htpasswd \
        -e  REGISTRY_AUTH_HTPASSWD_REALM="Registry Realm" \
        -e  REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd-basic \
        gcr.io/spectro-images-public/release/spectro-registry:1.0.0 
    ```
* Expose the container host's port publicly to allow the tenant console to interact with the registry. This would be typically done via environment-specific constructs like Security Groups, Firewalls, etc.
* Verify installation by invoking the pack registry API’s using the curl command. The curl command returns the status code 200 if the registry installation is successful.

    ```
    $curl -v [REGISTRY_SERVER]/health   
    $curl -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
    ```

# Create a custom registry on the Tenant Console

Once the deployment of the registry server is complete, configure it with the tenant console as follows:-

1. As a tenant administrator, navigate to Admin -> Settings -> Pack Registries.
1. Click on "Add new Pack Registry" and provide the registry name, endpoint and user credentials.
1. Click on "Confirm" once the details are filled.

Upon successful registration, users can build and deploy custom packs on to the custom registry and use these packs in their cluster profiles.
