---
title: "Instructions"
metaTitle: "Install Palette VerteX"
metaDescription: "Learn how to install Palette VerteX on VMware vSphere."
icon: ""
hideToC: false
fullWidth: false
---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Install Palette VerteX on VMware vSphere

You install Palette VerteX using a Command Line Interface (CLI) that guides you for details to create a configuration file and a three-node enterprise cluster for high availability (HA) with the following resources: 

- 6 vCPU
- 12 GB memory
- 70 GB storage

You can invoke the installer on any Linux x86-64 system with the docker daemon installed and connectivity to the Palette console and the VMware vSphere where Palette VerteX will be deployed. 


# Prerequisites

- A Palette VerteX account and repository credentials. Refer to [Access Palette VerteX](/vertex#accesspalettevertex).


- Downloaded Palette CLI.


- An Ubuntu Pro Subscription. Ubuntu Pro provides access to FIPS 140-2 certified cryptographic packages.


- An Ubuntu Pro token.


- In VMware environments with internet connectivity, you will need to configure firewall ports to allow relevant traffic for Palette to function correctly. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication.


You can provide an optional SSH key pair to access the cluster remotely for maintenance and troubleshooting.

<br />

<InfoBox>

Self-hosted Palette installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the Palette console. To learn how to install a PCG on VMware, check out the [VMware](/clusters/data-center/vmware) guide.

</InfoBox>


# Install the Enterprise Cluster

1. Download the Palette CLI. Refer to [Download and Setup](/palette-cli/install-palette-cli#downloadandsetup).


2. Log in to the vCenter Server by using the vSphere Client.


3. Navigate to the Datacenter and select the cluster you want to use for the installation. Right-click on the cluster and select **vertex-installer**. 


4. Click the **Power On** icon to create a Virtual Machine (VM) instance. The installer will provide a DNS name and IP address for the instance, which you will use to SSH into the instance. This may take a few minutes. 

![Screenshot of the DNS name and IP address displayed when a VM instance is created.](/vertex_installation_install-on-vmware_dns-and-ip.png)

<br />


5. Open a terminal window and SSH into the instance using the DNS name and IP address the vertex-installer provides. For example `ssh -i ~/.ssh/vertex_id_rsa ubuntu@10.10.139.195`.

```bash hideClipboard
ssh -i ~/.ssh/vertex_id_rsa <dns_name>@<ip_address>
```


6. Invoke the Palette CLI by using the following command. The installer prompts you for configuration details and then initiates the installation. For more information about the ``ec`` subcommand, refer to [Palette Commands](/palette-cli/commands#ec). 

```bash
palette ec install
```


7. When prompted to enable Ubuntu Pro, type `y` and provide your Ubuntu Pro token. This enables the Ubuntu license.  


8. When prompted to enable FIPS, type `y`. The repository location is displayed. 


9. Type your Palette username and password.


10. Choose ``VMware vSphere`` as the cloud type. This is the default.


11. When prompted, enter the information listed in each of the following tables.

<br />

#### Environment Configuration


|**Parameter**| **Description**|
|:-------------|----------------|
|**HTTPS Proxy**|Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all EC nodes and all of its target cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
|**HTTP Proxy**|Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all EC nodes and all of its target cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
|**No Proxy**|The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
|**Proxy CA Certificate Filepath**|The default is blank. You can provide the filepath of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`.|
|**Pod CIDR**|Enter the CIDR pool IP that will be used to assign IP addresses to pods in the EC cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
|**Service IP Range**|Enter the IP address range that will be used to assign IP addresses to services in the EC cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|

<br />

#### VMware vSphere Account Information

|**Parameter**                            | **Description**|
|-----------------------------------------|----------------|
|**vSphere Endpoint** | vSphere endpoint: FQDN or IP address without a scheme - that is, without an IP protocol, such as ``https://``. Example: `vcenter.mycompany.com`.|
|**vSphere Username** | vSphere account username.|
|**vSphere Password**| vSphere account password.|
|**Allow Insecure Connection** | Bypasses x509 verification. Enter `y` if using a vSphere instance with self-signed Transport Layer Security (TLS) certificates. Otherwise, enter `n`.|

<br />

#### VMware vSphere PCG Cluster Configuration

This information is used to determine where the Palette VerteX management plane nodes for the enterprise cluster will be running.

|**Parameter**                            | **Description**|
|-----------------------------------------|----------------|
|**Datacenter**| |
|**Folder** | |
|**Fault Domain(s)** | Configure one or more fault domains by selecting values for these properties: Cluster, Network, Resource Pool, and Storage Type (Datastore or VM Storage Policy). |
|**NTP Server(s)** | You can provide a list of Network Time Protocol (NTP) servers.  |
|**SSH Public Key(s)** | Provide any public SSH keys you will use to access clusters in your project. |
|**PCG cluster size** | Specify **1** or **3** nodes (HA). |

<InfoBox>

SSH keys that you provide allow you to access the host cluster remotely for maintenance purposes. To learn about basic vi commands, check out [vi Commands](https://www.cs.colostate.edu/helpdocs/vi.html).

</InfoBox>


8. Specify the IP pool configuration. The placement type can be Static or DDNS. Choosing static placement creates an IP pool from which VMs are assigned IP addresses. Choosing DDNS assigns IPs using DNS.


#### Static Placement Configuration
| Parameter                                 | Description                                                |
|-------------------------------------------|------------------------------------------------------------|
| **IP Start range**                          | Enter the first address in the EC IP pool range.           |
| **IP End range**                            | Enter the last address in the EC IP pool range.            |
| **Network Prefix**                          | Enter the network prefix for the IP pool range. Valid values are in [0, 32]. Example: `18`. |
| **Gateway IP Address**                      | Enter the IP address of the static IP gateway.              |
| **Name server(s)**                          | Comma-separated list of DNS name server IP addresses.       |
| **Name server search suffixes**  | An optional comma-separated list of DNS search domains. |

<br />

#### DDNS Placement Configuration
|**Parameter**                            | **Description**|
|-----------------------------------------|----------------|
| **Search domain(s)** | Comma-separated list of DNS search domains.|


Upon completion, a new EC configuration file is generated and its location is displayed in the terminal. 

<br />

```bash
==== EC config saved EEEE
Location: :/home/spectro/.palette/ec/ec-20230706150945/ec.yaml
```

<br />

Installation details are also displayed in the terminal, including default username and password.

<br />

```bash
log. InfoCLI("====================================")
log. InfoCLI("==== Enterprise Cluster Details ====")
log. InfoCLI("====================================")
log. InfoCLI("Console URL: %s://%s/system", apiServerURL.Scheme, apiServerURL.Hostname())
log. InfoCLI("Username: admin")
log. InfoCLI("Password: admin")
```

<!-- The installer prompts you to reset the username and password and provides a URL to access the Palette VerteX System Console. -->

The installer provides a URL to access the Palette VerteX System Console.

9.  Click the URL to access the System Console. The default credentials are ``admin / admin``. Reset the password in the System Console. 


![Screenshot of the Palette VerteX system console showing Username and Password fields.](/vertex_installation_install-on-vmware_vertex-system-console)


10. Upon logging in, a Click the Go to Tenant Management button.


![Screenshot of the Summary page showing where to click Go to Tenant Management button.](/vertex_installation_install-on-vmware_goto-tenant-management)

<!-- provisions a EC cluster in your VMware vSphere environment. The CloudAccount.apiKey and Mgmt.apiKey values in the ec.yaml are encrypted and cannot be manually updated. To change these values, rerun the installer using palette ec install. -->

<!-- If the deployment fails due to misconfiguration, update the ec.yaml file and rerun the installer. Refer to the Edit and Redeploy EC section below. -->

10. Upon logging in, a Summary page is displayed. Click the **Go to Tenant** button to start setting up your tenant.

# Validate

1. The 

<!-- 1. Connect to the system console as a tenant admin. 


2. Access the tenant, and navigate to the left **Main Menu** and select **Clusters**. 


3. On the cluster Overview page, verify the cluster health status. While the cluster is being deployed, the **Cluster Status** field displays **Provisioning**. When provisioning is complete, ensure cluster status displays **Running**. -->

# Next Steps

Now you can configure authentication types in tenant settings and create users and teams.


# Resources

TBS

<br />
   