---
title: "Native Day 2"
metaTitle: "Day 2 operations on native edge device"
metaDescription: "day 2 operations on native edge device"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Upgrading Your Edge Clusters

Palette uses immutable container-based OS images for the edge clusters, enabling efficient upgrades with minimal downtime. A new immutable OS image is built dynamically to include the upgraded artifacts, and this new image is swapped out with the existing one on the edge hosts. These immutable upgrades are based on the open-source project Kairos.

You can initiate the upgrade of your clusters by updating the infrastructure cluster profile associated with the cluster as follows:

<br />

* Modify the infrastructure profile to upgrade the K8s pack to the desired version,
	 Example: Version 1.22 to 1.23.


* All the clusters built from this profile start to show an update notification.


* Apply these notifications to your cluster to start the upgrade. You may need to resolve any conflicts in configuration between the two versions.


# Scale Your Edge Cluster

## Scale Up - Add Node(s)

To add new nodes to a running cluster, you will need to prepare the new edge host device and add it to the node pool configuration of a running cluster. 

* Prepare edge host(s) as described in the section above.


* Register the edge host on the Palette Management Console using its unique edge host ID. The edge host status should change to ‘Ready’ within a couple of minutes once the host agent on the edge host pairs up with its configuration on the Palette Management Console. 


* Edit the cluster node pool and increase the pool size of the desired node pool by adding the number of new nodes. 


* Associate the newly added edge hosts with the node pool in the appliance fields that get added due to increased pool size. 


* Save the configuration. 


Edge host agent(s) on the newly added nodes will detect that they are now part of a cluster and perform the required installation steps to deploy the appropriate image and join the running cluster. 

## Scale Down - Delete Node(s)

TBD


# Customizing Palette Edge Distribution

For certain environments or specific hardware, there might be a need to deploy additional packages or device drivers on the system for them to function correctly. For example, certain devices might need specific versions of drivers on them to establish network connectivity. Spectro Cloud provides a way for the Palette Installer Image and Palette Edge Distribution Images (PXE, PO-K3S, PO-RKE2) to be customized.

Follow the steps below to customize the Palette Distribution Image :


1. Checkout to **this** Git Repository and Switch to  the v2 branch
Copy the `.local.env.v2.template` file to `.local.env.v2`. Adjust the file settings as follows.

```
# Not supported yet.
#PUSH_BUILD="false"
# Flavor of OS+K8S
FLAVOR="ubuntu-rke2"
# Private registry to which the custom image is tagged and can be later pushed.
IMAGE_REPO="gcr.io/spectro-dev-public/venkat/p6os-ubuntu-rke2"
```

2. The Kubernetes versions supported for RKE2 and K3S are present in the `versions-v2.sh` file. Check them out to be aware of which images will be built.

```
cat versions-v2.sh

```
```
#!/bin/bash

BASE_REPO=${BASE_REPO:-quay.io/kairos}
K3S_VERSIONS="v1.25.0-k3s1,v1.24.4-k3s1,v1.23.10-k3s1,v1.22.13-k3s1"
RKE2_VERSIONS="v1.24.4-rke2r1,v1.23.10-rke2r1,v1.22.13-rke2r1"
FLAVOR="${FLAVOR:-ubuntu-rke2}"

getK8SVersions() {
	IFS='- ' read -r -a strs <<< "$FLAVOR"
	k8sDistro=${strs[1]}

	case $k8sDistro in
rke2)
echo $RKE2_VERSIONS
;;
k3s)
echo $K3S_VERSIONS
;;
*)
echo -n "unknown"
;;
	esac

}
K8S_VERSIONS=$(getK8SVersions)
```


3. The customizable Docker images are present in `images-v2/` directory per os+distro 

  **Example:** ubuntu+rke2 we have `images-v2/Dockerfile.ubuntu-rke2` as below. 

  **Note:** To customize any packages. uncomment the apt lines and add the appropriate packages as needed.

```
ARG BASE_REPO=quay.io/kairos
ARG BASE_IMAGE=$BASE_REPO/core-ubuntu-rke2:latest
ARG K8S_VERSION=v1.22.13-rke2r1

FROM  $BASE_IMAGE"_"$K8S_VERSION as build
ARG ARCH=amd64
ENV ARCH=${ARCH}

ENV DEBIAN_FRONTEND=noninteractive

#RUN apt update && apt install -y \
#        open-vm-tools \
#        jq \
#        netplan.io \
#        wireguard \
#         && apt-get clean

COPY overlay-v2/os/ubuntu/ /

# Clear cache
RUN apt-get clean && rm -rf /var/cache/*

FROM scratch as release
COPY --from=build / /
```


