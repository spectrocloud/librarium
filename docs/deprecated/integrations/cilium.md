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

Palette Network Pack(s) helps provision resources for setting up Cluster networking in Kubernetes. For more Kubernetes
network model design goals visit
[here](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model).

Palette supports **Cilium**, an open source software for securing and observing network connectivity between
cloud-native container workloads. Cilium is underpinned by a Linux Kernel technology called eBPF, to enable dynamic and
strong security visibility and control logic within Linux. As eBPF runs within the Linux Kernel, Cilium security
policies are applied and updated independent of the application code or container configuration.

The Cilium agent runs on all clusters and servers to provide networking, security and observability to the workload
running on that node.

## Versions Supported

<Tabs>
<TabItem label="1.15.x" value="1.15.x">

## Prerequisite

- If you are using Bring Your Own Operating System (BYOOS), then HWE (Hardware Enabled) Kernel or a Kernel that supports
  [eBPF](https://ebpf.io/) modules needs to be provisioned.

</TabItem>

<TabItem label="1.14.x" value="1.14.x">

## Prerequisite

- If you are using Bring Your Own Operating System (BYOOS), then HWE (Hardware Enabled) Kernel or a Kernel that supports
  [eBPF](https://ebpf.io/) modules needs to be provisioned.

</TabItem>
<TabItem label="Deprecated" value="Deprecated">

All versions below version 1.14.x are deprecated. We recommend you to upgrade to the latest version.

</TabItem>

</Tabs>

## Troubleshooting

Review the following common issues and solutions when using the Cilium network pack.

### I/O Timeout Error on VMware

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

## References

- [Cilium Documentation](https://docs.cilium.io/en/stable)
