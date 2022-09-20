---
title: "RBAC and NS Support"
metaTitle: "Cluster Level RBAC and NS Support"
metaDescription: "Cluster Level RBAC and NS Support for Access Control"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

RoleBindings and ClusterRoleBindings are Role-Based Access Control (RBAC) concepts that allow granular control over cluster-wide resources as well as namespaced resources. Palette provides the ability to specify these bindings to configure granular RBAC rules. Palette also can define new namespaces for the cluster and manage (remove, assign quota, assign role bindings, etc.) them.

Users can configure namespaces and RBAC directly from within a cluster or from a workspace that contains a collection of homogenous clusters that need to be managed as a group.

<InfoBox>
Please note that namespace management and RBAC can only be performed from within a cluster, as long as the cluster is not part of any workspace. Once a cluster is made part of a workspace, these actions can only be performed from the workspace.
</InfoBox>

**Role** sets access permissions within a namespace. During Role creation, the namespace it belongs to needs to be specified.

**Cluster Role** is a non-namespaced resource that sets permissions of the cluster-scoped resources.

<InfoBox>
Palette does not provide a way for roles to be configured natively through its platform. However, you may choose to create roles using a manifest layer in the cluster profile. RBAC management only allows you to specify bindings.
</InfoBox>

**RoleBinding** is binding or associating a Role with a Subject. RoleBinding is used for granting permission to a Subject. In addition, RoleBinding holds a list of subjects (users, groups, or service accounts) and references the role being granted. Role and RoleBinding are used in namespaced scoped.

**ClusterRoleBinding** binds or associates a ClusterRole with a Subject (users, groups, or service accounts). ClusterRole and ClusterRoleBinding function similar Role and RoleBinding with a broader scope. ClusterRoleBinding grants access cluster-wide as well as multiple namespaces.

# New clusters

While configuring the cluster (Cluster Settings) during the cluster creation, the user can select RBAC from the left menu. There are two available options for setting up RBAC:

* **Cluster** to create a RoleBinding with cluster-wide scope (ClusterRoleBinding).
* **Namespaces** to create a RoleBinding within namespaces scope (RoleBinding).
Palette users can choose role creation based on their resource requirements.

## Configure cluster role bindings

* Select Cluster Settings -> RBAC -> Cluster
* Click on “Add new binding” to open the “Add Cluster Role Binding” wizard. Fill in the following details:
  * Role Name: Define a custom role name to identify the cluster role
  * Subjects: Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or a team can perform. There are three types of subjects:
    * Subject Type:
      * Users: These are global and meant for humans or processes living outside the cluster.
      * Groups: Set of users.
      * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects.
“Confirm” the information to complete the creation of the ClusterRoleBinding.

## Configure role bindings

Users can now allocate CPU and Memory quotas for each namespace at the cluster level.