4. To add any specific directories as writable edit the `overlay-v2/os/ubuntu/system/oem/11_persistency.yaml`.

  **Example:** `/var/lib/rook` below is a custom path added.

```
name: "Configure persistent dirs bind-mounts"
stages:
  rootfs.after:
    - if: '[ ! -f "/run/cos/recovery_mode" ]'
      name: "Layout configuration"
      environment_file: /run/cos/cos-layout.env
      environment:
        VOLUMES: "LABEL=COS_OEM:/oem LABEL=COS_PERSISTENT:/usr/local"
        OVERLAY: "tmpfs:25%"
        RW_PATHS: "/var /etc /srv"
        PERSISTENT_STATE_PATHS: >-
          /etc/systemd
          /etc/modprobe.d
          /etc/rancher
          /etc/sysconfig
          /etc/runlevels
          /etc/ssh
          /etc/iscsi 
          /etc/cni
          /home
          /opt
          /root
          /usr/libexec
          /var/log
          /var/lib/rancher
          /var/lib/kubelet
          /var/lib/wicked
          /var/lib/longhorn
          /var/lib/cni
          /var/lib/rook
        PERSISTENT_STATE_BIND: "true"
    - if: |
        cat /proc/cmdline | grep -q "kairos.boot_live_mode"
      name: "Layout configuration"
      environment_file: /run/cos/cos-layout.env
      environment:
        VOLUMES: "LABEL=COS_OEM:/oem LABEL=COS_PERSISTENT:/usr/local"
        OVERLAY: "tmpfs:25%"
        RW_PATHS: "/var /etc /srv"
        PERSISTENT_STATE_PATHS: >-
          /etc/systemd
          /etc/rancher
          /etc/sysconfig
          /etc/runlevels
          /etc/ssh
          /etc/iscsi 
          /etc/cni
          /home
          /opt
          /root
          /usr/libexec
          /var/log
          /var/lib/rancher
          /var/lib/kubelet
          /var/lib/wicked
          /var/lib/longhorn
          /var/lib/cni
          /var/lib/rook
        PERSISTENT_STATE_BIND: "true"
    - if: '[ ! -f /run/cos/recovery_mode ] && [ ! -f /run/cos/live_mode ]'
      name: "Grow persistent"
      layout:
        device:
          label: COS_PERSISTENT
        expand_partition:
          # Size 0 is required to specify all remaining space
          size: 0
  boot:
  - if: "[ ! -d /usr/local/cloud-config ]"
    commands:
    - mkdir /usr/local/cloud-config
    - chmod 600 /usr/local/cloud-config
    name: "Ensure /usr/local/cloud-config exists"

```

5. `Rub ./dev-build.sh` from the home directory. This shall build OS+K8S flavor docker images for each version based on the versions support per Kubernetes Distro tagged with the setting in `.local.env.v2` of IMAGE_REPO 
   Example: The below images will be created with the settings above:
 
  gcr.io/spectro-dev-public/venkat/p6os-ubuntu-rke2:v1.22.13-rke2r1

  gcr.io/spectro-dev-public/venkat/p6os-ubuntu-rke2:v1.23.10-rke2r1

  gcr.io/spectro-dev-public/venkat/p6os-ubuntu-rke2:v1.24.4-rke2r1



6. Push these images to private repo and use them in hubble to replace the OS image uri with the system.uri parameter.

Example:

```
install:
  offline: true
  auto: true

bundles:
  - targets:
      - container://gcr.io/spectro-dev-public/stylus:v2.0.0-alpha11
  - repository: disk:///opt/spectrocloud/luet-repo
    targets:
      - package://system/stylus

options:
    device: /dev/sda
    reboot: true
    system.uri: gcr.io/spectro-dev-public/venkat/p6os-ubuntu-rke2:v1.24.4-rke2r1
    
stages:
  initramfs:
   - users:
       kairos:
         passwd: kairos
  boot:
    - commands:
       - modprobe rbd

```
# Troubleshooting

To be added Troubleshooting  
 





