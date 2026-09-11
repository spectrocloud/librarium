---
sidebar_label: "Deploy Cluster with an Amazon ECR Provider Registry"
title: "Deploy Cluster with an Amazon ECR Provider Registry"
description:
  "Configure an Edge cluster to pull provider images from a private Amazon ECR repository during cluster creation and
  upgrade."
hide_table_of_contents: false
sidebar_position: 45
tags: ["edge"]
---

[Amazon Elastic Container Registry (ECR)](https://docs.aws.amazon.com/ecr/) authenticates pulls with a short-lived token
rather than a static username and password. This guide describes how to configure an Edge cluster to pull provider
images from a private Amazon ECR repository, both when the cluster is first created and when it is later upgraded.

This procedure applies to Edge clusters that use the PXK-E (kubeadm) Kubernetes distribution deployed in agent mode, and
it covers provider images only. It does not configure ECR for application workload images, and it does not cover
appliance mode or other Kubernetes distributions. Refer to [Limitations](#limitations) for the full scope.

## Provider Image Pull Paths

A provider image is pulled at two different points in the life of a cluster, by two different components that do not
share credentials. This is why the configuration has two halves.

| Attribute                  | Cluster creation         | Upgrade                           |
| -------------------------- | ------------------------ | --------------------------------- |
| When                       | A node joins the cluster | The provider image tag changes    |
| Pulled by                  | Palette agent            | Kubelet                           |
| Authentication             | Docker credential helper | Kubernetes credential provider    |
| Credentials file           | `/root/.aws/credentials` | `/etc/kubernetes/ecr/credentials` |
| Written by                 | Edge host user data      | Cluster profile                   |
| Rotatable after deployment | No                       | Yes                               |

An upgrade runs as a pod whose container image is the provider image, and that pod has no image pull secret, so Kubelet
performs the pull. Kubelet does not read `/root/.docker/config.json` and does not use the Docker credential helper
protocol. If you configure only the creation path, the cluster creates successfully but then fails at its first upgrade
with the error `authorization failed: no basic auth credentials`. Both paths are required.

The two paths use separate credentials files on purpose. The cluster profile writes the upgrade path credentials file,
and the Edge host user data writes the creation path credentials file. Because the cluster profile owns the upgrade path
file, you can change those credentials later, which is what makes credential rotation possible.

## Limitations

- This configuration applies to the PXK-E (kubeadm) Kubernetes distribution in agent mode only. Appliance mode and other
  Kubernetes distributions are not covered.

- The configuration covers provider images only. Application workload images are not covered.

- Credentials are stored in plain text on each node, in both the Edge host user data and the rendered cluster
  configuration file at `/oem/85_cluster_config.yaml`. A bare-metal Edge host has no cloud instance profile, so a static
  access key is the only option. Scope the IAM user to a single repository to limit the exposure.

- The creation path credential cannot be changed after deployment. Only the upgrade path credential can be rotated. If
  the deploy-time key is retired, creating new nodes from that user data fails, although existing clusters continue to
  upgrade.

- Rotating the credential reboots every node in a rolling fashion, and it must be applied separately from any change to
  the provider image tag.

- Only hosts deployed with this user data from the start are covered. An existing cluster cannot adopt this
  configuration, because user data is written at install time.

- A broken credential is silent. If a key is deactivated, deleted, or mistyped, the cluster stays healthy and no alert
  is raised. The failure surfaces only at the next pull, which might be when the next node is added or at the next
  upgrade. Verify the credential against ECR out of band on the same schedule that you rotate it.

## Prerequisites

- A private Amazon ECR repository that contains a provider image you built during the EdgeForge process. For more
  information, refer to [Build Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md).

- Permission to create an [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) user and an access
  key in the AWS account that owns the repository.

- Familiarity with providing Edge host [user data](../../edgeforge-workflow/prepare-user-data.md) during the EdgeForge
  process.

- A cluster profile that uses the Bring Your Own OS (BYOOS) pack for its OS layer.

## Create a Pull-Only IAM User

1. In the AWS account that owns your ECR repository, create an IAM user for the Edge nodes. A bare-metal Edge host has
   no instance profile, so a static access key is required.

2. Attach a policy that grants a registry-wide authorization token and pull-only access to the single repository that
   holds your provider images. Replace `<region>`, `<account-id>`, and `<repository-name>` with your values.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AuthTokenIsRegistryWide",
         "Effect": "Allow",
         "Action": "ecr:GetAuthorizationToken",
         "Resource": "*"
       },
       {
         "Sid": "PullOnlySingleRepository",
         "Effect": "Allow",
         "Action": ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"],
         "Resource": "arn:aws:ecr:<region>:<account-id>:repository/<repository-name>"
       }
     ]
   }
   ```

   The `ecr:GetAuthorizationToken` action cannot be scoped to a repository, because it is registry-wide by design. The
   pull actions carry the repository restriction, so this key can pull only the named repository and is denied push and
   every other repository in the same account.

3. Create an access key for the user and record the access key ID and secret access key. You use these values in the
   following steps.

:::info

The static access key does not expire. The ECR authorization token that it mints is valid for 12 hours and is generated
on demand at pull time, so a cluster created months ago upgrades the same way as one created minutes ago.

:::

## Configure Edge Host User Data

Provide the following as the Edge host user data. This single document installs both helper binaries, writes the
creation path credentials, and points Kubelet at the profile-owned upgrade path credentials file without writing that
file itself.

The `initramfs` and `boot` keys are two stages of the same `stages` document, not two alternative configurations.
Deliver the whole document as the user data.

Two details are load-bearing:

- The credential provider configuration must be written in an `initramfs` stage, not a `boot` stage. yip runs the
  `initramfs` stage of every `/oem` file before the `boot` stage of any of them. The cluster configuration runs
  `kubeadm init` in its boot stage, and `kubeadm init` blocks until Kubelet is up. Kubelet validates the credential
  provider configuration at startup and exits if it is missing or invalid. Writing the configuration in an `initramfs`
  stage guarantees that it is present and correct before `kubeadm init` starts.

- The `defaultCacheDuration` field is mandatory. If you omit it, Kubelet does not start and never retries, and
  `kubeadm init` fails at `wait-control-plane` with `providers.defaultCacheDuration: Required value`.

Replace `<account-id>`, `<region>`, `<access-key-id>`, and `<secret-access-key>` with your values.

```yaml
stages:
  initramfs:
    - name: "ECR credential provider configuration"
      commands:
        - mkdir -p /etc/kubernetes/credential-provider
        - mkdir -p /etc/systemd/system/kubelet.service.d
        - mkdir -p /root/.aws
        - mkdir -p /root/.docker
        - mkdir -p /etc/kubernetes/ecr
      files:
        - path: /etc/kubernetes/credential-provider-config.yaml
          permissions: 0644
          owner: 0
          group: 0
          content: |
            apiVersion: kubelet.config.k8s.io/v1beta1
            kind: CredentialProviderConfig
            providers:
              - name: ecr-credential-provider
                matchImages:
                  - "*.dkr.ecr.*.amazonaws.com"
                defaultCacheDuration: "12h" # Required. kubelet does not start without it.
                apiVersion: credentialprovider.kubelet.k8s.io/v1

    # Enable the kubelet flags only when the binary is present. Setting the flags
    # without the binary is another reason kubelet refuses to start. The binary is
    # downloaded in the boot stage below and persists, so it is present from the
    # second boot onward.
    - name: "Enable kubelet credential provider flags when the binary exists"
      commands:
        - |
          BIN=/etc/kubernetes/credential-provider/ecr-credential-provider
          DST=/etc/systemd/system/kubelet.service.d/20-credential-provider.conf
          if [ -x "$BIN" ]; then
            printf '%s\n' '[Service]' \
              'Environment="KUBELET_EXTRA_ARGS=--image-credential-provider-config=/etc/kubernetes/credential-provider-config.yaml --image-credential-provider-bin-dir=/etc/kubernetes/credential-provider"' \
              > "$DST"
            chmod 0644 "$DST"
          else
            rm -f "$DST"
            logger --tag ecr-init "credential-provider binary absent; kubelet flags not enabled this boot"
          fi
          systemctl daemon-reload || true
          true

  boot:
    # Creation pull path: the Palette agent, when a node joins the cluster.
    - name: "ECR credential helper for the Palette agent"
      downloads:
        - path: /usr/local/bin/docker-credential-ecr-login
          url: "https://amazon-ecr-credential-helper-releases.s3.us-east-2.amazonaws.com/0.12.0/linux-amd64/docker-credential-ecr-login"
          permissions: 0755
          owner: 0
          group: 0
          timeout: 180
      files:
        - path: /root/.docker/config.json
          permissions: 0600
          owner: 0
          group: 0
          content: |
            {
              "credHelpers": {
                "<account-id>.dkr.ecr.<region>.amazonaws.com": "ecr-login"
              }
            }
        - path: /root/.aws/credentials
          permissions: 0600
          owner: 0
          group: 0
          content: |
            [default]
            aws_access_key_id = <access-key-id>
            aws_secret_access_key = <secret-access-key>
        - path: /root/.aws/config
          permissions: 0600
          owner: 0
          group: 0
          content: |
            [default]
            region = <region>
            output = json

    # Upgrade pull path: kubelet, when the provider image tag changes.
    - name: "ECR kubelet credential provider"
      commands:
        # If /etc/kubernetes was wiped and kubelet started before this stage wrote
        # the file, restart it once, and only if it has actually failed.
        - |
          if [ "$(systemctl is-failed kubelet 2>/dev/null)" = "failed" ]; then
            systemctl daemon-reload || true
            systemctl restart kubelet || true
            logger --tag ecr-selfheal "restarted failed kubelet after writing credential-provider config"
          fi
          true
      downloads:
        - path: /etc/kubernetes/credential-provider/ecr-credential-provider
          url: "https://artifacts.k8s.io/binaries/cloud-provider-aws/v1.31.0/linux/amd64/ecr-credential-provider-linux-amd64"
          permissions: 0755
          owner: 0
          group: 0
          timeout: 180
      files:
        - path: /etc/systemd/system/kubelet.service.d/10-ecr-aws.conf
          permissions: 0644
          owner: 0
          group: 0
          content: |
            [Service]
            Environment=HOME=/root
            Environment=AWS_SDK_LOAD_CONFIG=1
            Environment=AWS_SHARED_CREDENTIALS_FILE=/etc/kubernetes/ecr/credentials
