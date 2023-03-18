---
title: "Create a VM Template"
metaTitle: "Create a VM Template"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Although Palette provides some generic out-of-the box templates, we recommend that you create and manage your own templates.

You can create your own templates by adding a YAML file as manifest in an add-on profile. 

1. Navigate to **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button. 
2. Define a name and select the **Add-on** type. In the Profile Layers page, click **Add Manifest** and enter a layer name.
3. Click **Edit manifest** and enter a name for the first template
4. Click on the blue icon ?? to validate the manifest creation. 
5. The next step is to enter the definition of the VM as YAML in the right screen. You can add multiple manifests for multiple templates in the same add-on profile.

6. To finish, click **Confirm and Create**, then **Next** to create the add-on profile.

### Example YAML for a template

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
  icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Fedora_logo.svg/534px-Fedora_logo.svg.png?20091128031656"
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
            image:  gcr.io/spectro-images-public/release/vm-dashboard/os/fedora-container-disk:36
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


