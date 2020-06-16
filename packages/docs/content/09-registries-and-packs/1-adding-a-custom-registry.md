---
title: "Adding a custom registry"
metaTitle: "Adding a custom registry"
metaDescription: "How to create and use custom made packs and registries in Spectro Cloud"
icon: ""
---

# Adding custom registries

In the event of the default registries not meeting a user's requirements, custom registries can be easily created.

# Deploying a registry server

* Configure the user credentials by using the `htpasswd` utility. Store the credentials in a file and mount it inside a docker container.
    ```
    htpasswd -Bbn admin admin > /root/auth/htpasswd-basic

* Create the directory named "certs" and copy the TLS certificates into this directory. This directory also is to be mounted inside the docket container.
* The registry's data volume can be configured locally or in an external file system for storing the packs content. An external file system is recommended as the pack content will never be lost in case the host is terminated.
* Pull the latest Spectro registry docker image using docker CLI.
 ```
    docker pull spectro-registry:latest

* Create the docker container using the docker `run` command
    * HTTPS mode
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

# Create a custom registry in Spectro Cloud SaaS

Once the deployment of the registry server is completed, then it is required to create the registry in the Spectro Cloud SaaS platform.

1. In the Spectro Cloud dashboard, go to Admin -> Settings -> Pack Registries
1. Click on "Add new Pack Registry" and provide the registry name, endpoint and user credentials.
1. Click on "Confirm" once the details are filled.

After successfully creating a registry, the Spectro Cloud SaaS will sync all the packs from the registry periodically. So, the user can start pushing the packs via the Spectro CLI and all these packs are available in the Spectro Cloud dashboard for the user to start creating a profile.
