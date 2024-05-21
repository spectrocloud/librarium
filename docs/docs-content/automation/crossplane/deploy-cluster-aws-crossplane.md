---
sidebar_label: "Deploy an AWS IaaS Cluster with Crossplane"
title: "Deploy an AWS IaaS Cluster with Crossplane"
description: "Learn how to deploy an AWS IaaS cluster using the Spectro Cloud Crossplane provider."
hide_table_of_contents: false
sidebar_position: 20
tags: ["crossplane", "aws", "iac", "infrastructure as code"]
---

Palette supports using [Crossplane](https://www.crossplane.io) to create and manage Kubernetes
[host clusters](../../glossary-all.md#host-cluster) across major infrastructure providers. This section guides you on
how to use Crossplane to deploy a Palette-managed Kubernetes cluster in AWS.

## Prerequisites

- A [Palette](https://www.spectrocloud.com/get-started) account and API key. Refer to the
  [Create API Key](../../user-management/authentication/api-key/create-api-key.md) page for instructions on creating an
  API key.
- A public [AWS](https://repost.aws/knowledge-center/create-and-activate-aws-account) cloud account with the required
  [IAM Policies](../../clusters/public-cloud/aws/required-iam-policies.md).
- An SSH key pair available in the region where you want to deploy the cluster. Check out the
  [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) for
  guidance.
- The AWS account must be registered in Palette. Follow the
  [Add an AWS Account to Palette](../../clusters/public-cloud/aws/add-aws-accounts.md) guide to register your account in
  Palette.
- A Kubernetes cluster with at least 2 GB of RAM. This guide uses a [kind](https://kind.sigs.k8s.io) cluster as an
  example. Refer to the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) to learn how to install kind
  and create a cluster.
- The following software is required and must be installed:
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - [Helm](https://helm.sh/docs/intro/install/) version v3.2.0 or later
  - [curl](https://curl.se/docs/install.html)
  - A text editor such as Vi or [Nano](https://www.nano-editor.org). This guide uses Vi as an example.

## Deploy an AWS IaaS Cluster with Crossplane

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
    mkdir crossplane-aws
    ```

5.  Use a text editor of your choice to create a file for the Palette Crossplane provider configuration.

    ```bash
    vi crossplane-aws/provider-palette.yaml
    ```

6.  Paste the following Kubernetes configuration into the text editor window that opens. Press the `Escape` key, type
    `:wq`, and press `Enter` to save the file and exit.

    ```yaml
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-palette
    spec:
      package: xpkg.upbound.io/crossplane-contrib/provider-palette:v0.19.2
    ```

    :::tip

    Access the [Upbound Marketplace](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) to
    get the latest version of the Palette Crossplane provider.

    :::

7.  Issue the command below to install the Palette Crossplane provider. Crossplane will install the CRDs that allow you
    to create Palette resources directly inside Kubernetes.

    ```bash
    kubectl apply --filename crossplane-aws/provider-palette.yaml
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
    vi crossplane-aws/secret-aws.yaml
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
    kubectl apply --filename crossplane-aws/secret-aws.yaml
    ```

11. Next, create a file to store the `ProviderConfig` object. This object configures the Palette Crossplane provider
    with the secret containing the Palette API key.

    ```bash
    vi crossplane-aws/providerconfig-aws.yaml
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
    kubectl apply --filename crossplane-aws/providerconfig-aws.yaml
    ```

14. Once the Palette Crossplane provider is installed and set up, create a file to store the AWS
    [cluster profile](../../profiles/cluster-profiles/cluster-profiles.md) configuration.

    ```bash
    vi crossplane-aws/cluster-profile-aws.yaml
    ```

15. Paste the Kubernetes configuration below into the text editor window that opens. Save the file and exit.

    ```yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Profile
    metadata:
      name: aws-crossplane-cluster-profile
      namespace: crossplane-system
    spec:
      forProvider:
        cloud: "aws"
        description: "AWS Crossplane cluster profile"
        type: "cluster"
        pack:
          - name: "ubuntu-aws"
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
            uid: "63bd0373764141c6622c3062"

          - name: "kubernetes"
            tag: "1.29.0"
            uid: "661cc50b0aa79b77ade281f9"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "# spectrocloud.com/enabled-presets: Kube Controller Manager:loopback-ctrlmgr,Kube
              Scheduler:loopback-scheduler\npack:\n  content:\n    images:\n      - image:
              registry.k8s.io/coredns/coredns:v1.10.1\n      - image: registry.k8s.io/etcd:3.5.10-0\n      - image:
              registry.k8s.io/kube-apiserver:v1.29.0\n      - image:
              registry.k8s.io/kube-controller-manager:v1.29.0\n      - image:
              registry.k8s.io/kube-proxy:v1.29.0\n      - image: registry.k8s.io/kube-scheduler:v1.29.0\n      - image:
              registry.k8s.io/pause:3.9\n      - image: registry.k8s.io/pause:3.8\n  k8sHardening: True\n  #CIDR Range
              for Pods in cluster\n  # Note : This must not overlap with any of the host or service network\n  podCIDR:
              \"192.168.0.0/16\"\n  #CIDR notation IP range from which to assign service cluster IPs\n  # Note : This
              must not overlap with any IP ranges assigned to nodes for pods.\n  serviceClusterIpRange:
              \"10.96.0.0/12\"\n  # serviceDomain: \"cluster.local\"\n\n# KubeAdm customization for kubernetes
              hardening. Below config will be ignored if k8sHardening property above is
              disabled\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      # Note : secure-port flag is used during
              kubeadm init. Do not change this flag on a running cluster\n      secure-port:
              \"6443\"\n      anonymous-auth: \"true\"\n      profiling: \"false\"\n      disable-admission-plugins:
              \"AlwaysAdmit\"\n      default-not-ready-toleration-seconds:
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
              \"baseline\"\n              enforce-version: \"v1.29\"\n              audit:
              \"baseline\"\n              audit-version: \"v1.29\"\n              warn:
              \"restricted\"\n              warn-version: \"v1.29\"\n              audit:
              \"restricted\"\n              audit-version: \"v1.29\"\n            exemptions:\n              # Array of
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
              oidc client secret\n  #oidc-extra-scope: profile,email"

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

          - name: "csi-aws-ebs"
            tag: "1.26.1"
            uid: "661cc4f60aa79b75afba6d4b"
            registryUid: "5eecc89d0b150045ae661cef"
            values:
              "pack:\n  content:\n    images:\n      - image:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/aws-ebs-csi-driver:v1.26.1\n      - image:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-provisioner:v3.6.3-eks-1-29-2\n      -
              image: gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-attacher:v4.4.3-eks-1-29-2\n      -
              image: gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-resizer:v1.9.3-eks-1-29-2\n      -
              image: gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/livenessprobe:v2.11.0-eks-1-29-2\n      -
              image:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/node-driver-registrar:v2.9.3-eks-1-29-2\n      -
              image:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-snapshotter/csi-snapshotter:v6.3.3-eks-1-29-2\n      -
              image: gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/volume-modifier-for-k8s:v0.1.3\n      -
              image:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/kubekins-e2e:v20231206-f7b83ffbe6-master\n    charts:\n      -
              repo: https://kubernetes-sigs.github.io/aws-ebs-csi-driver \n        name:
              aws-ebs-csi-driver\n        version: 2.26.1\n  namespace:
              \"kube-system\"\n\ncharts:\n  aws-ebs-csi-driver: \n    storageClasses: \n    # Default Storage
              Class\n      - name: spectro-storage-class\n      # annotation
              metadata\n        annotations:\n          storageclass.kubernetes.io/is-default-class: \"true\"\n      #
              label metadata\n      # labels:\n      #   my-label-is: supercool\n      # defaults to
              WaitForFirstConsumer\n        volumeBindingMode: WaitForFirstConsumer\n      # defaults to
              Delete\n        reclaimPolicy: Delete\n        parameters:\n        # File system type: xfs, ext2, ext3,
              ext4\n          csi.storage.k8s.io/fstype: \"ext4\"\n        # EBS volume type: io1, io2, gp2, gp3, sc1,
              st1, standard\n          type: \"gp2\"\n        # I/O operations per second per GiB. Required when io1 or
              io2 volume type is specified.\n        # iopsPerGB: \"\"\n        # Applicable only when io1 or io2 volume
              type is specified\n        # allowAutoIOPSPerGBIncrease: false\n        # I/O operations per second.
              Applicable only for gp3 volumes.\n        # iops: \"\"\n        # Throughput in MiB/s. Applicable only for
              gp3 volumes.\n        # throughput: \"\"\n        # Whether the volume should be encrypted or
              not\n        # encrypted: \"\"\n        # The full ARN of the key to use when encrypting the volume. When
              not specified, the default KMS key is used.\n        # kmsKeyId: \"\"\n    # Additional Storage Class
              \n      # - name: addon-storage-class\n      #
              annotations:\n      #   storageclass.kubernetes.io/is-default-class: \"false\"\n      #
              labels:\n      #   my-label-is: supercool\n      # volumeBindingMode: WaitForFirstConsumer\n      #
              reclaimPolicy: Delete\n      # parameters:\n        # csi.storage.k8s.io/fstype: \"ext4\"\n        # type:
              \"gp2\"\n        # iopsPerGB: \"\"\n        # allowAutoIOPSPerGBIncrease: false\n        # iops:
              \"\"\n        # throughput: \"\"\n        # encrypted: \"\"\n        # kmsKeyId:
              \"\"\n\n    image:\n      repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/aws-ebs-csi-driver\n      # Overrides the image tag
              whose default is v{{ .Chart.AppVersion }}\n      tag: \"\"\n      pullPolicy: IfNotPresent\n\n    # --
              Custom labels to add into metadata\n    customLabels:\n      {}\n      # k8s-app:
              aws-ebs-csi-driver\n\n    sidecars:\n      provisioner:\n        env:
              []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-provisioner\n          tag:
              \"v3.6.3-eks-1-29-2\"\n        logLevel: 2\n        # Additional parameters provided by
              external-provisioner.\n        additionalArgs: []\n        # Grant additional permissions to
              external-provisioner\n        additionalClusterRoleRules:\n        resources: {}\n        # Tune leader
              lease election for csi-provisioner.\n        # Leader election is on by
              default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease
              behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration
              format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration:
              \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod:
              \"5s\"\n        securityContext:\n          readOnlyRootFilesystem:
              true\n          allowPrivilegeEscalation: false\n      attacher:\n        env:
              []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-attacher\n          tag:
              \"v4.4.3-eks-1-29-2\"\n        # Tune leader lease election for csi-attacher.\n        # Leader election
              is on by default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune
              lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration
              format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration:
              \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel:
              2\n        # Additional parameters provided by external-attacher.\n        additionalArgs: []\n        #
              Grant additional permissions to external-attacher\n        additionalClusterRoleRules:
              []\n        resources: {}\n        securityContext:\n          readOnlyRootFilesystem:
              true\n          allowPrivilegeEscalation: false\n      snapshotter:\n        # Enables the snapshotter
              sidecar even if the snapshot CRDs are not installed\n        forceEnable: false\n        env:
              []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-snapshotter/csi-snapshotter\n          tag:
              \"v6.3.3-eks-1-29-2\"\n        logLevel: 2\n        # Additional parameters provided by
              csi-snapshotter.\n        additionalArgs: []\n        # Grant additional permissions to
              csi-snapshotter\n        additionalClusterRoleRules: []\n        resources:
              {}\n        securityContext:\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
              false\n      livenessProbe:\n        image:\n          pullPolicy: IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/livenessprobe\n          tag:
              \"v2.11.0-eks-1-29-2\"\n        # Additional parameters provided by
              livenessprobe.\n        additionalArgs: []\n        resources:
              {}\n        securityContext:\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
              false\n      resizer:\n        env: []\n        image:\n          pullPolicy:
              IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/external-resizer\n          tag:
              \"v1.9.3-eks-1-29-2\"\n        # Tune leader lease election for csi-resizer.\n        # Leader election is
              on by default.\n        leaderElection:\n          enabled: true\n          # Optional values to tune
              lease behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration
              format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration:
              \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel:
              2\n        # Additional parameters provided by external-resizer.\n        additionalArgs: []\n        #
              Grant additional permissions to external-resizer\n        additionalClusterRoleRules:
              []\n        resources: {}\n        securityContext:\n          readOnlyRootFilesystem:
              true\n          allowPrivilegeEscalation: false\n      nodeDriverRegistrar:\n        env:
              []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/node-driver-registrar\n          tag:
              \"v2.9.3-eks-1-29-2\"\n        logLevel: 2\n        # Additional parameters provided by
              node-driver-registrar.\n        additionalArgs: []\n        resources:
              {}\n        securityContext:\n          readOnlyRootFilesystem: true\n          allowPrivilegeEscalation:
              false\n        livenessProbe:\n          exec:\n            command:\n            -
              /csi-node-driver-registrar\n            -
              --kubelet-registration-path=$(DRIVER_REG_SOCK_PATH)\n            -
              --mode=kubelet-registration-probe\n          initialDelaySeconds: 30\n          periodSeconds:
              90\n          timeoutSeconds: 15\n      volumemodifier:\n        env:
              []\n        image:\n          pullPolicy: IfNotPresent\n          repository:
              gcr.io/spectro-images-public/packs/csi-aws-ebs/1.26.1/volume-modifier-for-k8s\n          tag:
              \"v0.1.3\"\n        leaderElection:\n          enabled: true\n          # Optional values to tune lease
              behavior.\n          # The arguments provided must be in an acceptable time.ParseDuration
              format.\n          # Ref: https://pkg.go.dev/flag#Duration\n          # leaseDuration:
              \"15s\"\n          # renewDeadline: \"10s\"\n          # retryPeriod: \"5s\"\n        logLevel:
              2\n        # Additional parameters provided by volume-modifier-for-k8s.\n        additionalArgs:
              []\n        resources: {}\n        securityContext:\n          readOnlyRootFilesystem:
              true\n          allowPrivilegeEscalation:
              false\n\n    proxy:\n      http_proxy:\n      no_proxy:\n\n    imagePullSecrets:
              []\n    nameOverride:\n    fullnameOverride:\n\n    awsAccessSecret:\n      name: aws-secret\n      keyId:
              key_id\n      accessKey: access_key\n\n    controller:\n      batching:
              true\n      volumeModificationFeature:\n        enabled: false\n      # Additional parameters provided by
              aws-ebs-csi-driver controller.\n      additionalArgs: []\n      sdkDebugLog: false\n      loggingFormat:
              text\n      affinity:\n        nodeAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n          -
              weight: 1\n            preference:\n              matchExpressions:\n              - key:
              eks.amazonaws.com/compute-type\n                operator:
              NotIn\n                values:\n                -
              fargate\n        podAntiAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n          -
              podAffinityTerm:\n              labelSelector:\n                matchExpressions:\n                - key:
              app\n                  operator: In\n                  values:\n                  -
              ebs-csi-controller\n              topologyKey: kubernetes.io/hostname\n            weight: 100\n      #
              The default filesystem type of the volume to provision when fstype is unspecified in the
              StorageClass.\n      # If the default is not set and fstype is unset in the StorageClass, then no fstype
              will be set\n      defaultFsType: ext4\n      env: []\n      # Use envFrom to reference ConfigMaps and
              Secrets across all containers in the deployment\n      envFrom: []\n      # If set, add pv/pvc metadata to
              plugin create requests as parameters.\n      extraCreateMetadata: true\n      # Extra volume tags to
              attach to each dynamically provisioned volume.\n      # ---\n      # extraVolumeTags:\n      #   key1:
              value1\n      #   key2: value2\n      extraVolumeTags: {}\n      httpEndpoint:\n      # (deprecated) The
              TCP network address where the prometheus metrics endpoint\n      # will run (example: `:8080` which
              corresponds to port 8080 on local host).\n      # The default is empty string, which means metrics
              endpoint is disabled.\n      # ---\n      enableMetrics: false\n      serviceMonitor:\n        # Enables
              the ServiceMonitor resource even if the prometheus-operator CRDs are not installed\n        forceEnable:
              false\n        # Additional labels for ServiceMonitor object\n        labels:\n          release:
              prometheus\n      # If set to true, AWS API call metrics will be exported to the following\n      # TCP
              endpoint: \"0.0.0.0:3301\"\n      # ---\n      # ID of the Kubernetes cluster used for tagging provisioned
              EBS volumes (optional).\n      k8sTagClusterId:\n      logLevel: 2\n      userAgentExtra:
              \"helm\"\n      nodeSelector: {}\n      podAnnotations: {}\n      podLabels: {}\n      priorityClassName:
              system-cluster-critical\n      # AWS region to use. If not specified then the region will be looked up via
              the AWS EC2 metadata\n      # service.\n      # ---\n      # region:
              us-east-1\n      region:\n      replicaCount: 2\n      updateStrategy:\n        type:
              RollingUpdate\n        rollingUpdate:\n          maxUnavailable: 1\n      # type: RollingUpdate\n      #
              rollingUpdate:\n      #   maxSurge: 0\n      #   maxUnavailable:
              1\n      resources:\n        requests:\n          cpu: 10m\n          memory:
              40Mi\n        limits:\n          cpu: 100m\n          memory: 256Mi\n      serviceAccount:\n      # A
              service account will be created for you if set to true. Set to false if you want to use your
              own.\n        create: true\n        name: ebs-csi-controller-sa\n        annotations: {}\n        ##
              Enable if EKS IAM for SA is used\n        # eks.amazonaws.com/role-arn:
              arn:<partition>:iam::<account>:role/ebs-csi-role\n        automountServiceAccountToken:
              true\n      tolerations:\n        - key: CriticalAddonsOnly\n          operator: Exists\n        - effect:
              NoExecute\n          operator: Exists\n          tolerationSeconds: 300\n      # TSCs without the label
              selector stanza\n      #\n      # Example:\n      #\n      # topologySpreadConstraints:\n      #  -
              maxSkew: 1\n      #    topologyKey: topology.kubernetes.io/zone\n      #    whenUnsatisfiable:
              ScheduleAnyway\n      #  - maxSkew: 1\n      #    topologyKey:
              kubernetes.io/hostname\n      #    whenUnsatisfiable: ScheduleAnyway\n      topologySpreadConstraints:
              []\n      # securityContext on the controller pod\n      securityContext:\n        runAsNonRoot:
              true\n        runAsUser: 1000\n        runAsGroup: 1000\n        fsGroup: 1000\n      # Add additional
              volume mounts on the controller with controller.volumes and controller.volumeMounts\n      volumes:
              []\n      # Add additional volumes to be mounted onto the controller:\n      # - name:
              custom-dir\n      #   hostPath:\n      #     path: /path/to/dir\n      #     type:
              Directory\n      volumeMounts: []\n      # And add mount paths for those additional volumes:\n      # -
              name: custom-dir\n      #   mountPath: /mount/path\n      # ---\n      # securityContext on the controller
              container (see sidecars for securityContext on sidecar
              containers)\n      containerSecurityContext:\n        readOnlyRootFilesystem:
              true\n        allowPrivilegeEscalation: false\n      initContainers: []\n      # containers to be run
              before the controller's container starts.\n      #\n      # Example:\n      #\n      # - name:
              wait\n      #   image: busybox\n      #   command: [ 'sh', '-c', \"sleep 20\" ]\n      # Enable
              opentelemetry tracing for the plugin running on the daemonset\n      otelTracing:
              {}\n      #  otelServiceName: ebs-csi-controller\n      #  otelExporterEndpoint:
              \"http://localhost:4317\"\n\n    node:\n      env: []\n      envFrom: []\n      kubeletPath:
              /var/lib/kubelet\n      loggingFormat: text\n      logLevel:
              2\n      priorityClassName:\n      affinity:\n        nodeAffinity:\n          requiredDuringSchedulingIgnoredDuringExecution:\n            nodeSelectorTerms:\n            -
              matchExpressions:\n              - key: eks.amazonaws.com/compute-type\n                operator:
              NotIn\n                values:\n                - fargate\n              - key:
              node.kubernetes.io/instance-type\n                operator:
              NotIn\n                values:\n                - a1.medium\n                - a1.large\n                -
              a1.xlarge\n                - a1.2xlarge\n                - a1.4xlarge\n      nodeSelector:
              {}\n      podAnnotations: {}\n      podLabels: {}\n      tolerateAllTaints:
              true\n      tolerations:\n      - operator: Exists\n        effect: NoExecute\n        tolerationSeconds:
              300\n      resources:\n        requests:\n          cpu: 10m\n          memory:
              40Mi\n        limits:\n          cpu: 100m\n          memory:
              256Mi\n      serviceAccount:\n        create: true\n        name: ebs-csi-node-sa\n        annotations:
              {}\n        ## Enable if EKS IAM for SA is used\n        # eks.amazonaws.com/role-arn:
              arn:<partition>:iam::<account>:role/ebs-csi-role\n        automountServiceAccountToken: true\n      #
              Enable the linux daemonset creation\n      enableLinux: true\n      enableWindows: false\n      # The
              \"maximum number of attachable volumes\" per
              node\n      volumeAttachLimit:\n      updateStrategy:\n        type:
              RollingUpdate\n        rollingUpdate:\n          maxUnavailable: \"10%\"\n      hostNetwork:
              false\n      # securityContext on the node pod\n      securityContext:\n        # The node pod must be run
              as root to bind to the registration/driver sockets\n        runAsNonRoot: false\n        runAsUser:
              0\n        runAsGroup: 0\n        fsGroup: 0\n      # Add additional volume mounts on the node pods with
              node.volumes and node.volumeMounts\n      volumes: []\n      # Add additional volumes to be mounted onto
              the node pods:\n      # - name: custom-dir\n      #   hostPath:\n      #     path:
              /path/to/dir\n      #     type: Directory\n      volumeMounts: []\n      # And add mount paths for those
              additional volumes:\n      # - name: custom-dir\n      #   mountPath: /mount/path\n      # ---\n      #
              securityContext on the node container (see sidecars for securityContext on sidecar
              containers)\n      containerSecurityContext:\n        readOnlyRootFilesystem: true\n        privileged:
              true\n      # Enable opentelemetry tracing for the plugin running on the daemonset\n      otelTracing:
              {}\n      #  otelServiceName: ebs-csi-node\n      #  otelExporterEndpoint:
              \"http://localhost:4317\"\n\n    additionalDaemonSets:\n      # Additional node DaemonSets, using the node
              config structure\n      # See docs/additional-daemonsets.md for more information\n      #\n      #
              example:\n      #   nodeSelector:\n      #     node.kubernetes.io/instance-type:
              c5.large\n      #   volumeAttachLimit: 15\n\n    # Enable compatibility for the A1 instance family via use
              of an AL2-based image in a separate DaemonSet\n    # a1CompatibilityDaemonSet:
              true\n\n    #storageClasses: []\n    # Add StorageClass resources like:\n    # - name: ebs-sc\n    #   #
              annotation metadata\n    #   annotations:\n    #     storageclass.kubernetes.io/is-default-class:
              \"true\"\n    #   # label metadata\n    #   labels:\n    #     my-label-is: supercool\n    #   # defaults
              to WaitForFirstConsumer\n    #   volumeBindingMode: WaitForFirstConsumer\n    #   # defaults to
              Delete\n    #   reclaimPolicy: Retain\n    #   parameters:\n    #     encrypted:
              \"true\"\n\n    volumeSnapshotClasses: []\n    # Add VolumeSnapshotClass resources like:\n    # - name:
              ebs-vsc\n    #   # annotation
              metadata\n    #   annotations:\n    #     snapshot.storage.kubernetes.io/is-default-class:
              \"true\"\n    #   # label metadata\n    #   labels:\n    #     my-label-is: supercool\n    #   #
              deletionPolicy must be specified\n    #   deletionPolicy: Delete\n    #   parameters:\n\n    # Use old
              CSIDriver without an fsGroupPolicy set\n    # Intended for use with older clusters that cannot easily
              replace the CSIDriver object\n    # This parameter should always be false for new
              installations\n    useOldCSIDriver: false"

      providerConfigRef:
        name: default
    ```

    The cluster profile contains the following core infrastructure layers.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | OS            | Public Repo  | `ubuntu-aws`  | `22.04`          |
    | Kubernetes    | Public Repo  | `kubernetes`  | `1.29.0`         |
    | Network       | Public Repo  | `cni-calico`  | `3.27.0`         |
    | Storage       | Public Repo  | `csi-aws-ebs` | `1.26.1`         |

    :::tip

    If you want to use different packs in your cluster profile, you can access the Palette UI and simulate creating a
    cluster profile to gather the pack's required values. During the cluster profile creation, click the API button to
    display the API payload. You will find the values of each packs' `name`, `tag`, `uid`, `registryUid`, and `values`
    parameters.

    :::

16. Create the cluster profile.

    ```bash
    kubectl apply --filename crossplane-aws/cluster-profile-aws.yaml
    ```

17. Issue the commands below to get the ID of the cluster profile once its creation is complete.

    ```bash
    kubectl wait --for=condition=Ready profile.cluster.palette.crossplane.io/aws-crossplane-cluster-profile
    clusterProfileId=$(kubectl get profile.cluster.palette.crossplane.io aws-crossplane-cluster-profile --output jsonpath='{.status.atProvider.id}')
    echo Cluster Profile ID: $clusterProfileId
    ```

    ```text hideClipboard
    profile.cluster.palette.crossplane.io/aws-crossplane-cluster-profile condition met
    Cluster Profile ID: 6638e0eb8f42b99cb4d1d1bb
    ```

18. Next, get the ID of your AWS cloud account registered in Palette by invoking the `cloudaccounts` Palette API.
    Replace `<your-api-key>` with your Palette API key and `<aws-account-name>` with the name under which you registered
    your AWS account in Palette.

    ```bash
    curl --location --request GET 'https://api.spectrocloud.com/v1/cloudaccounts/aws' \
    -H 'Accept: application/json' \
    -H 'ApiKey: <your-api-key>' | jq '.items[] | select(.metadata.name == "<aws-account-name>") | .metadata.uid'
    ```

    ```text hideClipboard
    "645981f0ab3ab8105fabc932"
    ```

    Copy the API response containing your AWS cloud account ID.

19. Create a file to store the AWS IaaS cluster configuration.

    ```bash
    vi crossplane-aws/cluster-aws.yaml
    ```

20. Paste the cluster configuration displayed below into the text editor window that opens:

    - Replace `<ssh-key-name>` with the name of the SSH key available in the region where you want to deploy the
      cluster.
    - Replace `<cluster-profile-id>` and `<cloud-account-id>` with the IDs you obtained in steps 17 and 18.

    Optionally, you can edit the region, availability zone, instance type, and number of nodes of your cluster according
    to your workload.

    Once you are done making the alterations, save and exit the file.

    ```yaml
    apiVersion: cluster.palette.crossplane.io/v1alpha1
    kind: Aws
    metadata:
      name: aws-crossplane-cluster
      namespace: crossplane-system
    spec:
      forProvider:
        cloudConfig:
          - sshKeyName: <ssh-key-name>
            region: us-east-1
        machinePool:
          - azs:
              - us-east-1a
            count: 2
            instanceType: t3.xlarge
            name: machinepool1
          - azs:
              - us-east-1a
            count: 1
            instanceType: m4.2xlarge
            name: controlplanepool
            controlPlane: true
        clusterProfile:
          - id: <cluster-profile-id>
        cloudAccountId: <cloud-account-id>
      providerConfigRef:
        name: default
    ```

21. Create the AWS IaaS cluster.

    ```bash
    kubectl apply --filename crossplane-aws/cluster-aws.yaml
    ```

22. Wait for the cluster to be created. The cluster provisioning might take up to 20 minutes.

    ```bash
    kubectl wait --for=condition=Ready aws.cluster.palette.crossplane.io/aws-crossplane-cluster --timeout=1h
    ```

    Once ready, you should receive an output similar to the following.

    ```text hideClipboard
    aws.cluster.palette.crossplane.io/aws-crossplane-cluster condition met
    ```

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Clusters**.

3. Verify the deployed cluster named `aws-crossplane-cluster` is displayed and has the **Running** and **Healthy**
   status.
