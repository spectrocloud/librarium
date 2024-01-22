---
sidebar_label: "Portworx"
title: "Portworx"
description: "Portworx storage integration for on-prem installations"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/csi-portworx/blobs/sha256:e27bc9aaf22835194ca38062061c29b5921734eed922e57d693d15818ade7486?type=image/png"
tags: ["packs", "portworx", "storage"]
---

[Portworx](https://portworx.com/) is a software-defined persistent storage solution designed and purpose-built for
applications deployed as containers, via container orchestrators such as Kubernetes. You can use Palette to install
Portworx on the cloud or on-premises.

## Versions Supported

<br />

<Tabs queryString="versions">

<TabItem label="2.11.x" value="2.11.x">

- **2.11.2**

</TabItem>

<TabItem label="2.10.x" value="2.10.x">

- **2.10.0**

</TabItem>
<TabItem label="2.9.x" value="2.9.x">

- **2.9.0**

</TabItem>
<TabItem label="2.8.x" value="2.8.x">

- **2.8.0**

</TabItem>
<TabItem label="2.6.x" value="2.6.x">

- **2.6.1**

</TabItem>
</Tabs>

## Prerequisites

For deploying Portworx for Kubernetes, make sure to configure the properties in the pack:

- Have at least three nodes with the proper
  [hardware, software, and network requirements](https://docs.portworx.com/install-portworx/prerequisites).

- Ensure you are using a supported Kubernetes version.

- Identify and set up the storageType.

<br />

## Contents

The default installation of Portworx will deploy the following components in the Kubernetes cluster.

- Portworx

- CSI Provisioner

- [Lighthouse](https://legacy-docs.portworx.com/enterprise/lighthouse-new)

- [Stork](https://github.com/libopenstorage/stork) and
  [Stork on Portworx](https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/stork/)

- Storage class making use of portworx-volume provisioner.

## Parameters

### Manifests - Portworx

```yaml
manifests:
  portworx:
    # The namespace to install Portworx resources
    namespace: "portworx"

    # Portworx storage type and size
    storageType: "type=zeroedthick,size=150"

    # Max storgae nodes per zone
    maxStorageNodesPerZone: 3

    # Node recovery timeout in seconds
    nodeRecoveryTimeout: 1500

    # Portworx storage class config
    storageClass:
      enabled: true
      isDefaultStorageClass: true
      allowVolumeExpansion: true
      reclaimPolicy: Retain
      volumeBindingMode: Immediate
      parameters:
        repl: "3"
        priority_io: "high"
        #sharedv4: true

    k8sVersion: "{{.spectro.system.kubernetes.version}}"

    templateVersion: "v4"

    # List of additional container args to be passed
    args:
      ociMonitor:
        #- "-dedicated_cache"
        #- "-a"
      storkDeployment:
        #- "--app-initializer=true"
      storkScheduler:
        #- "--scheduler-name=xyz"
      autoPilot:
      csiProvisioner:
      csiSnapshotter:
      csiSnapshotController:
      csiResizer:

    # The private registry from where images will be pulled from. When left empty, images will be pulled from the public registry
    # Example, imageRegistry: "harbor.company.com/portworx"
    imageRegistry: ""
```

# Integration With External etcd

Starting Portworx v2.6.1, you can use the presets feature to toggle between the available ETCD options.

By default, Portworx is set to use internal KVDB. However, you can integrate Portworx to an external etcd server by
following the steps below.

1. Enable `useExternalKvdb` flag by setting it to _true_.

2. Configure the external etcd endpoints in `externalKvdb.endpoints`.

If the external etcd server is configured to authenticate via certificates, additionally you may want to set up the
following:

1. Enable `externalKvdb.useCertsForSSL` flag by setting it to _true_.

2. Setup certificate related configuration in `externalKvdb.cacert`, `externalKvdb.cert`, and `externalKvdb.key`.

:::warning Make sure to follow the correct indentation style; otherwise, certs will not be imported correctly and will
result in Portworx deployment failure. :::

## Etcd Presets

These are the three types of Presets that can be selected and modified.

<br />

<Tabs>
<TabItem label="Use Internal KVDB Preset" value="Use Internal KVDB">

## Use Internal KVDB

```yaml
# ECTD selection
  useExternalKvdb: false

  # External kvdb related config
  externalKvdb:

    useCertsForSSL: false

vsphere-cloud-controller-manager:
  k8sVersion: '{{.spectro.system.kubernetes.version}}'
```

</TabItem>
<TabItem label="Use Non-Secure KVDB Endpoints" value="Use Non-Secure KVDB Endpoints">

## Use Non-Secure KVDB Endpoints

```yaml
# External kvdb related config
    externalKvdb:
      # List of External KVDB endpoints to use with Portworx. Used only when useExternalKvdb is true
      endpoints:
        - etcd:http://100.26.199.167:2379
        - etcd:http://100.26.199.168:2379
        - etcd:http://100.26.199.169:2379
      useCertsForSSL: false
    useExternalKvdb: true
  vsphere-cloud-controller-manager:
    k8sVersion: '{{.spectro.system.kubernetes.version}}'
```

</TabItem>

<TabItem label="Use Certs Secured KVDB Endpoints" value="Use Certs Secured KVDB Endpoints">

## Use Certs Secured KVDB Endpoints

```yaml

# External KVDB Related Configuration
 externalKvdb:
  # List of External KVDB endpoints to use with Portworx. Used only when useExternalKvdb is true
  endpoints:
    - etcd:https://100.26.199.167:2379
    - etcd:https://100.26.199.168:2379
    - etcd:https://100.26.199.169:2379
  useCertsForSSL: true
  # The CA cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cacert: |-
    -----BEGIN CERTIFICATE-----
    MIIC3DCCAcQCCQCr1j968rOV3zANBgkqhkiG9w0BAQsFADAwMQswCQYDVQQGEwJV
    UzELMAkGA1UECAwCQ0ExFDASBgNVBAcMC1NhbnRhIENsYXJhMB4XDTIwMDkwNDA1
    MzcyNFoXDTI1MDkwMzA1MzcyNFowMDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNB
    MRQwEgYDVQQHDAtTYW50YSBDbGFyYTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
    AQoCggEBALt2CykKKwncWNQqB6Jg0QXd58qeDk40OF4Ti8DewZiZgpQOgA/+GYO7
    bx2/oQyAwjvhpTYjmMN5zORJpE3p9A+o57An1+B9D8gm1W1uABVEmwiKZhXpa+3H
    Zlon58GR+kAJPbMIpvWbjMZb4fxZM0BPo0PHzzITccoaTV4+HY4YoDNAVjfZ1cEn
    Hu2PUyN8M4RM+HdE4MOQVwqFDq/Fr6mLBMV0PdiwML0tjZ7GSGSjv1hme3mOLvKP
    qSWx4hCd5oTegEfneUKKnVhH3JLpSU1NaC6jU3vhyowRNOShi77/uJCnkx3mp9JG
    c4YruKrGc997wmUMsIv0owt49Y3dAi8CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEA
    kEXPdtpOURiZIi01aNJkzLvm55CAhCg57ZVeyZat4/LOHdvo+eXeZ2LHRvEpbakU
    4h1TQJqeNTd3txI0eIx8WxpwbJNxesuTecCWSIeaN2AApIWzHev/N7ZYJsZ0EM2f
    +rYVcX8mcOkLeyKDInCKySxIPok8kU4qQLTWytJbeRYhxh7mSMuZXu7mtSh0HdP1
    C84Ml+Ib9uY2lbr1+15MhfSKdpvmLVOibRIrdqQirNhl8uU9I1/ExDxXyR2NBMLW
    tzGgsz5dfFDZ4oMqAc8Nqm9LuvmIZYMCunMZedI2h7jGH3LVQXdM81iZCgJdTgKf
    i9CNyx+CcwUCkWQzhrHBQA==
    -----END CERTIFICATE-----
  # The cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cert: |-
    -----BEGIN CERTIFICATE-----
    MIIDaTCCAlGgAwIBAgIJAPLC+6M3EezhMA0GCSqGSIb3DQEBCwUAMDAxCzAJBgNV
    BAYTAlVTMQswCQYDVQQIDAJDQTEUMBIGA1UEBwwLU2FudGEgQ2xhcmEwHhcNMjAw
    OTA0MDUzODIyWhcNMjIxMjA4MDUzODIyWjA4MQswCQYDVQQGEwJVUzETMBEGA1UE
    CAwKQ2FsaWZvcm5pYTEUMBIGA1UEBwwLU2FudGEgQ2xhcmEwggEiMA0GCSqGSIb3
    DQEBAQUAA4IBDwAwggEKAoIBAQCycmCHPrX0YNk75cu3H5SQv/D1qND2+2rGvv0Z
    x28A98KR/Bdchk1QaE+UHYPWejsRWUtEB0Q0KreyxpwH1B4EHNKpP+jV9YqCo5fW
    3QRipWONKgvrSKkjVp/4U/NAAWCHfruB1d9u/qR4utY7sEKHE9AxmbyG+K19mOB2
    FJc7NOsTwN8d6uA5ZfFKmv3VtZzl0+Vq1qFSyIZT9zXYM22YjBAqXk9FVoI0FoQt
    zpymQrsajfS+hNX7lSUVKKv3IplpNqSOyTHRF7TWo5NOH+YRWJHLAgZoq2w/yaEi
    5IdjLdb1JXmVUyBgq590WcJZDakwD9SPOHrM9K1vTl9I41q7AgMBAAGjfjB8MEoG
    A1UdIwRDMEGhNKQyMDAxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEUMBIGA1UE
    BwwLU2FudGEgQ2xhcmGCCQCr1j968rOV3zAJBgNVHRMEAjAAMAsGA1UdDwQEAwIE
    8DAWBgNVHREEDzANggtleGFtcGxlLmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAUOBn
    YdTif6WlRpQOj+3quGrafJSNL8TqHkpmgaInSpMVFwDsmPF/HoAVVpX+H3oMY8p7
    Ll4I1Q7szpGRnKpJuzMZp5+gNpmwAz2MdAr7Ae9wH/+o8c2avbfpaHFWVTJZJ6X1
    Q6m6jmXcU0QSS4zj+lyxDNKnXfwVL8hVp0mXRFfPpb4l5ZCBoj4IA2UgyeU7F/nn
    nvR5rmg781zc0lUL6X7HaSfQjtPDTSZYFqwE93vSe42JP7NWM96lZHy2IlfE88Wp
    jUvOOJjaFVuluaJ78uCydMGEkJmipxH+1YXicH47RQ30tD5QyXxGBi+8jw5z0RiR
    ptWD/oDFCiCjlffyzg==
    -----END CERTIFICATE-----
  # The key to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  key: |-
    -----BEGIN RSA PRIVATE KEY-----
    MIIEogIBAAKCAQEAsnJghz619GDZO+XLtx+UkL/w9ajQ9vtqxr79GcdvAPfCkfwX
    XIZNUGhPlB2D1no7EVlLRAdENCq3ssacB9QeBBzSqT/o1fWKgqOX1t0EYqVjjSoL
    60ipI1af+FPzQAFgh367gdXfbv6keLrWO7BChxPQMZm8hvitfZjgdhSXOzTrE8Df
    HergOWXxSpr91bWc5dPlatahUsiGU/c12DNtmIwQKl5PRVaCNBaELc6cpkK7Go30
    voTV+5UlFSir9yKZaTakjskx0Re01qOTTh/mEViRywIGaKtsP8mhIuSHYy3W9SV5
    lVMgYKufdFnCWQ2pMA/Ujzh6zPStb05fSONauwIDAQABAoIBAGHELIKspv/m993L
    Pttrn/fWUWwmO6a1hICzLvQqwfRjyeQ1m48DveQp4j+iFBM0EJymsYfp+0IhjVeT
    XPUlD/Ts3bYA384pouOEQbJkkPyC5JH40WLtAk3sLeTeCc2tc3eIxa6SwMGNHgtP
    QgSdwzVCc7RZKGNCZ7sCQSgwi9LRdyjHU0z0KW3lHqsMkK+yEg8zuH2DpIgvFej8
    KxjwF9ZEsnYDcERdd4TOu2NTEIl5N7F8E6di/CLP/wkfHazjX+qGcuBXjeGhPgdb
    fKCcrFxhbavaJRMGLqnOD99l/zvySnA+LUSZ35KB/2ZfLMv71Z9oABTlyiR+76GW
    0lcQjmECgYEA2Jrq2qe7IUZ8CURWJ6rDKgD83LGRCHAWZ+dYvFmdsyfAGMV4+p4V
    zKSidiTWAgl7ppiZdaEPu/2cH8uohDkdx2CTSUKPUM6+PBhE4hwSA42RlnIpGWbf
    YEqcZ/qeo1IFb1A1YslwdslCVLc3INEbWairBEGis8aAxUaoEiTiPTMCgYEA0ubQ
    05BijLK6XH6YfASDLxwRg6jxn3mBqh+pAwE4tVVJVI9yXnNzN4/WKJJM+mdSGfpv
    UcJy86ZcmHNzanZUPWh80U2pyRoVXvVQpY8hdMQ3neya60mc6+Nneba2LflkBVmd
    cdoNGO0zAcGb0FKDCF2H3fizDxcoOyUjeKlLnFkCgYABU0lWlyok9PpzUBC642eY
    TTM+4nNBuvXYIuk/FclKPFcHj8XCus7lVqiL0oPgtVAlX8+okZi4DMA0zZk1XegZ
    vTSJgTfBRdKSKY/aVlOh4+7dHcu0lRWO0EYOuNDZrPnNiY8aEKN4hpi6TfivYbgq
    H0cUmpY1RWSqUFlc6w7bUwKBgEMINctoksohbHZFjnWsgX2RsEdmhRWo6vuFgJSB
    6OJJrzr/NNysWSyJvQm8JldYS5ISNRuJcDvc3oVd/IsT/QZflXx48MQIVE6QLgfR
    DFMuonbBYyPxi7y11Ies+Q53u8CvkQlEwvDvQ00Fml6GOzuHbs2wZEkhlRnnXfTV
    6kBRAoGAP9NUZox5ZrwkOx7iH/zEx3X3qzFoN/zSI2iUi2XRWaglGbNAxqX5/ug8
    xJIi1Z9xbsZ/3cPEdPif2VMdvIy9ZSsBwIEuzRf8YNw6ZGphsO95FKrgmoqA44mm
    WsqUCBt5+DnOaDyvMkokP+T5tj/2LXemuIi4Q5nrOmw/WwVGGGs=
    -----END RSA PRIVATE KEY-----
  useExternalKvdb: true
vsphere-cloud-controller-manager:
  k8sVersion: '{{.spectro.system.kubernetes.version}}'

```

</TabItem>
</Tabs>

# Environments

<br />

<Tabs>
<TabItem label="vSphere" value="vSphere">

## vSphere Environment

For deploying Portworx storage on vSphere environments, make sure to configure the following properties in the pack:

- vSphere Configuration file

- Storage Type

- Kubernetes Version

### vSphere Manifest

Additional parameters for the manifest is as follows:

<br />

```yaml
# VSphere cloud configurations
vsphereConfig:
  insecure: "true"
  host: ""
  port: "443"
  datastorePrefix: "datastore"
  installMode: "shared"
  userName: ""
  password: ""
  # Enter the name of the secret which has vsphere user credentials (Use keys VSPHERE_USER, VSPHERE_PASSWORD)
  userCredsSecret: ""
```

<br />

## Using Secrets for vSphere User Credentials

Portworx pack values allow you to configure vSphere user credentials in two ways:

1. Username & password - (`portworx.vsphereConfig.userName` and `portworx.vsphereConfig.password`).

2. Secret - (`portworx.vsphereConfig.userCredsSecret` is available with v2.6.1 and above).

If you chose the latter, make sure to create the secret in the target cluster manually or by bringing your own (BYO)
manifest Add-on pack.

<br />

:::warning Until the secret is created in the cluster, Portworx deployments might fail to run. When secret is
configured, reconciliation should recover Portworx. :::

Secret can be created using the spec below,

<br />

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: px-vsphere-secret
  namespace: kube-system
type: Opaque
data:
  VSPHERE_USER: "b64 encoded admin username"
  VSPHERE_PASSWORD: "b64 encoded admin password"
```

and this secret can be referenced in the Portworx pack values as shown below:

<br />

```
manifests:
  portworx:
    vsphereConfig:
      userCredsSecret: "px-vsphere-secret"
```

Ensure to follow the correct indentation style; otherwise, certificates will not be imported correctly and resulting in
a Portworx deployment failure.

</TabItem>
<TabItem label="AWS" value="AWS">

## AWS Environment

Palette provisions Portworx in an AWS environment. The following are the packs supported:

<br />

### Packs Supported

<Tabs>
<TabItem label="2.9" value="2.9">

**portworx-aws-2.9**

</TabItem>
<TabItem label="2.10" value="2.10">

**portworx-aws-2.10**

</TabItem>
</Tabs>

<br />

### Prerequisites

To deploy Portworx in an AWS environment, have the following prerequisites in place.

- Ensure the Portworx Nodes have the TCP ports open at **9001-9022**.

- Ensure there is an open UDP port at **9002**.

- Apply the following policy to the **User** in AWS:

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Sid": "<stmt-id>",
        "Effect": "Allow",
        "Action":
          [
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
            "autoscaling:DescribeAutoScalingGroups",
          ],
        "Resource": ["*"],
      },
    ],
}
```

<br />

## AWS Manifest

```yaml
manifests:
  portworx:
    # The namespace to install Portworx resources
    namespace: "portworx"

    # Portworx storage type and size
    storageType: "type=gp3,size=150"

    # Max storage nodes per zone
    maxStorageNodesPerZone: 3

    # Node recovery timeout in seconds
    nodeRecoveryTimeout: 1500

    # Portworx storage class config
    storageClass:
      enabled: true
      isDefaultStorageClass: true
      allowVolumeExpansion: true
      reclaimPolicy: Retain
      volumeBindingMode: Immediate
      parameters:
        repl: "3"
        priority_io: "high"
        #sharedv4: true

    # Kubernetes version.
    k8sVersion: "{{.spectro.system.kubernetes.version}}"

    templateVersion: "v4"

    # List of additional container args to be passed
    args:
      ociMonitor:
        #- "-dedicated_cache"
        #- "-a"
      storkDeployment:
        #- "--app-initializer=true"
      storkScheduler:
        #- "--scheduler-name=xyz"
      autoPilot:
      csiProvisioner:
      csiSnapshotter:
      csiSnapshotController:
      csiResizer:

    # The private registry from where images will be pulled from. When left empty, images will be pulled from the public registry
    # Example, imageRegistry: "harbor.company.com/portworx"
    imageRegistry: ""

    # ECTD selection
    useExternalKvdb: false

    # External kvdb related config
    externalKvdb:
      useCertsForSSL: false
```

</TabItem>

</Tabs>

<br />

<br />

## References

- [Portworx Install with Kubernetes](https://docs.portworx.com/portworx-install-with-kubernetes/)

- [Lighthouse](https://legacy-docs.portworx.com/enterprise/lighthouse-new.html)

- [Installation Prerequisites](https://docs.portworx.com/install-portworx/prerequisites/)

- [Install Portworx on AWS ASG using the DaemonSet](https://docs.portworx.com/install-portworx/cloud/aws/aws-asg/daemonset/)
