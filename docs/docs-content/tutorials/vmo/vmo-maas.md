---
sidebar_position: 10
sidebar_label: "Deploy and Manage VMs with VMO and Terraform"
title: "Deploy and Manage VMs with VMO and Terraform"
description:
  "Learn how to create and manage Virtual Machines using Palette VMO on host clusters deployed to Canonical MAAS."
tags: ["VMO", "tutorial", "maas"]
category: ["tutorial"]
---

# Introduction to Palette Virtual Machine Orchestrator

In this tutorial you will deploy a VM using Palette Virtual Machine Orchestrator (VMO). You will learn about the
components that make up VMO, how to create and customize them for a Canonical MAAS VMO cluster deployment, and how to
customize and deploy a VM.

We recommend reviewing the [VMO architecture](/vm-management/architecture.md) page before starting this tutorial. The
architecture page describes what VMO is, a high level view of the components it uses, and provides links to more
detailed information.

## Supported Environments

VMO is supported in the following environments:
- Private Clouds 
  - MAAS 
  - Palette Edge
  - VMWare
- Public Clouds
  - AWS
  - Azure

## Prerequisites

- A Palette account with tenant admin access.

- MAAS Datacenter environment.

- Two MAAS machines with a minimum spec of

  - 8 CPU
  - 32 GB RAM
  - 250 GB Storage (Worker node must have 2 disks)

- Two routable, static IP addresses from your MAAS environment's network.

- A MAAS user with necessary permissions.

  - _ADD PERMISSIONS HERE_

- An existing [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md) in your MAAS environment.

- Basic knowledge of containers

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

- [virtctl](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/) installed locally

  <br />

<Tabs>

<TabItem label="Terraform Workflow" value="Terraform Workflow">

## Clone GitHub Repository

This tutorial has pre-built Terraform scripts that you will use to create your VMO MAAS cluster and deploy a VM to it.

Clone the Spectro Cloud Terraform tutorial repository.

`git clone https://github.com/spectrocloud/tutorials`

The directory containing the files you will use in this tutorial is _/terraform/vmo-cluster_.

## Terraform Workflow

### Deploy a VMO Cluster

In this section, you will modify and execute Terraform scripts to deploy a new VMO Cluster to your MAAS environment.

#### Update terraform.tfvars

This file allows you to set values to be used for your variables in one place. We recommend using the _terraform.tfvars_
file whenever possible as it helps reduce human error and makes updating and reusing your Terraform scripts more
efficient.

:::info

We recommend that you read the **Palette Specific Terraform Files** section at the end of this tutorial. It will provide
additional detail about the Palette specific files in this tutorial, what they do, and how you can modify them for
your own deployments.

:::

The provided _terraform.tfvars_ file is broken into sections to help you understand which files the variables are
related to.

Make the changes to your _terraform.tfvars_ as instructed in the table.

```yaml
# Copyright (c) Spectro Cloud
# SPDX-License-Identifier: Apache-2.0

#####################
# Palette Settings
#####################
palette-project = "REPLACE_ME"                                 # The name of your project in Palette.

############################
# MAAS Deployment Settings
############################

deploy-maas    = true                                       # Set to true to deploy to a new VMO cluster to MAAS.
deploy-maas-vm = false                                      # Set to true to create a VM on MAAS VMO cluster once deployed.

pcg-name    = "REPLACE_ME"                                    # Provide the name of the PCG that will be used to deploy the Palette cluster.
maas-domain = "REPLACE_ME"                                     # Provide the MAAS domain that will be used to deploy the Palette cluster.

maas-worker-nodes         = 1                               # Provide the number of worker nodes that will be used for the Palette cluster.
maas-worker-resource-pool = "REPLACE_ME"                    # Provide a resource pool for the worker nodes.
maas-worker-azs           = ["REPLACE_ME"]                     # Provide a set of availability zones for the worker nodes.
maas-worker-node-tags     = ["REPLACE_ME"]                        # Provide a set of node tags for the worker nodes.

maas-control-plane-nodes         = 1                        # Provide the number of control plane nodes that will be used for the Palette cluster.
maas-control-plane-resource-pool = "REPLACE_ME"     # Provide a resource pool for the control plane nodes.
maas-control-plane-azs           = ["REPLACE_ME"]                  # Provide a set of availability zones for the control plane nodes.
maas-control-plane-node-tags     = ["REPLACE_ME"]              # Provide a set of node tags for the control plane nodes.


# #####################
# # cluster_profiles.tf
# #####################
vmo-cluster-name        = "REPLACE_ME"
cluster-profile-type      = "REPLACE_ME"                          # Infrastructure, Full, or Add-on
cluster-profile-version   = "REPLACE_ME"                          # Version number for the cluster profile in Palette


# ##############
# # clusters.tf
# ##############
ctl-node-min-cpu          = REPLACE_ME                            # Minimum number of CPU cores required for control plane nodes
ctl-node-min-memory-mb    = REPLACE_ME                         # Minimum amount of RAM (memory) required for control plane nodes
wrk-node-min-cpu          = REPLACE_ME                             # Minimum number of CPU cores required for worker nodes
wrk-node-min-memory-mb    = REPLACE_ME                         # Minimum amount of RAM (memory) required for worker nodes


# #####################
# # virtual_machines.tf
# #####################
vm-deploy-namespace       = "REPLACE_ME"                       # Namespace where your VM will be deployed.
vm-deploy-name            = "REPLACE_ME"                        # The name of your VM
vm-storage-Gi             = "REPLACE_ME"                          # Size of the disk (PVC) that your VM will have.
vm-cpu-cores              = REPLACE_ME                              # Number of CPU cores your VM will have.
vm-cpu-sockets            = REPLACE_ME                               # Number of physical CPU sockets the CPU cores should be spread over.
vm-cpu-threads            = REPLACE_ME                               # Number of CPU threads to use for the VM CPU
vm-memory-Gi              = "REPLACE_ME"                           # Amount of RAM (memory) your VM will have

```

**Palette Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **palette-project** | _string_      | Set this value to the name of your project in Palette. |

**MAAS Deployment Values**

| **Variable**                         | **Data Type** | **Instruction**                                                                                                                                                                          |
| ------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **deploy-maas**                      | _boolean_     | This is a true or false value. If true, a VMO cluster will be deployed to MAAS.                                                                                                          |
| **deploy-maas-vm**                   | _boolean_     | This is a true of false value. If true, an Ubuntu 22.04 VM with the Hello Universe app will be deployed in your VMO cluster. Set this value to _false_ for this section of the tutorial. |
| **pcg-name**                         | _string_      | Set this value to the name of your MAAS PCG. This can be pre-existing or one you created in the [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md) tutorial.           |
| **maas-domain**                      | _string_      | Set this value to the domain your MAAS environment is in. example _spectronaut.com_.                                                                                                     |
| **maas-control-plane-nodes**         | _number_      | Set this value to the number of worker nodes you want to create.                                                                                                                         |
| **maas-control-plane-resource-pool** | _string_      | Set this value to match the MAAS resource pool you want to deploy your worker nodes to.                                                                                                  |
| **maas-control-plane-azs**           | _string_      | Set this value to the MAAS availability zones you want your worker nodes deployed to.                                                                                                    |
| **maas-control-plane-node-tags**     | _string_      | If you are using tags to target MAAS deployments to specific nodes using tags, enter those tags here.                                                                                    |
| **maas-worker-nodes**                | _number_      | Set this value to the number of worker nodes you want to create.                                                                                                                         |
| **maas-worker-resource-pool**        | _string_      | Set this value to match the MAAS resource pool you want to deploy your worker nodes to.                                                                                                  |
| **maas-worker-azs**                  | _string_      | Set this value to the MAAS availability zones you want your worker nodes deployed to.                                                                                                    |
| **maas-worker-node-tags**            | _string_      | If you are using tags to target MAAS deployments to specific nodes, enter those tags here.                                                                                               |

