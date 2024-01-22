---
sidebar_label: "Install Using Quick-Start Mode"
title: "VMware Quick Start Installatio"
description: "Learn how to install self-hosted Palette by deploying a single node instance."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["self-hosted", "enterprise"]
---

The Palette On-Prem Quick Start Mode is a single node installation of the Palette platform, used for PoC environments to
quickly understand the capabilities of the Palette platform. It is not recommended for Production deployments (see
Enterprise Mode for production deployments).

As a prerequisite, download the platform installer OVA using the <Tooltip trigger={<u>link</u>}>Please

<a href="https://www.spectrocloud.com/contact/">contact us</a> to receive download instructions.</Tooltip> provided, and
upload it into vCenter.

## Deploy Platform Installer

1. Log in to the vSphere console and navigate to VMs and Templates.
2. Navigate to the Datacenter and folder you would like to use for the installation.
3. Right-click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template.
4. Complete all the steps of the OVF deployment wizard. Provide values for various fields as follows:

   - URL: &lt;Location of the platform installer&gt;
   - Virtual Machine Name: &lt;vm name&gt;
   - Folder: &lt;Select desired folder&gt;
   - Select the desired Datacenter, Storage, and Network for the platform installer VM as you proceed through the next
     steps. The Platform installer VM requires an outgoing internet connection. Select a network that provides this
     access directly, or via a proxy.
   - Customize the template as follows:

     - Name: &lt;The name to identify the platform installer&gt;
     - SSH Public Keys: Create a new SSH key pair (or pick an existing one). Enter the public key in this field. The
       public key will be installed in the installer VM to provide SSH access, as the user `ubuntu`. This is useful for
       troubleshooting purposes.
     - Monitoring Console Password: A monitoring console is deployed in the platform installer VM to provide detailed
       information about the installation progress as well as to provide access to various logs. This console can be
       accessed after the VM is powered on at https://&lt;VM IP Address&gt;:5080. The default monitoring console
       credentials are:

       - User Name: admin
       - Password: admin

       Provide a different password for the monitoring console if desired. Leave the field blank to accept the default
       password.

     - Pod CIDR: Optional - provide an IP range exclusive to pods. This range should be different to prevent an overlap
       with your network CIDR. (e.g: 192.168.0.0/16)
     - Service cluster IP range: Optional - assign an IP range in the CIDR format exclusive to the service clusters.
       This range also must not overlap with either the pod CIDR range or your network CIDR. (e.g: 10.96.0.0/12)
     - Static IP Address: &lt;VM IP Address&gt; Optional IP address (e.g: 192.168.10.15) to be specified only if static
       IP allocation is desired. DHCP is used by default.
     - Static IP subnet prefix: &lt;Network Prefix&gt; Static IP subnet prefix (e.g: 18), required only for static IP
       allocation.
     - Static IP gateway: &lt;Gateway IP Address&gt; (e.g: 192.168.0.1) required only for static IP allocation.
     - Static IP DNS: &lt;Name servers&gt; Comma separated DNS addresses (e.g: 8.8.8.8, 192.168.0.8), required only for
       static IP allocation.
     - HTTP Proxy: &lt;endpoint for the http proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_. An
       optional setting, required only if a proxy is used for outbound connections.
     - HTTPS Proxy: &lt;endpoint for the https proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_. An
       optional setting, required only if a proxy is used for outbound connections.
     - NO Proxy: &lt;comma-separated list of vCenter server, local network CIDR, hostnames, domain names that should be
       excluded from proxying&gt;, e.g: _vcenter.company.com_,10.10.0.0/16.
     - Spectro Cloud Repository settings: The platform installer downloads various platform artifacts from a repository.
       Currently, this repository is hosted by Palette and the installer VM needs to have an outgoing internet
       connection to the repository. Upcoming releases will enable the option to privately host a dedicated repository
       to avoid having to connect outside. This option is currently unavailable. Leave all the fields under Palette
       Repository settings blank

   - Finish the OVF deployment wizard and wait for the template to be created. This may take a few minutes as the
     template is initially downloaded.

5. Power on the VM.

## Monitor Installation

The platform installer contains a web application called the Supervisor, to provide detailed progress of the
installation. After the VM is powered on, perform the following steps to ensure installation is completed successfully.

1. Open the Supervisor application in a browser window by navigating to https://&lt;VM IP Address&gt;:5080.
2. Observe the installation status in the Status tab. The page auto-refreshes to provide updated installation progress.
3. Once the final installation step is complete, you will see URLs to navigate to the On-Prem System Console as well as
   the Management Console.
   - On-Prem System Console: Initial login:admin/admin
   - Management Console: Tenant credentials to be created and used
     [Configure System for First Time](#initial-configuration).
4. Navigate to the On-Prem System Console to perform the initial configuration. Additional administration tasks like
   SMTP setup, certificate management, etc. can also be performed from the On-Prem System Console.

:::info Typically, the installation takes around 10 mins after powering on the virtual machine. If the installation
fails or takes an unusually long time, please look for failure messages in the install status page, or access system
logs from the "Logs" tab to get detailed information about the failure. :::

## Initial Configuration

The On-Prem System Console provides options for performing various administrative setup tasks. Most of these are
optional and can be performed at any later time. To quickly start using the platform's functionality, all that is needed
is to create the first tenant and activate it.

1. Open the system console. You can access the system console by opening a browser window and typing in the IP address
   of the platform installer VM or the custom domain name if configured. Append `/system` to the URL to access the
   system console. Example `https://10.10.10.100/system`.

2. Log in using username: 'admin' and password: 'admin'.

3. Reset the default password.

4. Choose "Quick Start" when prompted for a choice for the startup mode.

5. Navigate to the Tenant Management section and create your first tenant.

6. Copy the tenant activation link and invoke it in a browser window to activate the newly created tenant.

7. Enter the desired password and proceed and login as a tenant into the Management Console.

Next, continue to perform various tasks as desired from the management console like creating gateways, cloud accounts,
cluster profiles, and launching of clusters.
