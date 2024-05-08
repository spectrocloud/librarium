---
sidebar_label: "Deploy a GCP IaaS Cluster with Crossplane"
title: "Deploy a GCP IaaS Cluster with Crossplane"
description: "Learn how to deploy a GCP IaaS cluster using the Spectro Cloud Crossplane provider."
hide_table_of_contents: false
sidebar_position: 30
tags: ["crossplane", "gcp", "iac", "infrastructure as code"]
---

Palette supports using [Crossplane](https://www.crossplane.io) to create and manage Kubernetes
[host clusters](../../glossary-all.md#host-cluster) across major infrastructure providers. This section guides you on
how to use Crossplane to deploy a Palette-managed Kubernetes cluster in GCP.

## Prerequisites

- A [Palette](https://www.spectrocloud.com/get-started) account and API key. Refer to the
  [Create API Key](../../user-management/user-authentication.md) page for instructions on creating an API key.
- A public [GCP](https://cloud.google.com/iam/docs/creating-managing-service-accounts) service account with the required
  [roles](../../clusters/public-cloud/gcp/add-gcp-accounts.md#prerequisites).
- An SSH key pair available. Check out the [Create an Upload an SSH Key](../../clusters/cluster-management/ssh-keys.md)
  page for guidance.
- The GCP account must be registered in Palette. Follow the
  [Register and Manage GCP Accounts](../../clusters/public-cloud/gcp/add-gcp-accounts.md) guide to register your account
  in Palette.
- A Kubernetes cluster with at least 2 GB of RAM. This guide uses a [kind](https://kind.sigs.k8s.io) cluster as an
  example. Refer to the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) to learn how to install kind
  and create a cluster.
- The following software is required and must be installed:
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - [Helm](https://helm.sh/docs/intro/install/) version v3.2.0 or later
  - [curl](https://curl.se/docs/install.html)
  - A text editor such as Vi or [Nano](https://www.nano-editor.org). This guide uses Vi as an example.

## Deploy a GCP IaaS Cluster with Crossplane

1.  Open up a terminal session and set the kubectl context to your kind cluster. Replace `<kind-cluster-name>` with the
    name of your cluster.

    ```bash
    kubectl cluster-info --context <kind-cluster-name>
    ```

    ```text hideClipboard
    Kubernetes control plane is running at https://127.0.0.1:65306
    CoreDNS is running at https://127.0.0.1:65306/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

2.  Next, add the Crossplane Helm chart. This will enable Crossplane to install all its Kubernetes components.

    ```bash
    helm repo add \
    crossplane-stable https://charts.crossplane.io/stable
    helm repo update
    ```

    ```text hideClipboard
    "crossplane-stable" has been added to your repositories
    Hang tight while we grab the latest from your chart repositories...
    ...Successfully got an update from the "ngrok" chart repository
    ...Successfully got an update from the "crossplane-stable" chart repository
    ...Successfully got an update from the "stable" chart repository
    Update Complete. ⎈Happy Helming!⎈
    ```

3.  Install the Crossplane components using the `helm install` command.

    ```bash
    helm install crossplane \
    crossplane-stable/crossplane \
    --namespace crossplane-system \
    --create-namespace
    ```

    You can verify the installation with the `kubectl get pods` command. The output must contain two Crossplane pods in
    the _Running_ status.

    ```bash
    kubectl get pods --namespace crossplane-system
    ```

    ```text hideClipboard
    NAME                                     READY   STATUS    RESTARTS   AGE
    crossplane-869d89c8f8-7jc6c              1/1     Running   0          20s
    crossplane-rbac-manager-784b496b-8mr6z   1/1     Running   0          20s
    ```

4.  Once Crossplane is installed, create a folder to store the Kubernetes configuration files.

    ```bash
    mkdir crossplane-gcp
    ```

5.  Use a text editor of your choice to create a file for the Palette Crossplane provider configuration.

    ```bash
    vi crossplane-gcp/provider-palette.yaml
    ```

6.  Paste the following Kubernetes configuration into the text editor window that opens. Press the `Escape` key, type
    `:wq`, and press `Enter` to save the file and exit.

    ```yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-palette
    spec:
      package: crossplane-contrib/provider-palette:v0.12.0
    ```

7.  Issue the command below to install the Palette Crossplane provider. Crossplane will install the CRDs that allow you
    to create Palette resources directly inside Kubernetes.

    ```bash
    kubectl apply --filename crossplane-gcp/provider-palette.yaml
    ```

    You can check the installation with the `kubectl get providers` command.

    ```bash
    kubectl get providers
    ```

    ```text hideClipboard
     NAME                          INSTALLED   HEALTHY   PACKAGE                                              AGE
     provider-palette              True        True      crossplane-contrib/provider-palette:v0.12.0          61s
    ```

8.  Create a file to store a Kubernetes Secret containing your Palette API key. The Palette provider requires
    credentials to create and manage resources.

    ```bash
    vi crossplane-gcp/secret-gcp.yaml
    ```

9.  Paste the following Kubernetes configuration into the text editor window that opens. Replace `<your-api-key>` with
    your Palette API key and change the values of `project_name` and `host` according to your environment. Save the file
    and exit.

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: palette-creds
      namespace: crossplane-system
    type: Opaque
    stringData:
      credentials: |
        {
        "api_key": "<your-api-key>",
        "project_name": "Default",
        "host": "console.spectrocloud.com"
        }
    ```

10. Create the Kubernetes secret.

    ```shell
    kubectl apply --filename crossplane-gcp/secret-gcp.yaml
    ```

11. Next, create a file to store the `ProviderConfig` object. This object configures the Palette Crossplane provider
    with the secret containing the Palette API key.

    ```bash
    vi crossplane-gcp/providerconfig-gcp.yaml
    ```

12. Paste the content below into the text editor window, save the file and exit.

    ```yaml
    apiVersion: palette.crossplane.io/v1beta1
    kind: ProviderConfig
    metadata:
      name: default
    spec:
      credentials:
        source: Secret
        secretRef:
          name: palette-creds
          namespace: crossplane-system
          key: credentials
    ```

13. Create the Kubernetes `ProviderConfig` object.

    ```shell
    kubectl apply --filename crossplane-gcp/providerconfig-gcp.yaml
    ```

14. Once the Palette Crossplane provider is installed and set up, create a file to store the GCP
    [cluster profile](../../profiles/cluster-profiles/cluster-profiles.md) configuration.

    ```bash
    vi crossplane-gcp/cluster-profile-gcp.yaml
    ```

15. Paste the Kubernetes configuration below into the text editor window that opens. Save the file and exit.

    ```yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Profile
    metadata:
      name: gcp-crossplane-cluster-profile
      namespace: crossplane-system
    spec:
      forProvider:
        cloud: "gcp"
        description: "GCP cluster profile"
        type: "cluster"
        pack:
          - name: "ubuntu-gcp"
            tag: "22.04"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "# Spectro Golden images includes most of the hardening as per CIS Ubuntu Linux 22.04 LTS Server L1 v1.0.0
              standards\n\n# Uncomment below section to\n# 1. Include custom files to be copied over to the nodes
              and/or\n# 2. Execute list of commands before or after kubeadm init/join is
              executed\n#\n#kubeadmconfig:\n#  preKubeadmCommands:\n#  - echo \"Executing pre kube admin config
              commands\"\n#  - update-ca-certificates\n#  - 'systemctl restart containerd; sleep 3'\n#  - 'while [ ! -S
              /var/run/containerd/containerd.sock ]; do echo \"Waiting for containerd...\"; sleep 1;
              done'\n#  postKubeadmCommands:\n#  - echo \"Executing post kube admin config commands\"\n#  files:\n#  -
              targetPath: /usr/local/share/ca-certificates/mycom.crt\n#    targetOwner:
              \"root:root\"\n#    targetPermissions: \"0644\"\n#    content: |\n#      -----BEGIN
              CERTIFICATE-----\n#      MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl\n#      cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE\n#      AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA\n#      nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz\n#      qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN\n#      fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2\n#      7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL\n#      9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK\n#      jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB\n#      /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki\n#      HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y\n#      g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ\n#      ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6\n#      b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56\n#      IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=\n#      -----END
              CERTIFICATE-----"
            uid: "63fdd138199bafb6b657b7e6"

          - name: "kubernetes"
            tag: "1.28.3"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "# spectrocloud.com/enabled-presets: Kube Controller Manager:loopback-ctrlmgr,Kube
              Scheduler:loopback-scheduler\npack:\n  k8sHardening: True\n  #CIDR Range for Pods in cluster\n  # Note :
              This must not overlap with any of the host or service network\n  podCIDR: \"192.168.0.0/16\"\n  #CIDR
              notation IP range from which to assign service cluster IPs\n  # Note : This must not overlap with any IP
              ranges assigned to nodes for pods.\n  serviceClusterIpRange: \"10.96.0.0/12\"\n  # serviceDomain:
              \"cluster.local\"\n\n# KubeAdm customization for kubernetes hardening. Below config will be ignored if
              k8sHardening property above is disabled\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      # Note :
              secure-port flag is used during kubeadm init. Do not change this flag on a running
              cluster\n      secure-port: \"6443\"\n      anonymous-auth: \"true\"\n      profiling:
              \"false\"\n      disable-admission-plugins: \"AlwaysAdmit\"\n      default-not-ready-toleration-seconds:
              \"60\"\n      default-unreachable-toleration-seconds: \"60\"\n      enable-admission-plugins:
              \"AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity\"\n      admission-control-config-file:
              \"/etc/kubernetes/pod-security-standard.yaml\"\n      audit-log-path:
              /var/log/apiserver/audit.log\n      audit-policy-file:
              /etc/kubernetes/audit-policy.yaml\n      audit-log-maxage: \"30\"\n      audit-log-maxbackup:
              \"10\"\n      audit-log-maxsize: \"100\"\n      authorization-mode: RBAC,Node\n      tls-cipher-suites:
              \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256\"\n    extraVolumes:\n      -
              name: audit-log\n        hostPath: /var/log/apiserver\n        mountPath:
              /var/log/apiserver\n        pathType: DirectoryOrCreate\n      - name: audit-policy\n        hostPath:
              /etc/kubernetes/audit-policy.yaml\n        mountPath: /etc/kubernetes/audit-policy.yaml\n        readOnly:
              true\n        pathType: File\n      - name: pod-security-standard\n        hostPath:
              /etc/kubernetes/pod-security-standard.yaml\n        mountPath:
              /etc/kubernetes/pod-security-standard.yaml\n        readOnly: true\n        pathType:
              File\n  controllerManager:\n    extraArgs:\n      profiling: \"false\"\n      terminated-pod-gc-threshold:
              \"25\"\n      use-service-account-credentials: \"true\"\n      feature-gates:
              \"RotateKubeletServerCertificate=true\"\n  scheduler:\n    extraArgs:\n      profiling:
              \"false\"\n  kubeletExtraArgs:\n    read-only-port : \"0\"\n    event-qps: \"0\"\n    feature-gates:
              \"RotateKubeletServerCertificate=true\"\n    protect-kernel-defaults:
              \"true\"\n    rotate-server-certificates: \"true\"\n    tls-cipher-suites:
              \"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256\"\n  files:\n    -
              path: hardening/audit-policy.yaml\n      targetPath: /etc/kubernetes/audit-policy.yaml\n      targetOwner:
              \"root:root\"\n      targetPermissions: \"0600\"\n    - path: hardening/90-kubelet.conf\n      targetPath:
              /etc/sysctl.d/90-kubelet.conf\n      targetOwner: \"root:root\"\n      targetPermissions: \"0600\"\n    -
              targetPath: /etc/kubernetes/pod-security-standard.yaml\n      targetOwner:
              \"root:root\"\n      targetPermissions: \"0600\"\n      content: |\n        apiVersion:
              apiserver.config.k8s.io/v1\n        kind: AdmissionConfiguration\n        plugins:\n        - name:
              PodSecurity\n          configuration:\n            apiVersion:
              pod-security.admission.config.k8s.io/v1\n            kind:
              PodSecurityConfiguration\n            defaults:\n              enforce:
              \"baseline\"\n              enforce-version: \"v1.28\"\n              audit:
              \"baseline\"\n              audit-version: \"v1.28\"\n              warn:
              \"restricted\"\n              warn-version: \"v1.28\"\n              audit:
              \"restricted\"\n              audit-version: \"v1.28\"\n            exemptions:\n              # Array of
              authenticated usernames to exempt.\n              usernames: []\n              # Array of runtime class
              names to exempt.\n              runtimeClasses: []\n              # Array of namespaces to
              exempt.\n              namespaces: [kube-system]\n\n  preKubeadmCommands:\n    # For enabling
              'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required\n    - 'echo \"====>
              Applying kernel parameters for Kubelet\"'\n    - 'sysctl -p
              /etc/sysctl.d/90-kubelet.conf'\n  #postKubeadmCommands:\n    #- 'echo \"List of post kubeadm commands to
              be executed\"'\n\n# Client configuration to add OIDC based authentication flags in
              kubeconfig\n#clientConfig:\n  #oidc-issuer-url: \"{{
              .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}\"\n  #oidc-client-id: \"{{
              .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}\"\n  #oidc-client-secret:
              1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv\n  #oidc-extra-scope: profile,email"
            uid: "659a47b28b7673a7dff73658"

          - name: "cni-calico"
            tag: "3.27.0"
            uid: "661cc4f20aa79b7543637fa9"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "pack:\n  content:\n    images:\n      - image:
              gcr.io/spectro-images-public/packs/calico/3.27.0/cni:v3.27.0\n      - image:
              gcr.io/spectro-images-public/packs/calico/3.27.0/node:v3.27.0\n      - image:
              gcr.io/spectro-images-public/packs/calico/3.27.0/kube-controllers:v3.27.0\n\nmanifests:\n  calico:\n    images:\n      cni:
              \"\"\n      node: \"\"\n      kubecontroller: \"\"\n    # IPAM type to use. Supported types are
              calico-ipam, host-local\n    ipamType: \"calico-ipam\"\n\n    calico_ipam:\n      assign_ipv4:
              true\n      assign_ipv6: false\n\n    # Should be one of CALICO_IPV4POOL_IPIP or
              CALICO_IPV4POOL_VXLAN  \n    encapsulationType: \"CALICO_IPV4POOL_IPIP\"\n\n    # Should be one of Always,
              CrossSubnet, Never\n    encapsulationMode: \"Always\"\n\n    env:\n      # Additional env variables for
              calico-node\n      calicoNode:\n        #IPV6: \"autodetect\"\n        #FELIX_IPV6SUPPORT:
              \"true\"\n        #CALICO_IPV6POOL_NAT_OUTGOING: \"true\"\n        #CALICO_IPV4POOL_CIDR:
              \"192.168.0.0/16\"\n        #IP_AUTODETECTION_METHOD: \"first-found\"\n\n      # Additional env variables
              for calico-kube-controller deployment\n      calicoKubeControllers:\n        #LOG_LEVEL:
              \"info\"\n        #SYNC_NODE_LABELS: \"true\""

          - name: "csi-gcp-driver"
            tag: "1.12.4"
            uid: "661cc4f80aa79b75d4440676"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "pack:\n  content:\n    images:\n      - image:
              gcr.io/spectro-images-public/packs/csi-gcp-driver/1.12.4/csi-provisioner:v3.6.2\n      - image:
              gcr.io/spectro-images-public/packs/csi-gcp-driver/1.12.4/csi-attacher:v4.4.2\n      - image:
              gcr.io/spectro-images-public/packs/csi-gcp-driver/1.12.4/csi-resizer:v1.9.2\n      - image:
              gcr.io/spectro-images-public/packs/csi-gcp-driver/1.12.4/csi-snapshotter:v6.3.2\n      - image:
              gcr.io/spectro-images-public/packs/csi-gcp-driver/1.12.4/gcp-compute-persistent-disk-csi-driver:v1.12.4\n      -
              image:
              gcr.io/spectro-images-public/packs/csi-gcp-driver/1.12.4/csi-node-driver-registrar:v2.9.2\n    \nmanifests:\n  storageclass:\n    #Flag
              to denote if this should be the default storage class for dynamic provisioning\n    isDefaultClass:
              \"true\"\n\n    parameters:\n      #Possible values : pd-standard or pd-ssd\n      type:
              \"pd-standard\"\n      \n      #Possible values: none or regional-pd\n      replication-type:
              \"none\"\n          \n    #Supported binding modes are Immediate,
              WaitForFirstConsumer\n    volumeBindingMode: \"WaitForFirstConsumer\"\n\n    #Set this flag to true to
              enable volume expansion\n    allowVolumeExpansion: true\n\n    #Allowed reclaim policies are Delete,
              Retain\n    reclaimPolicy: \"Delete\"\n\n    #allowedTopologies\n    zones:\n      #-
              us-central1-a\n      #- us-central1-b\n\n    k8sVersion: \"{{ .spectro.system.kubernetes.version
              }}\"\n\n  controller:\n    args:\n      csiProvisioner:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--feature-gates=Topology=true\"\n        -
              \"--http-endpoint=:22011\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--timeout=250s\"\n        - \"--extra-create-metadata\"\n        #-
              \"--run-controller-service=false\"  # disable the controller service of the CSI driver\n        #-
              \"--run-node-service=false\"        # disable the node service of the CSI driver\n        -
              \"--leader-election\"\n        - \"--default-fstype=ext4\"\n        -
              \"--controller-publish-readonly=true\"\n              \n      csiAttacher:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--http-endpoint=:22012\"\n        -
              \"--leader-election\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--timeout=250s\"\n\n      csiResizer:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--http-endpoint=:22013\"\n        -
              \"--leader-election\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--handle-volume-inuse-error=false\"\n\n      csiSnapshotter:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--metrics-address=:22014\"\n        -
              \"--leader-election\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--timeout=300s\"\n\n      csiDriver:\n        - \"--v=5\"\n        - \"--endpoint=unix:/csi/csi.sock\""

      providerConfigRef:
        name: default
    ```

    The cluster profile contains the following core infrastructure layers.

    | **Pack Type** | **Registry** | **Pack Name**    | **Pack Version** |
    | ------------- | ------------ | ---------------- | ---------------- |
    | OS            | Public Repo  | `ubuntu-gcp`     | `22.04`          |
    | Kubernetes    | Public Repo  | `kubernetes`     | `1.28.3`         |
    | Network       | Public Repo  | `cni-calico`     | `3.27.0`         |
    | Storage       | Public Repo  | `csi-gcp-driver` | `1.12.4`         |

    :::tip

    If you want to use different packs in your cluster profile, you can access the Palette UI and simulate creating a
    cluster profile to gather the packs' required values. During the cluster profile creation, click the API button to
    display the API payload. You will find the values of each pack's `name`, `tag`, `uid`, `registryUid`, and `values`
    parameters.

    :::

16. Create the cluster profile.

    ```bash
    kubectl apply --filename crossplane-gcp/cluster-profile-gcp.yaml
    ```

17. Issue the commands below to get the ID of the cluster profile once its creation is complete.

    ```bash
    kubectl wait --for=condition=Ready profile.cluster.palette.crossplane.io/gcp-crossplane-cluster-profile
    clusterProfileId=$(kubectl get profile.cluster.palette.crossplane.io gcp-crossplane-cluster-profile --output jsonpath='{.status.atProvider.id}')
    echo Cluster Profile ID: $clusterProfileId
    ```

    ```text hideClipboard
    profile.cluster.palette.crossplane.io/gcp-crossplane-cluster-profile condition met
    Cluster Profile ID: 6638e0eb8f42b00cb4d1d22bb
    ```

18. Next, get the ID of your GCP cloud account registered in Palette by invoking the `cloudaccounts` Palette API.
    Replace `<your-api-key>` with your Palette API key and `<gcp-account-name>` with the name under which you registered
    your GCP account in Palette.

    ```bash
    curl --location --request GET 'https://api.spectrocloud.com/v1/cloudaccounts/gcp' \
    -H 'Accept: application/json' \
    -H 'ApiKey: <your-api-key>' | jq '.items[] | select(.metadata.name == "<gcp-account-name>") | .metadata.uid'
    ```

    ```text hideClipboard
    "645981f0ab3ab8105fabc982"
    ```

    Copy the API response containing your GCP cloud account ID.

19. Create a file to store the GCP IaaS cluster configuration.

    ```bash
    vi crossplane-gcp/cluster-gcp.yaml
    ```

20. Paste the cluster configuration displayed below into the text editor window that opens:

    - Replace `<project-name>` with the name of your GCP project.
    - Replace `<cluster-profile-id>` and `<cloud-account-id>` with the IDs obtained in steps **17** and **18** of this
      guide.

    Optionally, you can edit the region, availability zone, instance type, and number of nodes of your cluster according
    to your workload.

    Once you are done making the alterations, save and exit the file.

    ```yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: GCP
    metadata:
      name: gcp-crossplane-cluster
      namespace: crossplane-system
    spec:
      forProvider:
        cloudConfig:
          - project: "<project-name>"
            region: "us-east1"
        machinePool:
          - azs:
              - us-east1-b
            count: 2
            instanceType: n1-standard-4
            name: machinepool1
          - azs:
              - us-east1-b
            count: 1
            instanceType: n1-standard-4
            name: controlplanepool
            controlPlane: true
        clusterProfile:
          - id: <cluster-profile-id>
        cloudAccountId: <cloud-account-id>
      providerConfigRef:
        name: default
    ```

21. Create the GCP IaaS cluster.

    ```bash
    kubectl apply --filename crossplane-gcp/cluster-gcp.yaml
    ```

22. Wait for the cluster to be created. The cluster provisioning might take up to 20 minutes.

    ```bash
    kubectl wait --for=condition=Ready gcp.cluster.palette.crossplane.io/gcp-crossplane-cluster --timeout=1h
    ```

    Once ready, you should receive an output similar to the following.

    ```text hideClipboard
    gcp.cluster.palette.crossplane.io/gcp-crossplane-cluster condition met
    ```

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Clusters**.

3. Verify the deployed cluster named `gcp-crossplane-cluster` is displayed and has the **Running** and **Healthy**
   status.
