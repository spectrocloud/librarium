---
sidebar_label: "VMware vSphere Airgap Instructions"
title: "VMware vSphere Airgap Instructions"
description: "Learn how to install Palette in an air gap environment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "enterprise", "airgap", "vmware", "vsphere"]
keywords: ["self-hosted", "enterprise"]
---

This guide provides instructions for preparing your airgap environment for a Palette installation, by ensuring you
complete all the required preparatory steps shown in the diagram. The installation process is covered in the respective
installation guides for each platform.

![Overview diagram of the pre-install steps eager-load](/vertex_airgap_vmware-vsphere-airgap-instructions_order-operations.png)


## Prerequisites

- Download the following OVAs:
  - The Palette VerteX installation OVA.
  - The installation OVA that deploys and initializes the airgap support VM.
  - An OVA with the operating system and Kubernetes distribution required for the VerteX nodes.

   For sensitive environments, you can download the OVAs to a system with internet access and then transfer them to your airgap environment.



- The airgap support VM requires the following resources:

  - 6 CPU

  - 8 GB of Memory

  - 120 GB of disk space available for the airgap support VM.

- Dynamic Host Configuration Protocol (DHCP) is required for the airgap support VM so that you can access the VM with
  SSH. You can disable DHCP or modify the IP address after the airgap support VM is deployed.

