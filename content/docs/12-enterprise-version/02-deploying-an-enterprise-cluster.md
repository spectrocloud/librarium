---
title: "Install Enterprise Cluster"
metaTitle: "Install Enterprise Cluster"
metaDescription: "Learn how to install self-hosted Palette or convert a self-hosted single node cluster to a highly available three node cluster."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";
import Tabs from 'shared/components/ui/Tabs';

# Install Enterprise Cluster

You have two options for installing Palette. You can use the Palette CLI to install a new self-hosted Palette instance or convert an existing single-node cluster (Quick-Start Mode) to a highly available three-node cluster. Select the tab below that corresponds to your installation type.


<br />

<WarningBox>


Starting with Palette 4.0.0, the Palette CLI, and the Helm Chart, are the only supported methods for installing Palette. The Palette OVA installation method is only available for versions 3.4 and earlier. Refer to the CLI tab below, or the [Kubernetes Install Helm Chart](/enterprise-version#kubernetesinstallhelmchart) guide for additional guidance on how to install Palette.

</WarningBox>


<br />

<Tabs>

<Tabs.TabPane tab="CLI" key="cli">

You install Palette using the Palette Command Line Interface (CLI) that guides you for details to create a configuration file and a three-node enterprise cluster for high availability (HA). You can invoke the Palette CLI on any Linux x86-64 system with the Docker daemon installed and connectivity to VMware vSphere where Palette will be deployed. 


## Prerequisites


- An AMD64 Linux environment with connectivity to the VMware vSphere environment. 



- [Docker](https://docs.docker.com/engine/install/) or equivalent container runtime installed and available on the Linux host.



- Palette CLI installed and available. Refer to the Palette CLI [Install](/palette-cli/install-palette-cli#downloadandsetup) page for guidance.



- Review required VMware vSphere [permissions](/enterprise-version/on-prem-system-requirements#vmwareprivileges).

  <br />

  <InfoBox>

    Refer to the Palette [Self-Hosted Configuration](/enterprise-version/on-prem-system-requirements#self-hostedconfiguration) resource for additional sizing information.

  </InfoBox>


- The following network ports must be accessible for Palette to operate successfully.

  - TCP/443: Inbound to and outbound from the Palette management cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed cluster's Kubernetes API server.


- Ensure you have an SSL certificate that matches the domain name you will assign to Palette. You will need this to enable HTTPS encryption for Palette. Reach out to your network administrator or security team to obtain the SSL certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format. This file is optional.


- Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require persistent storage. Refer to [Zone Tagging](/enterprise-version/on-prem-system-requirements#zonetagging) for information.


- Assigned IP addresses for application workload services, such as Load Balancer services.


- Shared Storage between VMware vSphere hosts.

<br />

<InfoBox>

Self-hosted Palette installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the Palette console. To learn how to install a PCG on VMware, check out the [VMware](/clusters/data-center/vmware) guide.

</InfoBox>

<br />

## Deployment


The video below provides a demonstration of the installation wizard and the prompts you will encounter. Take a moment to watch the video before you begin the installation process. Make sure to use values that are appropriate for your environment. Use the **three-dots Menu** in the lower right corner of the video to expand the video to full screen and to change the playback speed.

  <br />

  `video: title: "palette-cli-install": /./palette-install.mp4`

Use the following steps to install Palette. 


<br />

1. Open a terminal window and invoke the Palette CLI by using the `ec` command to install the enterprise cluster. The interactive CLI prompts you for configuration details and then initiates the installation. For more information about the `ec` subcommand, refer to [Palette Commands](/palette-cli/commands#ec). 

  <br />

  ```bash
  palette ec install
  ```

2. At the **Enterprise Cluster Type** prompt, choose **Palette**.


3. Type `y` if you want to use Ubuntu Pro. Otherwise, type `n`. If you choose to use Ubuntu Pro, you will be prompted to enter your Ubuntu Pro token.


4. Provide the repository URL you received from our support team.


5. Enter the repository credentials.


6. Choose `VMware vSphere` as the cloud type. This is the default.


7. Type an enterprise cluster name.


8. When prompted, enter the information listed in each of the following tables.

  <br />

  #### Environment Configuration

  |**Parameter**| **Description**|
  |:-------------|----------------|
  |**HTTPS Proxy**|Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all EC nodes and all of its target cluster nodes. Example: `https://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.|
  |**HTTP Proxy**|Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all EC nodes and all of its target cluster nodes. Example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.|
  |**No Proxy**|The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: `maas.company.com,10.10.0.0/16`.|
  |**Proxy CA Certificate Filepath**|The default is blank. You can provide the filepath of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`.|
  |**Pod CIDR**|Enter the CIDR pool IP that will be used to assign IP addresses to pods in the EC cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
  |**Service IP Range**|Enter the IP address range that will be used to assign IP addresses to services in the EC cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|

<br />



<br />


9. Provide the Pack & Image Registry configuration values. Use the default registry URL unless you are using a custom registry. If you are using a custom registry, enter the URL, file path, and credentials for the registry.

  <br />

  #### Pack & Image Registry Configuration

  | **Parameter**             | **Description**                         |
  |---------------------------|-----------------------------------------|
  | **Use Default Pack Registry URL** | The default is `https://registry.spectrocloud.com`. Select `y` to use the default registry URL.  |
  | **Registry Type** | Specify the type of registry. Allowed values are `OCI` or `OCI ECR`. |
  | **Registry Name** | Enter the name of the registry. |
  | **Registry Endpoint** | Enter the registry endpoint. |
  | **Registry Base Path** | Enter the registry base path. |
  |**Allow Insecure Connection** | Bypasses x509 verification. Type `Y` if using a vSphere instance with self-signed Transport Layer Security (TLS) certificates. Otherwise, type `n`.|
  | **Registry Username** or **Registry Access Key** | Enter the registry username or the access key if using `OCI ECR`. |
  | **Registry Password** or **Registry Secret Key** | Enter the registry password or the secret key if using `OCI ECR`. |
  | **Registry Region** | Enter the registry region. This option is only available if you are using `OCI ECR`. |
  | **ECR Registry Private** | Type `y` if the registry is private. Otherwise, type `n`. |
  | **Use Public Registry for Images** | Type `y` to use a public registry for images. Type `n` to a different registry for images. If you are using another registry for images, you will be prompted to enter the registry URL, base path, username, and password. |

<br />

10. Next, specify the database storage size to allocate for Palette. The default is 20 GB. Refer to the [size guidelines](/vertex/install-palette-vertex#sizeguidelines) for additional information.



11. The next set of prompts is for the VMware vSphere account information. Enter the information listed in the following table.

  <br />

  #### VMware vSphere Account Information

  |**Parameter**                            | **Description**|
  |-----------------------------------------|----------------|
  |**vSphere Endpoint** | VMware vSphere endpoint. Must be a fully qualified domain name (FQDN) or IP address without a scheme - that is, without an IP protocol, such as `https://`. Example: `vcenter.mycompany.com`.|
  |**vSphere Username** | VMware vSphere account username.|
  |**vSphere Password**| VMware vSphere account password.|
  |**Allow Insecure Connection** | Bypasses x509 verification. Type `Y` if using a VMware vSphere instance with self-signed Transport Layer Security (TLS) certificates. Otherwise, type `n`.|

  <br />

  #### VMware vSphere Cluster Configuration

  This information determines where Palette will be deployed in your VMware vSphere environment. The Palette CLI will use the provided VMware credentials to retrieve information from your VMware vSphere environment and present options for you to select from.

  <br />

  |**Parameter**                            | **Description**|
  |-----------------------------------------|----------------|
  |**Datacenter**| The installer retrieves the Datacenter automatically. |
  |**Folder** | Select the folder that contains the VM instance. |
  | **Cluster** | Select the cluster where you want to deploy Palette. |
  | **Network** | Select the network where you want to deploy Palette. |
  | **Resource Pool** | Select the resource pool where you want to deploy Palette. |
  | **Datastore** | Select the datastore where you want to deploy Palette. |
  |**Fault Domains** | Configure one or more fault domains by selecting values for these properties: Cluster, Network (with network connectivity), Resource Pool, and Storage Type (Datastore or VM Storage Policy). Note that when configuring the Network, if you are using a distributed switch, choose the network that contains the switch. |
  |**NTP Servers** | You can provide a list of Network Time Protocol (NTP) servers.  |
  |**SSH Public Keys** | Provide any public SSH keys to access your Palette VMs. This option opens up your system's default text editor. Vi is the default text editor for most Linux distributions. To review basic vi commands, check out the [vi Commands](https://www.cs.colostate.edu/helpdocs/vi.html) reference. |


12. Specify the IP pool configuration. The placement type can be Static or Dynamic Domain Name Server (DDNS). Choosing static placement creates an IP pool from which VMs are assigned IP addresses. Choosing DDNS assigns IP addresses using DNS.

  <br />

  #### Static Placement Configuration
  | **Parameter**             | **Description**                         |
  |---------------------------|-----------------------------------------|
  | **IP Start range** | Enter the first address in the EC IP pool range.           |
  | **IP End range** | Enter the last address in the EC IP pool range.            |
  | **Network Prefix** | Enter the network prefix for the IP pool range. Valid values are in [0, 32]. Example: `18`. |
  | **Gateway IP Address** | Enter the IP address of the static IP gateway.              |
  | **Name servers** | Comma-separated list of DNS name server IP addresses.       |
  | **Name server search suffixes**  | An optional comma-separated list of DNS search domains. |


<br />


13. The last set of prompts is for the vSphere machine configuration. Enter the information listed in the following table.

  <br />

  #### vSphere Machine Configuration

  |**Parameter**                            | **Description**|
  |-----------------------------------------|----------------|
  | **Number of CPUs** | The number of CPUs allocated to each VM node instance.|
  | **Memory** | The amount of memory allocated to each VM node instance.|
  | **Disk Size** | The size of the disk allocated to each VM node instance.|


  <br />


  The installation process stands up a [kind](https://kind.sigs.k8s.io/) cluster locally that will orchestrate the remainder of the installation. The installation takes some time.

  <br />

  Upon completion, the enterprise cluster configuration file named `ec.yaml` contains the information you provided, and its location is displayed in the terminal. Credentials and tokens are encrypted in the YAML file. 

  <br />

  ```bash hideClipboard
  ==== Enterprise Cluster config saved ====
  Location: :/home/spectro/.palette/ec/ec-20230706150945/ec.yaml
  ```

  <br />

  When the installation is complete, Enterprise Cluster Details that include a URL and default credentials are displayed in the terminal. You will use these to access the Palette system console.

  <br />

  ```bash hideClipboard
  ====================================
  ==== Enterprise Cluster Details ====
  ====================================
  Console URL: https://10.10.189.100/system
  Username: **********
  Password: **********
  ```


14. Copy the URL to the browser to access the system console. You will be prompted to reset the password.

  <br />

  <InfoBox>

  The first time you visit the Palette system console, a warning message about an untrusted SSL certificate may appear. This is expected, as you have not yet uploaded your SSL certificate to Palette. You can ignore this warning message and proceed.

  </InfoBox> 

  <br />

  ![Screenshot of the Palette system console showing Username and Password fields.](/palette_installation_install-on-vmware_palette-system-console.png)

<br />


15. Log in to the system console using the credentials provided in the Enterprise Cluster Details output. After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be redirected to the Palette system console.
  

16. After login, a Summary page is displayed. Palette is installed with a self-signed SSL certificate. To assign a different SSL certificate you must upload the SSL certificate, SSL certificate key, and SSL certificate authority files to Palette. You can upload the files using the Palette system console. Refer to the [Configure HTTPS Encryption](/vertex/system-management/ssl-certificate-management) page for instructions on how to upload the SSL certificate files to Palette.


17. The last step is to start setting up a tenant. To learn how to create a tenant, check out the [Tenant Management](/vertex/system-management/tenant-management) guide. 

  <br />

  ![Screenshot of the Summary page showing where to click Go to Tenant Management button.](/palette_installation_install-on-vmware_goto-tenant-management.png)


# Validate

You can verify the installation is successful if you can access the system console using the IP address provided in Enterprise Cluster Details and if the Summary page displays the **Go to Tenant Management** button.

You can also validate that a three-node Kubernetes cluster is launched and Palette is deployed on it.

<br />

1. Log in to the vCenter Server by using vSphere Client.


2. Navigate to the Datacenter and locate your VM instance. 


3. Select the VM to access its details page, and verify three nodes are listed.


4. Open a web browser session, and use the IP address provided in Enterprise Cluster Details at the completion of the installation to connect to the Palette system console. Copy the IP address to the address bar and append `/system`.


5. Log in using your credentials.


6. A **Summary** page will be displayed that contains a tile with a **Go to Tenant Management** button. After initial installation, the **Summary** page shows there are zero tenants.
 


</Tabs.TabPane>

<Tabs.TabPane tab="OVA" key="ova">


## Enterprise Mode

The Palette Enterprise Mode is a multi-node, highly-available installation of the Palette platform suitable for production purposes. Installation involves instantiating the on-prem platform installer VM and invoking the "Enterprise Cluster Migration" wizard. Please follow [these](/enterprise-version/deploying-the-platform-installer/) steps to deploy the installer VM and observe the [monitoring console](/enterprise-version/deploying-the-platform-installer/#monitorinstallation) to ensure installation is successful. After a successful installation of the platform installer, proceed to enterprise cluster migration.

<br />

<InfoBox>

Deployment of an enterprise cluster is a migration process from the quick start mode. You may choose to deploy the enterprise cluster on day 1 right after instantiating the platform installer VM, or use the system in the quick start mode initially and at a later point invoke the enterprise cluster migration wizard to deploy the enterprise cluster. All the data from the quick start mode is migrated to the enterprise cluster as part of this migration process.

</InfoBox>



1. Open the On-Prem system console from a browser window by navigating to https://&lt;VM IP Address&gt;/system and log in.


2. Navigate to the Enterprise Cluster Migration wizard from the menu on the left-hand side.


3. Enter the vCenter credentials to be used to launch the enterprise cluster. Provide the vCenter server, username, and password. Check the `Use self-signed certificates` if applicable. Validate your credentials and click on `Next` button to proceed to IP Pool Configuration.


4. Enter the IPs to be used for Enterprise Cluster VMs as a `Range` or a `Subnet`. At least 5 IP addresses should be required in the range for the installation and the ongoing management. Provide the details of the `Gateway` and the `Nameserver addresses`. Any search suffixes being used can be entered in the `Nameserver search suffix` box. Click on `Next` to proceed to Cloud Settings.


5. Select the datacenter and the folder to be used for the enterprise cluster VMs. Select the desired compute cluster, resource pools, datastore, and network. For high availability purposes, you may choose to distribute the three VMs across multiple compute clusters. If this is desired, invoke the "Add Domain" option to enter multiple sets of properties.


6. Add SSH Public key and optionally NTP servers and click "Confirm".


7. The Enterprise cluster deployment will proceed through the following three steps:
   * Deployment - A 3 node Kubernetes cluster is launched and Palette Platform is deployed on it. This typically takes 10 mins.
   * Data Migration - Data from the installer VM is migrated to the newly created enterprise cluster.
   * Tenant Migration - If any tenants were created prior to the enterprise cluster migration, which would typically be the case if the system was used in the quick start mode initially, all those tenants, as well as the management of any such tenant clusters previously deployed, will be migrated to the enterprise cluster.


8. Once Enterprise Cluster is fully deployed, the On-Prem System and Management Console should be accessed on this new cluster. The platform installer VM can be safely powered off at this point.

</Tabs.TabPane>

</Tabs>


<br />

# Resources

- [Palette CLI](/palette-cli/install-palette-cli#downloadandsetup)


- [Airgap Install Instructions](/enterprise-version/air-gap-repo)

<br />