```

The `AWS_SHARED_CREDENTIALS_FILE=/etc/kubernetes/ecr/credentials` line redirects the upgrade path away from
`/root/.aws`. The user data creates the directory but never writes the file. The cluster profile writes the file in the
next step. Both `/etc/kubernetes` and `/etc/systemd` are persistent mounts, so the credentials file and the Kubelet
drop-ins survive reboots and the A/B image swap.

The [Amazon ECR credential helper](https://github.com/awslabs/amazon-ecr-credential-helper) and the
[ecr-credential-provider](https://github.com/kubernetes/cloud-provider-aws) binaries are static Go binaries that use the
AWS SDK directly, so the AWS CLI is not required on the node. The AWS CLI is still useful for on-node diagnosis, but
nothing in this procedure depends on it.

:::info

The `ecr-credential-provider` binary is pinned to `v1.31.0` in the example above, because that is the version published
at `artifacts.k8s.io/binaries/cloud-provider-aws` that was validated for this configuration. Confirm the binary path
resolves before you rely on it.

:::

## Configure the Cluster Profile

The BYOOS layer of the cluster profile carries the provider image tag and the profile-owned credentials file. Before you
apply the profile, create two [masked Palette variables](../../../cluster-management/macros.md): `ecr_rotating_key_id`
for the access key ID and `ecr_rotating_key_secret` for the secret access key.

Add the following to the OS layer of your cluster profile. Replace `<account-id>`, `<region>`, `<repository-name>`, and
`<create-tag>` with your values.

```yaml
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"

