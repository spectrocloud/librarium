---
sidebar_label: 'Astra Trident'
title: 'Astra Trident'
description: 'Learn abou the Astra Trident pack.'
hide_table_of_contents: true
type: "integration"
category: ['storage', 'amd64', 'community']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/csi-trident/blobs/sha256:d4dd2ecf2e6f67876b8dab57ecfdf17591824c21e8d0d44fab0aaef9ddd3b931?type=image/png'
tags: ['packs', 'trident', 'storage']
---


Astra Trident, is an open-source project backed and maintained by [NetApp](https://www.netapp.com/) and is designed to provide persistence storage to containerized applications using industry-standard interfaces, such as the Container Storage Interface (CSI).

Astra Trident deploys in Kubernetes clusters as pods and provides dynamic storage orchestration services for Kubernetes workloads. Containerized applications are enabled to quickly consume persistent storage from NetApp’s portfolio of solutions with minimal overhead. 

- ONTAP (AFF/FAS/Select/Cloud/Amazon FSx for NetApp ONTAP)
- Element software (NetApp HCI/SolidFire) 
- Azure NetApp Files service
- Cloud Volumes Service on Google Cloud.

## Versions Supported

<Tabs>
<TabsItem label="23.07.x" value="trident_23.07">

## Prerequisites

- All worker nodes in the Kubernetes cluster must be able to mount the volumes you have provisioned for your pods. To prepare the worker nodes, you must install NFS or iSCSI tools based on your driver selection. Check out the [Selecting the right tools](https://docs.netapp.com/us-en/trident/trident-use/worker-node-prep.html#selecting-the-right-tools) guide for more information.

- The following ports must be exposed on the worker nodes. 

  | **Port**  | **Purpose**  |
  |-------|--------------------------------------------------------------|
  | 8443  | Backchannel HTTPS                                            |
  | 8001  | Prometheus metrics endpoint                                  |
  | 8000  | Trident REST server                                          |
  | 17546 | Supports liveness and readiness probe used by Trident DaemonSet pods |

  <br />

  :::info

  The liveness and readiness probe port can be changed during installation by using the `--probe-port` flag. Ensure the probe port is not used by another process on the worker nodes. 

  :::

## Parameters

| **Parameter** | **Description** |
|-----------|-------------|
| ``imageRegistry`` | Identifies the registry for the trident-operator, trident, and other images.  Leave empty to accept the default. |
| ``imagePullPolicy`` | Sets the image pull policy for the trident-operator. Default: `IfNotPresent` |
| ``imagePullSecrets`` | Sets the image pull secrets for the trident-operator, trident, and other images. |
| ``kubeletDir`` | Allows overriding the host location of Kubelet's internal state.  Default: `/var/lib/kubelet` |
| ``operatorDebug`` | Allows enabling debug logging in trident-operator. Default: `false` |
| ``operatorImage`` | Allows the complete override of the image for trident-operator. |
| ``operatorImageTag`` | Allows overriding the tag of the trident-operator image. |
| ``tridentDebug`` | Allows enabling debug logging from the Trident deployment. Default: `false` |
| ``tridentIPv6`` | Allows enabling Trident to work in IPv6 clusters. Default: `false` |
| ``tridentK8sTimeout`` | Overrides the default 30-second timeout for most Kubernetes API operations (if non-zero, in seconds). Default: `0` |
| ``tridentHttpRequestTimeout`` | Overrides the default 90-second timeout for the HTTP requests, with 0s being an infinite duration for the timeout. Negative values are not allowed. Default:  `90s` |
| ``tridentSilenceAutosupport`` | Allows disabling Trident's periodic Autosupport reporting. Default: `false` |
| ``tridentAutosupportImage`` | Allows the complete override of the image for Trident's Autosupport container. |
| ``tridentAutosupportImageTag`` | Allows overriding the tag of the image for Trident's Autosupport container. Default: `23.01` |
| ``tridentAutosupportProxy`` | Allows Trident's Autosupport container to phone home via an HTTP proxy. |
| ``tridentLogFormat`` | Sets the Trident logging format (text or JSON). Default: `text` |
| ``tridentDisableAuditLog`` | Disables Trident's audit logger. Default: `true` |
| ``tridentImage`` | Allows the complete override of the image for Trident. |
| ``tridentImageTag`` | Allows overriding the tag of the image for Trident. |
| ``tridentEnableNodePrep`` | (Deprecated) Attempts to automatically install required packages on nodes. Default: `false` |
| ``tridentSkipK8sVersionCheck`` | (Deprecated) Allows overriding the k8s version limit for Trident. Default: `false` |
| ``tridentProbePort`` | Allows overriding the default port used for k8s liveness/readiness probes. |
| ``windows`` | Allows Trident to be installed on Windows worker node. Default: `false` |
| ``enableForceDetach`` | Allows enabling the force detach feature. Default: `false` |
| ``excludePodSecurityPolicy`` | Excludes the operator pod security policy from creation. Default: `false` |


## Usage

After deploying Trident, you will need to create a backend and a storage class before you can start provisioning volumes and mounting those to any pods. 



### Create a Storage Backend  

Trident supports multiple storage backends. Select a supported backend that fits your needs. You can find example of different backends by reviewing the driver manifests examples in the official Trident [repository](https://github.com/NetApp/trident/tree/master/trident-installer/sample-input/backends-samples). If you decide to use one of the example configurations, make sure you update the configuration with your credentials and environment configurations. 

The example below creates a backend with the ONTAP-NAS driver. 

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-ontap-nas-secret
  namespace: trident
type: Opaque
stringData:
  username: [USERNAME]
  password: [PASSWORD]
---
apiVersion: trident.netapp.io/v1
kind: TridentBackendConfig
metadata:
  name: backend-ontap-nas
  namespace: trident
spec:
  version: 1
  storageDriverName: ontap-nas
  managementLIF: [ONTAP_MANAGEMENT_LIF_IP]
  dataLIF: [DATA_LIF_IP]
  backendName: ontap-nas
  autoExportCIDRs:
  - [x.x.x.x/xx]
  autoExportPolicy: true
  svm: [SVM]
  credentials: 
    name: backend-ontap-nas-secret
```



#### Create a Storage Class 

Kubernetes supports the ability to bind statically or dynamically provisioned volumes to pods. Statically provisioned volumes are manually created by a user and then referenced in a deployment. Astra Trident allows you to leverage your NetApp storage. You must create a storage class before you can request dynamically provisioned volumes. 


```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: trident-csi
  namespace: trident
provisioner: csi.trident.netapp.io
parameters:
  backendType: "ontap-nas"
  csi.storage.k8s.io/fstype: ext4
```



#### Provision Volumes 

An example of provisioning a Persistent Volume Claim (PVC). 

<br />

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: trident-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: trident-csi
```

<br />

#### Deploy a Pod and Mount the Volume.  

The following code snippet is an example of a pod deployment. The pod contains an Nginx container, with a claim to the previously created PVC. Once deployed, the PVC with its bound Persistent Volume (PV), will mount to the pod and provide persistent storage to this application.    

<br />

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: example-pv-pod
  namespace: trident
spec:
  volumes:
    - name: example-pv-vol
      persistentVolumeClaim:
       claimName: trident-pvc
  containers:
    - name: example-pv-pod
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: example-pv-vol
```


</TabsItem>

<TabsItem label="23.01.x" value="trident_23.01">

## Prerequisites

- All worker nodes in the Kubernetes cluster must be able to mount the volumes you have provisioned for your pods. To prepare the worker nodes, you must install NFS or iSCSI tools based on your driver selection. Check out the [Selecting the right tools](https://docs.netapp.com/us-en/trident/trident-use/worker-node-prep.html#selecting-the-right-tools) guide for more information.

- The following ports must be exposed on the worker nodes. 

  | **Port**  | **Purpose**  |
  |-------|--------------------------------------------------------------|
  | 8443  | Backchannel HTTPS                                            |
  | 8001  | Prometheus metrics endpoint                                  |
  | 8000  | Trident REST server                                          |
  | 17546 | Supports liveness and readiness probe used by Trident DaemonSet pods |

  <br />

  :::info

  The liveness and readiness probe port can be changed during installation by using the `--probe-port` flag. Ensure the probe port is not used by another process on the worker nodes. 

  :::

## Parameters

| **Parameter** | **Description** |
|-----------|-------------|
| ``imageRegistry`` | Identifies the registry for the trident-operator, trident, and other images.  Leave empty to accept the default. |
| ``imagePullPolicy`` | Sets the image pull policy for the trident-operator. Default: `IfNotPresent` |
| ``imagePullSecrets`` | Sets the image pull secrets for the trident-operator, trident, and other images. |
| ``kubeletDir`` | Allows overriding the host location of Kubelet's internal state.  Default: `/var/lib/kubelet` |
| ``operatorDebug`` | Allows enabling debug logging in trident-operator. Default: `false` |
| ``operatorImage`` | Allows the complete override of the image for trident-operator. |
| ``operatorImageTag`` | Allows overriding the tag of the trident-operator image. |
| ``tridentDebug`` | Allows enabling debug logging from the Trident deployment. Default: `false` |
| ``tridentIPv6`` | Allows enabling Trident to work in IPv6 clusters. Default: `false` |
| ``tridentK8sTimeout`` | Overrides the default 30-second timeout for most Kubernetes API operations (if non-zero, in seconds). Default: `0` |
| ``tridentHttpRequestTimeout`` | Overrides the default 90-second timeout for the HTTP requests, with 0s being an infinite duration for the timeout. Negative values are not allowed. Default:  `90s` |
| ``tridentSilenceAutosupport`` | Allows disabling Trident's periodic Autosupport reporting. Default: `false` |
| ``tridentAutosupportImage`` | Allows the complete override of the image for Trident's Autosupport container. |
| ``tridentAutosupportImageTag`` | Allows overriding the tag of the image for Trident's Autosupport container. Default: `23.01` |
| ``tridentAutosupportProxy`` | Allows Trident's Autosupport container to phone home via an HTTP proxy. |
| ``tridentLogFormat`` | Sets the Trident logging format (text or JSON). Default: `text` |
| ``tridentDisableAuditLog`` | Disables Trident's audit logger. Default: `true` |
| ``tridentImage`` | Allows the complete override of the image for Trident. |
| ``tridentImageTag`` | Allows overriding the tag of the image for Trident. |
| ``tridentEnableNodePrep`` | (Deprecated) Attempts to automatically install required packages on nodes. Default: `false` |
| ``tridentSkipK8sVersionCheck`` | (Deprecated) Allows overriding the k8s version limit for Trident. Default: `false` |
| ``tridentProbePort`` | Allows overriding the default port used for k8s liveness/readiness probes. |
| ``windows`` | Allows Trident to be installed on Windows worker node. Default: `false` |
| ``enableForceDetach`` | Allows enabling the force detach feature. Default: `false` |
| ``excludePodSecurityPolicy`` | Excludes the operator pod security policy from creation. Default: `false` |


## Usage

After deploying Trident, you will need to create a backend and a storage class before you can start provisioning volumes and mounting those to any pods. 



### Create a Storage Backend  

Trident supports multiple storage backends. Select a supported backend that fits your needs. You can find example of different backends by reviewing the driver manifests examples in the official Trident [repository](https://github.com/NetApp/trident/tree/master/trident-installer/sample-input/backends-samples). If you decide to use one of the example configurations, make sure you update the configuration with your credentials and environment configurations. 

The example below creates a backend with the ONTAP-NAS driver. 

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-ontap-nas-secret
  namespace: trident
type: Opaque
stringData:
  username: [USERNAME]
  password: [PASSWORD]
---
apiVersion: trident.netapp.io/v1
kind: TridentBackendConfig
metadata:
  name: backend-ontap-nas
  namespace: trident
spec:
  version: 1
  storageDriverName: ontap-nas
  managementLIF: [ONTAP_MANAGEMENT_LIF_IP]
  dataLIF: [DATA_LIF_IP]
  backendName: ontap-nas
  autoExportCIDRs:
  - [x.x.x.x/xx]
  autoExportPolicy: true
  svm: [SVM]
  credentials: 
    name: backend-ontap-nas-secret
```



#### Create a Storage Class 

Kubernetes supports the ability to bind statically or dynamically provisioned volumes to Pods. Statically provisioned volumes are manually created by a user and then referenced in a deployment. Astra Trident allows you to leverage your NetApp storage. You must create a storage class before you can request dynamically provisioned volumes. 


```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: trident-csi
  namespace: trident
provisioner: csi.trident.netapp.io
parameters:
  backendType: "ontap-nas"
  csi.storage.k8s.io/fstype: ext4
```



#### Provision Volumes 

An example of provisioning a Persistent Volume Claim (PVC). 

<br />

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: trident-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: trident-csi
```

<br />

#### Deploy a Pod and Mount the Volume.  

The following code snippet is an example of a pod deployment. The pod contains an Nginx container, with a claim to the previously created PVC. Once deployed, the PVC with its bound Persistent Volume (PV), will mount to the pod and provide persistent storage to this application.    

<br />

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: example-pv-pod
  namespace: trident
spec:
  volumes:
    - name: example-pv-vol
      persistentVolumeClaim:
       claimName: trident-pvc
  containers:
    - name: example-pv-pod
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: example-pv-vol
```


</TabsItem>

</Tabs>

## References

- [NetApp Astra Trident Docs](https://docs.netapp.com/us-en/trident/index.html)


- [Necessary tools](https://docs.netapp.com/us-en/trident/trident-use/worker-node-prep.html#selecting-the-right-tools)


- [Trident GitHub](https://github.com/NetApp/trident)

