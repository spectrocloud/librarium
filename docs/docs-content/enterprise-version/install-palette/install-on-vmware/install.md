---
sidebar_label: "Instructions"
title: "Install Palette on VMware"
description: "Learn how to install Palette on VMware."
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["palette", "self-hosted", "vmware"]
---

Deployment of an enterprise cluster is a migration process from the quick start mode. You may choose to deploy the
enterprise cluster on day-1 right after instantiating the platform installer VM, or use the system in the quick start
mode initially and at a later point invoke the enterprise cluster migration wizard to deploy the enterprise cluster. All
the data from the quick start mode is migrated to the enterprise cluster as part of this migration process.

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

6. Open the On-Prem system console from a browser window by navigating to https://&lt;VM IP Address&gt;/system and log
   in.

7. Navigate to the Enterprise Cluster Migration wizard from the menu on the left-hand side.

8. Enter the vCenter credentials to be used to launch the enterprise cluster. Provide the vCenter server, username, and
   password. Check the `Use self-signed certificates` if applicable. Validate your credentials and click on `Next`
   button to proceed to IP Pool Configuration.

9. Enter the IPs to be used for Enterprise Cluster VMs as a `Range` or a `Subnet`. At least five IP addresses should be
   required in the range for the installation and the ongoing management. Provide the details of the `Gateway` and the
   `Nameserver addresses`. Any search suffixes being used can be entered in the `Nameserver search suffix` box. Click on
   `Next` to proceed to Cloud Settings.

10. Select the datacenter and the folder to be used for the enterprise cluster VMs. Select the desired compute cluster,
    resource pools, datastore, and network. For high availability purposes, you may choose to distribute the three VMs
    across multiple compute clusters. If this is desired, invoke the "Add Domain" option to enter multiple sets of
    properties.

11. Add SSH Public key and optionally NTP servers and click "Confirm".

12. The Enterprise cluster deployment will proceed through the following three steps:

- Deployment - A 3 node Kubernetes cluster is launched and Palette Platform is deployed on it. This typically takes 10
  mins.
- Data Migration - Data from the installer VM is migrated to the newly created enterprise cluster.
- Tenant Migration - If any tenants were created prior to the enterprise cluster migration, which would typically be the
  case if the system was used in the quick start mode initially, all those tenants, as well as the management of any
  such tenant clusters previously deployed, will be migrated to the enterprise cluster.

14. Once Enterprise Cluster is fully deployed, the On-Prem System and Management Console should be accessed on this new
    cluster. The platform installer VM can be safely powered off at this point.

## Resources

- [Palette CLI](../../../palette-cli/install-palette-cli.md)

- [Airgap Install Instructions](airgap-instructions.md)

- [VMware vSphere permissions](vmware-system-requirements.md)
