---
title: "Install on VMware vSphere"
metaTitle: "Install on VMware vSphere"
metaDescription: "Install Palette on VMware vSphere."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Install Palette VerteX on VMware vSphere

Palette provides an installer command line interface (CLI) that prompts you for details and creates the Private Cloud Gateway (PCG) configuration file needed to establish a secure connection from your internal network to the internet-accessible Palette VerteX instance. You can invoke the installer on any Linux x86-64 system that has the docker daemon installed and connectivity to the Palette Management console or VMware vSphere. 

The PCG creates a three-node enterprise cluster for high availability (HA): 6 vCPU, 12 GB memory, 70 GB storage.

# Prerequisites

- A Palette VerteX account. Refer to [Access Palette VerteX](/vertex#accesspalettevertex).


- Downloaded PCG installer CLI.


- An Ubuntu Pro Subscription. Ubuntu Pro is FIPS 140-2 certified.


- An Ubuntu Pro token.


- In VMware environments with internet connectivity, you will need added port permissions to inbound rules for security groups to provide Palette VerteX connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication.


- A new or existing SSH key pair to access the PCG installer for any troubleshooting.

<!-- <InfoBox>

Self-hosted Palette installations provide a system PCG out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the management console.

</InfoBox> -->


# Install the PCG

1. Download the PCG installer. Refer to [Download and Setup](/palette-cli/install-palette-cli#downloadandsetup).


2. Invoke the installer by using the following command. The installer prompts you for details to create the PCG configuration file and then initiates the installation.

```bash
palette pcg install
```


3. When prompted to enable Ubuntu Pro, type `y` and provide your Ubuntu Pro token.  


4. When prompted to enable FIPS, type `y`. The repository location is displayed. 


5. Type your Palette username and password.


6. Choose ``VMware vSphere`` as the cloud type.


7. When prompted, enter the information listed in each of the following tables.


<!-- #### Palette PCG Parameters >DOES THIS SECTION APPLY?

|**Parameter**       | **Description**|
|:-----------------------------|---------------|
|**Cloud Type**| Choose ``VMware vSphere``.|
|**Private Cloud Gateway Name** | Enter a custom name for the PCG. Example: ``vmware-vsphere-pcg-1``.|
|**Share PCG Cloud Account across platform Projects** |Enter 'y' if you want the Cloud Account associated with the PCG to be available from all Projects within your Organization. Enter 'n' if you want the Cloud Account to be available at the tenant admin scope only.| -->

<br />

#### Environment Configuration


|**Parameter**| **Description**|
|:-------------|----------------|
|`HTTPS Proxy`|Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
|`HTTP Proxy`|Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
|`No Proxy`|The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
|`Proxy CA Certificate Filepath`|The default is blank. You can provide the filepath of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`.|
|`Pod CIDR`|Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
|`Service IP Range`|Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|

<br />

#### VMware vSphere Account Information

|**Parameter**                            | **Description**|
|-----------------------------------------|----------------|
|`vSphere Endpoint` | vSphere endpoint: FQDN or IP address without a scheme - that is, without an IP protocol, such as ``https://``. Example: `vcenter.mycompany.com`.|
|`vSphere Username`  | vSphere account username.|
|`vSphere Password`| vSphere account password.|
|`Allow Insecure Connection`  | Bypasses x509 verification. Enter `y` if using a vSphere instance with self-signed Transport Layer Security (TLS) certificates. Otherwise, enter `n`.|

<br />

#### VMware vSphere PCG Cluster Configuration

|**Parameter**                            | **Description**|
|-----------------------------------------|----------------|
|``Datacenter``| |
|``Folder``  | |
|``Fault Domain(s)`` | Configure one or more fault domains by selecting values for these properties: Cluster, Network, Resource Pool, and Storage Type (Datastore or VM Storage Policy). |
|``NTP Server(s)`` | You can provide a list of Network Time Protocol (NTP) servers.  |
|``SSH Public Key(s)`` | Provide any public SSH keys you will use to access clusters in your project. |
|``PCG cluster size`` | Specify **1** or **3** nodes (HA). |


<!-- any SSH keys in case you need to remote into the host cluster.  -->


8. Specify the IP pool configuration. The placement type can be Static or DDNS. Choosing static placement creates an IP pool from which VMs are assigned IP addresses. Choosing DDNS assigns IPs using DNS.


#### Static Placement Configuration
| Parameter                                 | Description                                                |
|-------------------------------------------|------------------------------------------------------------|
| `IP Start range`                          | Enter the first address in the PCG IP pool range.           |
| `IP End range`                            | Enter the last address in the PCG IP pool range.            |
| `Network Prefix`                          | Enter the network prefix for the IP pool range. Valid values are in [0, 32]. Example: `18`. |
| `Gateway IP Address`                      | Enter the IP address of the static IP gateway.              |
| `Name server(s)`                          | Comma-separated list of DNS name server IP addresses.       |
| `Name server search suffixes`  | An optional comma-separated list of DNS search domains. |

<br />

#### DDNS Placement Configuration
|**Parameter**                            | **Description**|
|-----------------------------------------|----------------|
| `Search domain(s)` | Comma-separated list of DNS search domains.|


Upon completion, a new PCG configuration file is generated and its location is displayed in the console.

<br />

```bash
==== PCG config saved EEEE
Location: :/home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
```

<br />

Installation details are displayed in the console, including default username and password.

<br />

```bash
log. InfoCLI("===== You, 3 months ago • PLT-430: Display
log. InfoCLI("==== Enterprise Cluster Details
log. InfoCLI("=======
log. InfoCLI ("Console URL: %s://%s/system", apiServerURL. Scheme, apiServerURL.Hostname
log. InfoCLI ("Username: f admin")
log. InfoCLI(" Password: admin")
```

The installer prompts you to reset the username and password and provides a URL to access the Palette VerteX System Console.

PLACEHOLDER FOR VERTEX SYSTEM CONSOLE SCREENSHOT.

<br />

9.  Click the URL to access the System Console, and type `admin` in the **Username** and **Password** fields. 


10. Reset the password.



<!-- provisions a PCG cluster in your VMware vSphere environment. The CloudAccount.apiKey and Mgmt.apiKey values in the pcg.yaml are encrypted and cannot be manually updated. To change these values, rerun the installer using palette pcg install. -->

<!-- If the deployment fails due to misconfiguration, update the PCG configuration file and rerun the installer. Refer to the Edit and Redeploy PCG section below. -->


# Validate
  

# Next Steps

Now you are ready to create a tenant. When the tenant is created, you can configure authentication types in tenant settings and create users and teams.


# Resources

- Create Tenant

<br />
   