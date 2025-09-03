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
  [Create API Key](../../user-management/authentication/api-key/create-api-key.md) page for instructions on creating an
  API key.
- A public [GCP](https://cloud.google.com/iam/docs/creating-managing-service-accounts) service account with the required
  [roles](../../clusters/public-cloud/gcp/add-gcp-accounts.md#prerequisites).
- An SSH key pair available. Check out the
  [Create and Upload an SSH Key](../../clusters/cluster-management/ssh/ssh-keys.md) page for guidance.
- The GCP account must be registered in Palette. Follow the
  [Register and Manage GCP Accounts](../../clusters/public-cloud/gcp/add-gcp-accounts.md) guide to register your account
  in Palette.
- A Kubernetes cluster with at least 2 GB of RAM. This guide uses a [kind](https://kind.sigs.k8s.io) cluster as an
  example. Refer to the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) guide to learn how to
  install kind and create a cluster.
- The following software must be installed on your host:
  - [curl](https://curl.se/docs/install.html)
  - [jq](https://jqlang.github.io/jq/download/)
  - [Helm](https://helm.sh/docs/intro/install/) version v3.2.0 or later
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - A text editor such as Vi or [Nano](https://www.nano-editor.org). This guide uses Vi as an example.

## Deploy a GCP IaaS Cluster with Crossplane

<PartialsComponent category="crossplane" name="install-crossplane" />

4.  Once Crossplane is installed, create a folder to store the Kubernetes configuration files.

    ```bash
    mkdir crossplane-gcp
    ```

5.  <PartialsComponent category="crossplane" name="palette-crossplane-provider-version" />

6.  Create the following Kubernetes configuration for the Palette Crossplane provider.

    ```bash
    cat << EOF > crossplane-gcp/provider-palette.yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-palette
    spec:
      package: crossplane-contrib/provider-palette:$PALETTE_CROSSPLANE_PROVIDER_VERSION
    EOF
    ```

    Verify that the file was created and populated with the expected Palette Crossplane provider version.

    ```bash
    cat crossplane-gcp/provider-palette.yaml
    ```

    <PartialsComponent category="crossplane" name="provider-palette-yaml" />

7.  Issue the command below to install the Palette Crossplane provider. Crossplane installs the CRDs that allow you to
    create Palette resources directly inside Kubernetes.

    ```bash
    kubectl apply --filename crossplane-gcp/provider-palette.yaml
    ```

    <PartialsComponent category="crossplane" name="provider-palette-created" />

8.  <PartialsComponent category="crossplane" name="palette-environment-variables" />

9.  Create a file to store the Kubernetes Secret containing your Palette API key and environment details. The Palette
    provider requires credentials to create and manage resources.

    ```bash
    cat << EOF > crossplane-gcp/secret-gcp.yaml
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
        "host": "$PALETTE_HOST",
        "ignore_insecure_tls_error": "true",
        "retry_attempts": "1",
        "trace": "true"
        }
    EOF
    ```

    Verify that the file was created and populated with the expected API key and environment values.

    ```bash
    cat crossplane-gcp/secret-gcp.yaml
    ```

    <PartialsComponent category="crossplane" name="secret-cloud-yaml" />

10. Create the Kubernetes secret.

    ```shell
    kubectl apply --filename crossplane-gcp/secret-gcp.yaml
    ```

    ```bash hideClipboard title="Example output"
    secret/palette-creds created
    ```

11. Create a file to store the `ProviderConfig` object. This object configures the Palette Crossplane provider with the
    Secret containing the Palette API key.

    ```bash
    cat << EOF > crossplane-gcp/providerconfig-gcp.yaml
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
    kubectl apply --filename crossplane-gcp/providerconfig-gcp.yaml
    ```

    ```bash hideClipboard title="Example output"
    providerconfig.palette.crossplane.io/default created
    ```

13. <PartialsComponent category="crossplane" name="cluster-profile-warning" />

    ```bash
    vi crossplane-gcp/cluster-profile-gcp.yaml
    ```

14. Paste the Kubernetes configuration below into the text editor window that opens. Save the file and exit.

    ```yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Profile
    metadata:
      name: gcp-crossplane-cluster-profile
      namespace: crossplane-system
    spec:
      forProvider:
        cloud: "gcp"
        description: "GCP Crossplane cluster profile"
        name: "gcp-crossplane-cluster-profile"
        type: "cluster"
        pack:
          - name: "ubuntu-gcp"
            tag: "22.04"
            uid: "63fdd138199bafb6b657b7e6"
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

          - name: "cni-calico"
            tag: "3.30.1"
            uid: "687bbdcf511462ef363aa0b4"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "# spectrocloud.com/enabled-presets: Microk8s:microk8s-false\npack:\n  content:\n    images:\n      -
              image: us-docker.pkg.dev/palette-images/packs/calico/3.30.1/cni:v3.30.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/calico/3.30.1/node:v3.30.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/calico/3.30.1/kube-controllers:v3.30.1\n\nmanifests:\n  calico:\n    microk8s:
              \"false\"\n    images:\n      cni: \"\"\n      node: \"\"\n      kubecontroller: \"\"\n    # IPAM type to
              use. Supported types are calico-ipam, host-local\n    ipamType:
              \"calico-ipam\"\n\n    calico_ipam:\n      assign_ipv4: true\n      assign_ipv6: false\n\n    # Should be
              one of CALICO_IPV4POOL_IPIP or CALICO_IPV4POOL_VXLAN  \n    encapsulationType:
              \"CALICO_IPV4POOL_IPIP\"\n\n    # Should be one of Always, CrossSubnet, Never\n    encapsulationMode:
              \"Always\"\n\n    env:\n      # Additional env variables for
              calico-node\n      calicoNode:\n        #IPV6: \"autodetect\"\n        #FELIX_IPV6SUPPORT:
              \"true\"\n        #CALICO_IPV6POOL_NAT_OUTGOING: \"true\"\n        #CALICO_IPV4POOL_CIDR:
              \"192.168.0.0/16\"\n        # For EKS cluster with static provisioning, set IP_AUTODETECTION_METHOD to
              \"interface=eth0\"\n        #IP_AUTODETECTION_METHOD: \"first-found\"\n\n      # Additional env variables
              for calico-kube-controller deployment\n      calicoKubeControllers:\n        #LOG_LEVEL:
              \"info\"\n        #SYNC_NODE_LABELS: \"true\""

          - name: "csi-gcp-driver"
            tag: "1.15.4"
            uid: "6803e5e5d7d1020ea8e438cb"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "pack:\n  content:\n    images:\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-gcp-driver/1.15.4/csi-provisioner:v5.2.0\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-gcp-driver/1.15.4/csi-attacher:v4.8.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-gcp-driver/1.15.4/csi-resizer:v1.13.2\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-gcp-driver/1.15.4/csi-snapshotter:v8.2.1\n      - image:
              us-docker.pkg.dev/palette-images/packs/csi-gcp-driver/1.15.4/gcp-compute-persistent-disk-csi-driver:v1.15.4\n      -
              image:
              us-docker.pkg.dev/palette-images/packs/csi-gcp-driver/1.15.4/csi-node-driver-registrar:v2.13.0\nmanifests:\n  storageclass:\n    #Flag
              to denote if this should be the default storage class for dynamic provisioning\n    isDefaultClass:
              \"true\"\n    parameters:\n      #Possible values : pd-standard or pd-ssd\n      type:
              \"pd-standard\"\n      #Possible values: none or regional-pd\n      replication-type:
              \"none\"\n    #Supported binding modes are Immediate, WaitForFirstConsumer\n    volumeBindingMode:
              \"WaitForFirstConsumer\"\n    #Set this flag to true to enable volume expansion\n    allowVolumeExpansion:
              true\n    #Allowed reclaim policies are Delete, Retain\n    reclaimPolicy:
              \"Delete\"\n    #allowedTopologies\n    zones:\n    #- us-central1-a\n    #-
              us-central1-b\n    k8sVersion: \"{{ .spectro.system.kubernetes.version
              }}\"\n  controller:\n    args:\n      csiProvisioner:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--feature-gates=Topology=true\"\n        -
              \"--http-endpoint=:22011\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--timeout=250s\"\n        - \"--extra-create-metadata\"\n        # -
              \"--run-controller-service=false\"  # disable the controller service of the CSI driver\n        # -
              \"--run-node-service=false\"        # disable the node service of the CSI driver\n        -
              \"--leader-election\"\n        - \"--default-fstype=ext4\"\n        -
              \"--controller-publish-readonly=true\"\n        -
              \"--feature-gates=VolumeAttributesClass=true\"\n      csiAttacher:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--http-endpoint=:22012\"\n        -
              \"--leader-election\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--timeout=250s\"\n      csiResizer:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--http-endpoint=:22013\"\n        -
              \"--leader-election\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--handle-volume-inuse-error=false\"\n        -
              \"--feature-gates=VolumeAttributesClass=true\"\n      csiSnapshotter:\n        - \"--v=5\"\n        -
              \"--csi-address=/csi/csi.sock\"\n        - \"--metrics-address=:22014\"\n        -
              \"--leader-election\"\n        - \"--leader-election-namespace=$(PDCSI_NAMESPACE)\"\n        -
              \"--timeout=300s\"\n      csiDriver:\n        - \"--v=5\"\n        - \"--endpoint=unix:/csi/csi.sock\""

      providerConfigRef:
        name: default
    ```

    The cluster profile contains the following core infrastructure layers.

    | **Pack Type** | **Registry** | **Pack Name**    | **Pack Version** |
    | ------------- | ------------ | ---------------- | ---------------- |
    | OS            | Public Repo  | `ubuntu-gcp`     | `22.04`          |
    | Kubernetes    | Public Repo  | `kubernetes`     | `1.32.4`         |
    | Network       | Public Repo  | `cni-calico`     | `3.30.1`         |
    | Storage       | Public Repo  | `csi-gcp-driver` | `1.15.4`         |

    <PartialsComponent category="crossplane" name="cluster-profile-tip" />

15. Create the cluster profile in Palette.

    ```bash
    kubectl apply --filename crossplane-gcp/cluster-profile-gcp.yaml
    ```

    ```bash hideClipboard title="Example output"
    profile.cluster.palette.crossplane.io/gcp-crossplane-cluster-profile created
    ```

16. Issue the commands below to get the ID of the cluster profile once its creation is complete.

    ```bash
    kubectl wait --for=condition=Ready profile.cluster.palette.crossplane.io/gcp-crossplane-cluster-profile
    CLUSTER_PROFILE_ID=$(kubectl get profile.cluster.palette.crossplane.io gcp-crossplane-cluster-profile --output jsonpath='{.status.atProvider.id}')
    echo Cluster Profile ID: $CLUSTER_PROFILE_ID
    ```

    ```text hideClipboard title="Example output"
    profile.cluster.palette.crossplane.io/gcp-crossplane-cluster-profile condition met
    Cluster Profile ID: 68960ddf222fa7f0046e80ed
    ```

17. Next, set your Palette GCP account name as a variable. Replace `<gcp-account-name>` with the name under which you
    registered your GCP account in Palette. This is the display name that appears under **Cloud Accounts** in **Tenant
    Settings** or **Project Settings**, _not_ the actual name of your GCP account.

    ```bash
    PALETTE_GCP_CLOUD_ACCOUNT_NAME=<gcp-account-name>
    ```

    In the example below, the Palette GCP account name is `spectro-cloud-gcp`.

    ![GCP account name in Palette](/automation_crossplane_deploy-cluster-gcp-crossplane_gcp-account-name-4-7.webp)

18. Next, fetch the ID of your GCP cloud account registered in Palette by invoking the `cloudaccounts` Palette API.

    ```bash
    GCP_CLOUD_ACCOUNT_ID=$(curl --location --request GET 'https://api.spectrocloud.com/v1/cloudaccounts/gcp' \
    -H 'Accept: application/json' \
    -H "ApiKey: $PALETTE_API_KEY" \
    | jq --arg name "$PALETTE_GCP_CLOUD_ACCOUNT_NAME" '.items[] | select(.metadata.name == $name) | .metadata.uid' -r)
    echo Cloud Account ID: $GCP_CLOUD_ACCOUNT_ID
    ```

19. Use the following command to create a file to store your GCP IaaS cluster configuration. Replace
    `<gcp-project-name>` with the name of your GCP project under which you will deploy your GCP cluster.

    Optionally, edit the region, availability zone, instance type, and number of cluster nodes according to your
    workload.

    ```bash {11}
    cat << EOF > crossplane-gcp/cluster-gcp.yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: GCP
    metadata:
      name: gcp-crossplane-cluster
      namespace: crossplane-system
    spec:
      forProvider:
        name: gcp-crossplane-cluster
        cloudConfig:
          - project: "<gcp-project-name>"
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
          - id: $CLUSTER_PROFILE_ID
        cloudAccountId: $GCP_CLOUD_ACCOUNT_ID
      providerConfigRef:
        name: default
    EOF
    ```

20. Create the GCP IaaS cluster.

    ```bash
    kubectl apply --filename crossplane-gcp/cluster-gcp.yaml
    ```

    ```bash hideClipboard title="Example output"
    gcp.cluster.palette.crossplane.io/gcp-crossplane-cluster created
    ```

21. Wait for the cluster to be created. Cluster provisioning may take up to 20 minutes.

    ```bash
    kubectl wait --for=condition=Ready gcp.cluster.palette.crossplane.io/gcp-crossplane-cluster --timeout=1h
    ```

    Once ready, you should receive output similar to the following.

    ```text hideClipboard title="Example output"
    gcp.cluster.palette.crossplane.io/gcp-crossplane-cluster condition met
    ```

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Verify the deployed cluster named `gcp-crossplane-cluster` is displayed and has a **Cluster Status** of **Running**
   and a **Health** status of **Healthy**.
