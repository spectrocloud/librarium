---
title: 'generic-vm-vsphere'
metaTitle: 'vSphere Generic Virtual Manager'
metaDescription: 'Choosing vSphere Generic Virtual Manager within the Palette console'
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

Generic-VM-vSphere is an Add-on Pack that Palette enables to simplify deploying the virtual machine applications from a cluster profile or a system profile by extracting all Terraform constructs inside the pack and by exposing nothing but the values. Users will then have the ability to modify the add-on pack for the different applications.

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
<br />

**Example**

generic-vm-libvirt: vm-app-1

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
vmTemplate: "spectro-templates/ubuntu-focal-20.04-cloudimg-20220207"
# If we want to configure the template using an ova
# ovaTemplate: 
#   remote_ovf_url:       "https://example.com/foo.ova"

# Optional configuration of ovf can also be added
# ovaTemplate: 
#   remote_ovf_url:       "https://example.com/foo.ova"
#   allow_unverified_ssl_cert: false
#   disk_provisioning:    "thin"
#   ip_protocol:          "IPV4"
#   ip_allocation_policy: "STATIC_MANUAL"
#   ovf_network_map:
#   - name: "Network 1"
#     value: "Network 1"
#   - name: "Network 2"
#     value: "Network 2"    

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

vAppProperties:
    #instance-id: vm-app-1
    #hostname: vm-app-1
    #public-keys: "ssh-rsa AAAAB3....NGJwwlOmNrw== spectro@spectro"
    #password: abcde12345
    #user-data: data.template_file.user_data.rendered
```

<br />
<br />

## Using extraVMHclConfig

The extraVMHclConfig command can be used to provide extra configuration in the virtual machine and config should be provided in HCL format.

```terraform
# extraVMHclConfig: |
#   cdrom {
#     client_device = true
#   }
```

## Using extraResourceHclConfig

The extraResourceHclConfig command can be used to provide extra configuration to add more resources and config should be provided in HCL format.

```terraform
# extraResourceHclConfig: | 
#   data "vsphere_virtual_machine" "template" {
#    name = "vm-1"
#    datacenter_id = data.vsphere_datacenter.dc.id
# }
```

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

The **preVMDestroyCmd** command can also be used to SSH into a VM or call the Rest API for the application running inside the VM, before the VM is terminated.

<br />

```yaml
preVMDestroyCmd: ""
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

Files present in below section will be added to the pod and will be accessible while executing pre and post exec hooks and absolulte file path would be '/var/files/<file_name>'.

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




## References


