---
sidebar_label: "generic-vm-libvirt"
title: "Generic Virtual Machines Libvirt"
description: "Choosing Libvirt Generic Virtual Machine within the Palette console"
hide_table_of_contents: true
type: "integration"
category: ["system app", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/generic-vm-libvirt/blobs/sha256:23e1ba27947158ccf1ae36913601011508a55103ce1bdb517a175d752fb35eea?type=image.webp"
tags: ["packs", "generic-vm-libvirt", "system app"]
---

Generic-VM-Libvirt is a Palette Add-on pack used to simplify deploying the virtual machine applications from a cluster
profile or a system profile. Generic-VM-Libvirt extracts all Terraform constructs inside the pack and exposes nothing
but the values. Users will then have the ability to modify the add-on pack for the different applications.

## Version Supported

<Tabs queryString="versions">
<TabItem label="1.0.x" value="1.0.x">

- **1.0.2**
- **1.0.0**

</TabItem>
</Tabs>

<br />

## Configuring Palette Generic VM Libvirt Add-on

To configure the Generic-VM-Libvirt add-on pack for the application cluster, begin by editing the manifest namespace
value.

`cluster-{{ .spectro.system.cluster.uid }}`

**Example**

```yaml
namespace: jet-system
```

If multiple instances of this pack have to be deployed on the cluster for different virtual machine applications, then
modify '`spectrocloud.com/display-name`' and '`releaseNameOverride`' with distinctive names to make it unique across all
the packs in the cluster.

<br />

```yaml
spectrocloud.com/display-name: vm-app-1
releaseNameOverride:
```

<br />

## Generic-VM-Libvirt Pack Manifest

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
  # generic-vm-libvirt: vm-app-1

charts:
  generic-vm-libvirt:
    providers:
      source: "dmacvicar/libvirt"
      version: "0.6.14"
    name: vm-app-1
    image: https://cloud-images.ubuntu.com/releases/xenial/release/ubuntu-16.04-server-cloudimg-amd64-disk1.img

    # uncomment the below line and comment the above line if the image is present within the host.
    # image="/opt/spectrocloud/ubuntu-16.04-server-cloudimg-amd64-disk1.img"
    hardware:
      cpu: 2
      memory: 6 #in GB
      network: ["br-int"]
      rootDisk:
        size: 50 #in GB
        pool: ehl_images
      dataDisks:
        - size: 20 #in GB
          pool: ehl_data
          persisted: true
        - size: 25 #in GB
          pool: ehl_data
          persisted: true
    cloudInit:
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

    # preVMDestroyCmd can also be uded to ssh into vm or call the rest api for the application running inside vm before vm is terminated
    # or to download the file and use it later once new vm is provisioned
    preVMDestroyCmd: ""

    # extraDomainHclConfig: |
    #   cpu {
    #     mode = "host-passthrough"
    #   }

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

The Generic-VM-Libvirt pack supports various hooks, while deploying VM applications and supports multiple use-cases of
customizing workflow, as customers require.

<br />

## Using preExecCmd and postExecCmd

The **preExecCmd** and **postExecCmd** commands will be executed in every pod reconciliation. The loop runs at
approximately a 2-minute interval.

If you want to run the command or script only, whenever the virtual machine is getting created or after the virtual
machine is destroyed, use **preVMInitCmd** and **postVMInitCmd**, respectively.

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

Any command or script provided in this virtual machine hook will execute before the VM gets destroyed. It will be
executed only when the VM is being deleted. A virtual machine deletion can happen for any reason, like changing anything
in cloud-init or removing the pack from the profile.

<br />

```yaml
preVMDestroyCmd: ""
```

<br />

:::info

During a first-time deployment, <b> preVMDestroyCmd</b> will not be invoked. However, if there is any change in
cloud-init, then the VM resource will be recreated, preVMDestroyCmd will be invoked before deleting the VM, and once
preVMDestroyCmd is executed successfully, only then will the VM resource be deleted.

<br />
Once the virtual machine is deleted and before another virtual machine is created, <b>preVMInitCmd</b> will be invoked.

:::

<br />

## Files

Files presented in this section will be added to the pod, where the pre-and-post exec hooks are executed.

<br />

```yaml
files:
  - name: pre-exec.sh
    content: |
      #!/bin/bash
      echo "I am pre exec"
  - name: post-exec.sh
    content: |
      #!/bin/bash
      echo "I am post exec"
extraDomainHclConfig: |
  cpu {
    mode = "host-passthrough"
  }
```

<br />

## Mounts

Mount the data inside the existing configuration maps or secrets into the pod as files, where pre-and-post hooks are
executed. This allows the data present in the configuration map or the secrets file to be accessible while running
pre-and-post exec hooks.

<br />

```yaml
mounts:
  configMap:
    - name: system-config
      path: /data/system-config
    - name: system-config-2
      path: /data/system-config-2
  secret:
    - name: system-config
      path: /data/system-config
    - name: system-config-2
      path: /data/system-config-2
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
    - name: database-app-config
      env: DATABASE_USER
      dataKey: "db.user"
  secret:
    - name: database-app-secret
      env: DATABASE_PASSWORD
      dataKey: "db.password"
```

## References

- [Libvirt Apps](https://libvirt.org/apps.html)