**Cluster Profile Values**

| **Variable**                | **Data Type** | **Instruction**                                                                                                       |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| **vmo-cluster-name**        | _string_      | The name your MAAS VMO cluster will have.                                                                             |
| **cluster-profile-type**    | _string_      | The type of _Palette Cluster Profile_ you are creating. Values should be "Infrastructure", "App", "Add-On", or "Full" |
| **cluster-profile-version** | _number_      | The version number that will be assigned to your _Palette Cluster Profile_.                                           |

**Cluster Values**

| **Variable**            | **Data Type** | **Instruction**                                                                              |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| **ctl-node-min-cpu**    | _number_      | Set this to the minimum number of CPU cores you want assigned to your control plan nodes.    |
| **ctl-node-min-mem-mb** | _number_      | Set this to the minimum amount of RAM (Memory) you want assigned to your control plan nodes. |
| **wrk-node-min-cpu**    | _number_      | Set this to the minimum number of CPU cores you want assigned to your worker nodes.          |
| **wrk-node-min-mem-mb** | _number_      | Set this to the minimum amount of RAM (Memory) you want assigned to your worker nodes.       |

**Kubernetes Values**

| **Variable**              | **Data Type** | **Instruction**                                                                                                   |
| ------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| **pod-CIDR**              | _string_      | Set this value to the subnet you want your pods to run on. Format must ne standard CIDR notation "192.168.0.0/24" |
| **serviceClusterIPRange** | _number_      | Set this value to the IP addresses or range that you want your cluster services to use.                           |

**MetalLB Values**

| **Variable**        | **Data Type** | **Instruction**                                                                                                                                                                                                          |
| ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **metallb-ip-pool** | _number_      | Set this value to the IP address range you want MetalLB to use. These IP's should be routable and the NIC on your MAAS nodes should be connected to a Switchport that has your subnets VLAN ID set as the untagged VLAN. |

#### Deploy the Cluster

Once the variables in _terraform.tfvars_ have been updated, you can proceed with the VMO cluster deployment.

First, you must set the `SPECTROCLOUD_APIKEY` environment variable to your API key by using the command below.

```shell
export SPECTROCLOUD_APIKEY="YOUR KEY HERE"
```

Execute the `terraform plan` command to ensure there are no errors, the install plan is correct, and you have
connectivity to your Spectro Cloud tenant.

```shell
terraform plan
data.spectrocloud_registry.public_registry: Reading...
data.spectrocloud_cloudaccount_maas.account[0]: Reading...
data.spectrocloud_cloudaccount_maas.account[0]: Read complete after 0s [id=680a7a2321e9c36a9a0efa4f]
data.spectrocloud_registry.public_registry: Read complete after 0s [id=5eecc89d0b150045ae661cef]
data.spectrocloud_pack.maas_csi: Reading...
data.spectrocloud_pack.maas_metallb: Reading...
data.spectrocloud_pack.maas_vmo: Reading...
data.spectrocloud_pack.maas_k8s: Reading...
data.spectrocloud_pack.maas_cni: Reading...
data.spectrocloud_pack.maas_ubuntu: Reading...
data.spectrocloud_pack.maas_metallb: Read complete after 0s [id=678d28cce2561ecca5cf0aea]
.
.
.
              + name    = "vmo-extras"
              + uid     = (known after apply)
            }
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
\
```

Execute the `terraform apply` command. This process may take up to an hour or more depending on your environment and the
resource capacity you selected for your MAAS VMO Cluster.

```shell

```

#### Verify the Deployment

To verify your cluster deployment was successful, navigate to the **Clusters** option in the left Main Menu in Palette. Select the
cluster name you created. On the overview page, ensure the cluster status is healthy. No further validation is
necessary.

### Deploy a Virtual Machine

In this section, you will modify and execute Terraform scripts to deploy a new VMO Cluster to your MAAS environment.

#### Update terraform.tfvars

Prior to deploying your VM you must modify the _terraform.tfvars_ file to reflect the configuration you want your VM to
have. Make changes to your _terraform.tfvars_ file as instructed in the table.

| **Variable**            | **Data Type** | **Instruction**                                                                                                                                                                                                                                              |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **deploy-maas-vm**      | _boolean_     | This is a true of false value. If true, an Ubuntu 22.04 VM with the Hello Universe app will be deployed in your VMO cluster. Set this value to _true_ for this section of the tutorial.                                                                      |
| **vm-deploy-namespace** | _string_      | Set this value to the name of the VLAN you want your VMs to be deployed to.<br/><br/>These namespaces are standard Kubernetes namespaces. Your VM will be impacted by any configurations applied at the namespace level such as network policies and quotas. |
| **vm-deploy-name**      | _string_      | Set this value to the name you want your VM to have.                                                                                                                                                                                                         |
| **vm-labels**           | _string_      | Set this value to a single label you want applied to your VM. For multiple labels, you must modify _virtual_machines.tf_ to include one line for each label.                                                                                                 |
| **vm-storage-Gi**       | _string_      | Set this value to the size of disk you want your VM to have. You must include 'Gi' in your value. Example _vm-storage-Gi = 50Gi_                                                                                                                             |
| **vm-vpu-cores**        | _number_      | This value will set the number of CPU cores your VM will use.                                                                                                                                                                                                |
| **vm-cpu-sockets**      | _number_      | This value will set the number of physical CPU sockets your VM must use. This is intended to enable hardware resilience in the event of a single CPU socket related failure.                                                                                 |
| **vm-cpu-threads**      | _number_      | The number of CPU threads your VM is allowed to use. You can assign 1 CPU core and a single thread if desired.                                                                                                                                               |
| **vm-memory-Gi**        | _string_      | Set this value to the amount of RAM (memory) you want your VM to have. You must include 'Gi' in your value. Example _vm-memory-Gi = 4Gi_                                                                                                                     |

#### Deploy the Virtual Machine

Execute the `terraform plan` command to ensure there are no errors, the install plan is correct, and you have
connectivity to your Spectro Cloud tenant.

Execute the `terraform apply` command to create the VM in your VMO Cluster.

#### Verify the Application

The deployed VM should be successfully provisioned, in a healthy state, and the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application be installed and functional.

In Palette, navigate to the left main menu and select **Clusters**. Select the cluster you created.

Select the URL link for port **:8080** to access the Hello Universe application.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.webp)

Your result should be similar to the below screenshot.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)

### Clean Up - Terraform Workflow

To clean up the resources you deployed, execute the `terraform destroy` command.

</TabItem>

<TabItem label="Palette UI Workflow" value="Palette UI Workflow">

## UI Workflow

<br />

### Create a VMO Cluster Profile

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left Main Menu, select **Profiles** and select **Add Cluster Profile**.

3.  Enter the name, version number, and any tags you wish to apply to the profile. Set the type value to **full**.
    Select **Next**.

4.  Select **MAAS** from the **infrastructure provider** column. Select **Next**.

:::info

VMO is currently supported in the following environments: UPDATE WITH DETAILS

:::

5. The first profile layer you are asked to configure is the OS layer. Your selection will be used as the base OS for
   the nodes in your Kubernetes Cluster. This tutorial uses the _Ubuntu v22.04_ OS image from the _Palette Registry
   OCI_.

   Select **Ubuntu latest: v22.04**.

6. Ubuntu requires customizations to be made for it to be functional in your environment. Select **Values** and paste
   the configuration below into the text editor frame.

   Update the value for **NETWORKS** to something that works for your environment. Select **Next layer**.

