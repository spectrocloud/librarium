---
sidebar_label: "Add a Custom Registry"
title: "Add a Custom Registry"
description: "Learn how to create and use custom made packs and registries in Spectro Cloud"
icon: ""
hide_table_of_contents: false
sidebar_position: 0
---



# Add Custom Registries

Setting up a custom pack registry is a two-step process. The first step is to deploy a pack registry server using a Docker image provided by us. While deploying a pack registry server, you can employ a TLS certificate from a Certificate Authority (CA) or a self-signed certificate. The current guide will provide instructions for both methods - using TLS and self-signed certificates. You can check out the [Advanced Configuration](advanced-configuration.md) guide to learn about the customization options while deploying a pack registry server.

After deploying a pack registry server, the next step is configuring the pack registry server in Palette. Once you finish configuring the pack registry server in Palette, Palette will synchronize the pack contents from the pack registry server periodically. 

## Prerequisites

* Ensure you have a Docker container runtime Docker to be installed on the machine.


* The HTTP utility *htpasswd* is required to be installed for user authentication encryption.


* The minimum machine compute specifications are 1 vCPU and 2 GB Memory.


* Firewall ports 443/80 are required to be opened on the machine to allow traffic from the Palette console and Spectro CLI tool.

* [OpenSSL](https://www.openssl.org/source/) if creating a self-signed certificate. Refer to the [Self-Signed Certificates](#self-signed-certificates) section below for more guidance.

:::warning

Please ensure that the ports 443 and 80 are exclusively allocated to the registry server and are not in use by other processes.

:::

## Deploy Pack Registry Server with Let's Encrypt

We provide a Docker image for setting up a pack registry server. Use the following steps to deploy a pack registry server using the designated Docker image and a TLS certificate issued by [Let's Encrypt](https://letsencrypt.org/).
<br />

1. Create a folder that contains an httppasswd file.
<br />

  ```bash
  mkdir spectropaxconfig
  ```

2. Create a htpasswd file.
<br />

  ```shell
  htpasswd -Bbn admin "yourPasswordHere" > spectropaxconfig/htpasswd-basic
  ```


3. Create a pax registry configuration file titled **myconfig.yml** in the **spectropaxconfig** directory. The YAML code block below displays the sample content for the **myconfig.yml** file. The current example assumes that your pack registry server will be hosted at `yourhost.companydomain.com` and the email id for notifications is `you@companydomain.com`. Replace the `host` and `email` attribute values as applicable to you. 
<br />

  ```yaml
  version: 0.1
  log:
    level: debug
  storage: inmemory
  http:
    addr: :5000
    tls:
      letsencrypt:
        cachefile: /etc/spectropaxconfig/le-cache
        email: you@companydomain.com
        hosts: 
        - yourhost.companydomain.com 
  auth:
    htpasswd:
      realm: basic-realm
      path: /etc/spectropaxconfig/htpasswd-basic
  ```

3. Start the container image with the following flags.

<br />

  ```bash
  docker run  \
      --rm \
      -p 443:5000 \
      --name spectro-registry \
      --volume $(pwd)/spectropaxconfig/:/etc/spectropaxconfig/ \
      gcr.io/spectro-images-public/release/spectro-registry:4.0.2  \
      serve /etc/spectropaxconfig/myconfig.yml
  ```

You can now access the pack registry at `https://yourhost.companydomain.com/v1/`.
You will be prompted to give the user admin and the password of your choice.

## Deploy a Pack Registry Server with Self-Signed Certificates

The following steps need to be performed to deploy the pack registry server using self-signed certificates:

1. Configure the user credentials by using the `htpasswd` utility and store the credentials in a file locally. This file will be mounted inside the pack registry docker container.
<br />

  ```bash
  mkdir -p /root/auth
  ```

2. For admin users, the command below has a placeholder to specify your unique secure password for admin users.
<br />

  ```bash
  htpasswd -Bbn admin "yourPasswordHere" > /root/auth/htpasswd-basic
  ```

3. For other users. The following command has the placeholder to specify your unique secure password for read-only users.
<br />

  ```bash
  htpasswd -Bbn spectro "yourPasswordHere" >> /root/auth/htpasswd-basic
  ```

4. If HTTPS mode is used, create a directory called `certs`.
<br />

  ```shell
  mkdir -p /root/certs
  ```

5. Copy the **tls.crt** and **tls.key** files from the CA into the **/roots/certs** directory. This directory will be mounted inside the registry Docker container. 


6. Pack contents in a pack registry can be stored locally on the host or an external file system.
An external file system is recommended so that the pack contents can be mounted on another pack
registry instance in the event of restarts and failures.
Create a directory or mount an external volume to the desired storage location. Example: `/root/data`


7. Issue the following command to pull the pack registry server image. The image will help you instantiate a Docker container as a pack registry server.  
<br />

  ```shell
  docker pull gcr.io/spectro-images-public/release/spectro-registry:4.0.2
  ```

8. Use the `docker run` command to instantiate a Docker container. If you encounter an error while instantiating the Docker container, below are some common scenarios and troubleshooting tips. 

    * The Registry CLI login command fails with the error message `x509: cannot validate certificate for ip_address, because it doesn't contain any IP SANs`. The error occurs when a self-signed certificate is created using an IP address rather than a hostname. To resolve the error, recreate the certificate to include an IP SAN or use a DNS name instead of an IP address.

    * The Registry CLI login command fails with the error message `x509: certificate signed by unknown authority`. The error occurs when the self-signed certificate is invalid. To resolve the error, you must configure the host where CLI is installed to trust the certificate.

<Tabs>

<TabItem label="HTTPS" value="https-1">


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
    gcr.io/spectro-images-public/release/spectro-registry:4.0.2
```

</TabItem>

<TabItem label="HTTP" value="http-1">


```shell
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
    gcr.io/spectro-images-public/release/spectro-registry:4.0.2
  ```

<br />

:::warning

Registry servers configured in HTTP mode require the `--insecure` CLI flag when using the Spectro Cloud CLI's `login` command.

<br />

```shell
spectro registry login --insecure http://example.com:5000
```

:::

</TabItem>

</Tabs> 
 
<br />


9. Expose the container host's port publicly to allow the console to interact with the pack registry.
   This would be typically done via environment-specific constructs like Security Groups, Firewalls, etc.


10. Verify the installation by invoking the pack registry APIs using the curl command. This should result in a 200 response.

<Tabs>

<TabItem label="HTTPS" value="https-2">

  ```bash
  curl --cacert tls.crt -v [REGISTRY_SERVER]/health
  curl --cacert tls.crt -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
  ```

</TabItem>

<TabItem label="HTTP" value="http-2">

  ```bash
  curl -v [REGISTRY_SERVER]/health
  curl -v -u [USERNAME] [REGISTRY_SERVER]/v1/_catalog
  ```

</TabItem>

</Tabs> 



## Configure a Custom Pack Registry in Palette

Once you deploy the pack registry server, use the following steps to configure the pack registry server in Palette.
<br />

1. Log in to Palette, and switch to the tenant admin view. 


2. Navigate to the **Tenant Settings** > **Registries** > **Pack Registries** section.


3. Click on the **Add New Pack Registry**. Palette will open a pop-up window asking for the fields to configure a pack registry server, as highlighted in the screenshot below. 

  ![A screenshot highlighting the fields to configure a custom pack registry. ](/registries-and-packs_adding-a-custom-registry-tls_certificate.png)


4. Provide the pack registry server name, endpoint, and user credentials in the pop-up window. Ensure to use an "https://" prefix in the pack registry server endpoint.  


5. If you want Palette to establish a secure and encrypted HTTPS connection with your pack registry server, upload the certificate in the **TLS Configuration** section. The certificate file must be in the PEM format and have a complete trust chain. 

  If you used a TLS certificate issued by a CA while configuring the pack registry server, check with your CA to obtain a certificate chain. If you used a self-signed certificate, upload the entire certificate trust chain. The file content must have the server, the intermediate, and the root certificates. 

  Once you upload the *.pem* certificate file and click the **Validate** button, Palette will perform the TLS verification to affirm the certificate's authenticity before establishing a communication channel. 


6. Select the **Insecure Skip TLS Verify** checkbox if you do not want an HTTPS connection between Palette and your pack registry server. If you upload a TLS certificate and also select the **Insecure Skip TLS Verify** checkbox. The **Insecure Skip TLS Verify** checkbox value will take precedence in that case. 


7. Click the **Confirm** button to finish configuring the pack registry server. After you finish the configuration, Palette will periodically synchronize with the pack registry server to download pack updates, if any.  


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

  ```text hideClipboard
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