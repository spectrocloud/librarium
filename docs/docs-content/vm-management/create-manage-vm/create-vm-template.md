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

<br />

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Profiles** and click the **Add Cluster Profile** button.

3. Give the profile a name, select type **Add-on**, and click **Next**.

4. On the Profile Layers page, click **Add Manifest**.

5. Give the layer a name, and click **Edit manifest** and enter a name for the first template. Click the checkmark icon.

6. In the blank manifest file at right, enter the VM definition as a YAML file. You can add multiple manifests for multiple templates in the same add-on profile. They will display as layers in the profile.

7. Click **Confirm and Create**, then click **Next**.

8. Click **Finish Configuration**.

<br />

#### Example YAML for a VM template

```yaml
apiVersion: spectrocloud.com/v1
kind: VmTemplate
metadata:
  labels:
    app.kubernetes.io/name: fedora-36
    app.kubernetes.io/instance: fedora-36-instance
    app.kubernetes.io/part-of: vmtemplate
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: vmtemplate
  name: fedora-36
spec:
  description: This is Fedora 36 image
  displayName: Fedora 36
  icon: "https://s3.amazonaws.com/manifests.spectrocloud.com/logos/fedora.png"
  running: false
  template:
    spec:
      domain:
        cpu:
          cores: 1
        devices:
          disks:
            - name: containerdisk
              disk:
                bus: virtio
            - name: cloudinitdisk
              disk:
                bus: virtio
          interfaces:
            - name: default
              masquerade: {}
        resources:
          requests:
            memory: 1Gi
            cpu: 1
          limits:
            memory: 2Gi
            cpu: 2
      networks:
        - name: default
          pod: {}
      volumes:
        - name: containerdisk
          containerDisk:
            image: gcr.io/spectro-images-public/release/vm-dashboard/os/fedora-container-disk:36
        - name: cloudinitdisk
          cloudInitNoCloud:
            # user name is fedora
            userData: |
              #cloud-config
              ssh_pwauth: True
              chpasswd: { expire: False }
              password: spectro
              disable_root: false
              packages:
                qemu-guest-agent
              runcmd:
                - ["sudo", "systemctl", "enable", "--now", "qemu-guest-agent"]
```

## Validate

1. Navigate to the left **Main Menu** and click **Profiles**.

2. Verify your newly added manifest is listed.

## Next Steps

Try applying the template to your cluster. Navigate to **Clusters** and click `+` next to Addon Layers, then select the VMO profile you created.
