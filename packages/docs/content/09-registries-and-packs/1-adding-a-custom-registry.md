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

# Deploying a registry server

Spectro Cloud provides a docker image for the registry server. The following steps need to be performed to deploy registry server using this docker image:-

* Configure the user credentials by using the `htpasswd` utility. Store the credentials in a file locally. This file will be mounted inside a docker container.
    ```
    htpasswd -Bbn admin admin > /root/auth/htpasswd-basic
    ```

* Create a directory for certificates and copy the desired tls certificates into this directory. This directory will be mounted inside the registry docker container. Example : `/root/certs`
* Pack contents in a registry can be stored locally on the host or an external file system. An external file system is recommended so that the pack contents can easily mounted on another registry instance in the event of restarts and failures. Create a directory or mount an external volume to the desired storage location. Example: `/root/data`
* Pull the latest Spectro registry docker image using docker CLI.
```
    docker pull spectro-registry:latest
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
        spectro-registry:latest

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
            spectro-registry:latest
        ```
* Expose the container host's port publicly to allow the tenant console to interact with the registry. This would be typically done via environment-specific constructs like Security Groups, Firewalls, etc.
* Verify installation by ...

# VERIFICATION OF THE INSTALLATION PENDING!

# Create a custom registry on the Tenant Console

Once the deployment of the registry server is complete, configure it with the tenant console as follows:-

1. As a tenant administrator, navigate to Admin -> Settings -> Pack Registries.
1. Click on "Add new Pack Registry" and provide the registry name, endpoint and user credentials.
1. Click on "Confirm" once the details are filled.

Upon successful registration, users can build and deploy custom packs on to the custom registry and use these packs in their cluster profiles.
