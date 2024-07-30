---
sidebar_label: "Cilium"
title: "Cilium"
description: "Cilium network pack for Spectro Cloud Palette"
hide_table_of_contents: true
type: "integration"
category: ["network", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/cni-cilium/blobs/sha256:dbc239ac739ea2939ef41dd0743b82281bc82c360326cd7c536f73f0053e2cd2?type=image.webp"
tags: ["packs", "cilium", "network"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="1.15.x" value="1.15.x">

:::warning

If you are using Bring Your Own Operating System (BYOOS), then HWE (Hardware Enabled) Kernel or a Kernel that supports
[eBPF](https://ebpf.io/) modules needs to be provisioned.

:::

## Troubleshooting

### Scenario - I/O Timeout Error on VMware

If you are deploying a cluster to a VMware environment using the VXLAN tunnel protocol, you may encounter I/O timeout
errors. This is due to a known bug in the VXMNET3 adapter that results in VXLAN traffic being dropped. You can learn
more about this issue in Cilium's [GitHub issue #21801](https://github.com/cilium/cilium/issues/21801).

You can work around the issue by using one of the two following methods:

- Option 1: Set a different tunnel protocol in the Cilium configuration. You can set the tunnel protocol to `geneve`.

  ```yaml
  charts:
    cilium:
      tunnelProtocol: "geneve"
  ```

- Option 2: Modify the Operating System (OS) layer of your cluster profile to automatically disable UDP Segmentation
  Offloading (USO).

  ```yaml
  kubeadmconfig:
    preKubeadmCommands:
      # Disable hardware segmentation offloading due to VMXNET3 issue
      - |
        install -m 0755 /dev/null /usr/lib/networkd-dispatcher/routable.d/10-disable-offloading
        cat <<EOF > /usr/lib/networkd-dispatcher/routable.d/10-disable-offloading
        #!/bin/sh
        ethtool -K eth0 tx-udp_tnl-segmentation off
        ethtool -K eth0 tx-udp_tnl-csum-segmentation off
        ethtool --offload eth0 rx off tx off
        EOF
        systemctl restart systemd-networkd
  ```

</TabItem>

<TabItem label="1.14.x" value="1.14.x">

## Prerequisite

:::warning

If you are using Bring Your Own Operating System (BYOOS), then HWE (Hardware Enabled) Kernel or a Kernel that supports
[eBPF](https://ebpf.io/) modules needs to be provisioned.

:::

## Troubleshooting

### Scenario - I/O Timeout Error on VMware

If you are deploying a cluster to a VMware environment using the VXLAN tunnel protocol, you may encounter I/O timeout
errors. This is due to a known bug in the VXMNET3 adapter that results in VXLAN traffic being dropped. You can learn
more about this issue in Cilium's [GitHub issue #21801](https://github.com/cilium/cilium/issues/21801).

You can work around the issue by using one of the two following methods:

- Option 1: Set a different tunnel protocol in the Cilium configuration. You can set the tunnel protocol to `geneve`.

  ```yaml
  charts:
    cilium:
      tunnelProtocol: "geneve"
  ```

- Option 2: Modify the Operating System (OS) layer of your cluster profile to automatically disable UDP Segmentation
  Offloading (USO).

  ```yaml
  kubeadmconfig:
    preKubeadmCommands:
      # Disable hardware segmentation offloading due to VMXNET3 issue
      - |
        install -m 0755 /dev/null /usr/lib/networkd-dispatcher/routable.d/10-disable-offloading
        cat <<EOF > /usr/lib/networkd-dispatcher/routable.d/10-disable-offloading
        #!/bin/sh
        ethtool -K eth0 tx-udp_tnl-segmentation off
        ethtool -K eth0 tx-udp_tnl-csum-segmentation off
        ethtool --offload eth0 rx off tx off
        EOF
        systemctl restart systemd-networkd
  ```

</TabItem>

</Tabs>

## Terraform

You can reference the Cilium pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "cilium" {
  name    = "cni-cilium-oss"
  version = "1.15.3"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
