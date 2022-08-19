---
title: 'Portworx /w Operator'
metaTitle: 'Portworx storage CSI (Essentials/PAYG/Enterprise)'
metaDescription: 'Portworx storage CSI for all use cases'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-portworx/blobs/sha256:e27bc9aaf22835194ca38062061c29b5921734eed922e57d693d15818ade7486?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Portworx /w Operator

[Portworx](https://portworx.com/) is a software-defined persistent storage solution designed and purpose-built for applications deployed as containers, via container orchestrators such as Kubernetes. You can use Palette to install Portworx on a cloud platform, on-premises or at the edge.

## Versions Supported

<br />

<Tabs>


<Tabs.TabPane tab="2.11.x" key="2.11.x">

* **2.11.x**


</Tabs.TabPane>
</Tabs>

## Prerequisites

For deploying Portworx with Operator for Kubernetes, make sure to configure the properties in the pack:


* Have at least three nodes with the proper [hardware, software, and network requirements](https://docs.portworx.com/install-portworx/prerequisites).  


* Ensure you are using a supported Kubernetes version (1.19+).


* Identify and set up the storageType.

<br />

## Contents

The default installation of Portworx /w Operator will deploy the following components in the Kubernetes cluster:


* Portworx Operator


* `StorageCluster` resource that tells the Operator how to deploy & configure Portworx


* `StorageClass` resource for dynamic provisioning of PersistentVolumes using the portworx-volume provisioner


* [Stork](https://github.com/libopenstorage/stork) and [Stork on Portworx](https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/stork/)


Optionally, you can enable [Lighthouse](https://legacy-docs.portworx.com/enterprise/lighthouse-new) for basic monitoring of your Portworx cluster.

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
      spec:
        # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
        image: portworx/oci-monitor:2.11.1
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


# Integrating to an External Etcd

Portworx Enterprise supports multiple Etcd scenarios.

By default, Portworx will use its own internal key-value store (KVDB). However, you can integrate Portworx to an external Etcd server by following the steps below.

1. Select either the `Use External Kvdb over HTTP` or `Use External Kvdb over SSL` preset in the pack user interface. If your external Etcd server requires certificate authentication, you need the `Use External Kvdb over SSL` preset.


2. Configure the external Etcd endpoint(s) in `charts.portworx-generic.storageCluster.spec.kvdb.endpoints`.


3. When using the `Use External Kvdb over SSL` preset, leave the `charts.portworx-generic.storageCluster.spec.kvdb.endpoints` option to its default of `px-kvdb-auth` since that is the name of the secret that will be created by this pack.


When using the `Use External Kvdb over SSL` preset, you additionally need to configure the `charts.portworx-generic.externalKvdb` section:

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

# Environments

<br/>

<Tabs>
<Tabs.TabPane tab="on-premises" key="on-premises">


## Bare metal and on-premises environments

For deploying Portworx with Operator on bare metal and on-premesis environments, either use the pack's defaults or generate a `StorageCluster` spec specific to your environment at [PX-Central](https://central.portworx.com/specGen/wizard) and paste the resulting spec in the `charts.portworx-generic.storageCluster.spec` section of the pack.


</Tabs.TabPane>
<Tabs.TabPane tab="AWS" key="AWS">


## Amazon EC2 and EKS

### Prerequisites

To deploy Portworx in an AWS environment, ensure the following IAM Policy is created in AWS:
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

then attach this IAM Policy to the correct IAM Role:

* When deploying an regular Kubernetes cluster on AWS EC2 using Palette, attach the policy to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM Role. Or alternatively, edit the AWS cloud account in Palette and enable the `Add IAM Policies` option and select the Portworx IAM Policy describe above. This will automatically attach the IAM Policy to the correct IAM Role.


* When deploying an EKS cluster, use the `managedMachinePool.roleAdditionalPolicies` option in the `kubernetes-eks` pack to automatically attach the Portworx IAM Policy to the EKS worker pool IAM role that Palette will manage for you. For example:

```yaml
managedMachinePool:
  roleAdditionalPolicies:
    - "arn:aws:iam::012345678901:policy/my-portworx-policy"
```

<br />

## AWS spec

For deploying Portworx with Operator on AWS environments, it's recommended to generate a `StorageCluster` spec for your AWS environment at [PX-Central](https://central.portworx.com/specGen/wizard) and paste the resulting spec in the `charts.portworx-generic.storageCluster.spec` section of the pack. An example looks like this:
<br/>

```yaml
    storageCluster:
      annotations:
        portworx.io/is-eks: "true"
      spec:
        spec:
          image: portworx/oci-monitor:2.11.1
          imagePullPolicy: Always
          kvdb:
            internal: true
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
              enabled: true
              exportMetrics: true
```


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="Azure">


## Azure and AKS

For deploying Portworx with Operator on Azure environments, it's recommended to generate a `StorageCluster` spec for your Azure environment at [PX-Central](https://central.portworx.com/specGen/wizard) and paste the resulting spec in the `charts.portworx-generic.storageCluster.spec` section of the pack. An example looks like this:
<br/>

```yaml
    storageCluster:
      annotations:
        portworx.io/is-aks: "true"
      spec:
        spec:
            image: portworx/oci-monitor:2.11.1
            imagePullPolicy: Always
            kvdb:
              internal: true
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
                enabled: true
                exportMetrics: true
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
```

Note that the spec will reference a `secret` in your cluster (`px-azure` by default), that is assumed to hold your Azure credentials. You will need to create this secret, which you can do by adding an additional manifest to your cluster profile that contains the YAML for the secret. For example:
<br/>

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: px-azure
  namespace: kube-system
type: Opaque
data:
  AZURE_TENANT_ID: "base64 encoded Azure Tenant ID"
  AZURE_CLIENT_ID: "base64 encoded Azure Client ID"
  AZURE_CLIENT_SECRET: "base64 encoded Azure Client secret"
``` 


</Tabs.TabPane>
<Tabs.TabPane tab="Google" key="Google">


## Google Cloud Platform and GKE

For deploying Portworx with Operator on Google environments, it's recommended to generate a `StorageCluster` spec for your Google environment at [PX-Central](https://central.portworx.com/specGen/wizard) and paste the resulting spec in the `charts.portworx-generic.storageCluster.spec` section of the pack. An example looks like this:
<br/>

```yaml
    storageCluster:
      annotations:
        portworx.io/is-gke: "true"
      spec:
        spec:
          image: portworx/oci-monitor:2.11.1
          imagePullPolicy: Always
          kvdb:
            internal: true
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
              enabled: true
              exportMetrics: true
```


</Tabs.TabPane>
<Tabs.TabPane tab="vSphere" key="vSphere">

## VMware vSphere

For deploying Portworx with Operator on vSphere environments, it's recommended to generate a `StorageCluster` spec for your vSphere environment at [PX-Central](https://central.portworx.com/specGen/wizard) and paste the resulting spec in the `charts.portworx-generic.storageCluster.spec` section of the pack. An example looks like this:
<br/>

```yaml
    storageCluster:
      spec:
        image: portworx/oci-monitor:2.11.1
        imagePullPolicy: Always
        kvdb:
          internal: true
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
            enabled: true
            exportMetrics: true
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
          value: "1.2.3.4"
        - name: VSPHERE_VCENTER_PORT
          value: "443"
        - name: VSPHERE_DATASTORE_PREFIX
          value: "px_datastore_"
        - name: VSPHERE_INSTALL_MODE
          value: "shared"
```
Note that the spec will reference a `secret` in your cluster (`px-vsphere-secret` by default), that is assumed to hold your vSphere credentials. You will need to create this secret, which you can do by adding an additional manifest to your cluster profile that contains the YAML for the secret. For example:
<br/>

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: px-vsphere-secret
  namespace: kube-system
type: Opaque
data:
  VSPHERE_USER: "base64 encoded admin username"
  VSPHERE_PASSWORD: "base64 encoded admin password"
``` 


</Tabs.TabPane>
<Tabs.TabPane tab="Pure Flash Array" key="Pure Flash Array">


## Pure Storage Flash Array integration

For deploying Portworx with Operator with Pure Flash Array integratuib, it's recommended to generate a `StorageCluster` spec for your environment at [PX-Central](https://central.portworx.com/specGen/wizard) and paste the resulting spec in the `charts.portworx-generic.storageCluster.spec` section of the pack. An example looks like this:
<br/>

```yaml
    storageCluster:
      annotations:
        portworx.io/is-gke: "true"
      spec:
        spec:
          image: portworx/oci-monitor:2.11.1
          imagePullPolicy: Always
          kvdb:
            internal: true
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
              enabled: true
              exportMetrics: true
          env:
          - name: PURE_FLASHARRAY_SAN_TYPE
            value: "ISCSI"
```

In order for the Pure Flash Array integration to activate, you will need to create a `secret` on your cluster named `px-pure-secret` that contains your Flash Array license. You can do this by running
```
kubectl create secret generic px-pure-secret --namespace kube-system --from-file=pure.json=<file path>
```
on the cluster.


</Tabs.TabPane>
</Tabs>

<br />

<br />

## References

[Portworx Install with Kubernetes](https://docs.portworx.com/portworx-install-with-kubernetes/)

[Lighthouse](https://docs.portworx.com/reference/lighthouse/)

[Installation Prerequisites](https://docs.portworx.com/install-portworx/prerequisites/)