options:
  system.uri: "<account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:<create-tag>"

stages:
  initramfs:
    - name: "Create the ECR credentials directory"
      commands:
        - mkdir -p /etc/kubernetes/ecr

  boot:
    - name: "Write the profile-owned ECR credentials"
      files:
        - path: /etc/kubernetes/ecr/credentials
          permissions: 0600
          owner: 0
          group: 0
          content: |
            [default]
            aws_access_key_id = {{.spectro.var.ecr_rotating_key_id}}
            aws_secret_access_key = {{.spectro.var.ecr_rotating_key_secret}}
```

Keep the following in mind when you configure the profile:

- A variable marked masked in the Palette UI improves where the secret is stored and managed. It does not remove the
  on-disk exposure. Palette renders the value in plain text into `/oem/85_cluster_config.yaml` on every node, readable
  by anyone with node access.

- Palette variable names cannot contain hyphens, because the template engine rejects them. Use `ecr_rotating_key_id`,
  not `ecr-rotating-key-id`.

- Do not set the `providerCredentials` field. It is a registry redirect rather than an authentication scope, and it
  rewrites provider image references.

## Deploy the Cluster

Deploy the Edge hosts with the user data from [Configure Edge Host User Data](#configure-edge-host-user-data), then
create the cluster against the profile from [Configure the Cluster Profile](#configure-the-cluster-profile). The
creation path does the work here. The Palette agent pulls the provider image with the deploy-time key, the node repaves
into it, and `kubeadm init` runs.

After the repave completes, confirm that both nodes report `Ready`.

```shell
kubectl get nodes --output wide
```

```shell hideClipboard title="Example Output"
edge-<id>   Ready   control-plane   v1.34.2   Ubuntu 22.04.5 LTS   containerd://2.1.4
edge-<id>   Ready   <none>          v1.34.2   Ubuntu 22.04.5 LTS   containerd://2.1.4
```

## Validate Both Pull Paths

The upgrade path is not exercised until the first upgrade, so a cluster can look healthy while being unable to upgrade.
Verify the upgrade path explicitly on each node before you need it.

Run the following script on each node. Replace `<account-id>`, `<region>`, `<repository-name>`, and `<upgrade-tag>` with
your values.

```shell
#!/bin/bash
REG=<account-id>.dkr.ecr.<region>.amazonaws.com
IMG=$REG/<repository-name>:<upgrade-tag>
PROV=/etc/kubernetes/credential-provider/ecr-credential-provider
PF=/etc/kubernetes/ecr/credentials

