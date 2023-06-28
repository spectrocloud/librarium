---
title: 'Astra Trident'
metaTitle: 'Astra Trident Integration with Palette'
metaDescription: 'Astra Trident pack in Palette'
hiddenFromNav: true
type: "integration"
category: ["storage"]
logoUrl: ''
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Astra Trident

Astra Trident, is an open-source project backed and maintained by NetApp and is designed to provide persistence storage to containerized applications using industry-standard interfaces such as the Container Storage Interface (CSI).

Astra Trident deploys in Kubernetes clusters as pods and provides dynamic storage orchestration services for Kubernetes workloads. It enables containerized applications to quickly and easily consume persistent storage from NetApp’s portfolio that includes ONTAP (AFF/FAS/Select/Cloud/Amazon FSx for NetApp ONTAP), Element software (NetApp HCI/SolidFire), as well as the Azure NetApp Files service, and Cloud Volumes Service on Google Cloud.

# Versions Supported

<Tabs>

<Tabs.TabPane tab="23.01.x" key="trident_23.01">

## Prerequisites

- All worker nodes in the Kubernetes cluster must be able to mount the volumes you have provisioned for your pods. To prepare the worker nodes, you must install NFS or iSCSI tools based on your driver selection. See https://docs.netapp.com/us-en/trident/trident-use/worker-node-prep.html#selecting-the-right-tools

- Port requirements as listed in the table. 

| Port  | Purpose                                                      |
|-------|--------------------------------------------------------------|
| 8443  | Backchannel HTTPS                                            |
| 8001  | Prometheus metrics endpoint                                  |
| 8000  | Trident REST server                                          |
| 17546 | Liveness/readiness probe port used by Trident daemonset pods |

<InfoBox>

The liveness/readiness probe port can be changed during installation using the `--probe-port` flag. It is important to make sure this port isn’t being used by another process on the worker nodes. 

</InfoBox>

## Parameters

| Parameter | Description |
|-----------|-------------|
| ``imageRegistry`` | Identifies the registry for the trident-operator, trident, and other images.  Leave empty to accept the default. |
| ``imagePullPolicy`` | Sets the image pull policy for the trident-operator. Default: `IfNotPresent` |
| ``imagePullSecrets`` | Sets the image pull secrets for the trident-operator, trident, and other images. |
| ``kubeletDir`` | Allows overriding the host location of kubelet's internal state.  Default: `/var/lib/kubelet` |
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
| ``tridentAutosupportProxy`` | Allows Trident's autosupport container to phone home via an HTTP proxy. |
| ``tridentLogFormat`` | Sets the Trident logging format (text or json). Default: `text` |
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

<br />

#### Create a backend.  

Trident supports multiple backends and depending your storage backend, you will need to choose a backend that fits your needs. You can find example driver manifests [here](https://github.com/NetApp/trident/tree/master/trident-installer/sample-input/backends-samples) and you will need to personalise them with your credentials and environment configurations. Here's an example with the ONTAP-NAS driver. 

<br />

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

<br />

#### Create a storage class.  

Kubernetes allows us to bind statically and/or dynamically provisioned volumes to our Pods. Statically provisioned volumes are manually created by a user and then referenced in a deployment. Astra Trident allows you to leverage your NetApp storage and 
Before you can request dynamically provisioned volumes, you will need to create a storage class. Storage classes 

<br />

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

<br />

#### Provision your first Volume.  

Here's an example of a basic Persistent Volume Claim (PVC). 

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

#### Deploy your first Pod and mount the volume.  

Here's an example of a simple Pod deployment. This Pod contains an NGINX container, with a claim to the previously created Persistent Volume Claim (PVC). Once deployed, the PVC with it's bound Persistent Volume (PV), will mount to the Pod and provide persistent storage to this application.    

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

<br />

</Tabs.TabPane>

</Tabs>

# References
- [NetApp Astra Trident Docs](https://docs.netapp.com/us-en/trident/index.html)
- [Trident Github](https://github.com/NetApp/trident)
