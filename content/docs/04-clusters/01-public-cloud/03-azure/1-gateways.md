---
title: "Self Hosted PCG"
metaTitle: "Creating a Self Hosted PCG on Palette"
metaDescription: "The methods of creating Self Hosted PCG on Palette for secured cluster deployment"
icon: "wifi"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import Tooltip from 'shared/components/ui/Tooltip';

# Overview
<br />
Palette enables provisioning of private AKS clusters within Azure Virtual networks (VNet) for enhanced security by offloading the orchestration to a Private Cloud Gateway that is deployed within the same account as the private AKS clusters. This private cloud gateway (Self Hosted PCGs) is an AKS cluster itself which needs to be launched manually and linked to an Azure cloud account in Palette Managemnt Console. The following sections discuss the prerequisites and detailed steps towards deploying Palette self-hosted PCG for Azure Cloud Accounts. Once the self hosted PCG is created and linked with an Azure cloud account in Palette, any Azure clusters provisioned using that cloud account will be orchestrated via this self hosted PCG, thereby enabling provisioning of Private AKS clusters. 

# Prerequisites

* An active Azure Cloud account with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.


* Azure CLI installed


# Create your Azure Self Hosted PCGs

To create an Azure Self-Hosted PCG, the significant steps are:
 <br />

1. [Create a Virtual Network in the Azure console](/clusters/public-cloud/azure/gateways#createavirtualnetworkintheazureconsole)


2. [Create an Azure Kubernetes Target Cluster in the Azure console](/clusters/public-cloud/azure/gateways#createanazurekubernetestargetclusterintheazureconsole)


3. [Establish external connectivity with the Target Azure Kubernetes Cluster](/clusters/public-cloud/azure/gateways#establishexternalconnectivitywiththetargetazurekubernetescluster)


4. [Deploy Palette Self Hosted PCG to Palette Console](/clusters/public-cloud/azure/gateways#deploypaletteselfhostedpcgtopaletteconsole)


## Create a Virtual Network in the Azure Console

Log in to the Azure portal and create a Virtual Network taking care of the following steps:
<br />

1. Azure Virtual Network (VNet) with **three subnets**. Each of the subnets should have a minimum of **333 available IPs**. 


2. The VNet should have the ** `Microsoft.Authorization/roleAssignments/write` ** action required to connect the virtual network to the Azure Kubernetes Cluster if the network configuration is `Azure CNI.` for the cluster.


3. This VNet needs to be linked with:
    * Azure Kubernetes Cluster
    * Azure Bastion Host (Jump Box Virtual Machine) to connect to the Azure target Kubernetes cluster securely.


## Create an Azure Kubernetes Target Cluster in the Azure Console


1. Log in to the **Azure Portal** and go to **Kubernetes services**, and click **Create a Kubernetes Cluster** to initiate the cluster.     Creation.


2. Fill up the essential information to **Create Cluster Wizard**  and take care of the following information specifically.


3. Primary Node Pool:
     * Node Size: Select a VM instance with a minimum of 16 GiB RAM and four vCPUs.
     * Node Count: 1 or 3 as per user requirement


4. The scale method to be selected is manual.


5. Networking: Two options available for networking configuration are **Kubenet** and **Azure CNI**
  <br />

#### Kubenet: 

If this option is selected, the user needs to ensure that the VNet used is the VNet created at the previous step. This selection of VNet is not possible via Azure User Interface and hence can be achieved [programmatically](https://learn.microsoft.com/en-us/azure/aks/configure-kubenet) as below:

 <br />

```
SUBNET_ID=$(az network vnet subnet show --resource-group resource-group-name --vnet-name vnet-name --name subnet-name --query id -o tsv)
```
<br />

```
az aks create \
		--resource-group resource-group-name \
		--name cluster-name \
		--enable-private-cluster \
		--node-count count-value \
		--network-plugin kubenet \
		--vnet-subnet-id $SUBNET_ID
```

 #### Azure CNI: 

6. Security: For network security enable **Private cluster**.

In Azure CNI network configuration, select the static [virtual network created](/clusters/public-cloud/azure/gateways#createanazurevirtualnetworkintheazureconsole) from the drop-down menu. 

<br />

## Establish external connectivity with the Target Azure Kubernetes Cluster 

To establish a connection to the Target Azure Kubernetes Cluster get connected to the Bastian Host (Jump-Box) and then get connected to the target Azure Kubernetes cluster to be imported to Palette Console as self hosted PCG.

### Get Connected to Bastian Host (Jump-Box)

To establish the external connectivity for the private Kubernetes cluster, launch an Azure Virtual Machine as a jump-box with an SSH key attached. 
<br />

<InfoBox>
Port Prerequisite:
Add an inbound network security group rule with destination port 22.
</InfoBox>
<br />

1. Open the client terminal of your choice to execute:
<br />


2. Ensure you have read-only access to the private key. Chmod is only supported on Linux subsystems (e.g. WSL on Windows or Terminal on Mac).

```
  chmod 400 <keyname>.pem
```

3. Run the example command below to connect to your VM.
<br />

```
  ssh -i <private key path> azureuser@public-ip-address-of-bastion-jump-box
```


### Get connected to the Target Azure Kubernetes cluster

After getting connected to the Bastion host, establish a connection to the Target Azure Kubernetes cluster. Refer to the below sample instructions:
<br />

 ```
   az login
 ```
   <br />

  ```
    az account set --subscription 8710ff2b-e468-434a-9a84-e522999f6b81
  ```
<br />   

  ``` 
    az aks get-credentials --resource-group resource-group-name --nametarget-cluster-name 
  ```
## Deploy Palette Self Hosted PCG to Palette Console
<br />

1. Login to Palette console as Tenant Admin and go to Tenant settings.


2. Go to Private Cloud Gateways and select  + Add New Private Cloud Gateway.


3. From the available options, select the `Self Hosted Gateway.` 

4. In the create gateway wizard, 
  * Private cloud gateway name: Custom gateway name
  * Cloud type: Select the cloud type as Azure for Azure self-hosted PCG.

5.Install the Palette agent (also check for  prerequisites and instructions on Palette UI)

**Example:**
```
  kubectl apply -f endpoint/v1/pcg/12345678901234/services/jet/manifest
```
```
  kubectl apply -n cluster-1234abcd -f https://endpoint/v1/pcg/12345678901234/services/ally/manifest
```

6. The self-hosted PCG will be provisioned and will start running in the Palette console. The healthy self-hosted PCG can be managed from the Palette UI page. The healthy self-hosted PCG can be linked to Azure Cloud Account (optionally) to enjoy the enhanced security benefits. We support the [PCG migratiom](/enterprise-version/enterprise-cluster-management#palettepcgmigration) for the public cloud self-hosted PCGs as well. 

<InfoBox>

Palette users can launch Azure clusters without a PCG also. To enjoy the additional benefits of this private cloud Self-hosted PCG, users need to attach it to the Palette Azure cloud account.

</InfoBox>

## Attach the Self Hosted PCG to the Azure Cloud Account

The self-hosted PCG can be attached to an existing Azure Palette cloud account or while creating a new Azure Palette cloud account. Refer to the [Azure Cloud Account](/clusters/public-cloud/azure#creatinganazurecloudaccount) creation. 

<br /> 
<br /> 
