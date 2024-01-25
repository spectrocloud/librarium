---
sidebar_label: "generic-vm-vsphere"
title: "Generic Virtual Machine vSphere"
description: "Choosing vSphere Generic Virtual Machine within the Palette console"
hide_table_of_contents: true
type: "integration"
category: ["system app", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/generic-vm-vsphere/blobs/sha256:3b121dca3cbc7fed0153d3e1c8c3df20076ec200e091085a3a281ba08cb2261e?type=image/png"
tags: ["packs", "generic-vm-vsphere", "system app"]
---

Generic-VM-vSphere is a Palette Add-on pack used to simplify deploying the virtual machine resource from a cluster
profile or a system profile. Generic-VM-vSphere extracts all Terraform constructs inside the pack and exposes nothing
but the values. Users will then have the ability to modify the add-on pack for the different applications.

<br />

## Version Supported

<Tabs queryString="versions">
<TabItem label="1.0.x" value="1.0.x">

- **1.0.4**
- **1.0.0**

</TabItem>
</Tabs>

<br />

## Configuring Generic-VM-vSphere

To configure the Generic-VM-vSphere Add-on pack for the application cluster, the namespace value should be as follows:

`cluster-{{ .spectro.system.cluster.uid }}` <br />

```yaml
namespace: cluster-{{ .spectro.system.cluster.uid }}
```

If multiple instances of this pack has to be deployed on the cluster for different virtual machine applications, then
modify '`spectrocloud.com/display-name`' and '`releaseNameOverride`' with different names to make it unique across all
the packs in the cluster.

<br />

```yaml
spectrocloud.com/display-name: vm-app-1
releaseNameOverride:
```

<br />
<br />

## Generic-VM-vSphere Pack Manifest

<br />

```yaml
pack:
  # for app cluster, namespace value should be "cluster-{{ .spectro.system.cluster.uid }}"
  namespace: jet-system

  # if multiple instance of this pack has to be deployed on the cluster for different vm applications
  # then modify 'spectrocloud.com/display-name' and 'releaseNameOverride' with unique names to make it
  # unique across all the packs in the cluster
  # spectrocloud.com/display-name: vm-app-1
  # releaseNameOverride:
  # generic-vm-vsphere: vm-app-1

charts:
  generic-vm-vsphere:
    providers:
      source: "hashicorp/vsphere"
      version: "2.2.0"
    name: vm-app-1
    hardware:
      cpu: 2
      memory: 6 #in GB
      dataDisks:
        - size: 20 #in GB
        - size: 25 #in GB

    # To use an image from a remote url please uncomment the below lines and comment out the vmTemplate section.
    # ovaTemplate:
    #   remote_ovf_url: "https://192.168.100.12:8443/artifactory/generic-eis-all/ehl-guest/sles-154-cloud-kube-v1.21.10-20220718141926-014.ova"
    #   name: system-cluster-ova
    #   network:
    #   - name: "VM Network"
    #     value: "VLAN-909"
    #   disk:
    #     size: 40
    vmTemplate: "spectro-templates/ubuntu-focal-20.04-cloudimg-20220207"
    guestId: "ubuntu64Guest" #ubuntu64Guest for ubuntu, sles15_64Guest for sles etc
    scsiType: "lsilogic"

    cloudInit:
      # cloud init properties can be injected in vsphere via guest extra config (guestExtraConfig) or via vapp properties (vAppProperties)
      # if cloud init type is vAppProperties then add data in vAppProperties: section and leave guestExtraConfig commented
      # else if cloud init type is guestExtraConfig then add data in guestExtraConfig: section and leave vAppProperties commented
      type: guestExtraConfig # valid values is one of ["vAppProperties" or "guestExtraConfig"]
      userData: |
        #cloud-config
        # vim: syntax=yaml
        # Note: Content strings here are truncated for example purposes.
        ssh_pwauth: true
        chpasswd:
          list:
            - ubuntu:welcome
          expire: false
      metaData: |

      networkConfig: |
        version: 2
        ethernets:
          ens3:
            dhcp4: true

      guestExtraConfig:
        "guestinfo.network_config": base64encode(data.template_file.network_config.rendered)
        "guestinfo.network_config.encoding": "base64"
        "guestinfo.userdata": base64encode(data.template_file.user_data.rendered)
        "guestinfo.userdata.encoding": "base64"

      vAppProperties:
        #instance-id: vm-app-1
        #hostname: vm-app-1
        #public-keys: "ssh-rsa AAAAB3....NGJwwlOmNrw== spectro@spectro"
        #password: abcde12345
        #user-data: data.template_file.user_data.rendered

    # 'extraVMHclConfig' can be used to provide extra configuration in the virtual machine and config should be provided in HCL
    # format
    # extraVMHclConfig: |
    #   cdrom {
    #     client_device = true
    #   }

    # preExecCmd & postExecCmd gets executed in each reconcile loop which runs at an interval of ~2 mins
    # If you want to run some command or script only whenever VM is getting creating or after VM is destroyed
    # then you can use 'preVMInitCmd' and 'postVMInitCmd' respectively
    # preExecCmd: "bash /var/files/pre-exec.sh"
    # postExecCmd: "bash /var/files/pre-exec.sh"

    # preVMInitCmd & postVMInitCmd gets executed only when VM is being created/recreated and after VM is created/recreated respectively
    preVMInitCmd: ""
    postVMInitCmd: ""

    # For first time deployment, preVMDestroyCmd won't be invoked. If there is any change in cloud-init then vm resource will get recreated,
    # and 'preVMDestroyCmd' will be invoked before deleting VM and once preVMDestroyCmd gets executed successfully, then only VM resource will be deleted.
    # Once VM is deleted then before another VM is created, preVMInitCmd will be invoked

    # preVMDestroyCmd can also be used to ssh into vm or call the rest api for the application running inside vm before vm is terminated
    # or to download the file and use it later once new vm is provisioned
    preVMDestroyCmd: ""

    # mounts section can be used to mount data inside existing config maps or secrets into the pod as files where pre and post
    # hooks are executed
    # so that data present in config map or secret can be accessed while executing pre and post exec hooks
    mounts:
      configMap:
      #     - name: system-config
      #       path: /data/system-config
      #     - name: system-config-2
      #       path: /data/system-config-2
      secret:
    #     - name: system-config
    #       path: /data/system-config
    #     - name: system-config-2
    #       path: /data/system-config-2

    # envs section can be used to inject data inside existing config maps or secrets into the pod as env variables
    # where pre and post hooks are executed
    # so that data present in config map or secret can be accessed while executing pre and post exec hooks
    envs:
      configMap:
      #     - name: database-app-config
      #       env: DATABASE_USER
      #       dataKey: "db.user"
      secret:
    #     - name: database-app-secret
    #       env: DATABASE_PASSWORD
    #       dataKey: "db.password"

    # files present in below section will be added to the pod and will be accessible while executing
    # pre and post exec hooks and absolute file path would be '/var/files/<file_name>'
    files:
    # - name: pre-exec.sh
    #   content: |
    #     #!/bin/bash
    #     echo "I am pre exec"
    # - name: post-exec.sh
    #   content: |
    #     #!/bin/bash
    #     echo "I am post exec"
```

## Virtual Machine Hooks

The Generic-VM-vSphere pack supports various hooks while deploying VM applications and supports multiple use-cases of
customizing workflow, as customers require.

<br />

## Using extraVMHclConfig

The extraVMHclConfig command can be used to provide an extra configuration in the virtual machine and the configuration
file should be provided in HashiCorp Configuration Language (HCL) format.

```terraform
# extraVMHclConfig: |
#   cdrom {
#     client_device = true
#   }
```

## Using preExecCmd and postExecCmd

The **preExecCmd** and **postExecCmd** commands will be executed in every pod reconciliation. The loop runs at
approximately a 2-minute interval.

**preExecCMD** and **postVMInitCmd** are used to execute commands or scripts prior to virtual machine creation and after
virtual machine creation respectively.

<br />

```yaml
preExecCmd: "bash /var/files/pre-exec.sh"
```

```yaml
postExecCmd: "bash /var/files/pre-exec.sh"
```

<br />

## Using preVMInitCmd and postVMInitCmd

The **preVMInitCmd** command is executed, only when the virtual machine is being created or recreated. Likewise, the
**postVMInitCmd** command is executed only after the virtual machine is created or recreated.

**Note**: These commands will not be executed in each reconciliation.

<br />

```yaml
preVMInitCmd: "echo 'Hey! Hang on tight. I am gonna create a VM.'"
```

```yaml
postVMInitCmd: "echo 'Ooho! VM is created.'"
```

<br />

## Using preVMDestroyCmd

Any command or script provided in this virtual machine hook will execute before the virtual machine is destroyed. It
will be executed only when the VM is getting deleted. A virtual machine deletion can happen for any reason, like
changing anything in cloud-init or removing the pack from the profile.

<br />

```yaml
preVMDestroyCmd: ""
```

<br />

:::info

During a first-time deployment, <b> preVMDestroyCmd</b> won't be invoked. However, if there is any change in cloud-init,
then the VM resource will be recreated, preVMDestroyCmd will be invoked before deleting the VM, and once preVMDestroyCmd
is executed successfully, only then the VM resource will be deleted.

<br />
<br />
Once the VM is deleted and before another virtual machine is created, <b>preVMInitCmd</b> will be invoked.

:::

<br />
<br />

## Mounts

Mount the data inside the existing configuration map or secret into the pod as files, where pre-and-post hooks are
executed. This allows the data present in the configuration map or the secrets file to be accessible while running
pre-and-post exec hooks.

<br />

```yaml
mounts:
  configMap:
  #     - name: system-config
  #       path: /data/system-config
  #     - name: system-config-2
  #       path: /data/system-config-2
  secret:
  #     - name: system-config
  #       path: /data/system-config
  #     - name: system-config-2
  #       path: /data/system-config-2
```

<br />

## Environment Variables

The ENVS section can inject data inside the existing config maps or secrets into the pod as environment variables, where
pre-and post-hooks are executed so that data present in the config map or the secret file can be accessed while running
pre-and-post exec hooks.

<br />

```yaml
envs:
  configMap:
    #     - name: database-app-config
    #       env: DATABASE_USER
    #       dataKey: "db.user"
  secret:
    #     - name: database-app-secret
    #       env: DATABASE_PASSWORD
    #       dataKey: "db.password"
```

<br />

## Files

Files present in this section will be added to the pod and will be accessible while executing pre-and-post execution
hooks and absolute file path would be '/var/files/\<file_name>'.

<br />

```yaml
files:
# - name: pre-exec.sh
#   content: |
#     #!/bin/bash
#     echo "I am pre exec"
# - name: post-exec.sh
#   content: |
#     #!/bin/bash
#     echo "I am post exec"
```

<br />