- Review the required vSphere [permissions](../install-on-vmware/vmware-system-requirements.md). Ensure you have created
  the proper custom roles and zone tags. Zone tagging is required for dynamic storage allocation across fault domains
  when provisioning workloads that require persistent storage. Refer to
  [Zone Tagging](../install-on-vmware/vmware-system-requirements.md#zone-tagging) for information.

<br />

:::info

Self-hosted Palette installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not
require a separate, user-installed PCG. However, you can deploy additional PCG instances as needed to support
provisioning into remote data centers that do not have a direct incoming connection to Palette. To learn how to install
a PCG on VMware, check out the [VMware](../../../clusters/data-center/vmware.md) guide.

:::

<br />

## Instructions

Complete the following steps before deploying the airgap Palette installation.

1.  Log in to your vCenter environment.

2.  Create a vSphere VM and Template folder with the name `spectro-templates`. Ensure this folder is accessible by the
    user account you will use to deploy the airgap Palette installation.

3.  Right click on your cluster or resource group and select **Deploy OVF Template**.

4.  In the **Deploy OVF Template** wizard, provide the URL below to import the Operating System (OS) and Kubernetes
    distribution OVA required for the install. Place the OVA in the **spectro-templates** folder. Append the `r_`
    prefix, and remove the `.ova` suffix when assiging a name and target location. For example, the final output should
    look like `r_u-2004-0-k-12610`. This naming convention is required for the install process to identify the OVA.
    Refer to the [Supplement Packs](./supplemental-packs.md#additional-ovas) page for a list of additional OS OVAs.

        ```url
         https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
        ```

    You can terminate the deployment after the OVA is available in the `spectro-templates` folder. Refer to the
    [Deploy an OVF or OVA Template](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-AFEDC48B-C96F-4088-9C1F-4F0A30E965DE.html)
    guide for more information about deploying an OVA in vCenter.

    :::warning

    If you encounter an error message during the OVA deployment stating unable to retrieve manifest, or certificate,
    refer to this [known issue](https://kb.vmware.com/s/article/79986) from VMware's knowledge base for guidance on how
    to resolve the issue.

    :::

5.  Next, deploy the airgap install OVA by using the **Deploy OVF Template** wizard again in vSphere. Insert the Palette
    install OVA URL in the **URL** field. The URL is provided to you by your Palette support representative. Click on
    **Next** to continue.

    ![View of the OVF deploy wizard](/vertex_airgap_vmware-vsphere-airgap-instructions_ovf-wizard.png)

6.  Assign a name to the virtual machine and select a target location. Click on **Next** to continue.

7.  Select a compute resource and click on **Next** to continue.

8.  Review the details and click on **Ignore All** in any of the warning messages. The OVA contains a self-signed
    certificate which is causing vSphere to issue a warning. Click on **Next** to continue.

9.  Select the storage location and click on **Next** to continue.

10. Select the network and click on **Next** to continue.

11. The last step is to customize the template. Review the table below to learn more about each field. Click on **Next**
    after you have completed the customization to continue.

    | Parameter                                  | Description                                                                                                                                                            | Required |
    | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
    | **Encoded user-data**                      | Enter the base64 encoded user-data for additional boot-up customization. You can leave this field empty.                                                               | No       |
    | **SSH Public Keys**                        | Provide the SSH public keys for the user account you will use to access the airgap support VM. You need to provide at least one SSH public key to access the instance. | Yes      |
    | **Default User's password**                | Enter the password for the user account you will use to access the airgap support VM. You will be asked to change this password the first time you log in through SSH. | Yes      |
    | **A Unique Instance ID for this instance** | Enter a unique instance ID for the airgap support VM. The default value is `id-ovf`.                                                                                   | Yes      |
    | **Hostname**                               | Enter a hostname for the airgap support VM. For example, `palette.example.com`. The default value is `ubuntuguest`.                                                    | Yes      |
    | **Url to seed instance data from**         | You can specify a URL to seed instance data from. You can leave this value empty.                                                                                      | No       |

12. Review the details and click on **Finish** to deploy the airgap support VM.

13. It takes a while for the airgap support VM to deploy, approximately 45 min or more depending on your internet
    connection. The download of the OVA takes up majority of the time. The image is over 30 GB and contains all the
    dependencies required to deploy a Palette. Once the deployment is complete, the airgap support VM is displayed in
    the vSphere inventory. The VM will be powered off. Power on the VM to continue.

14. SSH into the airgap support VM. Use the following command to SSH into the VM. Replace the IP address below with the
    IP address or hostname of the airgap support VM. The default user account is `ubuntu`. Replace the path to the
    private SSH key and the IP address with the IP address or domain name of the airgap support VM.

    ```shell
    ssh -identity_file /path/to/private/key ubuntu@palette.example.com
    ```

15. Change the password for the `ubuntu` user account. You will be prompted to change the password the first time you
    log in through SSH. The new password must meet the following requirements:

    - At least 14 characters long
    - Palindromes are not allowed
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 number
    - At least 1 special character

16. Once you change the password, the SSH session will be terminated. SSH back into the airgap support VM with the new
    password.

    :::info

    You may receive a warning stating the new password is already used. You can ignore this message and SSH back into
    the airgap support VM with the new password.

    ```shell hideClipboard
    Password has been already used. Choose another.
    passwd: Have exhausted maximum number of retries for service
    passwd: password unchanged
    Connection to palette.example.com closed.
    ```

17. If you want to assign a static IP address to the airgap support VM, you can do so now. Click on the box below to
    expand the instructions. Otherwise, proceed to the next step.

  <details>
  <summary>Assign a static IP address</summary>

    Create an empty file to disable cloud-init from overriding the new network configurations you will add.

    ```shell
    sudo touch /etc/cloud/cloud-init.disabled
    ```

    Issue the following command to update cloud-init. Select **VMware** from the wizard Menu when prompted. The command will disable cloud-init from managing the network configuration.

    ```shell
    sudo dpkg-reconfigure cloud-init
    ```

    Next, create a file to configure the network settings.

    ```shell
    sudo vi /etc/netplan/01-netcfg.yaml
    ```

    Modify the file to look like the example below. Replace the IP address, gateway, and DNS server with your network settings. Save the file and exit the text editor.

    ```yaml
    network:
      version: 2
      renderer: networkd
      ethernets:
        ens192:
          dhcp4: false
          addresses:
            - 10.1.1.0/18
          gateway4: 2.2.2.2
          nameservers:
              addresses: [1.1.1.1]
    ```

:::tip

Press `i` to enter insert mode in the text editor. Press `esc` to exit insert mode. Type `:wq` to save the file and exit
the text editor.

:::

    Issue the following command to apply the changes.

    ```shell
    sudo netplan apply
    ```

  </details>

18. Switch to the `root` user account. You will need to use the `root` user account to complete the remaining steps.

    ```shell
    sudo --login
    ```

19. Start the airgap initialization process by issuing the following command. The script requires the hostname or IP
    address of the airgap support VM. Choose the preferred method for your environment. Be aware that the script will
    generate a self-signed certificate for the value you provide.

        <Tabs>
        <TabItem label="Domain Name" value="domain">

        ```shell
        /bin/airgap-setup.sh palette.example.com
        ```

        The output of the script will look similar to the example below.

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

        </TabItem>

        <TabItem label="IP Address" value="ip-address">

        ```shell
        /bin/airgap-setup.sh 10.10.1.1
        ```

        The output of the script will look similar to the example below.

        ```shell hideClipboard
        Setting up SSL Certs
        Setting up Harbor

        Details:
        -------
        Spectro Cloud Repository
        Location: 10.10.1.1:8443
        UserName: ********
        Password: ********
        CA certificate filepath: /opt/spectro/ssl/server.crt

        Pack OCI Registry
        Endpoint: 10.10.1.1
        Base Content Path: spectro-packs
        CA certificate Filepath: /opt/spectro/ssl/server.crt
        Username: ********
        Password: ********

        Image OCI Registry
        Endpoint: 10.10.1.1
        Base Content Path: spectro-images
        CA certificate Filepath: /opt/spectro/ssl/server.crt
        Username: ********
        Password: ********
        ```

        </TabItem>
        </Tabs>

20. The output of the script contains credentials and values you will need when completing the install with the Palette
    CLI. If you need to review information again, invoke the script again.

21. Review the [Additional Packs](./supplemental-packs.md) page and identify any additional packs you want to add to
    your OCI registry. By default, the installation only includes the minimum required packs. You can also add
    additional packs after the install is complete.

You now have completed the preparation steps for an airgap installation. Check out the [Validate](#validate) section to
ensure the airgap setup process completed successfully. After you validate the airgap setup process completed, review
the [Next Steps](#next-steps)

:::warning

Do not power off the airgap support VM. The airgap support VM is required for Palette to function properly and must
remain available at all time. If for some reason the airgap support VM is powered off, power the VM back on and restart
the required services by navigating to the **/opt/spectro/harbor** directory and issuing the following command.

```shell
sudo docker compose up --detach
```

:::

## Validate

Use the following steps to validate the airgap setup process completed successfully.

1.  SSH into to the airgap support VM.

2.  Switch to the `root` user account.

    ```shell
    sudo --login
    ```

3.  Issue the following command to validate the airgap setup process completed successfully. Replace the hostname or IP
    address with the hostname or IP address of the airgap support VM.

    ```shell
    bin/airgap-setup.sh palette.example.com
    ```

4.  Verify you have the values and credentials in the output.

## Next Steps

You are now ready to deploy the airgap Palette installation with the Palette CLI. As a root user, when you are ready to
proceed with the install, issue the Palette CLI command below to start the install. The Palette CLI is already installed
in the airgap support VM and ready to use.

    ```shell
    palette ec install
    ```

Complete all the Palette CLI steps outlined in the [VMware Install Instructions](../install-on-vmware/install.md) guide
from the airgap support VM.

:::info

The table below provides a mapping of the airgap script output values and the Palette CLI prompt the value is used. The
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
