---
title: "Add a Custom Registry"
metaTitle: "Add a Custom Registry"
metaDescription: "Learn how to create and use custom made packs and registries in Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Add Custom Registries

Setting up a custom pack registry involves the installation of a registry server and configuring it with Palette.
Once the registry server is installed, use the Spectro Cloud CLI tool to manage the contents of the pack registry.
Pack contents are periodically synchronized with Palette.

# Prerequisites

* Ensure you have a Docker container runtime Docker to be installed on the machine.


* The HTTP utility *htpasswd* is required to be installed for user authentication encryption.


* The minimum machine compute specifications are 1 vCPU and 2 GB Memory.


* Firewall ports 443/80 are required to be opened on the machine to allow traffic from the Palette console and Spectro CLI tool.

* [OpenSSL](https://www.openssl.org/source/) if creating a self-signed certificate. Refer to the [Self-Signed Certificates](#self-signed-certificates) section for more guidance.

<WarningBox>
Please ensure that the ports 443 and 80 are exclusively allocated to the registry server and are not in use by other processes.
</WarningBox>

# Deploying a Pack Registry Server

Palette provides a Docker image for the pack registry server. The following steps need to be performed to deploy the pack registry server using this docker image:


1. Configure the user credentials by using the `htpasswd` utility and store the credentials in a file locally. This file will be mounted inside the pack registry docker container.

    ```bash
    mkdir -p /root/auth
    ```

2. For Admin Users: The command-line below has a placeholder to specify your unique, secure password for admin users.

    ```bash
    htpasswd -Bbn admin {enter your secure password choice} > /root/auth/htpasswd-basic
    ```

3. For Other Users: The command-line following has the placeholder to specify your unique, secure password for read-only users.

    ```bash
    htpasswd -Bbn spectro {enter your secure password choice} >> /root/auth/htpasswd-basic
    ```

4. If HTTPS mode is being used, create a directory called `certs`.

    ```bash
    mkdir -p /root/certs
    ```

5. Copy the `tls.crt` and `tls.key` files from the Certificate Authority into the `/roots/certs` directory. This directory will be mounted inside the registry Docker container. 

6. Pack contents in a pack registry can be stored locally on the host or an external file system.
An external file system is recommended so that the pack contents can be mounted on another pack
registry instance in the event of restarts and failures.
Create a directory or mount an external volume to the desired storage location. Example: `/root/data`

7. Pull the latest Palette pack registry Docker image using the docker CLI.

    ```bash
        docker pull gcr.io/spectro-images-public/release/spectro-registry:3.1.0
    ```

8. Create the Docker container using the docker `run` command:

      * **HTTPS mode**
    
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
            -e REGISTRY_AUTH_HTPASSWD_REALM="Registry Realm" \
            -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd-basic \
            -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/tls.crt \
            -e REGISTRY_HTTP_TLS_KEY=/certs/tls.key \
            spectro-registry:3.1.0
          ```
    
<br />

  #### Common Issues 

  * Spectro Cloud CLI registry login command fails with the error message in the case of self-signed certificates created using an IP address, rather than a hostname. `x509: cannot validate certificate for ip_address, because it doesn't contain any IP SANs`. Either the certificate must be recreated to include an IP SAN, or you must use a DNS name as the Common Name, rather than an IP address.



  * Spectro Cloud CLI registry login command fails with the error message in case of self-signed certificates or if the certificate is invalid. `x509: certificate signed by unknown authority`. The host where Spectro Cloud CLI is installed must be configured to trust the certificate.


  *    **HTTP mode** (*not recommended*)
        ```bash
            docker run -d \
                -p 80:5000 \
                --restart=always \
                --name spectro-registry \
                --mount type=bind,source=/root/auth,target=/auth,readonly \
                --mount type=bind,source=/root/data,target=/data \
                -e  REGISTRY_LOG_LEVEL=info \
                -e  REGISTRY_AUTH=htpasswd \
                -e  REGISTRY_AUTH_HTPASSWD_REALM="Registry Realm" \
                -e  REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd-basic \
                spectro-registry:3.1.0
        ```

<br />

<InfoBox>
Spectro Cloud CLI is required to use the insecure option `-i ( --insecure )` in the registry login command if the pack registry is installed in the HTTP mode.
</InfoBox>
<br />

9. Expose the container host's port publicly to allow the console to interact with the pack registry.
   This would be typically done via environment-specific constructs like Security Groups, Firewalls, etc.


10. Verify the installation by invoking the pack registry APIs using the curl command. This should result in a 200 response.

  * **HTTPS mode**

    ```bash
    curl --cacert tls.crt -v [REGISTRY_SERVER]/health
    curl --cacert tls.crt -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
    ```

  * **HTTP mode**

    ```bash
    curl -v [REGISTRY_SERVER]/health
    curl -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
    ```

# Configure a Custom Pack Registry on the Palette Console

Once the deployment of the pack registry server is complete, configure it with the console as follows:

1. As a Tenant Administrator, navigate to **Admin Settings** > **Registries** > **Pack Registries**.


2. Click on **Add New Pack Registry** and provide the pack registry name, endpoint, and user credentials.


3. Click on **Confirm** once the details are filled.

# Upload the CA Certificate to Palette

In order to establish a trusted secure connection between Palette and your registry
you will need to upload your certificate to the console.

1. Click on **Tenant Settings** > **Certificates** > **Add A New Certificate**

   Provide the content of your CA Cert (that will be the content of `tls.crt` if
   you followed this tutorial.

   After you saved the content of the certificate, it will take a few minutes for your
   custom packs to appear in the available packs list.

Upon successful registration, users can build and deploy custom packs on to the custom pack registry and
use these packs in their cluster profiles.

**Note:**

To know more about the use of Spectro CLI to push packs to a custom registry and sync it to Palette [click here..](/registries-and-packs/spectro-cli-reference/?cliCommands=cli_push#push)



# Self-Signed Certificates

For self-signed certificates, use the following command to generate certificates.

<br />

  ```bash
  openssl req \
    -newkey rsa:4096 -nodes -sha256 -keyout tls.key \
    -x509 -days 1825 -out tls.crt
  ```

Provide the appropriate values while ensuring that the Common Name matches the registry hostname.

<br />

  ```text
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

  <br />