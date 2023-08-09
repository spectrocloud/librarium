---
title: 'Portworx /w Operator'
metaTitle: 'Portworx storage CSI (Essentials/PAYG/Enterprise)'
metaDescription: 'Portworx storage CSI for all use cases'
hiddenFromNav: true
type: "integration"
category: ['storage', 'amd64']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-portworx/blobs/sha256:e27bc9aaf22835194ca38062061c29b5921734eed922e57d693d15818ade7486?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Portworx /w Operator

[Portworx](https://portworx.com/) is a software-defined persistent storage solution designed and purpose-built for applications deployed as containers via container orchestrators such as Kubernetes. You can use Palette to install Portworx on a cloud platform, on-premises, or at the edge.

## Versions Supported

<br />

<Tabs>


<Tabs.TabPane tab="2.11.x" key="2.11.x">

* **2.11.x**


</Tabs.TabPane>
</Tabs>

## Prerequisites

For deploying Portworx with Operator for Kubernetes, make sure to configure the properties in the pack:
<br />

* Have at least three nodes with the proper [hardware, software, and network requirements](https://docs.portworx.com/install-portworx/prerequisites).

* Ensure you use a supported Kubernetes version (1.19 or above).

* Identify and set up the storageType.

<br />

## Contents

The default installation of Portworx /w Operator will deploy the following components in the Kubernetes cluster:
<br />

* Portworx Operator

* `StorageCluster` resource that tells the Operator how to deploy & configure Portworx

* `StorageClass` resource for dynamic provisioning of PersistentVolumes using the portworx-volume provisioner

* [Stork](https://github.com/libopenstorage/stork) and [Stork on Portworx](https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/stork/)


Optionally, you can enable [Lighthouse](https://legacy-docs.portworx.com/enterprise/lighthouse-new) for essential monitoring of the Portworx cluster.

<br />

## Notable Parameters

### Charts - Portworx:
```yaml
charts:
  portworx-generic:

    license:
      # Valid options for "type" are: essentials, saas, enterprise
      # If you want to deploy the PX Enterprise Trial version, or need manual offline activation,
      # select the "enterprise" type and set "activateLicense" to false.
      type: essentials
      # The next block only gets used if the type is set to "essentials"
      essentials:
        # Base64-decoded value of the px-essen-user-id value in the px-essential secret
        # Find your Essentials Entitlement ID at https://central.portworx.com/profile
        userId: 1234abcd-12ab-12ab-12ab-123456abcdef
        # Base64-decoded value of the px-osb-endpoint value in the px-essential secret
        # Leave at the default value unless there are special circumstances
        endpoint: https://pxessentials.portworx.com/osb/billing/v1/register
      # The next block only gets used if the type is set to "saas"
      saas:
        key: <PAY-AS-YOU-GO-KEY>
      # The next block only gets used if the type is set to "enterprise"
      enterprise:
        activateLicense: true
        activationId: <Activation ID>
        # customLicenseServer:
        #   url: http://hostname:7070/fne/bin/capability
        #   importUnknownCa: true
        #   licenseBorrowInterval: 1w15m
        #   addFeatures:
        #   - feature1
        #   - feature2

    storageCluster:
      # When autoGenerateName is true, a name of type "px-cluster-1234abcd-12ab-12ab-12ab-123456abcdef" is generated and the "name" field is ignored
      autoGenerateName: false
      name: "px-{{.spectro.system.cluster.name}}"
      # annotations:
      #   If you need additional annotations, specify them here
      spec: {}
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here

    storageClass:
      name: spectro-storage-class
      isDefaultStorageClass: true
      # annotations:
      #   If you need additional annotations, specify them here
      allowVolumeExpansion: true
      # Delete or Retain
      reclaimPolicy: Delete
      # WaitForFirstConsumer or Immediate
      volumeBindingMode: WaitForFirstConsumer
      parameters:
        repl: "3"
        priority_io: "high"
        # sharedv4: true
        # Add additional parameters as needed (https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/create-pvcs/dynamic-provisioning/)
```
# Selecting a license model

This pack can install Portworx in 3 different licensing modes:

* **Essentials**: a free Portworx license with limited functionality that allows you to run small production or proof-of-concept workloads. Essentials limits capacity and advanced features, but otherwise functions the same way as the fully-featured Portworx Enterprise version of Portworx.


* **Enterprise**: the fully featured version of Portworx. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.


* **Enterprise SaaS PAYG**: the fully featured version of Portworx but using a SaaS license key that allows unlimited use and in-arrears billing. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.


Use the presets in the pack user interface to select which license model you want to use, then update the `charts.portworx-generic.license` section for your chosen license model.

<br />

<Tabs>
<Tabs.TabPane tab="PX Essentials" key="PX Essentials">

```yaml
    license:
      type: essentials
      essentials:
        # Base64-decoded value of the px-essen-user-id value in the px-essential secret
        # Find your Essentials Entitlement ID at https://central.portworx.com/profile
        userId: 1234abcd-12ab-12ab-12ab-123456abcdef
        # Base64-decoded value of the px-osb-endpoint value in the px-essential secret
        # Leave at the default value unless there are special circumstances
        endpoint: https://pxessentials.portworx.com/osb/billing/v1/register
```

</Tabs.TabPane>
<Tabs.TabPane tab="PX Enterprise" key="PX Enterprise">

```yaml
    license:
      type: saas
      saas:
        key: <PAY-AS-YOU-GO-KEY>
```

</Tabs.TabPane>

<Tabs.TabPane tab="PX Enterprise SaaS PAYG" key="PX Enterprise SaaS PAYG">

```yaml
    license:
      type: enterprise
      enterprise:
        activateLicense: true
        activationId: <Activation ID>
        # customLicenseServer:
        #   url: http://hostname:7070/fne/bin/capability
        #   importUnknownCa: true
        #   licenseBorrowInterval: 1w15m
        #   addFeatures:
        #   - feature1
        #   - feature2
```

</Tabs.TabPane>
</Tabs>


# Selecting a storage specification

This pack can install Portworx in various different storage environment:

* **Using existing disks (generic)**: This mode does not integrate with any particular storage solution, it just uses existing disks available on the nodes.


* **AWS Cloud Storage**: This mode integrates with Amazon EBS block volumes and allows EKS and EC2 kubernetes clusters to dynamically attach EBS volumes to worker nodes for Portworx.


* **Azure Cloud Storage**: This mode integrates with Azure block storage and allows AKS and regular Azure kubernetes clusters to dynamically attach Azure block storage to worker nodes for Portworx.


* **Google Cloud Storage**: This mode integrates with Google persistent disks and allows GKE and regular Google kubernetes clusters to dynamically attach persistent disks to worker nodes for Portworx.


* **VMware vSphere Datastores**: This mode integrates with VMware vSphere storage and allows kubernetes clusters on vSphere to dynamically attach vSAN and regular Datastore disks to worker nodes for Portworx.


* **Pure Storage Flash Array**: This mode integrates with Pure Storage Flash Arrays and allows kubernetes clusters to dynamically attach Flash Array disks over iSCSI to worker nodes for Portworx.


Use the presets in the pack user interface to select which storage specification you want to use, then update the `charts.portworx-generic.storageCluster` section to your specific needs.

<br />

<Tabs>
<Tabs.TabPane tab="Generic" key="Generic">

```yaml
    storageCluster:
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.2
        imagePullPolicy: Always
        kvdb:
          internal: true
          # endpoints:
          # - etcd:https://etcd.company.domain:2379
          # authSecret: px-kvdb-auth
        storage:
          useAll: true
          journalDevice: auto
        secretsProvider: k8s
        stork:
          enabled: true
          args:
            webhook-controller: "true"
        autopilot:
          enabled: true
        csi:
          enabled: true
        monitoring:
          prometheus:
            enabled: false
            exportMetrics: false
```

</Tabs.TabPane>
<Tabs.TabPane tab="AWS" key="AWS">

```yaml
    storageCluster:
      annotations:
        portworx.io/is-eks: "true"
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.2
        imagePullPolicy: Always
        kvdb:
          internal: true
          # endpoints:
          # - etcd:https://etcd.company.domain:2379
          # authSecret: px-kvdb-auth
        cloudStorage:
          deviceSpecs:
          - type=gp2,size=150
          kvdbDeviceSpec: type=gp2,size=150
        secretsProvider: k8s
        stork:
          enabled: true
          args:
            webhook-controller: "true"
        autopilot:
          enabled: true
        csi:
          enabled: true
        monitoring:
          prometheus:
            enabled: false
            exportMetrics: false
```
### Prerequisites

To deploy Portworx in an AWS environment, ensure the following IAM Policy is created in AWS and attached to the correct IAM Role:
<br/>

```yaml
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AttachVolume",
                "ec2:ModifyVolume",
                "ec2:DetachVolume",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:DeleteTags",
                "ec2:DeleteVolume",
                "ec2:DescribeTags",
                "ec2:DescribeVolumeAttribute",
                "ec2:DescribeVolumesModifications",
                "ec2:DescribeVolumeStatus",
                "ec2:DescribeVolumes",
                "ec2:DescribeInstances",
                "autoscaling:DescribeAutoScalingGroups"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

* When deploying a regular Kubernetes cluster on AWS EC2 using Palette, attach the policy to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM Role. Or alternatively, edit the AWS cloud account in Palette, enable the `Add IAM Policies` option, and select the Portworx IAM Policy described above. This will automatically attach the IAM Policy to the correct IAM Role.

* When deploying an EKS cluster, use the `managedMachinePool.roleAdditionalPolicies` option in the `kubernetes-eks` pack to automatically attach the Portworx IAM Policy to the EKS worker pool IAM role that Palette will manage for you. For example:

```yaml
managedMachinePool:
  roleAdditionalPolicies:
    - "arn:aws:iam::012345678901:policy/my-portworx-policy"
```

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="Azure">

```yaml
    storageCluster:
      annotations:
        portworx.io/is-aks: "true"
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.2
        imagePullPolicy: Always
        kvdb:
          internal: true
          # endpoints:
          # - etcd:https://etcd.company.domain:2379
          # authSecret: px-kvdb-auth
        cloudStorage:
          deviceSpecs:
          - type=Premium_LRS,size=150
          kvdbDeviceSpec: type=Premium_LRS,size=150
        secretsProvider: k8s
        stork:
          enabled: true
          args:
            webhook-controller: "true"
        autopilot:
          enabled: true
        csi:
          enabled: true
        monitoring:
          prometheus:
            enabled: false
            exportMetrics: false
        env:
        - name: AZURE_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: px-azure
              key: AZURE_CLIENT_SECRET
        - name: AZURE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: px-azure
              key: AZURE_CLIENT_ID
        - name: AZURE_TENANT_ID
          valueFrom:
            secretKeyRef:
              name: px-azure
              key: AZURE_TENANT_ID
    azureSecret:
      tenantId: "your_azure_tenant_id"
      clientId: "your_azure_client_id"
      clientSecret: "your_client_secret"
```

</Tabs.TabPane>
<Tabs.TabPane tab="Google" key="Google">

```yaml
    storageCluster:
      annotations:
        portworx.io/is-gke: "true"
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.2
        imagePullPolicy: Always
        kvdb:
          internal: true
          # endpoints:
          # - etcd:https://etcd.company.domain:2379
          # authSecret: px-kvdb-auth
        cloudStorage:
          deviceSpecs:
          - type=pd-standard,size=150
          kvdbDeviceSpec: type=pd-standard,size=150
        secretsProvider: k8s
        stork:
          enabled: true
          args:
            webhook-controller: "true"
        autopilot:
          enabled: true
        csi:
          enabled: true
        monitoring:
          prometheus:
            enabled: false
            exportMetrics: false
```

</Tabs.TabPane>
<Tabs.TabPane tab="VMware vSphere" key="VMware vSphere">

```yaml
    storageCluster:
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.2
        imagePullPolicy: Always
        kvdb:
          internal: true
          # endpoints:
          # - etcd:https://etcd.company.domain:2379
          # authSecret: px-kvdb-auth
        cloudStorage:
          deviceSpecs:
          - type=lazyzeroedthick,size=150
          kvdbDeviceSpec: type=lazyzeroedthick,size=32
        secretsProvider: k8s
        stork:
          enabled: true
          args:
            webhook-controller: "true"
        autopilot:
          enabled: true
        csi:
          enabled: true
        monitoring:
          prometheus:
            enabled: false
            exportMetrics: false
        env:
        - name: VSPHERE_INSECURE
          value: "true"
        - name: VSPHERE_USER
          valueFrom:
            secretKeyRef:
              name: px-vsphere-secret
              key: VSPHERE_USER
        - name: VSPHERE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: px-vsphere-secret
              key: VSPHERE_PASSWORD
        - name: VSPHERE_VCENTER
          value: "my-vcenter.company.local"
        - name: VSPHERE_VCENTER_PORT
          value: "443"
        - name: VSPHERE_DATASTORE_PREFIX
          value: "datastore"
        - name: VSPHERE_INSTALL_MODE
          value: "shared"
    vsphereSecret:
      user: "username_for_vCenter_here"
      password: "your_password"
```

</Tabs.TabPane>
<Tabs.TabPane tab="Pure Flash Array" key="Pure Flash Array">

```yaml
    storageCluster:
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.2
        imagePullPolicy: Always
        kvdb:
          internal: true
          # endpoints:
          # - etcd:https://etcd.company.domain:2379
          # authSecret: px-kvdb-auth
        cloudStorage:
          deviceSpecs:
          - size=150
          kvdbDeviceSpec: size=32
        secretsProvider: k8s
        stork:
          enabled: true
          args:
            webhook-controller: "true"
        autopilot:
          enabled: true
        csi:
          enabled: true
        monitoring:
          prometheus:
            enabled: false
            exportMetrics: false
        env:
        - name: PURE_FLASHARRAY_SAN_TYPE
          value: "ISCSI"
```

To activate the Pure Flash Array integration, you will need to create a `secret` on your cluster named `px-pure-secret` that contains your Flash Array license. You can do this by running the below kubectl command:

```
kubectl create secret generic px-pure-secret --namespace kube-system --from-file=pure.json=<file path>
```


</Tabs.TabPane>
</Tabs>

# Integrating into an External Etcd

Portworx Enterprise supports multiple Etcd scenarios.

Portworx will default use its internal key-value store (KVDB). However, you can integrate Portworx to an external Etcd server by following the steps below.
<br />

1. Select the `Use External Kvdb over HTTP` or `Use External Kvdb over SSL` preset in the pack user interface. If your external Etcd server requires certificate authentication, you need the `Use External Kvdb over SSL` preset.


2. Configure the external Etcd endpoint(s) in `charts.portworx-generic.storageCluster.spec.kvdb.endpoints`.


3. When using the `Use External Kvdb over SSL` preset, leave the `charts.portworx-generic.storageCluster.spec.kvdb.endpoints` option to its default of `px-kvdb-auth` since that is the name of the secret that will be created by this pack.


When using the `Use External Kvdb over SSL` preset, you additionally need to configure the `charts.portworx-generic.externalKvdb` section:
<br />

1. Set `charts.portworx-generic.externalKvdb.useCertsForSSL` to `true` to enable certificate authentication.


2. Input your SSL certificates in the `cacert`, `cert`, and `key` sections of `charts.portworx-generic.externalKvdb`. The preset will give you cropped example values that you can overwrite with your actual PEM certificates.


<WarningBox>
Make sure to follow the provided indentation style; otherwise, certs will not be imported correctly and will result in Portworx deployment failure.
</WarningBox>


## Kvdb and Etcd Presets

These are the three types of Presets that can be selected and modified. The pack defaults to the `Use Internal Kvdb` option. Change to a different preset if you need to connect to an external Etcd server.

<br />

<Tabs>
<Tabs.TabPane tab="Use Internal Kvdb" key="Use Internal Kvdb">

```yaml
    storageCluster:
      spec:
        kvdb:
          internal: true
```

</Tabs.TabPane>
<Tabs.TabPane tab="Use External Kvdb over HTTP" key="Use External Kvdb over HTTP">

```yaml
    storageCluster:
      spec:
        kvdb:
          endpoints:
            - etcd:http://etcd.company.domain:2379
```

</Tabs.TabPane>

<Tabs.TabPane tab="Use External Kvdb over SSL" key="Use External Kvdb over SSL">

```yaml
    storageCluster:
      spec:
        kvdb:
          endpoints:
            - etcd:http://etcd.company.domain:2379
          authSecret: px-kvdb-auth

    # External kvdb related config, only used if storageCluster.spec.kvdb.internal != true
    externalKvdb:
      useCertsForSSL: true
      # The CA cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
      cacert: |-
        -----BEGIN CERTIFICATE-----
        MIIC3DCCAcQCCQCr1j968rOV3zANBgkqhkiG9w0BAQsFADAwMQswCQYDVQQGEwJV
        < .. >
        i9CNyx+CcwUCkWQzhrHBQA==
        -----END CERTIFICATE-----
      # The cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
      cert: |-
        -----BEGIN CERTIFICATE-----
        MIIDaTCCAlGgAwIBAgIJAPLC+6M3EezhMA0GCSqGSIb3DQEBCwUAMDAxCzAJBgNV
        < .. >
        ptWD/oDFCiCjlffyzg==
        -----END CERTIFICATE-----
      # The key to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
      key: |-
        -----BEGIN RSA PRIVATE KEY-----
        MIIEogIBAAKCAQEAsnJghz619GDZO+XLtx+UkL/w9ajQ9vtqxr79GcdvAPfCkfwX
        < .. >
        WsqUCBt5+DnOaDyvMkokP+T5tj/2LXemuIi4Q5nrOmw/WwVGGGs=
        -----END RSA PRIVATE KEY-----
```

</Tabs.TabPane>
</Tabs>

<br />

## References

- [Portworx Install with Kubernetes](https://docs.portworx.com/portworx-install-with-kubernetes/)
- [Lighthouse](https://docs.portworx.com/reference/lighthouse/)
- [Installation Prerequisites](https://docs.portworx.com/install-portworx/prerequisites/)
