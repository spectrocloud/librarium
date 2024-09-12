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

This guide helps you prepare your airgap environment for Palette installation using an existing Red Hat Enterprise Linux
(RHEL) VM available in your VMware vSphere environment.

You will learn how to use an appliance binary that includes all the tools required by Palette to set up the registry
that is required for the installation.

:::info

This guide is for preparing your airgap environment only. For instructions on installing Palette on VMware, refer to the
[Install Palette](./install.md) guide. A checklist of the steps you will complete to prepare your airgap environment for
Palette is available in the [Checklist](./checklist.md) page.

:::

## Prerequisites

- An RHEL airgap VM with connectivity to your VMware vSphere environemnt and ports `80` and `443` available. This guide
  uses RHEL version `8.8` as an example.

- The RHEL VM must have a fully qualified domain name (FQDN) and must be accessible via SSH.

- A valid [RHEL subscription](https://www.redhat.com/en/store/linux-platforms).

- An HTTP file server to host the Palette files. The file server must be accessible from the target environment where
  Palette will be installed and should serve files from the `/var/www/html` directory. Below is a list of common file
  servers. This guide uses Apache as an example.

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
  - An OVA with the operating system and Kubernetes distribution required for the Palette nodes.

## Prepare for Airgap Installation

1. Log in to your vCenter environment.

2. Create a vSphere template folder named `spectro-templates`. Ensure you can access this folder with the user account
   you plan to use when deploying the Palette installation.

3. Right-click on your cluster or resource group and select **Deploy OVF Template**.

4. In the **Deploy OVF Template** wizard, enter the following URL to import the Operating System (OS) and Kubernetes
   distribution OVA required for the installation.

   ```url
   https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-1282-0.ova
   ```

   Place the OVA in the **spectro-templates** folder. Append the `r_` prefix, and remove the `.ova` suffix when
   assigning its name and target location. For example, the final output should look like `r_u-2204-0-k-1282-0`. This
   naming convention is required for the installation process to identify the OVA. Refer to the
   [Additional Packs](../../airgap/supplemental-packs.md#additional-ovas) page for a list of additional OS OVAs.

   You can terminate the deployment after the OVA is available in the `spectro-templates` folder. Refer to the
   [Deploy an OVF or OVA Template](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-AFEDC48B-C96F-4088-9C1F-4F0A30E965DE.html)
   guide for more information about deploying an OVA in vCenter.

   :::warning

   If you encounter an error message during the OVA deployment stating unable to retrieve manifest or certificate, refer
   to this [known issue](https://kb.vmware.com/s/article/79986) from VMware's knowledge base for guidance on how to
   resolve the issue.

   :::

5. Open a terminal window and SSH into the RHEL airgap VM as a root user with the command below. Replace
   `/path/to/private_key` with the path to the private SSH key, `docs` with the username, and `palette.example.com` with
   the FQDN of the RHEL airgap VM.

   ```shell
   ssh -i /path/to/private_key docs@palette.example.com
   ```

6. Switch to the `root` user account to complete the remaining steps.

   ```shell
   sudo --login
   ```

7. Set the VM timezone to UTC.

   ```shell
   timedatectl set-timezone UTC
   ```

8. Register the RHEL VM with Red Hat. Replace `<rhel-username>` and `<rhel-password>` with your RHEL subscription
   credentials.

   ```shell
   subscription-manager register --username <rhel-username> --password <rhel-password>
   ```

9. Ensure ports `80` and `443` are not in use by your file server, as the OCI registry will use these ports. Open the
   `/etc/httpd/conf.d/ssl.conf` file and change the port from `443` to `8443`.

10. Next, open the `/etc/httpd/conf/httpd.conf` file and change the port from `80` to `8080`.

11. Restart the HTTP server to apply the configuration changes.

    ```shell
    systemctl restart httpd.service
    ```

12. Allow TCP traffic on ports `80`, `8080`, `443`, and `8443`, then reload the firewall.

    ```shell
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=8080/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=8443/tcp
    firewall-cmd --reload
    ```

13. Set the `AIRGAP_BUILD` variable as `true`. This is required for the execution of the RHEL airgap appliance binary.

    ```shell
    export AIRGAP_BUILD=true
    ```

14. Execute the RHEL airgap appliance binary.

    ```shell
    ./airgap-appliance-v4.4.2-rhel-podman.bin
    ```

    ```text hideClipboard
    insert output
    ```

15. Initialize the airgap configuration process by issuing the following command. Replace `<FQDN-RHEL-VM>` with the FQDN
    of the RHEL airgap VM. The script will generate a self-signed certificate for the value you provide.

    ```shell
    /bin/airgap-setup.sh <FQDN-RHEL-VM>
    ```

    The script output will look similar to the example below. It contains credentials and values you will need when
    completing the installation with the Palette CLI. If you need to review this information in the future, invoke the
    script again.

    ```text hideClipboard
    insert output
    ```

16. Update the **SCAR CA** certificate filepath in the **httpd** service. You can skip this step if you plan to use the
    local SCAR during the Palette installation process.

    Open the `/etc/httpd/conf.d/ssl.conf` fil, locate the SSLCertificateFile and SSLCertificateKeyFile lines, and update
    them with the path to the certificates generated in step **15** of this guide.

    ```text
    SSLCertificateFile - /opt/spectro/ssl/server.crt
    SSLCertificateKeyFile - /opt/spectro/ssl/server.key
    ```

    Next, restart the HTTP server for the changes to tafe effect.

    ```shell
    systemctl restart httpd.service
    ```

17. Execute the Palette installation binary. This will push the required images to the registry.

    ```shell
    chmod +x airgap-4-4-14.bin && ./airgap-4-4-14.bin
    ```

18. Grant the Apache user and group access to the `/var/www/html` folder.

    ```shell
    chown -R apache.apache /var/www/html
    ```

## Validate

Use the following steps to validate that you've successfully completed the airgap setup process.

1.  SSH into the RHEL airgap VM as a root user with the command below. Replace `/path/to/private_key` with the path to
    the private SSH key, `docs` with the username, and `palette.example.com` with the FQDN of the RHEL airgap VM.

    ```shell
    ssh -i /path/to/private_key docs@palette.example.com
    ```

2.  Switch to the `root` user account.

    ```shell
    sudo --login
    ```

3.  Issue the following command to validate that you've successfully completed the airgap setup process. Replace the
    hostname or IP address with the hostname or IP address of the RHEL airgap VM.

    ```shell
    bin/airgap-setup.sh palette.example.com
    ```

4.  Verify you have the values and credentials in the output.

        ```shell hideClipboard
        Setting up SSL Certs
        Setting up Harbor


        Details:
        -------
        Spectro Cloud Repository
        Location: https://palette.example.com:8443
        UserName: ********
        Password: ********
        CA certificate filepath: /opt/spectro/ssl/server.crt

        Pack OCI Registry
        Endpoint: https://palette.example.com
        Base Content Path: spectro-packs
        CA certificate Filepath: /opt/spectro/ssl/server.crt
        Username: ********
        Password: ********

        Image OCI Registry
        Endpoint: https://palette.example.com
        Base Content Path: spectro-images
        CA certificate Filepath: /opt/spectro/ssl/server.crt
        Username: ********
        Password: ********
        ```

## Next Steps

You are now ready to deploy the airgap Palette installation with the Palette CLI. As a root user, when you are ready to
proceed with the install, issue the Palette CLI command below to start the installation. The Palette CLI is already
installed in the RHEL airgap VM and ready to use.

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
server certificate filepath from the script output.

:::