* Select Cluster Settings -> RBAC -> Namespace.
* Create a namespace with a custom name and add it to the list of the namespace by clicking on “add to the list”.
* Allocate resources to the created namespace (CPU and Memory).
* Click on “Add new binding” to open the “Add ClusterRoleBinding” wizard. Fill in the following details:
  * Namespace: Select the namespace from the drop-down (the list will display the namespaces created during the previous step.
  * Role Type: Select the role type from the drop-down. Either Role or Cluster Role.

<InfoBox>
A RoleBinding may reference any Role in the same namespace. Alternatively, a RoleBinding can reference a ClusterRole and bind that ClusterRole to the namespace of the RoleBinding. For example, if you want to bind a ClusterRole to all the namespaces in your cluster, you use a ClusterRoleBinding.
</InfoBox>

* Role Name: Define a custom role name to identify the cluster role
* Subjects: Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or group can perform. There are three types of subjects:
  * Subject Type:
    * Users: These are global, and meant for humans or processes living outside the cluster.
    * Groups: Set of users.
    * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects. “Confirm” the information to complete the creation of the RoleBinding.

# Running Clusters

You can manage namespaces and RBAC for a running cluster by invoking the RBAC management page as follows:
Clusters -> select the cluster -> Settings -> Cluster Settings -> select RBAC from left menu.

Configure settings as described above.

# Use Cases

* Use Role and a RoleBinding to scope security to a single namespace.
* Use ClusterRole and RoleBinding to scope security to several or all namespaces.
* Use ClusterRole and ClusterRoleBinding to scope security to all namespaces OR cluster-scoped resources.

# Use RBAC-OIDC in your Public Cloud 


This section explains the RBAC OIDC configuration to be done for all the public cloud except [Azure-AKS](/clusters/new-clusters/aks/#configureazureactivedirectory) and [EKS](/integrations/oidc-eks/) clusters.

The following content needs to be added into the kubernetes pack values while creating the Cluster Profile.

```yaml
extraArgs:
  oidc-issuer-url: "provider URL"
  oidc-client-id: "client-id"
  oidc-groups-claim: "groups"
  oidc-username-claim: "email"
```
## Following Content is required to get the client configuration related to OIDC details in kubeconfig downloaded from Pallet UI.

```yaml
clientConfig:
  oidc-issuer-url: "<OIDC-ISSUER-URL>"
  oidc-client-id: "<OIDC-CLIENT-ID>"
  oidc-client-secret: "<OIDC-CLIENT-SECRET>"
  oidc-extra-scope: profile,email,openid
```
## Example

```yaml
pack:
  k8sHardening: True
  #CIDR Range for Pods in cluster
  # Note : This must not overlap with any of the host or service network
  podCIDR: "192.168.0.0/16"
  #CIDR notation IP range from which to assign service cluster IPs
  # Note : This must not overlap with any IP ranges assigned to nodes for pods.
  serviceClusterIpRange: "10.96.0.0/12"

# KubeAdm customization for kubernetes hardening. Below config will be ignored if k8s Hardening property above is disabled
kubeadmconfig:
  apiServer:
    extraArgs:
      oidc-issuer-url: "<OIDC-ISSUER-URL>"
      oidc-client-id: "<OIDC-CLIENT-ID>"
      oidc-groups-claim: "groups"
      oidc-username-claim: "email"
      # Note : secure-port flag is used during kubeadm init. Do not change this flag on a running cluster
      secure-port: "6443"
      anonymous-auth: "true"
      insecure-port: "0"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      default-not-ready-toleration-seconds: "60"
      default-unreachable-toleration-seconds: "60"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurityPolicy"
      audit-log-path: /var/log/apiserver/audit.log
      audit-policy-file: /etc/kubernetes/audit-policy.yaml
      audit-log-maxage: "30"
      audit-log-maxbackup: "10"
      audit-log-maxsize: "100"
      authorization-mode: RBAC,Node
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extraVolumes:
      - name: audit-log
        hostPath: /var/log/apiserver
        mountPath: /var/log/apiserver
        pathType: DirectoryOrCreate
      - name: audit-policy
        hostPath: /etc/kubernetes/audit-policy.yaml
        mountPath: /etc/kubernetes/audit-policy.yaml
        readOnly: true
        pathType: File
  controllerManager:
    extraArgs:
      profiling: "false"
      terminated-pod-gc-threshold: "25"
      pod-eviction-timeout: "1m0s"
      use-service-account-credentials: "true"
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port : "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/privileged-psp.yaml
      targetPath: /etc/kubernetes/hardening/privileged-psp.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"
  preKubeadmCommands:
    # For enabling 'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
  postKubeadmCommands:
    # Apply the privileged PodSecurityPolicy on the first master node ; Otherwise, CNI (and other) pods won't come up
    # Sometimes api server takes a little longer to respond. Retry if applying the pod-security-policy manifest fails
    - 'export KUBECONFIG=/etc/kubernetes/admin.conf && [ -f "$KUBECONFIG" ] && { echo " ====> Applying PodSecurityPolicy" ; until $(kubectl apply -f /etc/kubernetes/hardening/privileged-psp.yaml > /dev/null ); do echo "Failed to apply PodSecurityPolicies, will retry in 5s" ; sleep 5 ; done ; } || echo "Skipping PodSecurityPolicy for worker nodes"'

# Client configuration to add OIDC based authentication flags in kubeconfig
clientConfig:
  oidc-issuer-url: "<OIDC-ISSUER-URL>"
  oidc-client-id: "<OIDC-CLIENT-ID>"
  oidc-client-secret: "<OIDC-CLIENT-SECRET>"
  oidc-extra-scope: profile,email,openid
```