```yaml
kubeadmconfig:
  preKubeadmCommands:
    - 'echo "====> Applying pre Kubeadm commands"'
    # Force specific IP address as the Node InternalIP for kubelet
    - apt update
    - apt install -y grepcidr
    - |
      NETWORKS="REPLACE_ME"
      IPS=$(hostname -I)
      for IP in $IPS
      do
         echo "$IP" | grepcidr "$NETWORKS" >/dev/null && echo " --node-ip=$IP" >> /etc/default/kubelet
         if [ $? == 0 ]; then break; fi
      done
    # Increase audit_backlog_limit
    - sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX="audit_backlog_limit=256"/g' /etc/default/grub
    - update-grub
    # Clean up stale container images
    - (crontab -l || true; echo "0 4 * * * /usr/bin/crictl -c /etc/crictl.yaml rmi --prune")| crontab -
    # Update CA certs
    - update-ca-certificates
    # Start containerd with new configuration
    - systemctl daemon-reload
    - systemctl restart containerd
  postKubeadmCommands:
    - 'echo "====> Applying post Kubeadm commands"'
  files:
    - targetPath: /etc/containerd/config.toml
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
        ## template: jinja

        # Use config version 2 to enable new configuration fields.
        # Config file is parsed as version 1 by default.
        version = 2

        imports = ["/etc/containerd/conf.d/*.toml"]

        [plugins]
          [plugins."io.containerd.grpc.v1.cri"]
            sandbox_image = "registry.k8s.io/pause:3.9"
            device_ownership_from_security_context = true
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
            runtime_type = "io.containerd.runc.v2"
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            SystemdCgroup = true
```

7. The next profile layer determines the version of Kubernetes your cluster will use. Select **Palette eXtended
   Kubernetes v1.32.2** from the _Palette Registry OCI_.

8. Select the **Properties** icon.

   The Palette eXtended Kubernetes pack defaults to use a custom OIDC provider. This tutorial uses the **Pallete** OIDC
   Identity Provider. By using Palette as your OIDC provider, your cluster is configured to send authentication requests
   to your Palette tenant's configured OIDC provider.

   Select **Palette** as the OIDC Identity Provider.

![Image of the properties icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_configure-OIDC-properties.webp)

You may configure a different OIDC provider by selecting the **Values** icon, uncommenting the OIDC clientConfig
section, and adding your configuration values.

![Image of the properties icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_Configure-OIDC-Values.webp)

The Palette eXtended Kubernetes pack is pre-configured with subnets for both the clusters internal Pods and Services.
Review the values for **podCIDR** and **serviceClusterIpRange** and update them if necessary.

![Image of the configuration lines where Pod and Services Subnets are set.](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_pod-service-ips.webp)

    Select **Next layer**

9. The next profile layer is the Container Network Interface (CNI). Select **Cilium v1.17.1** from the Palette Registry (OCI).

    Cilium requires some customization to work correctly with VMO. Select **Values**. From the **Presets** drop down
    menu, set the value for VMO Compatibility to **Enable**.

    Enabling this flag makes the following changes to the Cilium deployment manifest.

