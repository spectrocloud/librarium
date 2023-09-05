---
sidebar_label: 'Multus CNI'
title: 'Multus'
description: 'Choosing Multus CNI within the Palette console'
type: "integration"
category: ['network', 'amd64']
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: true
logoUrl: 'https://registry.spectrocloud.com/v1/cni-multus/blobs/sha256:3727499ea41784a17c818b7269c27918b8664766c40d1b1f3cd90c34d5154676?type=image/png'
tags: ['packs', 'multus', 'network']
---

The Multus Container Network Interface (CNI) plugin enables multiple, network interfaces to attach to pods within Kubernetes. Palette provisions the CNI-Multus 3.8.0 Add-on pack, so you can create a multi-homed pod for Kubernetes right within the orchestrator.

<br />

## Version Supported

<Tabs queryString="versions">
<TabItem label="3.8.0" value="3.8.x">

**cni-multus 3.8.0**

</TabItem>
</Tabs>

<br />
<br />

# Notable Parameters

| **Parameters**             | **Values**  | **Required/Optional** | **Description**                                                                                                                                                  |
| ---------------------- | ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **name**                   | string  | required          | Enter the name of the network.                                                                                                                               |
| **type**                   | string  | required          | "multus"                                                                                                                                                     |
| **confDir**                | string  | optional          | This is the directory for the CNI config file that multus reads. default /etc/cni/multus/net.d.                                                              |
| **cniDir**                 | string  | optional          | Multus CNI data directory.                                                                                                                                   |
| **binDir**                 | string  | optional          | Additional directory for CNI plugins which multus calls.                                                                                                     |
| **kubeconfig**             | string  | optional          | Kubeconfig file for the out-of-cluster communication with kube-apiserver.                                                                                    |
| **logToStderr**            | boolean | optional          | Enable or disable logging to STDERR. Defaults to true.                                                                                                       |
| **logFile**                | string  | optional          | File path for log file. Multus add log in given file.                                                                                                        |
| **logLevel**               | string  | optional          | Logging level                                                                                                                                                |
| **logOptions**             | object  | optional          | Logging option                                                                                                                                               |
| **namespaceIsolation**     | boolean | optional          | Enables a security feature the where pods are only allowed to access <br /> NetworkAttachmentDefinitions in the namespace where the pod resides. Defaults to *false*. |
| **capabilities**           | list  | optional          | Capabilities supported by at least one of the delegates.                                                                                                     |
| **readinessindicatorfile** | string  |                   | The path to a file whose existence denotes that the default network is ready.                                                                                |


## References

- [Multus-CNI](https://github.com/k8snetworkplumbingwg/multi-net-spec)

- [Multus-CNI Quickstart Guide](https://github.com/k8snetworkplumbingwg/multus-cni/blob/master/docs/quickstart.md)

- [Mutltus Configuration](https://github.com/k8snetworkplumbingwg/multus-cni/blob/master/docs/configuration.md)

