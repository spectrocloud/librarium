---
sidebar_label: "Deploy an Azure IaaS Cluster with Crossplane"
title: "Deploy an Azure IaaS Cluster with Crossplane"
description: "Learn how to deploy an Azure IaaS cluster using the Spectro Cloud Crossplane provider."
hide_table_of_contents: false
sidebar_position: 30
tags: ["crossplane", "azure", "iac", "infrastructure as code"]
---

Palette supports using [Crossplane](https://www.crossplane.io) to create and manage Kubernetes
[host clusters](../../glossary-all.md#host-cluster) across major infrastructure providers. This section guides you on
how to use Crossplane to deploy a Palette-managed Kubernetes cluster in Azure.

## Prerequisites

- A [Palette](https://www.spectrocloud.com/get-started) account and API key. Refer to the
  [Create API Key](../../user-management/authentication/api-key/create-api-key.md) page for instructions on creating an
  API key.
- A public [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account) cloud account with the
  required [permissions](../../clusters/public-cloud/azure/required-permissions.md).
- An SSH key pair available. Check out the
  [Create and Upload an SSH Key](../../clusters/cluster-management/ssh/ssh-keys.md) page for guidance.
- The Azure account must be registered in Palette. Follow the
  [Register and Manage Azure Cloud Account](../../clusters/public-cloud/azure/azure-cloud.md) guide to register your
  account in Palette.
- A Kubernetes cluster with at least 2 GB of RAM. This guide uses a [kind](https://kind.sigs.k8s.io) cluster as an
  example. Refer to the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) guide to learn how to install kind
  and create a cluster.
- The following software must be installed on your host:
  - [curl](https://curl.se/docs/install.html)
  - [jq](https://jqlang.github.io/jq/download/)
  - [Helm](https://helm.sh/docs/intro/install/) version v3.2.0 or later
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - A text editor such as Vi or [Nano](https://www.nano-editor.org). This guide uses Vi as an example.

## Deploy an Azure IaaS Cluster with Crossplane

1.  Open a terminal session and set the kubectl context to your cluster. Replace `<cluster-name>` with the name of your
    cluster.

    ```bash
    kubectl cluster-info --context <cluster-name>
    ```

    ```text hideClipboard title="Example output"
    Kubernetes control plane is running at https://127.0.0.1:65306
    CoreDNS is running at https://127.0.0.1:65306/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

2.  Next, add the Crossplane Helm chart.

    ```bash
    helm repo add \
    crossplane-stable https://charts.crossplane.io/stable
    helm repo update
    ```

    ```text hideClipboard title="Example output"
    "crossplane-stable" has been added to your repositories
    Hang tight while we grab the latest from your chart repositories...
    ...Successfully got an update from the "ingress-nginx" chart repository
    ...Successfully got an update from the "crossplane-stable" chart repository
    Update Complete. ⎈Happy Helming!⎈
    ```

3.  Install the Crossplane components using the `helm install` command.

    ```bash
    helm install crossplane \
    crossplane-stable/crossplane \
    --namespace crossplane-system \
    --create-namespace
    ```

    ```bash hideClipboard title="Example output"
    NAME: crossplane
    LAST DEPLOYED: Fri Aug  8 08:27:46 2025
    NAMESPACE: crossplane-system
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    Release: crossplane

    Chart Name: crossplane
    Chart Description: Crossplane is an open source Kubernetes add-on that enables platform teams to assemble infrastructure from multiple vendors, and expose higher level self-service APIs for application teams to consume.
    Chart Version: 1.20.0
    Chart Application Version: 1.20.0

    Kube Version: v1.33.1
    ```

    Verify the installation with the `kubectl get pods` command. The output must contain two Crossplane pods with a
    `Running` status.

    ```bash
    kubectl get pods --namespace crossplane-system
    ```

    ```text hideClipboard title="Example output"
    NAME                                     READY   STATUS    RESTARTS   AGE
    crossplane-869d89c8f8-7jc6c              1/1     Running   0          20s
    crossplane-rbac-manager-784b496b-8mr6z   1/1     Running   0          20s
    ```

4.  Once Crossplane is installed, create a folder to store the Kubernetes configuration files.

    ```bash
    mkdir crossplane-azure
    ```

5.  Fetch the latest version of the Palette Crossplane provider. Alternatively, identify your desired version from the
    [Upbound Marketplace](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) and set the
    value manually.

    ```bash
    PALETTE_CROSSPLANE_PROVIDER_VERSION=$(curl -s https://api.github.com/repos/crossplane-contrib/provider-palette/releases/latest | jq -r .tag_name)
    echo Palette Crossplane Provider Version: $PALETTE_CROSSPLANE_PROVIDER_VERSION
    ```

6.  Create the following Kubernetes configuration for the Palette Crossplane provider.

    ```bash
    cat << EOF > crossplane-azure/provider-palette.yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-palette
    spec:
      package: xpkg.upbound.io/crossplane-contrib/provider-palette:$PALETTE_CROSSPLANE_PROVIDER_VERSION
    EOF
    ```

    Verify that the file was created and populated with the expected Palette Crossplane provider version.

    ```bash
    cat crossplane-azure/provider-palette.yaml
    ```

    ```yaml hideClipboard title="Example output" {6}
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-palette
    spec:
      package: xpkg.upbound.io/crossplane-contrib/provider-palette:v0.24.0
    ```

7.  Issue the command below to install the Palette Crossplane provider. Crossplane installs the CRDs that allow you to
    create Palette resources directly inside Kubernetes.

    ```bash
    kubectl apply --filename crossplane-azure/provider-palette.yaml
    ```

    ```bash hideClipboard title="Example output"
    provider.pkg.crossplane.io/provider-palette created
    ```

    Check the installation with the `kubectl get providers` command.

    ```bash
    kubectl get providers
    ```

    ```text hideClipboard title="Example output"
    NAME               INSTALLED   HEALTHY   PACKAGE                                                       AGE
    provider-palette   True        True      xpkg.upbound.io/crossplane-contrib/provider-palette:v0.24.0   40s
    ```

8.  Set the following variables for your Palette environment. Replace `<palette-api-key>` with your Palette API key,
    `<palette-project-name>` with the name of the Palette project you are deploying your cluster in, and
    `<palette-endpoint>` with the endpoint of your Palette environment.

    ```bash
    PALETTE_API_KEY=<palette-api-key>
    PALETTE_PROJECT_NAME=<palette-project-name>
    PALETTE_HOST=<palette-endpoint>
    ```

9.  Create a file to store the Kubernetes Secret containing your Palette API key and environment details. The Palette
    provider requires credentials to create and manage resources.

    ```bash
    cat << EOF > crossplane-azure/secret-azure.yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: palette-creds
      namespace: crossplane-system
    type: Opaque
    stringData:
      credentials: |
        {
        "api_key": "$PALETTE_API_KEY",
        "project_name": "$PALETTE_PROJECT_NAME",
        "host": "$PALETTE_HOST"
        }
    EOF
    ```

    Verify that the file was created and populated with the expected API key and environment values.

    ```bash
    cat crossplane-azure/secret-azure.yaml
    ```

    ```yaml hideClipboard title="Example output" {10-12}
    apiVersion: v1
    kind: Secret
    metadata:
      name: palette-creds
      namespace: crossplane-system
    type: Opaque
    stringData:
      credentials: |
      {
      "api_key": "**************",
      "project_name": "Default",
      "host": "console.spectrocloud.com"
      }
    ```

10. Create the Kubernetes Secret.

    ```bash
    kubectl apply --filename crossplane-azure/secret-azure.yaml
    ```

    ```bash hideClipboard title="Example output"
    secret/palette-creds created
    ```

11. Create a file to store the `ProviderConfig` object. This object configures the Palette Crossplane provider with the
    Secret containing the Palette API key.

    ```bash
    cat << EOF > crossplane-azure/providerconfig-azure.yaml
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
    EOF
    ```

12. Create the Kubernetes `ProviderConfig` object.

    ```bash
    kubectl apply --filename crossplane-azure/providerconfig-azure.yaml
    ```

    ```bash hideClipboard title="Example output"
    providerconfig.palette.crossplane.io/default created
    ```

13. Once the Palette Crossplane provider is installed and set up, create a file to store the Azure
    [cluster profile](../../profiles/cluster-profiles/cluster-profiles.md) configuration.

    :::warning

    We recommend creating the cluster profile file first and directly pasting the contents into the file. Redirecting
    cluster profile configurations from the terminal into the file can misinterpret escape characters, resulting in an
    invalid file.

    :::

    ```bash
    vi crossplane-azure/cluster-profile-azure.yaml
    ```

14. Paste the Kubernetes configuration below into the text editor window that opens. Save the file and exit.

    ```yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Profile
    metadata:
      name: azure-crossplane-cluster-profile
      namespace: crossplane-system
    spec:
      forProvider:
        cloud: "azure"
        description: "Azure Crossplane cluster profile"
        name: "azure-crossplane-cluster-profile"
        type: "cluster"
        pack:
          - name: "ubuntu-azure"
            tag: "22.04"
            uid: "63fdd137199bafb6b290c674"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "# Spectro Golden images includes most of the hardening as per CIS Ubuntu Linux 22.04 LTS Server L1 v1.0.0
              standards\n# Uncomment below section to\n# 1. Include custom files to be copied over to the nodes
              and/or\n# 2. Execute list of commands before or after kubeadm init/join is
              executed\n#\n#kubeadmconfig:\n#  preKubeadmCommands:\n#  - echo \"Executing pre kube admin config
              commands\"\n#  - update-ca-certificates\n#  - 'systemctl restart containerd; sleep 3'\n#  - 'while [ ! -S
              /var/run/containerd/containerd.sock ]; do echo \"Waiting for containerd...\"; sleep 1;
              done'\n#  postKubeadmCommands:\n#  - echo \"Executing post kube admin config commands\"\n#  files:\n#  -
              targetPath: /usr/local/share/ca-certificates/mycom.crt\n#    targetOwner:
              \"root:root\"\n#    targetPermissions: \"0644\"\n#    content: |\n#      -----BEGIN
              CERTIFICATE-----\n#      MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl\n#      cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE\n#      AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA\n#      nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz\n#      qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN\n#      fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2\n#      7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL\n#      9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK\n#      jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB\n#      /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki\n#      HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y\n#      g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ\n#      ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6\n#      b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56\n#      IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=\n#      -----END
              CERTIFICATE-----"

          - name: "kubernetes"
            tag: "1.32.4"
            uid: "687bbdf5511462f044b2c727"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "# spectrocloud.com/enabled-presets: Kube Controller Manager:loopback-ctrlmgr,Kube
              Scheduler:loopback-scheduler,Azure Disk Encryption
              Set:disable-azure-disk-encryption\npack:\n  content:\n    images:\n      - image:
              registry.k8s.io/coredns/coredns:v1.11.3\n      - image: registry.k8s.io/etcd:3.5.16-0\n      - image:
              registry.k8s.io/kube-apiserver:v1.32.4\n      - image:
              registry.k8s.io/kube-controller-manager:v1.32.4\n      - image:
              registry.k8s.io/kube-proxy:v1.32.4\n      - image: registry.k8s.io/kube-scheduler:v1.32.4\n      - image:
              registry.k8s.io/pause:3.9\n      - image: registry.k8s.io/pause:3.8\n  #CIDR Range for Pods in
              cluster\n  # Note : This must not overlap with any of the host or service network\n  podCIDR:
              \"192.168.0.0/16\"\n  #CIDR notation IP range from which to assign service cluster IPs\n  # Note : This
              must not overlap with any IP ranges assigned to nodes for pods.\n  serviceClusterIpRange:
              \"10.96.0.0/12\"\n  # serviceDomain:
              \"cluster.local\"\n\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      # Note : secure-port flag is used
              during kubeadm init. Do not change this flag on a running cluster\n      secure-port:
              \"6443\"\n      anonymous-auth: \"true\"\n      profiling: \"false\"\n      disable-admission-plugins:
              \"AlwaysAdmit\"\n      default-not-ready-toleration-seconds:
              \"60\"\n      default-unreachable-toleration-seconds: \"60\"\n      enable-admission-plugins:
              \"AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity\"\n      admission-control-config-file:
              \"/etc/kubernetes/pod-security-standard.yaml\"\n      audit-log-path:
              /var/log/apiserver/audit.log\n      audit-policy-file:
              /etc/kubernetes/audit-policy.yaml\n      audit-log-maxage: \"30\"\n      audit-log-maxbackup:
              \"10\"\n      audit-log-maxsize: \"100\"\n      authorization-mode:
              RBAC,Node\n      kubelet-certificate-authority: \"/etc/kubernetes/pki/ca.crt\"\n      tls-cipher-suites:
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
              \"false\"\n  kubeletExtraArgs:\n    read-only-port: \"0\"\n    event-qps: \"0\"\n    feature-gates:
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
              \"baseline\"\n              enforce-version: \"v1.32\"\n              audit:
              \"baseline\"\n              audit-version: \"v1.32\"\n              warn:
              \"restricted\"\n              warn-version: \"v1.32\"\n            exemptions:\n              # Array of
              authenticated usernames to exempt.\n              usernames: []\n              # Array of runtime class
              names to exempt.\n              runtimeClasses: []\n              # Array of namespaces to
              exempt.\n              namespaces: [kube-system]\n\n  preKubeadmCommands:\n    # For enabling
              'protect-kernel-defaults' flag to kubelet, kernel parameters changes are required\n    - 'echo \"====>
              Applying kernel parameters for Kubelet\"'\n    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'\n    - 'test -f
              /etc/containerd/ca.crt && cp /etc/containerd/ca.crt /usr/local/share/ca-certificates/container.crt &&
              update-ca-certificates && systemctl restart
              containerd'\n  #postKubeadmCommands:\n\n  postKubeadmCommands:\n    - 'chmod 600
              /var/lib/kubelet/config.yaml'\n    # - 'echo \"List of post kubeadm commands to be executed\"'\n\n# Client
              configuration to add OIDC based authentication flags in kubeconfig\n#clientConfig:\n  #oidc-issuer-url:
              \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}\"\n  #oidc-client-id:
              \"{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id
              }}\"\n  #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv\n  #oidc-extra-scope:
              profile,email"

          - name: "cni-calico-azure"
            tag: "3.30.1"
            uid: "687bbdd0511462ef3f7b016c"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "pack:\n  content:\n    images:\n      - image:
              us-docker.pkg.dev/palette-images/packs/calico/3.30.1/cni:v3.30.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/calico/3.30.1/node:v3.30.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/calico/3.30.1/kube-controllers:v3.30.1\n\nmanifests:\n  calico:\n    images:\n      cni:
              \"\"\n      node: \"\"\n      kubecontroller: \"\"\n    # IPAM type to use. Supported types are
              calico-ipam, host-local\n    ipamType: \"calico-ipam\"\n\n    calico_ipam:\n      assign_ipv4:
              true\n      assign_ipv6: false\n\n    # Should be one of CALICO_IPV4POOL_IPIP or
              CALICO_IPV4POOL_VXLAN  \n    encapsulationType: \"CALICO_IPV4POOL_VXLAN\"\n\n    # Should be one of
              Always, CrossSubnet, Never\n    encapsulationMode: \"Always\"\n\n    env:\n      # Additional env
              variables for calico-node\n      calicoNode:\n        #IPV6: \"autodetect\"\n        #FELIX_IPV6SUPPORT:
              \"true\"\n        #CALICO_IPV6POOL_NAT_OUTGOING: \"true\"\n        #CALICO_IPV4POOL_CIDR:
              \"192.168.0.0/16\"\n        #IP_AUTODETECTION_METHOD: \"first-found\"\n\n      # Additional env variables
              for calico-kube-controller deployment\n      calicoKubeControllers:\n        #LOG_LEVEL:
              \"info\"\n        #SYNC_NODE_LABELS: \"true\""

          - name: "csi-azure"
            tag: "1.32.0"
            uid: "6803e5e4d7d1020ea3d6b3ed"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "pack:\n  content:\n    images:\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/azuredisk-csi:v1.32.0\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/csi-provisioner:v5.2.0\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/csi-attacher:v4.8.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/csi-resizer:v1.13.2\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/livenessprobe:v2.15.0\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/csi-node-driver-registrar:v2.13.0\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/csi-snapshotter:v8.2.0\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-azure/1.32.0/snapshot-controller:v8.2.0\n    charts:\n      -
              repo: https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/charts\n        name:
              azuredisk-csi-driver\n        version: 1.32.0\n  namespace:
              \"kube-system\"\ncharts:\n  azuredisk-csi-driver:\n    storageclass:\n      # Azure storage account Sku
              tier. Default is empty\n      storageaccounttype: \"StandardSSD_LRS\"\n      # Possible values are shared
              (default), dedicated, and managed\n      kind: \"managed\"\n      #Allowed reclaim policies are Delete,
              Retain\n      reclaimPolicy: \"Delete\"\n      #Toggle for Volume expansion\n      allowVolumeExpansion:
              \"true\"\n      #Toggle for Default class\n      isDefaultClass: \"true\"\n      #Supported binding modes
              are Immediate, WaitForFirstConsumer\n      #Setting binding mode to WaitForFirstConsumer, so that the
              volumes gets created in the same AZ as that of the pods\n      volumeBindingMode:
              \"WaitForFirstConsumer\"\n    image:\n      baseRepo:
              us-docker.pkg.dev\n      azuredisk:\n        repository:
              /palette-images/packs/csi-azure/1.32.0/azuredisk-csi\n        tag: v1.32.0\n        pullPolicy:
              IfNotPresent\n      csiProvisioner:\n        repository:
              /palette-images/packs/csi-azure/1.32.0/csi-provisioner\n        tag: v5.2.0\n        pullPolicy:
              IfNotPresent\n      csiAttacher:\n        repository:
              /palette-images/packs/csi-azure/1.32.0/csi-attacher\n        tag: v4.8.1\n        pullPolicy:
              IfNotPresent\n      csiResizer:\n        repository:
              /palette-images/packs/csi-azure/1.32.0/csi-resizer\n        tag: v1.13.2\n        pullPolicy:
              IfNotPresent\n      livenessProbe:\n        repository:
              /palette-images/packs/csi-azure/1.32.0/livenessprobe\n        tag: v2.15.0\n        pullPolicy:
              IfNotPresent\n      nodeDriverRegistrar:\n        repository:
              /palette-images/packs/csi-azure/1.32.0/csi-node-driver-registrar\n        tag:
              v2.13.0\n        pullPolicy: IfNotPresent\n    serviceAccount:\n      create: true # When true, service
              accounts will be created for you. Set to false if you want to use your own.\n      controller:
              csi-azuredisk-controller-sa # Name of Service Account to be created or used\n      node:
              csi-azuredisk-node-sa # Name of Service Account to be created or used\n      snapshotController:
              csi-snapshot-controller-sa # Name of Service Account to be created or used\n    rbac:\n      create:
              true\n      name: azuredisk\n    controller:\n      name:
              csi-azuredisk-controller\n      cloudConfigSecretName:
              azure-cloud-provider\n      cloudConfigSecretNamespace: kube-system\n      allowEmptyCloudConfig:
              false\n      enableTrafficManager: false\n      trafficManagerPort: 7788\n      replicas:
              2\n      metricsPort: 29604\n      livenessProbe:\n        healthPort: 29602\n      runOnMaster:
              false\n      runOnControlPlane: false\n      disableAvailabilitySetNodes: false\n      vmType:
              \"\"\n      provisionerWorkerThreads: 100\n      attacherWorkerThreads: 1000\n      vmssCacheTTLInSeconds:
              -1\n      logLevel: 5\n      extraArgs: []\n      otelTracing:\n        enabled:
              false\n        otelServiceName: csi-azuredisk-controller\n        otelExporterEndpoint:
              \"http://localhost:4317\"\n      tolerations:\n        - key:
              \"node-role.kubernetes.io/master\"\n          operator: \"Exists\"\n          effect:
              \"NoSchedule\"\n        - key: \"node-role.kubernetes.io/controlplane\"\n          operator:
              \"Exists\"\n          effect: \"NoSchedule\"\n        - key:
              \"node-role.kubernetes.io/control-plane\"\n          operator: \"Exists\"\n          effect:
              \"NoSchedule\"\n        - key: \"CriticalAddonsOnly\"\n          operator: \"Exists\"\n          effect:
              \"NoSchedule\"\n      hostNetwork: true # this setting could be disabled if controller does not depend on
              MSI setting\n      labels: {}\n      annotations: {}\n      podLabels: {}\n      podAnnotations:
              {}\n      nodeSelector: {}\n      affinity:
              {}\n      resources:\n        csiProvisioner:\n          limits:\n            memory:
              500Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        csiAttacher:\n          limits:\n            memory:
              500Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        csiResizer:\n          limits:\n            memory:
              500Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        csiSnapshotter:\n          limits:\n            memory:
              400Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        livenessProbe:\n          limits:\n            memory:
              100Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        azuredisk:\n          limits:\n            memory:
              500Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n    node:\n      cloudConfigSecretName: azure-cloud-provider\n      cloudConfigSecretNamespace:
              kube-system\n      # reserved data disk slot number per node, driver.volumeAttachLimit must be <
              0\n      reservedDataDiskSlotNum: 0\n      supportZone: true\n      allowEmptyCloudConfig:
              true\n      getNodeIDFromIMDS: false\n      maxUnavailable: 1\n      logLevel:
              5\n      livenessProbe:\n        healthPort: 29603\n    snapshot:\n      enabled: false\n      name:
              csi-snapshot-controller\n      image:\n        csiSnapshotter:\n          repository:
              /palette-images/packs/csi-azure/1.32.0/csi-snapshotter\n          tag: v8.2.0\n          pullPolicy:
              IfNotPresent\n        csiSnapshotController:\n          repository:
              /palette-images/packs/csi-azure/1.32.0/snapshot-controller\n          tag: v8.2.0\n          pullPolicy:
              IfNotPresent\n      snapshotController:\n        name: csi-snapshot-controller\n        replicas:
              2\n        labels: {}\n        annotations: {}\n        podLabels: {}\n        podAnnotations:
              {}\n        resources:\n          limits:\n            memory:
              500Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n      VolumeSnapshotClass:\n        enabled: false\n        name:
              csi-azuredisk-vsc\n        deletionPolicy: Delete\n        parameters:\n          incremental: '\"true\"'
              # available values: \"true\", \"false\" (\"true\" by default for Azure Public Cloud, and \"false\" by
              default for Azure Stack Cloud)\n          resourceGroup: \"\" # available values: EXISTING RESOURCE GROUP
              (If not specified, snapshot will be stored in the same resource group as source Azure
              disk)\n          tags: \"\" # tag format: 'key1=val1,key2=val2'\n        additionalLabels:
              {}\n    feature:\n      enableFSGroupPolicy: true\n    driver:\n      name: disk.csi.azure.com\n      #
              maximum number of attachable volumes per node,\n      # maximum number is defined according to node
              instance type by default(-1)\n      volumeAttachLimit: -1\n      customUserAgent:
              \"\"\n      userAgentSuffix: \"OSS-helm\"\n      azureGoSDKLogLevel: \"\" # available values: \"\"(no
              logs), DEBUG, INFO, WARNING, ERROR\n      httpsProxy: \"\"\n      httpProxy: \"\"\n      noProxy:
              \"\"\n    linux:\n      enabled: true\n      dsName: csi-azuredisk-node # daemonset name\n      kubelet:
              /var/lib/kubelet\n      distro: debian # available values: debian, fedora\n      enablePerfOptimization:
              true\n      otelTracing:\n        enabled: false\n        otelServiceName:
              csi-azuredisk-node\n        otelExporterEndpoint: \"http://localhost:4317\"\n      tolerations:\n        -
              operator: \"Exists\"\n      hostNetwork: true # this setting could be disabled if perfProfile is
              `none`\n      getNodeInfoFromLabels: false # get node info from node labels instead of IMDS\n      labels:
              {}\n      annotations: {}\n      podLabels: {}\n      podAnnotations: {}\n      nodeSelector:
              {}\n      affinity:
              {}\n      nodeAffinity:\n        requiredDuringSchedulingIgnoredDuringExecution:\n          nodeSelectorTerms:\n            -
              matchExpressions:\n                - key: type\n                  operator:
              NotIn\n                  values:\n                    -
              virtual-kubelet\n      resources:\n        livenessProbe:\n          limits:\n            memory:
              100Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        nodeDriverRegistrar:\n          limits:\n            memory:
              100Mi\n          requests:\n            cpu: 10m\n            memory:
              20Mi\n        azuredisk:\n          limits:\n            memory:
              1000Mi\n          requests:\n            cpu: 10m\n            memory: 20Mi\n    windows:\n      enabled:
              true\n      useHostProcessContainers: true\n      dsName: csi-azuredisk-node-win # daemonset
              name\n      kubelet: 'C:\\var\\lib\\kubelet'\n      getNodeInfoFromLabels: false # get node info from node
              labels instead of IMDS\n      enableRegistrationProbe: true\n      otelTracing:\n        enabled:
              false\n        otelServiceName: csi-azuredisk-node-win\n        otelExporterEndpoint:
              \"http://localhost:4317\"\n      tolerations:\n        - key:
              \"node.kubernetes.io/os\"\n          operator: \"Exists\"\n          effect: \"NoSchedule\"\n      labels:
              {}\n      annotations: {}\n      podLabels: {}\n      podAnnotations: {}\n      nodeSelector:
              {}\n      affinity:
              {}\n      nodeAffinity:\n        requiredDuringSchedulingIgnoredDuringExecution:\n          nodeSelectorTerms:\n            -
              matchExpressions:\n                - key: type\n                  operator:
              NotIn\n                  values:\n                    -
              virtual-kubelet\n      resources:\n        livenessProbe:\n          limits:\n            memory:
              150Mi\n          requests:\n            cpu: 10m\n            memory:
              40Mi\n        nodeDriverRegistrar:\n          limits:\n            memory:
              150Mi\n          requests:\n            cpu: 30m\n            memory:
              40Mi\n        azuredisk:\n          limits:\n            memory:
              1000Mi\n          requests:\n            cpu: 10m\n            memory: 40Mi\n    cloud:
              AzurePublicCloud\n    ## Reference to one or more secrets to be used when pulling images\n    ## ref:
              https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/\n    ##\n    imagePullSecrets:
              []\n    # - name: \"image-pull-secret\"\n\n    workloadIdentity:\n      clientID: \"\"\n      # [optional]
              If the AAD application or user-assigned managed identity is not in the same tenant as the cluster\n      #
              then set tenantID with the application or user-assigned managed identity tenant ID\n      tenantID:
              \"\"\n    azureCredentialFileConfigMap: azure-cred-file"

      providerConfigRef:
        name: default
    ```

    The cluster profile contains the following core infrastructure layers.

    | **Pack Type** | **Registry** | **Pack Name**      | **Pack Version** |
    | ------------- | ------------ | ------------------ | ---------------- |
    | OS            | Public Repo  | `ubuntu-azure`     | `22.04`          |
    | Kubernetes    | Public Repo  | `kubernetes`       | `1.32.4`         |
    | Network       | Public Repo  | `cni-calico-azure` | `3.30.1`         |
    | Storage       | Public Repo  | `csi-azure`        | `1.32.0`         |

    :::tip

    If you want to use different packs in your cluster profile, use the Palette UI to simulate creating a cluster
    profile to gather the pack's required values. During the cluster profile creation, select the **API** button in the
    top-right to display the API payload. Replace the values of each pack's `name`, `tag`, `uid`, `registryUid`, and
    `values` as necessary. For information on creating cliuster profiles, refer to our
    [Create Cluster Profiles](../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide.

    :::

15. Create the cluster profile in Palette.

    ```bash
    kubectl apply --filename crossplane-azure/cluster-profile-azure.yaml
    ```

    ```bash hideClipboard title="Example output"
    profile.cluster.palette.crossplane.io/azure-crossplane-cluster-profile created
    ```

16. Issue the commands below to get the ID of the cluster profile once it is created and save it as a variable.

    ```bash
    kubectl wait --for=condition=Ready profile.cluster.palette.crossplane.io/azure-crossplane-cluster-profile
    CLUSTER_PROFILE_ID=$(kubectl get profile.cluster.palette.crossplane.io azure-crossplane-cluster-profile --output jsonpath='{.status.atProvider.id}')
    echo Cluster Profile ID: $CLUSTER_PROFILE_ID
    ```

    ```text hideClipboard title="Example output"
    profile.cluster.palette.crossplane.io/azure-crossplane-cluster-profile condition met
    Cluster Profile ID: 68960ddf222fa7f0046e80ed
    ```

17. Next, set your Palette Azure account name as a variable. Replace `<azure-account-name>` with the name under which
    you registered your Azure account in Palette. This is the display name that appears under **Cloud Accounts** in
    **Tenant Settings** or **Project Settings**, _not_ the actual name of your Azure account.

    ```bash
    PALETTE_AZURE_CLOUD_ACCOUNT_NAME=<azure-account-name>
    ```

    In the example below, the Palette Azure account name is `spectro-cloud-azure`.

    ![Azure account name in Palette](/automation_crossplane_deploy-cluster-azure-crossplane_azure-account-name-4-7.webp)

18. Next, fetch the ID of your Azure cloud account registered in Palette by invoking the `cloudaccounts` Palette API.

    ```bash
    AZURE_CLOUD_ACCOUNT_ID=$(curl --location --request GET 'https://api.spectrocloud.com/v1/cloudaccounts/azure' \
    -H 'Accept: application/json' \
    -H "ApiKey: $PALETTE_API_KEY" \
    | jq --arg name "$PALETTE_AZURE_CLOUD_ACCOUNT_NAME" '.items[] | select(.metadata.name == $name) | .metadata.uid' -r)
    echo Cloud Account ID: $AZURE_CLOUD_ACCOUNT_ID
    ```

19. Use the following command to create a file to store your Azure IaaS cluster configuration, replacing the following
    values:

    - `<public-ssh-key>` - The content of your Azure public SSH key.
    - `<resource-group-name>` - Your Azure resource group name.
    - `<azure-subscription-id>` - Your Azure subscription ID.

    Optionally, edit the region, availability zone, instance type, and number of cluster nodes according to your
    workload.

    ```bash {11,13-14}
    cat << EOF > crossplane-azure/cluster-azure.yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Azure
    metadata:
      name: azure-crossplane-cluster
      namespace: crossplane-system
    spec:
      forProvider:
        name: azure-crossplane-cluster
        cloudConfig:
          - sshKey: "<public-ssh-key>"
            region: "eastus"
            resourceGroup: "<resource-group-name>"
            subscriptionId: "<azure-subscription-id>"
        machinePool:
          - azs:
              - "1"
            count: 1
            instanceType: Standard_A8_v2
            name: machinepool1
          - azs:
              - "1"
            count: 1
            instanceType: Standard_A8_v2
            name: controlplanepool
            controlPlane: true
        clusterProfile:
          - id: $CLUSTER_PROFILE_ID
        cloudAccountId: $AZURE_CLOUD_ACCOUNT_ID
      providerConfigRef:
        name: default
    EOF
    ```

20. Create the Azure IaaS cluster.

    ```bash
    kubectl apply --filename crossplane-azure/cluster-azure.yaml
    ```

    ```bash hideClipboard title="Example output"
    azure.cluster.palette.crossplane.io/azure-crossplane-cluster created
    ```

21. Wait for the cluster to be created. Cluster provisioning may take up to 20 minutes.

    ```bash
    kubectl wait --for=condition=Ready azure.cluster.palette.crossplane.io/azure-crossplane-cluster --timeout=1h
    ```

    Once ready, you should receive output similar to the following.

    ```text hideClipboard title="Example output"
    azure.cluster.palette.crossplane.io/azure-crossplane-cluster condition met
    ```

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Verify the deployed cluster named `azure-crossplane-cluster` is displayed and has a **Cluster Status** of **Running**
   and a **Health** status of **Healthy**.
