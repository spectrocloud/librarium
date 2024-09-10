---
sidebar_label: "Create a VM Template"
title: "Create a VM Template"
description: "Learn how to create a VM template using Palette Virtual Machine Orchestrator."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo"]
---

Although Palette provides out-of-the box templates, we recommend that you create and manage your own templates.

## Prerequisites

- Valid YAML that defines your VM template.

## Create a VM Template

Create a template by adding a YAML file as a manifest in an add-on profile.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Profiles** and click the **Add Cluster Profile** button.

3. Give the profile a name, select type **Add-on**, and click **Next**.

4. On the Profile Layers page, click **Add Manifest**.

5. Give the layer a name, and click **Edit manifest** and enter a name for the first template. Click the checkmark icon.

6. In the blank manifest file at right, enter the VM definition as a YAML file. You can add multiple manifests for
   multiple templates in the same add-on profile. They will display as layers in the profile.

7. Click **Confirm and Create**, then click **Next**.

8. Click **Finish Configuration**.

#### Example YAML for a VM template

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: example
  namespace: default
  labels:
    app.kubernetes.io/managed-by: Helm
    kubevirt.io/vm: example
spec:
  dataVolumeTemplates:
    - metadata:
        name: example-dv-u2204-sip
      spec:
        pvc:
          accessModes:
            - ReadWriteMany
          resources:
            requests:
              storage: 50Gi
        source:
          registry:
            url: >-
              docker://gcr.io/spectro-images-public/release/virtual-machine-orchestrator/os/ubuntu-container-disk:22.04
  running: false
  template:
    metadata:
      annotations:
        descheduler.alpha.kubernetes.io/evict: "true"
    spec:
      domain:
        cpu:
          cores: 8
          sockets: 1
          threads: 1
        devices:
          disks:
            - disk:
                bus: virtio
              name: datavolume-os
            - disk:
                bus: virtio
              name: cloudinitdisk
          interfaces:
            - bridge: {}
              model: virtio
              name: default
              macAddress: "06:AD:69:40:F0:94"
        machine:
          type: q35
        resources:
          limits: {}
          requests: {}
        memory:
          guest: 16Gi
      networks:
        - multus:
            networkName: vlan-0
          name: default
      volumes:
        - dataVolume:
            name: example-dv-u2204-sip
          name: datavolume-os
        - cloudInitNoCloud:
            networkData: |
              network:
                version: 1
                config:
                  - type: physical
                    name: enp1s0
                    subnets:
                      #- type: dhcp
                      - type: static
                        address: a.b.c.d/prefixlength
                        gateway: e.f.g.h
                  - type: nameserver
                    address:
                      - 8.8.8.8
            userData: |
              #cloud-config
              ssh_pwauth: True
              chpasswd: { expire: False }
              password: spectro
              disable_root: false
              runcmd:
                - apt-get update
                - apt-get install -y qemu-guest-agent
                - systemctl start qemu-guest-agent
          name: cloudinitdisk
```

## Validate

1. Navigate to the left **Main Menu** and click **Profiles**.

2. Verify your newly added manifest is listed.

## Next Steps

Try applying the template to your cluster. Navigate to **Clusters** and click `+` next to Addon Layers, then select the
VMO profile you created.
