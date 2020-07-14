---
title: "Adding a custom registry"
metaTitle: "Adding a custom registry"
metaDescription: "How to create and use custom made packs and registries in Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/styles/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';

# Adding custom registries

Setting up a custom pack registry involves the installation of a registry server and configuring it with the management console. Once installed, the Spectro Cloud CLI tool can be used to manage the contents of the pack registry. Pack contents are periodically synchronized with the management console.

# Pre Requisites

* Need container runtime docker to be installed on the machine.

* HTTP utility *htpasswd* is required to be installed for user auth encryption.

* Required minimum machine compute specifications - 1 vCPU and 2GB Memory.
  
* HTTP utility *htpasswd* is required to be installed for user auth encryption.
  
* Required minimum machine compute specifications - 1 vCPU and 2GB Memory.
  
* Firewall ports 443/80 are required to be opened on the machine to allow traffic from the management console and Spectro CLI tool.

# Deploying a pack registry server

Spectro Cloud provides a docker image for the pack registry server. The following steps need to be performed to deploy the pack registry server using this docker image:-

* Configure the user credentials by using the `htpasswd` utility and store the credentials in a file locally. This file will be mounted inside the pack registry docker container.

```bash
mkdir -p /root/auth
htpasswd -Bbn admin admin > /root/auth/htpasswd-basic
```

* If HTTPS mode is being used, create a directory called `certs`.

```bash
mkdir -p /root/certs
```

* For self-signed certificates, use the following command to generate certificates.

```
openssl req \
  -newkey rsa:4096 -nodes -sha256 -keyout tls.key \
  -x509 -days 365 -out tls.crt
```

* 
    * Provide the appropriate values while ensuring that the Common Name matches with the registry hostname.

    ```
    Country Name (2 letter code) [XX]:
    State or Province Name (full name) []:
    Locality Name (eg, city) [Default City]:
    Organization Name (eg, company) [Default Company Ltd]:
    Organizational Unit Name (eg, section) []:
    Common Name (eg, your name or your server's hostname) []:[REGISTRY_HOST_DNS]
    Email Address []:  

    Example:
    REGISTRY_HOST_DNS - registry.com
    ```

* Copy the `tls.crt` and `tls.key` files from the Certificate Authority into the `/roots/certs` directory. This directory will be mounted inside the registry docker container

* Pack contents in a pack registry can be stored locally on the host or an external file system. An external file system is recommended so that the pack contents can be easily mounted on another pack registry instance in the event of restarts and failures. Create a directory or mount an external volume to the desired storage location. Example: `/root/data`
* Pull the latest Spectro Cloud pack registry docker image using the docker CLI.

```bash
openssl req \
  -newkey rsa:4096 -nodes -sha256 -keyout tls.key \
  -x509 -days 365 -out tls.crt
```

*
    * Provide the appropriate values while ensuring that the Common Name matches with the registry hostname.

    ```
    Country Name (2 letter code) [XX]:
    State or Province Name (full name) []:
    Locality Name (eg, city) [Default City]:
    Organization Name (eg, company) [Default Company Ltd]:
    Organizational Unit Name (eg, section) []:
    Common Name (eg, your name or your server's hostname) []:[REGISTRY_HOST_DNS]
    Email Address []:

    Example:
    REGISTRY_HOST_DNS - registry.com
    ```

* Copy the `tls.crt` and `tls.key` files from the Certificate Authority into the `/roots/certs` directory. This directory will be mounted inside the registry docker container

* Pack contents in a pack registry can be stored locally on the host or an external file system. An external file system is recommended so that the pack contents can be easily mounted on another pack registry instance in the event of restarts and failures. Create a directory or mount an external volume to the desired storage location. Example: `/root/data`
* Pull the latest Spectro Cloud pack registry docker image using the docker CLI.

```bash
    docker pull gcr.io/spectro-images-public/release/spectro-registry:1.0.0
```

* Create the docker container using the docker `run` command:
    * HTTPS mode -
    ```bash
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
    <InfoBox>
    Spectro Cloud CLI registry login command fails with the error message “x509: certificate signed by unknown authority” in case of self-signed certificates or if the certificate is invalid. The host where Spectro Cloud CLI is installed must be configured to trust the certificate.
    </InfoBox>
    
    * HTTP mode - **not recommended**

    ```bash
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

    <InfoBox>
    Spectro Cloud CLI is required to use the insecure option `-i ( --insecure )` in the registry login command if the pack registry is installed in the HTTP mode.
    </InfoBox>

* Expose the container host's port publicly to allow the management console to interact with the pack registry. This would be typically done via environment-specific constructs like Security Groups, Firewalls, etc.
* Verify the installation by invoking the pack registry APIs using the curl command. This should result in a 200 response.

    * HTTPS mode -
    ```bash
    $curl --cacert tls.crt -v [REGISTRY_SERVER]/health
    $curl --cacert tls.crt -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
    ```

    * HTTP mode -
    ```bash
    $curl -v [REGISTRY_SERVER]/health
    $curl -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
    ```

# Configure a custom pack registry on the management Console

Once the deployment of the pack registry server is complete, configure it with the management console as follows:-

1. As a tenant administrator, navigate to Admin -> Settings -> Pack Registries.
1. Click on "Add New Pack Registry" and provide the pack registry name, endpoint and user credentials.
1. Click on "Confirm" once the details are filled.

Upon successful registration, users can build and deploy custom packs on to the custom pack registry and use these packs in their cluster profiles.
