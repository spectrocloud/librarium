---
sidebar_label: "Environment Setup with RHEL"
title: "Environment Setup with an Existing RHEL VM"
description: "Learn how to prepare your airgap environment for Palette installation using an existing RHEL VM"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "enterprise", "airgap", "vmware", "vsphere", "rhel"]
keywords: ["self-hosted", "enterprise"]
---

This guide helps you prepare your VMware vSphere airgap environment for Palette installation using an existing Red Hat
Enterprise Linux (RHEL) VM.

You will learn how to execute an appliance binary in your VM that installs the necessary tools to deploy an OCI registry
for hosting Palette images and also assists in starting the Palette installation.

:::info

This guide is for preparing your airgap environment only. For instructions on installing Palette on VMware, refer to the
[Install Palette](./install.md) guide.

:::

## Prerequisites

- An RHEL airgap VM deployed in your VMware vSphere. The VM must be registered with
  [Red Hat](https://access.redhat.com/solutions/253273) and have ports `80` and `443` available. This guide uses RHEL
  version `8.8` as an example.

- The RHEL VM must have a Fully Qualified Domain Name (FQDN) that is DNS resolvable and must be accessible via SSH.

- The RHEL VM must have Podman installed.

- An HTTP file server installed within the RHEL VM to host the Palette files. The file server must serve files from the
  `/var/www/html` directory and have SSL support enabled. Below is a list of common file servers. This guide uses Apache
  as an example.

  - [Apache HTTP Server](https://httpd.apache.org/)

  - [Nginx](https://www.nginx.com/)

  - [Caddy](https://caddyserver.com/)

  :::warning

  Take the necessary steps to secure your file server and ensure it can automatically recover from failure. The file
  server is a critical component of the airgap installation and must be available post-install for Palette to function
  properly.

  :::

- Review the required vSphere [permissions](../../install-on-vmware/vmware-system-requirements.md) and ensure you have
  created the proper custom roles and zone tags. Zone tagging enables dynamic storage allocation across fault domains
  when provisioning workloads that require persistent storage. Refer to
  [Zone Tagging](../../install-on-vmware/vmware-system-requirements.md#zone-tagging) for information.

- The following artifacts must be available in the root home directory of the RHEL airgap VM. You can download the files
  in a system with internet access and then transfer them to your airgap environment. Contact your Palette support
  representative to obtain the latest version of each artifact.
  - RHEL airgap appliance binary. This guide uses version `4.4.2` of the binary as an example.
  - Palette installation binary. This guide uses version `4.4.14` of the binary as an example.

## Prepare for Airgap Installation

1.  Log in to your vCenter environment.

2.  Create a vSphere template folder named `spectro-templates`. Ensure you can access this folder with the user account
    you plan to use when deploying the Palette installation.

3.  Right-click on your cluster or resource group and select **Deploy OVF Template**.

4.  In the **Deploy OVF Template** wizard, enter the following URL to import the Operating System (OS) and Kubernetes
    distribution OVA required for the Palette nodes creation. Contact your Palette support representative to learn if
    the version of Palette you are using requires a new OS and Kubernetes OVA.

    ```url
    https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-1282-0.ova
    ```

    Place the OVA in the **spectro-templates** folder. Append the `r_` prefix, and remove the `.ova` suffix when
    assigning its name and target location. For example, the final output should look like `r_u-2204-0-k-1282-0`. This
    naming convention is required for the installation process to identify the OVA. Refer to the
    [Additional Packs](../../airgap/supplemental-packs.md#additional-ovas) page for a list of additional OS and
    Kubernetes OVAs.

    You can terminate the deployment after the OVA is available in the `spectro-templates` folder. Refer to the
    [Deploy an OVF or OVA Template](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-AFEDC48B-C96F-4088-9C1F-4F0A30E965DE.html)
    guide for more information about deploying an OVA in vCenter.

    :::warning

    If you encounter an error message during the OVA deployment stating that vCenter is unable to retrieve a manifest or
    certificate, refer to this [known issue](https://kb.vmware.com/s/article/79986) from VMware's knowledge base for
    guidance on how to resolve the issue.

    :::

5.  Open a terminal window and SSH into the RHEL airgap VM as a root user with the command below. Replace
    `/path/to/private_key` with the path to your private SSH key, `docs` with the username, and `palette.example.com`
    with the FQDN of the RHEL airgap VM.

    ```shell
    ssh -i /path/to/private_key docs@palette.example.com
    ```

6.  Switch to the `root` user account to complete the remaining steps.

    ```shell
    sudo --login
    ```

7.  Set the VM timezone to Coordinated Universal Time (UTC).

    ```shell
    timedatectl set-timezone UTC
    ```

8.  Ensure that ports `80` and `443` are not in use by your file server, as these ports will be used by the Harbor
    registry that will be installed later.

    Open the `/etc/httpd/conf.d/ssl.conf` file and make the following changes:

    - Replace the line `Listen 443 https` with `Listen 8443 https`.
    - Replace the line `<VirtualHost _default_:443>` with `<VirtualHost _default_:8443>`.

    Save and exit the file.

9.  Next, open the `/etc/httpd/conf/httpd.conf` file and replace the line `Listen 80` with `Listen 8080`. Save and exit
    the file.

10. Restart the Apache HTTP server to apply the configuration changes.

    ```shell
    systemctl restart httpd.service
    ```

11. Allow TCP traffic on ports `80`, `8080`, `443`, and `8443`, then reload the firewall.

    ```shell
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=8080/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=8443/tcp
    firewall-cmd --reload
    ```

    The output displays a success message.

    ```text hideClipboard
    success
    ```

12. Set the `AIRGAP_BUILD` variable as `true`. This is required to execute the RHEL airgap appliance binary.

    ```shell
    export AIRGAP_BUILD=true
    ```

13. Execute the RHEL airgap appliance binary, which installs the tools and configures the manifests that are required to
    set up the Harbor registry and push images.

    ```shell
    chmod +x ./airgap-appliance-v4.4.2-rhel-podman.bin && ./airgap-appliance-v4.4.2-rhel-podman.bin
    ```

    ```text hideClipboard
    Verifying archive integrity...  100%   MD5 checksums are OK. All good.
    Uncompressing Airgap Appliance Setup - 4.4.2  100%
    Setting up  directories and certs
    warning: /opt/spectro/pwgen-2.08-3.el8.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID 2f86d6a1: NOKEY
    Verifying...                          ################################# [100%]
    Preparing...                          ################################# [100%]
    Updating / installing...
    1:pwgen-2.08-3.el8                 ################################# [100%]
    Skipping setting up Nginx and Podman for airgap
    Installing Podman
    Setting up Harbor
    Setting up oras and jq
    Setting up Manifests
    Cleaning up setup files
    Reboot the system for selinux changes to take effect
    ```

14. Reboot your RHEL VM to apply the changes.

    ```shell
    reboot
    ```

    <!-- prettier-ignore -->
    Your SSH connection will be terminated. Start a new SSH session and switch to `sudo` mode before proceeding. Use
    the same commands from steps *5* and *6* of this guide.

15. Issue the following command to configure the Harbor registry. Replace `palette.example.com` with the FQDN of the
    RHEL airgap VM. The script will generate a self-signed certificate for the value you provide.

    ```shell
    chmod +x ./airgap-appliance-v4.4.2-rhel-podman.bin && /bin/airgap-setup.sh palette.example.com
    ```

    The script output will look similar to the example below. It contains the credentials and values you will need when
    completing the installation with the Palette CLI. If you need to review this information in the future, invoke the
    script again.

    ```text hideClipboard
    Setting up SSL Certs
    /opt/spectro/functions.sh: line 118: /etc/nginx/.htpasswd: No such file or directory
    chmod: cannot access '/etc/nginx/.htpasswd': No such file or directory
    mkdir: cannot create directory ‘/etc/nginx/ssl’: No such file or directory
    cp: target '/etc/nginx/ssl' is not a directory
    Setting up Harbor
    setenforce is /usr/sbin/setenforce
    Setup Completed

    Details:
    -------
    Spectro Cloud Repository
    Location: https://palette.example.com:8443
    UserName: spectro
    Password: **************
    CA certificate filepath: /opt/spectro/ssl/server.crt

    Pack OCI Registry
    Endpoint: https://palette.example.com
    Base Content Path: spectro-packs
    CA certificate Filepath: /opt/spectro/ssl/server.crt
    Username: admin
    Password: **************

    Image OCI Registry
    Endpoint: https://palette.example.comv
    Base Content Path: spectro-images
    CA certificate Filepath: /opt/spectro/ssl/server.crt
    Username: admin
    Password: **************
    ```

16. (REVIEW) Update the SSL certificate file and key in the **httpd** service.

    :::warning

    You can skip this step if you plan to use the local Spectro Cloud Repository Location (SCAR) during the
    [Palette installation](#next-steps) process.

    :::

    Open the `/etc/httpd/conf.d/ssl.conf` file and add the path to the certificate and key generated in step **15** of
    this guide:

    - Replace the line `SSLCertificateFile /etc/pki/tls/certs/localhost.crt` with
      `SSLCertificateFile  /opt/spectro/ssl/server.crt`.
    - Replace the line `SSLCertificateKeyFile /etc/pki/tls/private/localhost.key` with
      `SSLCertificateKeyFile /opt/spectro/ssl/server.key`.

    Save and exit the file. Next, restart the HTTP server to apply the changes.

    ```shell
    systemctl restart httpd.service
    ```

17. Execute the Palette installation binary, which pushes Palette images and packs to the Harbor registry.

    ```shell
    chmod +x airgap-4-4-14.bin && ./airgap-4-4-14.bin
    ```

    This step may take some time to complete. A `Setup Completed` message confirms it is finished.

    ```text hideClipboard {8}
    Verifying archive integrity...  100%   MD5 checksums are OK. All good.
    Uncompressing Airgap Setup - Version 4.4.14  100%
    Setting up CLI
    Setting up Manifests
    Setting up Packs
    ...

    Setup Completed
    ```

18. (REVIEW) Grant the Apache user and group access to the `/var/www/html` folder.

    ```shell
    chown -R apache.apache /var/www/html
    ```

## Validate

1.  SSH into the RHEL airgap VM as a root user with the command below. Replace `/path/to/private_key` with the path to
    the private SSH key, `docs` with the username, and `palette.example.com` with the FQDN of the RHEL airgap VM.

    ```shell
    ssh -i /path/to/private_key docs@palette.example.com
    ```

2.  Switch to the `root` user account.

    ```shell
    sudo --login
    ```

3.  Issue the following command to validate that you have successfully completed the airgap setup process. Replace
    `palette.example.com` with the FQDN of the RHEL airgap VM.

    ```shell
    bin/airgap-setup.sh palette.example.com
    ```

    The output must include the registry location and credentials, which must be accessible from within your
    environment.

    ```shell hideClipboard
    Setting up SSL Certs
    /opt/spectro/functions.sh: line 118: /etc/nginx/.htpasswd: No such file or directory
    chmod: cannot access '/etc/nginx/.htpasswd': No such file or directory
    mkdir: cannot create directory ‘/etc/nginx/ssl’: No such file or directory
    cp: target '/etc/nginx/ssl' is not a directory
    Setting up Harbor
    setenforce is /usr/sbin/setenforce
    Setup Completed

    Details:
    -------
    Spectro Cloud Repository
    Location: https://palette.example.com:8443
    UserName: spectro
    Password: **************
    CA certificate filepath: /opt/spectro/ssl/server.crt

    Pack OCI Registry
    Endpoint: https://palette.example.com
    Base Content Path: spectro-packs
    CA certificate Filepath: /opt/spectro/ssl/server.crt
    Username: admin
    Password: **************

    Image OCI Registry
    Endpoint: https://palette.example.comv
    Base Content Path: spectro-images
    CA certificate Filepath: /opt/spectro/ssl/server.crt
    Username: admin
    Password: **************
    ```

## Next Steps

You are now ready to deploy the airgap Palette installation with the Palette CLI. As a root user, issue the Palette CLI
command below to start the installation.

    ```shell
    palette ec install
    ```

Complete all the Palette CLI steps outlined in the [Install Palette](./install.md) guide from the RHEL VM.

:::info

The table below maps the airgap script output values to their respective Palette CLI prompts and example values. The
example values are for reference only.

| Output Value                          | Palette CLI Prompt                   | Example Value                                          |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------------ |
| **Spectro Cloud Repository Location** | **SCAR Location**                    | `https://palette.example.com:8443` or `10.10.1.1:8443` |
| **CA certificate filepath**           | **SCAR CA certificate filepath**     | `/opt/spectro/ssl/server.crt`                          |
| **OCI Registry**                      | **Registry Type**                    | `OCI`                                                  |
| **Pack OCI Registry**                 | **Registry Endpoint**                | `https://palette.example.com` or `10.10.1.1`           |
| **CA certificate Filepath**           | **Registry CA certificate filepath** | `/opt/spectro/ssl/server.crt`                          |
| **Image OCI Registry**                | **Registry Endpoint**                | `https://palette.example.com` or `10.10.1.1`           |
| **CA certificate Filepath**           | **Registry CA certificate filepath** | `/opt/spectro/ssl/server.crt`                          |

When prompted for **Allow Insecure Connection (Bypass x509 Verification)?**, enter `n` to continue and specify the
server certificate file path from the script output.

:::
