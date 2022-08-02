---
title: 'generic-vm-libvirt'
metaTitle: 'Libvirt Generic Virtual Manager'
metaDescription: 'Choosing Libvirt Generic Virtual Manager within the Palette console'
hiddenFromNav: true
isIntegration: true
category: ['operating system']
logoUrl: ''
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

Generic-VM-Libvirt is an Add-on Pack that Palette enables to simplify deploying the virtual machine applications from a cluster profile or a system profile by extracting all Terraform constructs inside the pack and by exposing nothing but the values. Users will then have the ability to modify the add-on pack for the different applications.

## Version Supported

<Tabs>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

**1.0.0**

</Tabs.TabPane>
</Tabs>

## Configuring Palette Generic VM Libvirt Add-on

To begin configuring the Generic-VM-Libvirt add-on pack for the application cluster, the namespace value should be as follows:

`cluster-{{ .spectro.system.cluster.uid }}`

**Example**

```yaml
namespace: jet-system
```

If multiple instances of this pack has to be deployed on the cluster for different Virtual Machine applications, then modify '`spectrocloud.com/display-name`' and '`releaseNameOverride`' with unique names to make it unique across all the packs in the cluster.

<br />

```yaml
spectrocloud.com/display-name: vm-app-1 
releaseNameOverride: 
```

**Example**
    generic-vm-libvirt: vm-app-1

<br />

```yaml
pack:
charts:
generic-vm-libvirt:
providers:
    source: "dmacvicar/libvirt"
    version: "0.6.14"
name: vm-app-1
image: https://cloud-images.ubuntu.com/releases/xenial/release/ubuntu-16.04-server-cloudimg-amd64-disk1.img
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
```

<br />
<br />

## Using preExecCmd and postExecCmd

The **preExecCmd** & **postExecCmd** commands will be executed in each reconcile loop which runs at an interval of ~2 mins. If you want to run a command or script only, whenever the virtual machine is getting creating or after virtual machine is destroyed, then use 'preVMInitCmd' and 'postVMInitCmd', respectively.

<br />

```yaml
preExecCmd: "bash /var/files/pre-exec.sh"
```

```yaml
postExecCmd: "bash /var/files/pre-exec.sh"
```

<br />

## Using preVMInitCmd & postVMInitCmd 

The **preVMInitCmd** & **postVMInitCmd** commands are executed only, when the virtual machine is being created/recreated and after the virtual machine is created/recreated, respectively.

```yaml
preVMInitCmd: "echo 'Hey! Hang on tight. I am gonna create a VM.'"
```

```yaml
postVMInitCmd: "echo 'Ooho! VM is created.'"
```

<br />

## Using preVMDestroyCmd

For first time deployment, **preVMDestroyCmd** will not be invoked. If there is any change in the cloud-init, then the virtual machine resource will get recreated, and preVMDestroyCmd will be invoked before deleting the VM. Once the preVMDestroyCmd gets executed successfully, then only the VM resource will be deleted.

Once the VM is deleted, then before another VM is created, **preVMInitCmd** will be invoked.

**preVMDestroyCmd** can also be used to SSH into a VM or call the Rest API for the application running inside the VM, before the VM is terminated.


<br />

## Files

Files presented in the section below will be added to the pod where pre and post exec hooks are executed.

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
# extraDomainHclConfig: |
#   cpu {
#     mode = "host-passthrough"
#   }
```

<br />


## Mounts

The Mounts section can be used to mount data inside the existing configuration maps or secrets into the pod, as files where pre and post hooks are executed so that the data present in configuration map or secret can be accessed while executing pre and post exec hooks.

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

The ENVS section can be used to inject data inside the existing config maps or secrets into the pod as env variables where pre and post hooks are executed so that data present in config map or secret can be accessed while executing pre and post exec hooks.

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



## References


