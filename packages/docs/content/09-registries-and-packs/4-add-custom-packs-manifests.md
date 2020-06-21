---
title: "Adding a custom pack using manifests"
metaTitle: "Adding a custom pack using manifests"
metaDescription: "How to create custom made packs using manifests and registries in Spectro Cloud"
icon: ""
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Add-on packs using manifests

Add-on packs can be built using Kubernetes manifests. These manifests contain deployment specifications for Kubernetes objects like pods, services, deployments, namespaces, secrets etc.

The example below shows how to build the Permission Manager auth pack and push to the pack registry server using the Spectro Cloud CLI.

1. Create the pack directory named `permission-manager`.
2. Create the metadata file named `pack.json`.
```
{
  "addonType":"authentication",
  "cloudTypes": ["all"],
  "displayName": "Permission Manager",
  "kubeManifests": [
    "manifests/permission-manager.yaml"
  ],
  "layer": "addon",
  "name": "permission-manager",
  "version": "1.0.0"
}
```

3. Create a sub-directory called `manifests`.
4. Copy the desired manifest files to the `manifests` directory and reference them in `pack.json` as shown in step 2. If configurability of the manifest is desired, then the manifest files must be templatized to introduce parameters, for example, *{{ .Values.namespace}}*. These parameters are defined with default values in the `values.yaml` file and can be overridden in the cluster profile.

permission-manager.yaml (partial)
```
---

apiVersion: v1
kind: Namespace
metadata:
  name: {{ .Values.namespace | quote }}

---

apiVersion: v1
kind: Secret
metadata:
  name: auth-password-secret
  namespace: {{ .Values.namespace | quote }}
type: Opaque
stringData:
  password: {{ .Values.authPassword }}

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: template-namespaced-resources___operator
rules:
  - apiGroups:
      - "*"
    resources:
      - "*"
    verbs:
      - "*"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: template-namespaced-resources___developer
rules:
  - apiGroups:
      - "*"
    resources:
      # - "bindings"
      - "configmaps"
      - "endpoints"
      # - "limitranges"
      - "persistentvolumeclaims"
      - "pods"
      - "pods/log"
      - "pods/portforward"
      - "podtemplates"
      - "replicationcontrollers"
      - "resourcequotas"
      - "secrets"
      # - "serviceaccounts"
      - "services"
      # - "controllerrevisions"
      # - "statefulsets"
      # - "localsubjectaccessreviews"
      # - "horizontalpodautoscalers"
      # - "cronjobs"
      # - "jobs"
      # - "leases"
      - "events"
      - "daemonsets"
      - "deployments"
      - "replicasets"
      - "ingresses"
      - "networkpolicies"
      - "poddisruptionbudgets"
      # - "rolebindings"
      # - "roles"
    verbs:
      - "*"

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: template-namespaced-resources___read-only
rules:
  - apiGroups:
      - "*"
    resources:
      - "configmaps"
      - "endpoints"
      - "persistentvolumeclaims"
      - "pods"
      - "pods/log"
      - "pods/portforward"
      - "podtemplates"
      - "replicationcontrollers"
      - "resourcequotas"
      - "secrets"
      - "services"
      - "statefulsets"
      - "cronjobs"
      - "jobs"
      - "events"
      - "daemonsets"
      - "deployments"
      - "replicasets"
      - "ingresses"
      - "networkpolicies"
      - "poddisruptionbudgets"
    verbs: ["get", "list", "watch"]

---
...
```

5.  Create a file called “values.yaml” to provide configurable manifest parameters.

values.yaml
```
manifests:
  permission-manager:
  
    #Namespace under which permission-manager will be deployed
    namespace: "permission-manager"

    #Login password for permission-manager
    authPassword: "welcome123"
```

6. Using Spectro Cloud CLI  push the newly built pack to the pack registry:

```
$spectro pack push permission-manager --registry-server [REGISTRY-SERVER]
```
