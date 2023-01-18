---
title: 'Kubernetes Dashboard'
metaTitle: 'Kubernetes Dashboard with Spectro Proxy'
metaDescription: 'Kubernetes Dashboard with Spectro Proxy'
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Overview

The [Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general-purpose, web-based UI for Kubernetes clusters. The dashboard allows users to manage the cluster, applications, and the ability to do some troubleshooting. The Kubernetes dashboard is by default not enabled when deploying Kubernetes clusters through Palette. 

You can enable the Kubernetes dashboard without OIDC integration or with OIDC. Palette by default supports the Kubernetes dashboard without the usage of OIDC. Users will be required to have a Palette user account to access the Kubernetes dashboard. 

To enable the Kubernetes the dashboard in a host cluster, follow the next set of steps.
<br />


<Tabs>
<Tabs.TabPane tab="Without OIDC" key="wOIDC">



Click on the tab that represents the access level you set for the host cluster.

<br />

<Tabs>
<Tabs.TabPane tab="Private Cluster API Access" key="private"> 

## Prerequisite

* [Kubernetes Dashboard Pack](/integrations/kubernetes-dashboard) v2.6.1+ added to a Cluster Profile.

* [Spectro Proxy](/integrations/frp) v1.2.0+ added to a Cluster Profile.

* [Kubectl](https://kubernetes.io/docs/reference/kubectl/) v1.23.0+ installed.

* Access to a local terminal.

## Enablement

1. Log in to Palette and switch to **Cluster Mode**
2. Navigate to the left **Main Menu** and click on **Profiles**
3. Select the cluster profile containing the Kubernetes Dashboard pack and the Spectro Proxy pack. If you don't have a cluster profile, create a cluster profile. Use the [Create Cluster Profile](/cluster-profiles/task-define-profile) guide if you need guidance on how to create a cluster profile. 
4. Ensure the cluster profile includes both the [Kubernetes Dashboard pack](/integrations/kubernetes-dashboard) and the [Spectro Proxy](/integrations/frp) pack.
5. Click on the Spectro Proxy pack.
6. Update the manifest YAML by setting the parameter `k8sDashboardIntegration.enabled` to `true`.
7. Navigat to the Kubernetes Dashboard pack.
8. Update the manifest YAML by setting the parameter `k8s-dashboard.serviceType`. Ensure the value `ClusterIP` is set.
9. The Kubernetes dashboard will by default require login credentials to access the dashboard. You can set the parameter `k8s-dashboard.skipLogin` to `false` if you want to disable this behavior.
10. Save your changes.
11. Deploy a host cluster using the cluster profile that contains the proper configurations you made. 


## Validate

To validate you have successfuly enabled the Kubernetes dashboard use the following steps.

1. Log in to Palette and switch to **Cluster Mode**
2. Navigate to the left **Main Menu** and click on **Clusters**
3. Click on the cluster you deployed with the cluster profile containing the Kubernetes dashboard configuration.
4. In the cluser details page, click on the **>_ Connect** button to right of the **Kubernetes Config File** element. This will open up a web shell session for the cluster.
5. Retrive the Kubernetes dashboard token by issuing the following command.
```shell
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
```shell

Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095


Type:  kubernetes.io/service-account-token


Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```
6. Grab the token value located at the bottom of the output and close the shell session.
7. In the cluser details page, click on the **>_ Connect** button to right of the **Kubernetes Dashboard** element.
5. A new tab will open up in your browser where you can access the Kubernetes dashboard.
6. Select token and provide the token you received in the terminal window.

</Tabs.TabPane>

<Tabs.TabPane tab="Public Cluster API Access" key="public">

## Prerequisite

* [Kubernetes Dashboard Pack](/integrations/kubernetes-dashboard) added to a Cluster Profile.

* [Kubectl](https://kubernetes.io/docs/reference/kubectl/) v1.23.0+ installed.

* Access to a local terminal.

## Enablement

1. Log in to Palette and switch to **Cluster Mode**
2. Navigate to the left **Main Menu** and click on **Profiles**
3. Select the cluster profile containing the Kubernetes Dashboard pack and the Spectro Proxy pack. If you don't have a cluster profile, create a cluster profile. Use the [Create Cluster Profile](/cluster-profiles/task-define-profile) guide if you need guidance on how to create a cluster profile. 
4. Ensure the cluster profile includes the [Kubernetes Dashboard Pack](/integrations/kubernetes-dashboard).
5. Click on the Kubernetes Dashboard pack.
6. Update the manifest YAML by setting the parameter `k8s-dashboard.serviceType`. Set the value to `LoadBalancer`.
7. The Kubernetes dashboard will by default require login credentials to access the dashboard. You can set the parameter `k8s-dashboard.skipLogin` to `false` if you want to disable this behavior.
8. Save your changes.
9. Deploy a host cluster using the cluster profile that contains the proper configurations you made. 


## Validate

To validate you have successfuly enabled the Kubernetes dashboard use the following steps.

1. Log in to Palette and switch to **Cluster Mode**
2. Navigate to the left **Main Menu** and click on **Clusters**
3. Click on the cluster you deployed with the cluster profile containing the Kubernetes dashboard configuration.
4. Download the Kubernetes cluster's kubeconfig file. You can download the kubeconfig file navigating to the element **Kubernetes Config File** and click on the file name to the right.
5. Open up a local terminal and set the environment variable `KUBECONFIG` to the downloaded kubeconfig file.
```shell
export KUBECONFIG=~/Downloads/yourClusterNameGoesHere.kubeconfig
```
6. Retrive the Kubernetes dashboard token by issuing the following command.
```shell
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
```shell

Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095


Type:  kubernetes.io/service-account-token


Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```
7. Grab the token value located at the bottom of the output.
8. Navigate back to Palette and the cluster's details page.
9. In the cluser details page, click on the **>_ Connect** button to right of the **Kubernetes Dashboard** element.
10. A new tab will open up in your browser where you can access the Kubernetes dashboard.
11. Select token and provide the token you received in the terminal window.

</Tabs.TabPane>

</Tabs> 

</Tabs.TabPane>

<Tabs.TabPane tab="With OIDC" key="oidc">

lalalalala
</Tabs.TabPane>

</Tabs>

 
<br />



<!-- # Quick Workflow:


1. [Create a cluster profile](/cluster-profiles) with required Infrastructure layers and Add-on layers per use case, in addition to the Kubernetes Dashboard Pack and Spectro-Proxy packs to the cluster profile as briefed in the Prerequisites.


2. [Enable OIDC authentication](/knowledgebase/how-to/reverse-proxy-dashboard#enableoidcauthentication) to the Kubernetes pack.


3. [Launch a new cluster](/clusters) using the cluster profile.


4. Configure the Role Binding for the user. The two options available for Role Binding are:
    * [Cluster Role Binding](/clusters/cluster-management/cluster-rbac)
    * [Workspace Role Binding](/workspace/workload-features#configureclusterrolebindings)


5. Now, from the cluster overview page of Palette UI, click [connect](/clusters/cluster-management/palette-webctl#overview) to redirect to the IDP for authentication or dashboard if already authorized.
 

6. The Palette Kubernetes Dashboard with Spectro-Proxy is ready for monitoring.

# Enable OIDC Authentication

To enable OIDC authentication, make the following configuration to Kubernetes Pack:


## Sample scenario

<br />

### OIDC Related Configuration to Kubernetes Pack

```
## OIDC related config
  oidcIdentityProvider:
    identityProviderConfigName: 'Spectro-docs'     # The name of the OIDC provider configuration
    issuerUrl: 'issuer-url'       # The URL of the OpenID identity provider
    clientId: 'user-client-id-from-Palette'           # The ID for the client application that makes authentication requests to the OpenID identity provider
    usernameClaim: "email"                     # The JSON Web Token (JWT) claim to use as the username
    usernamePrefix: "-"                        # The prefix that is prepended to username claims to prevent clashes with existing names
    groupsClaim: "groups"                      # The JWT claim that the provider uses to return your groups
    groupsPrefix: ""                          # The prefix that is prepended to group claims to prevent clashes with existing names
    requiredClaims:                            # The key value pairs that describe required claims in the identity token
```
<br />

### Client Configuration to Add OIDC Based Authentication in kubeconfig

```
## Client configuration to add OIDC based authentication flags in kubeconfig
clientConfig:
  oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
  oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
  oidc-client-secret: client-secret-value
  oidc-extra-scope: profile,email
```




 -->