echo "== provider flags on the running kubelet (expect 2) =="
tr '\0' '\n' < /proc/$(systemctl show kubelet --property MainPID --value)/cmdline \
  | grep --count image-credential-provider

echo "== kubelet points at the profile-owned credentials file =="
systemctl show kubelet --property Environment --value | tr ' ' '\n' | grep AWS_SHARED

echo "== profile-owned file present? which key id? =="
if [ -f "$PF" ]; then grep --only-matching 'AKIA[A-Z0-9]*' "$PF" | head --lines 1
else echo "   ABSENT - the profile has not written it yet"; fi

echo "== can the credential provider resolve right now? =="
echo "{\"apiVersion\":\"credentialprovider.kubelet.k8s.io/v1\",\"kind\":\"CredentialProviderRequest\",\"image\":\"$IMG\"}" \
  | HOME=/root AWS_SDK_LOAD_CONFIG=1 AWS_SHARED_CREDENTIALS_FILE=$PF $PROV 2>&1 \
  | grep --only-matching '"password":"[^"]*"' >/dev/null && echo "   RESOLVED" || echo "   FAILED"
```

A passing node reports `2` provider flags, `AWS_SHARED_CREDENTIALS_FILE=/etc/kubernetes/ecr/credentials`, an `AKIA` key
ID in the profile-owned file, and `RESOLVED`.

## Rotate the ECR Credential

Rotation matters most for a cluster deployed today and upgraded much later on a key that has since changed. Update the
two masked variables to the new key and apply the profile.

:::warning

Never combine a credential change with a change to the provider image tag (`system.uri`) in the same apply. The upgrade
task pod pulls the new image before the node reboots into it, while the profile `boot` stage writes the credential only
at a boot. Combining the two removes the reboot that the credential depends on, and the pull fails with
`authorization failed: no basic auth credentials`. Apply the credential change first, let it complete, and then change
the image tag in a separate apply.

:::

A credential-only change triggers a rolling node plan. Palette cordons, drains, and reboots each node in turn, roughly
two minutes apart, and drives the reboots itself with no manual intervention. Running workloads are not disturbed by the
credential change, because their images are already local, but plan for the rolling reboot.

After the rolling apply completes, confirm the new key on each node. Verify the credential directly against ECR rather
than through the credential helper. The helper caches tokens and does not check their expiry when reading the cache, so
it can report success with a retired key. A raw `aws ecr get-authorization-token` call against the credentials file is
the reliable check.

```shell
grep --only-matching 'AKIA[A-Z0-9]*' /etc/kubernetes/ecr/credentials   # the new key ID
grep --only-matching 'AKIA[A-Z0-9]*' /root/.aws/credentials            # still the old key, by design