| Field                             | Default Value | Modified Value | Description                                                                                        |
| --------------------------------- | ------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| cilium.cni.exclusive              | false         | true           | Instructs the cluster to remove all other CNI configuration files.                                 |
| cilium.socketLB.hostNamespaceOnly | true          | false          | Disables socket level load balancing and moves the function back to the virtual network interface. |

    For more information on these configurations, visit the official Cilium documentation site for [socket load balancers](https://docs.cilium.io/en/latest/network/Kubernetes/kubeproxy-free/#socketlb-host-netns-only) and [CNI configuration adjustments](https://docs.cilium.io/en/latest/network/kubernetes/configuration/#adjusting-cni-configuration).

Select **Next layer**.

10. The next profile layer determines which Container Storage Interface (CSI) your cluster will use. Select **Rook-Ceph
    (Helm) v1.16.3** from the Palette OCI Registry.

11. Select **Confirm**.

12. Your profile now contains the base infrastructure configurations you need. You need to add some additional packs to
    complete your configuration.

    Select **Add New Pack**.

13. Search for MetalLB and select the **MetalLB (Helm) v0.14.9** pack.

    Select **Values**. Update the value of the **addresses** field. The IP addresses entered will be used for the
    metalLB service and must be accessible to other services in your environment. Do not use IP addresses from any non
    routable subnets.

![Image of the properties icon](/tutorials/deploy-vmo-maas/tutorials_vmo_vmo-maas_metallb-ips.webp)

    Select **Confirm & Create**.

14. Select **Add New Pack**

15. Search for virtual machine orchestrator and select the **Virtual Machine Orchestrator v4.6.3** pack.

    The VMO pack defaults to use the proxied access architecture access pattern. This requires the **Spectro Proxy**
    service to be installed on your cluster to manage connectivity back to your Palette tenant. The pack will install the **Spectro Proxy** service for you if it is not already installed.

    For more information on the Spectro proxy, visit the
    [Official Spectro Proxy documentation page](/integrations/spectro-proxy.mdx)

    Paste the config below into the displayed text editor frame.

```yaml
    pack:
  content:
    images:
    - image: us-docker.pkg.dev/palette-images/palette/spectro-vm-dashboard:4.6.3
    - image: us-docker.pkg.dev/palette-images/third-party/kubevirt-ui:v19
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-operator:v1.4.0
    - image: registry.k8s.io/sig-storage/snapshot-validation-webhook:v8.1.0
    - image: registry.k8s.io/sig-storage/snapshot-controller:v8.1.0
    - image: registry.k8s.io/descheduler/descheduler:v0.32.0
    - image: ghcr.io/k8snetworkplumbingwg/multus-cni:v4.1.4-thick
    - image: ghcr.io/k8snetworkplumbingwg/multus-dynamic-networks-controller:latest-amd64
    - image: quay.io/kubevirt/cdi-operator:v1.61.0
    - image: quay.io/kubevirt/cdi-uploadproxy:v1.61.0
    - image: quay.io/kubevirt/cdi-controller:v1.61.0
    - image: quay.io/kubevirt/cdi-apiserver:v1.61.0
    - image: quay.io/kubevirt/cdi-importer:v1.61.0
    - image: quay.io/kubevirt/cdi-uploadserver:v1.61.0
    - image: quay.io/kubevirt/cdi-cloner:v1.61.0
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-handler:v1.4.0
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-launcher:v1.4.0
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-exportproxy:v1.4.0
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-exportserver:v1.4.0
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-controller:v1.4.0
    - image: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-api:v1.4.0
    - image: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/os/ubuntu-container-disk:22.04
    - image: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/os/fedora-container-disk:37
    - image: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/vlan-filtering/ubuntu:latest
    - image: us-docker.pkg.dev/palette-images/palette/spectro-cleanup:1.0.3
    - image: us-docker.pkg.dev/palette-images/palette/spectro-kubectl:v1.31.5-vmo
  namespace: vm-dashboard
  palette:
    config:
      dashboard:
        access: private

charts:
  virtual-machine-orchestrator:
    image:
      repository: us-docker.pkg.dev/palette-images/palette/spectro-vm-dashboard
      tag: "4.6.3"
    service:
      type: "ClusterIP"
    appConfig:
      clusterInfo:
        consoleBaseAddress: ""

    fullnameOverride: "virtual-machine-orchestrator"

    serviceAccount:
      # Specifies whether a service account should be created
      create: true
      # Annotations to add to the service account
      annotations: {}
      # The name of the service account to use.
      # If not set and create is true, a name is generated using the fullname template
      name: "virtual-machine-orchestrator"

    sampleTemplates:
      fedora37: true
      ubuntu2204: false
      ubuntu2204WithVol: true
      ubuntu2204staticIP: true
      fedora37staticIP: true
      # To create additional vm templates refer to https://docs.spectrocloud.com/vm-management/create-manage-vm/create-vm-template

    # This namespace will be used to store golden images
    goldenImagesNamespace: "vmo-golden-images"

    # These namespaces will be created and set up to deploy VMs into
    vmEnabledNamespaces:
      - "default"
      - "virtual-machines"

    grafana:
      namespace: monitoring

    vlanFiltering:
      enabled: false
      namespace: kube-system
      image:
        repository: us-docker.pkg.dev/palette-images/palette/virtual-machine-orchestrator/vlan-filtering/ubuntu
        pullPolicy: IfNotPresent
        tag: "latest"
      env:
        # Which bridge interface to control
        bridgeIF: "br0"
        # Beginning of VLAN range to enable
        allowedVlans: "1"
        # Set to "true" to enable VLANs on the br0 interface for the host to use itself
        allowVlansOnSelf: "true"
        # Beginning of VLAN range to enable for use by the node itself
        allowedVlansOnSelf: "1"

    snapshot-controller:
      enabled: true
      replicas: 1
      # controller image and policies
      image:
        repository: registry.k8s.io/sig-storage/snapshot-controller
        pullPolicy: IfNotPresent
        tag: "v8.1.0"

      # A list/array of extra args that should be used
      # when running the controller. Default args include log verbose level
      # and leader election
      extraArgs: []

      # snapshot webhook config
      webhook:
       # all below values take effect only if webhook is enabled
       enabled: true
       # webhook controller image and policies
       image:
         # change the image if you wish to use your own custom validation server image
         repository: registry.k8s.io/sig-storage/snapshot-validation-webhook
         pullPolicy: IfNotPresent
         # Overrides the image tag whose default is the chart appVersion.
         tag: "v8.1.0"

       validatingWebhook:
         failurePolicy: Fail
         timeoutSeconds: 2

       # Validating webhook is exposed on an HTTPS endpoint, and so
       # TLS certificate is required. This Helm chart relies on
       # cert-manager.io for managing TLS certificates.
       tls:
         # If not empty, this issuer will be used to sign the certificate.
         # If none is provided, a new, self-signing issuer will be created.
         issuerRef: { }
         # name: <ISSUER NAME>
         # kind: <ClusterIssuer|Issuer>
         # group: cert-manager.io

         # Certificate duration. The generated certificate will be automatically
         # renewed 1/3 of `certDuration` before its expiry.
         # Value must be in units accepted by Go time.ParseDuration.
         # See https://golang.org/pkg/time/#ParseDuration for allowed formats.
         # Minimum accepted duration is `1h`.
         # This option may be ignored/overridden by some issuer types.
         certDuration: 8760h

       service:
         # when running in cluster webhook service is recommended to be of type ClusterIP
         type: ClusterIP
         port: 443

       serviceAccount:
         # Specifies whether a service account should be created.
         create: true
         # Annotations to add to the service account.
         annotations: { }
         # The name of the service account to use.
         # If not set and create is true, a name is generated using the fullname template.
         name: ""

       # Log verbosity level.
       # See https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md
       # for description of individual verbosity levels.
       logVerbosityLevel: 2

       podAnnotations: { }

       resources: { }

       nodeSelector: { }

       tolerations: [ ]

       affinity: { }

       nameOverride: ""
       fullnameOverride: ""

      imagePullSecrets: []
      nameOverride: ""
      fullnameOverride: ""

      resources: {}
        # We usually recommend not to specify default resources and to leave this as a conscious
        # choice for the user. This also increases chances charts run on environments with little
        # resources, such as Minikube. If you do want to specify resources, uncomment the following
        # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
        # limits:
        #   cpu: 100m
        #   memory: 128Mi
        # requests:
      #   cpu: 100m
      #   memory: 128Mi

      nodeSelector: {}

      tolerations: []

      affinity: {}

      # create a default volume snapshot class
      volumeSnapshotClass:
        create: false
        name: "default-snapshot-class"
        driver: "mydriver"
        # deletionPolicy determines whether a VolumeSnapshotContent created through
        # the VolumeSnapshotClass should be deleted when its bound VolumeSnapshot is deleted.
        # Supported values are "Retain" and "Delete".
        deletionPolicy: ""
        # params is a key-value map with storage driver specific parameters for creating snapshots.
        params: {}

        # key-value pair of extra labels to apply to the volumesnapshotclass
        extraLabels: {}

      # time for sleep hook in seconds
      hooksleepTime: 12

    kubevirt:
      enabled: true
      # defaults to kubevirt
      namespace: kubevirt
      namespaceLabels:
        pod-security.kubernetes.io/enforce: privileged
        pod-security.kubernetes.io/enforce-version: v{{ .spectro.system.kubernetes.version | substr 0 4 }}
      replicas: 1

      service:
        type: LoadBalancer
        port: 443
        targetPort: 8443

      image:
        repository: us-docker.pkg.dev/palette-images/palette/kubevirt/virt-operator
        pullPolicy: IfNotPresent
        # Overrides the image tag whose default is the chart appVersion.
        tag: "v1.4.0"

      ## The Kubevirt CR that gets created
      kubevirtResource:
        name: kubevirt
        useEmulation: false
        # below gates are required for virtual machine orchestrator pack, users can append additional gates
        additionalFeatureGates:
        - LiveMigration
        - HotplugVolumes
        - Snapshot
        - VMExport
        - ExpandDisks
        - HotplugNICs
        - VMLiveUpdateFeatures
        - VMPersistentState
        - Sidecar
        - VolumeMigration
        - CPUManager   
        #- VMPersistentState
        # for additional feature gates refer to https://docs.spectrocloud.com/vm-management#featuregates

        config:
          evictionStrategy: "LiveMigrate"
          # additionalConfig lets you define any configuration other than developerConfiguration and evictionStrategy
          additionalConfig:
            #vmStateStorageClass: "" #fileSystem-based storageclass for persistent TPM
            migrations:
                allowAutoConverge: true
                completionTimeoutPerGiB: 800
          # additionalDevConfig lets you define dev config other than emulation and feature gate
          additionalDevConfig: {}
          # vmRolloutStrategy lets you define how changes to a VM object propagate to its VMI objects
          vmRolloutStrategy: LiveUpdate

        certificateRotateStrategy: {}

        customizeComponents:
          # flags:
          #   api:
          #     v:
          #       "5"
          #     port:
          #       "8443"

        imagePullPolicy: IfNotPresent

        infra: {}
        # The name of the Prometheus service account that needs read-access to KubeVirt endpoints
        monitorAccount: "prometheus-operator-prometheus"
        # The namespace Prometheus is deployed in
        monitorNamespace: "monitoring"
        # The namespace the service monitor will be deployed. Either specify this or the monitorNamespace
        serviceMonitorNamespace: "monitoring"

        workloads: {}

        workloadsUpdateStrategy:
          workloadUpdateMethods:
          - LiveMigrate

        # uninstallStrategy to use, options are RemoveWorkloads, BlockUninstallIfWorkloadsExist
        uninstallStrategy: ""

      ingress:
        enabled: false
        ingressClassName: nginx
        annotations:
          cert-manager.io/issuer: kubevirt-selfsigned-issuer
          nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        labels: {}
        hosts:
          - host: virt-exportproxy.maas.sc
            paths:
              - path: /
                pathType: ImplementationSpecific
        # tls:
        #   - secretName: chart-example-tls
        #     hosts:
        #       - virt-exportproxy.maas.sc

    cdi:
      enabled: true
      namespaceLabels:
        pod-security.kubernetes.io/enforce: privileged
        pod-security.kubernetes.io/enforce-version: v{{ .spectro.system.kubernetes.version | substr 0 4 }}
      replicas: 1

      image:
        repository: quay.io/kubevirt/cdi-operator
        pullPolicy: IfNotPresent
        # Overrides the image tag whose default is the chart appVersion.
        tag: "v1.61.0"

      # set enabled to true and add private registry details to bring up VMs in airgap environment
      privateRegistry:
        enabled: false
        registryIP: #Ex: 10.10.225.20
        registryBasePath: #Ex: specto-images

      serviceAccount:
        # Specifies whether a service account should be created
        create: true
        # Annotations to add to the service account
        annotations: {}
        # The name of the service account to use.
        # If not set and create is true, a name is generated using the fullname template
        name: ""

      service:
        type: LoadBalancer
        port: 443
        targetPort: 8443

      ingress:
        enabled: false
        className: "nginx"
        annotations:
          cert-manager.io/issuer: cdi-selfsigned-issuer
          nginx.ingress.kubernetes.io/proxy-body-size: "0"
          nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
          nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
          nginx.ingress.kubernetes.io/proxy-request-buffering: "off"
          nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        hosts:
          - host: cdi-uploadproxy.maas.sc
            paths:
              - path: /
                pathType: ImplementationSpecific
        tls: []
        #  - secretName: chart-example-tls
        #    hosts:
        #      - cdi-uploadproxy.maas.sc

      resources: {}
        # We usually recommend not to specify default resources and to leave this as a conscious
        # choice for the user. This also increases chances charts run on environments with little
        # resources, such as Minikube. If you do want to specify resources, uncomment the following
        # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
        # limits:
        #   cpu: 100m
        #   memory: 128Mi
        # requests:
        #   cpu: 100m
        #   memory: 128Mi

      ## The CDI CR that gets created
      cdiResource:
        additionalFeatureGates:
        # - FeatureName
        additionalConfig:
          filesystemOverhead:
            global: "0.08"
            storageClass:
              spectro-storage-class: "0.08"
          podResourceRequirements:
              requests:
                  cpu: 250m
                  memory: 1G
              limits:
                  cpu: 1
                  memory: 8G
          insecureRegistries: [] # List of insecure registries to allow in the CDI importer, preffered in air-gapped environments
          importProxy:
          #HTTPProxy: "http://username:password@your-proxy-server:3128"
          #HTTPSProxy: "http://username:password@your-proxy-server:3128"
          #noProxy: "127.0.0.1,localhost,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.company.local"
          #TrustedCAProxy: configmap-name # optional: the ConfigMap name of an user-provided trusted certificate authority (CA) bundle to be added to the importer pod CA bundle
        additionalSpec:
          infra:
            nodeSelector:
              kubernetes.io/os: linux
            tolerations:
              - key: CriticalAddonsOnly
                operator: Exists
          workload:
            nodeSelector:
              kubernetes.io/os: linux
          imagePullPolicy: IfNotPresent

    multus:
      enabled: true
      image:
        repository: ghcr.io/k8snetworkplumbingwg/multus-cni
        pullPolicy: IfNotPresent
        # Overrides the image tag whose default is the chart appVersion.
        tag: "v4.1.4-thick"

      networkController:
        criSocket:
          enableK3SHostPath: false # true for K3S and RKE2, false for PXK-E
          paletteAgentMode: false # true for running Palette Agent Mode clusters with PXK-E
          # criSocketHostPathOverride: /run/containerd/containerd.sock

      imagePullSecrets: []

      podAnnotations: {}

      resources:
        # We usually recommend not to specify default resources and to leave this as a conscious
        # choice for the user. This also increases chances charts run on environments with little
        # resources, such as Minikube. If you do want to specify resources, uncomment the following
        # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
        limits:
          cpu: 100m
          memory: 1Gi
        requests:
          cpu: 100m
          memory: 50Mi

      nodeSelector: {}

      affinity: {}

      dpdkCompatibility: false

      cleanup:
        image: us-docker.pkg.dev/palette-images/palette/spectro-cleanup
        tag: "1.0.3"

      networkAttachDef:
        create: false
        # a json string to apply
        config: ''
        # a sample config
          # '{
          #   "cniVersion": "0.3.0",
          #   "type": "macvlan",
          #   "master": "ens5",
          #   "mode": "bridge",
          #   "ipam": {
          #     "type": "host-local",
          #     "subnet": "192.168.1.0/24",
          #     "rangeStart": "192.168.1.200",
          #     "rangeEnd": "192.168.1.216",
          #     "routes": [
          #       { "dst": "0.0.0.0/0" }
          #     ],
          #     "gateway": "192.168.1.1"
          #   }
          # }'

    descheduler:
      enabled: true
      namespace: "kube-system"
      # CronJob or Deployment
      kind: CronJob

      image:
        repository: registry.k8s.io/descheduler/descheduler
        # Overrides the image tag whose default is the chart version
        tag: "v0.32.0"
        pullPolicy: IfNotPresent

      imagePullSecrets:
      #   - name: container-registry-secret

      resources:
        requests:
          cpu: 500m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 256Mi

      ports:
        - containerPort: 10258
          protocol: TCP

      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL
        privileged: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
        runAsUser: 1000

      # podSecurityContext -- [Security context for pod](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
      podSecurityContext: {}
        # fsGroup: 1000

      nameOverride: ""
      fullnameOverride: "descheduler"

      # -- Override the deployment namespace; defaults to .Release.Namespace
      namespaceOverride: ""

      # labels that'll be applied to all resources
      commonLabels: {}

      cronJobApiVersion: "batch/v1"
      schedule: "*/15 * * * *"
      suspend: false
      # startingDeadlineSeconds: 200
      # successfulJobsHistoryLimit: 3
      # failedJobsHistoryLimit: 1
      # ttlSecondsAfterFinished 600
      # timeZone: Etc/UTC

      # Required when running as a Deployment
      deschedulingInterval: 15m

      # Specifies the replica count for Deployment
      # Set leaderElection if you want to use more than 1 replica
      # Set affinity.podAntiAffinity rule if you want to schedule onto a node
      # only if that node is in the same zone as at least one already-running descheduler
      replicas: 1

      # Specifies whether Leader Election resources should be created
      # Required when running as a Deployment
      # NOTE: Leader election can't be activated if DryRun enabled
      leaderElection: {}
      #  enabled: true
      #  leaseDuration: 15s
      #  renewDeadline: 10s
      #  retryPeriod: 2s
      #  resourceLock: "leases"
      #  resourceName: "descheduler"
      #  resourceNamespace: "kube-system"

      command:
      - "/bin/descheduler"

      cmdOptions:
        v: 3

      # Recommended to use the latest Policy API version supported by the Descheduler app version
      deschedulerPolicyAPIVersion: "descheduler/v1alpha2"

      # deschedulerPolicy contains the policies the descheduler will execute.
      # To use policies stored in an existing configMap use:
      # NOTE: The name of the cm should comply to {{ template "descheduler.fullname" . }}
      # deschedulerPolicy: {}
      deschedulerPolicy:
        nodeSelector: kubevirt.io/schedulable=true
        maxNoOfPodsToEvictPerNode: 10
        # maxNoOfPodsToEvictPerNamespace: 10
        metricsCollector:
          enabled: true
        # ignorePvcPods: true
        # evictLocalStoragePods: true
        # evictDaemonSetPods: true
        # tracing:
        #   collectorEndpoint: otel-collector.observability.svc.cluster.local:4317
        #   transportCert: ""
        #   serviceName: ""
        #   serviceNamespace: ""
        #   sampleRate: 1.0
        #   fallbackToNoOpProviderOnError: true
        profiles:
          - name: default
            pluginConfig:
              - name: DefaultEvictor
                args:
                  ignorePvcPods: true
                  evictLocalStoragePods: true
                  nodeFit: true
                  ignorePodsWithoutPDB: true
              - name: RemoveDuplicates
              - name: RemovePodsHavingTooManyRestarts
                args:
                  podRestartThreshold: 100
                  includingInitContainers: true
              - name: RemovePodsViolatingNodeAffinity
                args:
                  nodeAffinityType:
                  - requiredDuringSchedulingIgnoredDuringExecution
              - name: RemovePodsViolatingNodeTaints
                args:
                  excludedTaints:
                      - node.kubernetes.io/unschedulable
              - name: RemovePodsViolatingInterPodAntiAffinity
              - name: RemovePodsViolatingTopologySpreadConstraint
              - name: LowNodeUtilization
                args:
                  thresholds:
                    cpu: 20
                    memory: 25
                    pods: 100
                  targetThresholds:
                    cpu: 60
                    memory: 75
                    pods: 100
                  metricsUtilization:
                    metricsServer: true
                  evictableNamespaces:
                      exclude:
                          - "cert-manager"
                          - "kube-system"
                          - "palette-system"
                          - "metallb-system"
                          - "cluster-{{ .spectro.system.cluster.uid }}"
                          - "kubevirt"
                          - "monitoring"
                          - "nginx"
                          - "vm-dashboard"
            plugins:
              balance:
                enabled:
                  - RemoveDuplicates
                  - RemovePodsViolatingTopologySpreadConstraint
                  - LowNodeUtilization
              deschedule:
                enabled:
                  - RemovePodsHavingTooManyRestarts
                  - RemovePodsViolatingNodeTaints
                  - RemovePodsViolatingNodeAffinity
                  - RemovePodsViolatingInterPodAntiAffinity

      priorityClassName: system-cluster-critical

      nodeSelector: {}
      #  foo: bar

      affinity: {}
      # nodeAffinity:
      #   requiredDuringSchedulingIgnoredDuringExecution:
      #     nodeSelectorTerms:
      #     - matchExpressions:
      #       - key: kubernetes.io/e2e-az-name
      #         operator: In
      #         values:
      #         - e2e-az1
      #         - e2e-az2
      #  podAntiAffinity:
      #    requiredDuringSchedulingIgnoredDuringExecution:
      #      - labelSelector:
      #          matchExpressions:
      #            - key: app.kubernetes.io/name
      #              operator: In
      #              values:
      #                - descheduler
      #        topologyKey: "kubernetes.io/hostname"
      topologySpreadConstraints: []
      # - maxSkew: 1
      #   topologyKey: kubernetes.io/hostname
      #   whenUnsatisfiable: DoNotSchedule
      #   labelSelector:
      #     matchLabels:
      #       app.kubernetes.io/name: descheduler
      tolerations: []
      # - key: 'management'
      #   operator: 'Equal'
      #   value: 'tool'
      #   effect: 'NoSchedule'

      rbac:
        # Specifies whether RBAC resources should be created
        create: true

      serviceAccount:
        # Specifies whether a ServiceAccount should be created
        create: true
        # The name of the ServiceAccount to use.
        # If not set and create is true, a name is generated using the fullname template
        name:
        # Specifies custom annotations for the serviceAccount
        annotations: {}

      podAnnotations: {}

      podLabels:
        spectrocloud.com/connection: proxy

      dnsConfig: {}

      livenessProbe:
        failureThreshold: 3
        httpGet:
          path: /healthz
          port: 10258
          scheme: HTTPS
        initialDelaySeconds: 3
        periodSeconds: 10

      service:
        enabled: false
        # @param service.ipFamilyPolicy [string], support SingleStack, PreferDualStack and RequireDualStack
        #
        ipFamilyPolicy: ""
        # @param service.ipFamilies [array] List of IP families (e.g. IPv4, IPv6) assigned to the service.
        # Ref: https://kubernetes.io/docs/concepts/services-networking/dual-stack/
        # E.g.
        # ipFamilies:
        #   - IPv6
        #   - IPv4
        ipFamilies: []

      serviceMonitor:
        enabled: false
        # The namespace where Prometheus expects to find service monitors.
        # namespace: ""
        # Add custom labels to the ServiceMonitor resource
        additionalLabels: {}
          # prometheus: kube-prometheus-stack
        interval: ""
        # honorLabels: true
        insecureSkipVerify: true
        serverName: null
        metricRelabelings: []
          # - action: keep
          #   regex: 'descheduler_(build_info|pods_evicted)'
          #   sourceLabels: [__name__]
        relabelings: []
          # - sourceLabels: [__meta_kubernetes_pod_node_name]
          #   separator: ;
          #   regex: ^(.*)$
          #   targetLabel: nodename
          #   replacement: $1
          #   action: replace

```
16. Select **Next**

17. Select **Finish Configuration**

### Deploy a VMO Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left Main Menu, select **Clusters**. Select **Create Cluster**.

3.  In the **Data Center** section, select **MAAS**. In the bottom-right corner, select **Start MAAS Configuration**.

4.  Provide basic cluster information: **Cluster name**, **Description**, and **Tags**. Select the PCG deployed in your
    MAAS environment from the **Cloud Account** drop down menu. Select **Next**.

5.  Select **Add Cluster Profile**.

6.  Locate and select the cluster profile you created in the Create a VMO Cluster Profile section. Select **Confirm**.

7.  Review and override pack parameters as desired and select **Next**. By default, parameters for all packs are set with
    values defined in the cluster profile.

8.  Select a domain from the **Domain drop-down Menu** and select **Next**.

9.  Configure the control plane and worker node pools. The following input fields apply to MAAS control plane and worker
    node pools. For a description of input fields that are common across target platforms refer to the
    [Node Pools](clusters/cluster-management/node-pool.md) management page.

##### Control Plane Pool Configuration

No changes will be made to the first section of control plane pool configuration. We recommend reviewing these values to
understand how they impact the deployment and how you might use them in a production deployment.

##### Control Plane - Cloud Configuration

| Variable            | Instruction                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Pool       | Set this value to the resource pool that your target MAAS machine is a member of.                                                                                                                                                                                                                       |
| Minimum CPU         | Set this to the minimum number of CPU cores you want your Control Plane server to have. Do not set values lower than 4.                                                                                                                                                                                 |
| Minimum Memory (GB) | Set this to the maximum amount of memory you want your Control Plane server to have. Do not set values lower than 8 GB.                                                                                                                                                                                 |
| Availability zones  | This is an optional value that allows you to specify which AZ's to use for your node deployment. This configuration is critical to consider when planning high availability infrastructure deployments.                                                                                           |
| Tags                | This is an option value that allows you to assign a tag to the MAAS machine selected for the build. <br /> To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |

##### Worker Pool Configuration

No changes will be made to the first section of the worker pool configuration. We recommend reviewing these values to
understand how they impact the deployment and how you might use them in a production deployment.

##### Worker Pool - Cloud Configuration

| Variable            | Instruction                                                                                                                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Pool       | Set this value to the resource pool that your target MAAS machine is a member of.                                                                                                                                                                                      |
| Minimum CPU         | Set this to the minimum number of CPU cores you want your Control Plane server to have. Do not set values lower than 5.                                                                                                                                                |
| Minimum Memory (GB) | Set this to the maximum amount of memory you want your Control Plane server to have. Do not set values lower than 8 GB.                                                                                                                                                |
| Availability zones  | This is an optional value that allows you to specify which AZ's to use for your node deployment. This configuration is critical to consider when planning high availability patterns for your infrastructure.                                                          |
| Tags                | This is an option value that allows you to assign the associated . <br /> To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |

Select **Next**.

12. The **Optional cluster settings** screen is displayed. This tutorial requires changes to the **RBAC** configuration.

    Select **RBAC**.

    Select **Add New Binding** and enter information as instructed in the table below.

    | Field             | Instruction                                                                                                                 |
    | ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
    | Cluster Role Name | For the purpose of this tutorial, you will use the _cluster-admin_ role.                                                    |
    | Subject Type      | Set this value to _user_.                                                                                                   |
    | Subject Name      | The VMO cluster you created was set to use Palette for OIDC. In this field, enter the ID you use when logging into Palette. |

    Select **Validate**.

:::caution

If you are not using a test cluster for this tutorial, we strongly recommend adhering to your companies security
standards when configuring RBAC for your cluster. If there are no clear standards, we recommend following the
[Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security model.

:::

13. Select **Finish Configuration** to begin deployment of your cluster.

### Verify the Deployment

To verify your cluster deployment was successful, navigate to the **Clusters** option in the left Main Menu in Palette. Select the
cluster name you created. On the overview page, ensure the cluster status is healthy. No further validation is
necessary.

### Deploy a Virtual Machine

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left Main Menu, select **Clusters**.

3. Select the cluster you deployed in the _Deploy a VMO Cluster with the Palette UI_ section.

4. Select the **Virtual Machines** tab. If the **Virtual Machines** tab is not displayed, review the RBAC configuration in the _Deploy a VMO Cluster with the Palette UI_ and ensure your user account is configured as instructed.

5. Select the *VirtualMachines* namespace from the **Namespace** drop down menu. This value will be used as the target deployment namespace in your VM manifest. Select **New Virutal Machine**.

6. Select the **Ubuntu 22.04 (pod nw)** template. This template configures your VM to get IP addresses from your configured pod subnets.

    The **VM settings** page allows you to customize basic VM configurations. Set the values as instructed in the table below. Select **Next**.

| Configuration | Value | Description |
|---------------|-------|-------------|
| CPUs (cores) | 2 | The number of CPU cores your VM will have. |
| Memory (GiB) | 2 | The amount of Memory your VM will have in GiB |
| Storage Access Mode | ReadWriteMany | We recommend always using ReadWriteMany. This configuration allows your VM to read the storage volume from any node in your cluster. This is required if you plan to migrate your VM between nodes. <br /> This configuration also helps to avoid node congestion as Kubernetes will attempt to schedule your VM on the node where the storage volume is first mounted. |
| OS image URL | N/A | Your image location is defined in the Ubuntu 22.04 (pod nw) template. This field can be used if you choose to use custom OS images for your VM. |
| Start VM automatically after creation | Halted | This can be set to your preference. The tutorial will cover how to manually start your VM. |

:::info

The [virtual_machines.tf](/tutorials/vmo/vmo-maas/#virtual_machinestf) section contains a table the discusses some of the values displayed in the text editor frame. We recommened reviweing the table to learn more about customizing your VM deployment.

:::

7. Select **Next**.

8. Select **Create Virtual Machine**.

### Validate the Application

The deployed VM should be successfully provisioned, in a healthy state, and the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application be installed and functional.

In Palette, navigate to the left main menu and select **Clusters**. Select the cluster you created.

Select the URL link for port **:8080** to access the Hello Universe application.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.webp)

Your result should be similar to the below screenshot.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)


The Palette UI provides a prebuilt command you can use to connect to your VM with SSH. Select **Copy SSH command** from the **Actions** drop down menu. This command can be pasted into a terminal window on your workstation. This requires virtctl to be installed on your local machine. 

### Clean Up - UI Workflow

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left Main Menu and select **Clusters**. Select the cluster you want to delete
to access its overview page.

Select on **Settings** to expand the menu, and select **Delete Cluster**.

![Delete cluster](/getting-started/azure/getting-started_deploy-k8s-cluster_delete-cluster-button.webp)

You will be prompted to type in the cluster name to confirm the delete action. Type in the cluster name to proceed with
the delete step. The deletion process takes several minutes to complete.

<br />

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for a force delete. To trigger a force
delete, navigate to the cluster’s details page, select on **Settings**, then select **Force Delete Cluster**. Palette
automatically removes clusters stuck in the cluster deletion phase for over 24 hours.

:::

<br />

Once the cluster is deleted, navigate to the left **Main Menu** and select **Profiles**. Find the cluster profile you
created and select the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the
selection to remove the cluster profile.

</TabItem>

</Tabs>

## Wrap-up

In this tutorial, you created a new cluster profile and used it to deploy new Kubernetes cluster with _Palette Virtual
Machine Orchestrator_ configured on it. You deployed a VM that was pre-built with the _Hello Universe_ app and confirmed
it was functioning in your VMO cluster correctly.

<br />
<br />

## Additional Information

### Palette Specific Terraform Files

This section will guide you through the Palette specific terraform files used in the tutorial. You will gain a better
understanding of how the variables in _terraform.tfvars_ fit with the other deployment files, and what the Terraform
scripts are actually doing when you execute `terraform apply`.

#### Manifests

Manifests are used to customize a pack's configuration. Some packs, like OS, Load Balancers require information specific
to your environment. When using terraform, the location of the manifest file for a pack must be specified as shown in
the **cluster_profiles.tf** file. If a manifest is not provided, default values will be applied.

This tutorial requires the MetalLB load balancer pack to have 2 IP Addresses defined.

Navigate to the **/vmo-cluster/manifests** folder in the Terraform tutorial code folder you downloaded.

Open the **metallb-values.yaml** file.

Update the IP addresses to reflect your environment and save the changes.

```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0-192.168.10.10 # These IP addresses would need to be updated to reflect your environment.
            avoidBuggyIPs: true
            autoAssign: true
      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool
```

#### cluster_profiles.tf

This file creates the cluster profile you will use to build your VMO cluster. Each pack to be included in the profile is
listed along with information to identify it in Palette. This file does not contain actual values for the **name**,
**tag**, and **id** fields. These are looked using queries in the **data.tf** file. Visit the [packs](/integrations)
page to search for packs you want to add and obtain their values.

In this example, you are creating a new Cluster Profile named "tf-maas-vmo-profile" and using the MetalLB pack from your
target registry.

```yaml
resource "spectrocloud_cluster_profile" "maas-vmo-profile" {
  count = var.deploy-maas ? 1 : 0

  name        = "tf-maas-vmo-profile"                       # The profile name that will display in Palette.
  description = "A basic cluster profile for MAAS VMO"      # The description of the profile that will display in Palette.
  tags        = concat(var.tags, ["env:maas"])              # Tags to be applied can be added as key value pairs in between the square brackets.
  cloud       = "maas"                                      # The type of infrastructure you are using. Other values could be "GCP", "Azure", "AWS".
  type        = "cluster"                                   # The type of profile you are creating. Other values could be "Infrastructure" or "App"
  version     = "1.0.0"                                     # The version number you want to assign to the profile.

  pack {                                                    # This pack is configured to retrieve information from a data source. See the data.tf section for more information.
    name = data.spectrocloud_pack.maas_metallb.name
    tag  = data.spectrocloud_pack.maas_metallb.version
    uid  = data.spectrocloud_pack.maas_metallb.id
    values = templatefile("manifests/metallb-values.yaml")  # This tells Terraform where the manifest to be applied is located. See the manifests section for more information.
    type = "spectro"
  }
}
```

#### clusters.tf

This file creates your VMO cluster in MAAS. The majority of values in this file are provided via variables you set in
_terrafrom.tfvars_.

General Configuration

Values in this section are specific to the overall MAAS VMO cluster that will be built.

```shell
resource "spectrocloud_cluster_maas" "maas-cluster" {
  count = var.deploy-maas ? 1 : 0

  name                 = "vmo-cluster-maas"
  tags                 = concat(var.tags, ["env:maas"])
  cloud_account_id     = data.spectrocloud_cloudaccount_maas.account[0].id
  pause_agent_upgrades = "unlock"

  cloud_config {
    domain = var.maas-domain
  }

  cluster_profile {
    id = resource.spectrocloud_cluster_profile.maas-vmo-profile[0].id
  }
```

| **Variable** | **Data Type** | **Instruction**                                                                                   |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------- |
| **name**     | _string_      | Set this value to the name you want your MAAS VMO cluster to have. Value must be inside "quotes". |

Control Plane Node Configuration

Values on these lines are nested in the **vmo-maas-control-planes** machine pool section and will only impact control
plane nodes.

```shell
  machine_pool {
    name          = "maas-control-plane"
    count         = 1
    control_plane = true
    azs           = var.maas-control-plane-azs
    node_tags     = var.maas-control-plane-node-tags
    instance_type {
      min_cpu       = 8
      min_memory_mb = 16000
    }
    placement {
      resource_pool = var.maas-control-plane-resource-pool
    }
  }
```

| **Variable**      | **Data Type** | **Instruction**                                                                                                                                                              |
| ----------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **name**          | _string_      | Set this value to the name you want the MAAS Machine Pool to have for control plane nodes.                                                                                   |
| **count**         | _number_      | Set this value to the number of control plane nodes you want to have.                                                                                                        |
| **control_plane** | _boolean_     | This is true false value. If not provided, the default value is false. Set this to **true** to have Palette create these VMs as your MAAS VMO cluster's control plane nodes. |
| **min_cpu**       | _number_      | Set this value to reflect your desired CPU core count for control plane nodes in your environment.                                                                           |
| **min-memory-mb** | _number_      | Set this value to reflect the desired memory allocation for control plane nodes in your environment.                                                                         |

:::tip

For non-production environments, lower CPU and Memory resources can be used.

:::

---

Worker Node Configuration

Values on these lines are nested in the **vmo-maas-worker-nodes** machine pool section and will only impact worker
nodes.

```shell
  machine_pool {
    name      = "maas-worker-basic"
    count     = 1
    azs       = var.maas-worker-azs
    node_tags = var.maas-worker-node-tags
    instance_type {
      min_cpu       = 8
      min_memory_mb = 32000
    }
    placement {
      resource_pool = var.maas-worker-resource-pool
    }
  }
}
```

| **Variable**      | **Data Type** | **Instruction**                                                                                                           |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **name**          | _string_      | Set this value to the name you want the MAAS Machine Pool to have for control plane nodes. Value must be inside "quotes". |
| **count**         | _number_      | Set this value to the number of control plane nodes you want to have.                                                     |
| **min_cpu**       | _number_      | Set this value to reflect your desired CPU core count for control plane nodes in your environment.                        |
| **min-memory-mb** | _number_      | Set this value to reflect the desired memory allocation for control plane nodes in your environment.                      |

:::info

Remember, your worker node must have 2 disks allocated to it.

:::

#### virtual_machines.tf

This file defines the configuration of the VM you will deploy to your MAAS VMO cluster. You will gain a high level
understanding of the file structure, what actions are being executed, and how your VM is tied into Kubernetes.

| **Variable**        | **Data Type** | **Instruction**                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **run_on_launch**   | _boolean_     | If set to true, the deployed VM will be started when the host is powered on. <br/><br/> We recommend this value to be set to **true** for production services.                                                                                                                                                                                     |
| **namespace**       | _string_      | This value defines the namespace your VM will be created in. <br/><br/>These namespaces are standard Kubernetes namespaces. Your VM will be impacted by any configurations applied at the namespace level such as network policies and quotas.                                                                                                     |
| **name**            | _string_      | The name you wish to assign to your VM.                                                                                                                                                                                                                                                                                                            |
| **Labels**          | _string_      | Add any labels you want applied to your VM resource in Kubernetes. To create more labels, repeat the format in line 21 on a new line.                                                                                                                                                                                                              |
| **storage configs** | _string_      | Multiple lines are used to define the storage configuration for your VM and the PVC's containing the OS images needed to create it. <br/><br/> Default values were used for this tutorial with the exception of the value you set for _vm-storage-Gi_<br/> in _terraform.tfvars_                                                                   |
| **storage**         | _number_      | This value determines how much storage your VM will have. Set it as needed for your environment.                                                                                                                                                                                                                                                   |
| **cores**           | _number_      | The number of CPU cores you want your VM to have.                                                                                                                                                                                                                                                                                                  |
| **sockets**         | _number_      | This value determines the number of sockets the CPU cores can be spread across. <br/><br/> 2 cores and 2 sockets will place use one CPU core in one physical CPU socket and a second core in a different physical CPU socket. This granular control enables you to ensure High Availability (HA) and fault tolerance down to the CPU socket level. |
| **threads**         | _number_      | This value determines how many CPU threads your VM can use.                                                                                                                                                                                                                                                                                        |
| **guest**           | _number_      | This value is in the memory section and determines how much memory your VM will be assigned. Set it as needed for your environment.                                                                                                                                                                                                                |

### Packs Used for VMO

This section will review the packs used to create a VMO Cluster in a MAAS environment. You will learn what the packs are
and how they work together to provide VMO services. You will be introduced to the Terraform deployment process and will
customize the provided template to prepare for deployment in your MAAS environment.

| **Pack Name**                    | **Version** | **Description**                                                                                                                                                                                                                                                                                                                                                                                  | **ReadMe Link**                                                                                                                        |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Virtual Machine Orchestrator** | v##         | The Palette Virtual Machine Orchestrator (VMO) pack consolidates all components that you need to deploy and manage Virtual Machines (VMs) alongside containers in a Kubernetes host cluster. You can deploy VMO as an add-on cluster profile on top of an existing data center or edge cluster.                                                                                                  | <VersionedLink text="Virtual Machine Orchestrator Readme" url="/integrations/packs/?pack=virtual-machine-orchestrator&version=4.6.3"/> |
| **MetalLB (Helm)**               | v##         | A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols. Offers a network load balancer implementation that integrates with standard network equipment.                                                                                                                                                                                              | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=lb-metallb-helm&version=1.14.9"/>                                   |
| **Rook-Ceph (Helm)**             | v##         | **Rook** is an open source cloud-native storage orchestrator for Kubernetes, providing the platform, framework, and support for Ceph storage to natively integrate with Kubernetes. **Ceph** is a distributed storage system that provides file, block and object storage and is deployed in large scale production clusters.                                                                    | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=csi-rook-ceph-helm&version=1.16.3"/>                                |
| **Cilium**                       | v##         | Cilium is a networking, observability, and security solution with an eBPF-based data plane.                                                                                                                                                                                                                                                                                                      | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=cni-cilium-oss&version=1.17.1"/>                                    |
| **Palette eXtended Kubernetes**  | v##         | Palette eXtended Kubernetes (PXK) is a recompiled version of the open source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette | <VersionedLink text="Palette eXtended Kubernetes Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/>                   |
| **Ubuntu Mass**                  | v##         | Ubuntu is a free, open source Operating System (OS) based on Linux that can be used on desktops, servers, in the cloud, and for IoT devices. Ubuntu is a Linux distribution derived from Debian.                                                                                                                                                                                                 | <VersionedLink text="Ubuntu Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/>                                        |

                                         |