AWS_SHARED_CREDENTIALS_FILE=/etc/kubernetes/ecr/credentials AWS_PROFILE=default \
  aws ecr get-authorization-token --region <region> \
  --query "authorizationData[0].expiresAt" --output text
```

## Upgrade the Cluster

If you changed the credential in [Rotate the ECR Credential](#rotate-the-ecr-credential), confirm that the rolling
reboot finished on every node and that the live credentials file shows the new key before you upgrade. Checking
`/oem/85_cluster_config.yaml` is not enough, because that reflects delivery rather than what Kubelet reads.

```shell
grep --only-matching 'AKIA[A-Z0-9]*' /etc/kubernetes/ecr/credentials   # the file kubelet reads
stat --format %y /etc/kubernetes/ecr/credentials          # confirm it was written after the last boot
uptime --since
```

Then point `system.uri` at the new tag and apply the profile. On a host deployed with this user data from the start, and
with no credential change involved, this is a single profile update that changes only `system.uri`. No second apply, no
manual reboot, and no node access are required.

```yaml
options:
  system.uri: "<account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:<upgrade-tag>"
```

Watch the upgrade task pods pull the new provider image.

```shell
kubectl describe pod --namespace spectro-task-<cluster-id> apply-control-plan-on-edge-<id>
```

```shell hideClipboard title="Example Output"
Normal  Pulling  kubelet  Pulling image "<account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:<upgrade-tag>"
Normal  Pulled   kubelet  Successfully pulled image ... Image size: 1710678131 bytes.
```

:::info

The provider image is large, roughly 1.7 GB, and there is no intermediate output during the pull, so a healthy pull and
a hung one look the same for several minutes. Do not conclude that the pull failed early. Wait for `ImagePullBackOff` or
`ErrImagePull`, which is the real failure signal.

:::

## Troubleshooting

The error `authorization failed: no basic auth credentials` appears identically whether the credential provider is
missing, its credential chain is broken, or the key is invalid. The error names neither ECR nor your configuration, so
always verify the credential itself against ECR, not just the provider wiring. An invalid key is especially misleading:
the AWS CLI reports `UnrecognizedClientException`, but the credential helper reports only
`credentials not found in native keychain`, and Kubelet surfaces it as `no basic auth credentials`.

| Symptom                                                               | Likely cause                                                                          | Check                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Kubelet does not start; `Failed to register CRI auth plugins`         | The flags are set but the provider binary is missing or misplaced                     | `ls -l /etc/kubernetes/credential-provider/`                                                  |
| `providers.defaultCacheDuration: Required value`; Kubelet exits       | `defaultCacheDuration` is omitted from the configuration                              | `cat /etc/kubernetes/credential-provider-config.yaml`                                         |
| `kubeadm init` stuck at `wait-control-plane`; port `6443` never opens | Kubelet exited on an invalid provider configuration and never retried                 | `systemctl is-failed kubelet`                                                                 |
| Cluster creates fine, upgrade fails with `ImagePullBackOff`           | The upgrade path is not configured                                                    | Provider flags on the running Kubelet, expect `2`                                             |
| `ImagePullBackOff` right after a combined credential and tag apply    | The credential was delivered to `/oem` but never executed, because no reboot happened | Compare `stat --format %y /etc/kubernetes/ecr/credentials` against `uptime --since`           |
| The creation path reports OK on a key you deleted                     | A cached token in `/root/.ecr/cache.json` that ignores expiry                         | Raw `aws ecr get-authorization-token` against the credentials file                            |
| All nodes remain `NotReady` after creation                            | Typically unrelated to ECR                                                            | Check the `stylus-operator` service logs for a `lease lock` message, then restart the service |

## Next Steps

Configure the cluster profile and, if you use basic authentication with a private provider registry instead of ECR,
refer to [Deploy Cluster with a Private Provider Registry](./deploy-private-registry.md). To upgrade a cluster to a new
provider image, refer to [Update a Cluster](../../../cluster-management/cluster-updates.md).
