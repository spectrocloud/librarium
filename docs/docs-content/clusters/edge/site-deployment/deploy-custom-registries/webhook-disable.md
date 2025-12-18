---
sidebar_label: "Disable Webhook to Customize Image Pull Behavior"
title: "Disable Webhook to Customize Image Pull Behavior"
description: "Learn how to disable the Palette agent webhook to give you greater freedom in designing registry image
  pull behavior.
  "
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

Palette Edge allows you to deploy clusters to an external registry and use an in-cluster primary registry without
manually configuring rewrites. This is possible because the Palette agent uses a webhook to redirect image pulls to the
appropriate locations depending on your configuration.

While the webhook makes using an external registry or the primary registry more streamlined, it can limit your
flexibility to configure your own image pull behavior. This guide guides you through how to disable the Palette agent
webhook and provides an example custom image pull configuration.

## What Happens When You Disable the Webhook

When the agent webhook is disabled, the Palette agent will not redirect any image pull operation by default. This means
that even if you specify an external registry in the `user-data` file, the Palette agent will not pull images from that
registry unless it is otherwise configured to do so. This also means that the Palette agent will not pull images from
the primary registry, even if the images are downloaded and stored in the registry, unless it is otherwise configured to
do so. Disabling the webhook removes restrictions, but does place the burden of ensuring that images are pulled from the
correct locations on yourself.

You may consider disabling the webhook if you want to configure your cluster to pull images from multiple authenticated
registries, or if you do not want the default behavior that forces image pulls to be redirected to the primary registry.
Once the webhook is disabled, you can then take advantage of the rewrite features of some Kubernetes distributions such
as K3s and RKE2, or other redirect mechanism that you implement on your own to customize the image pull behavior.

## Prerequisites

- The process to disable webhook is based on the EdgeForge process. We recommend that you familiarize yourself with
  [EdgeForge](../../edgeforge-workflow/edgeforge-workflow.md) and the process to build Edge artifacts.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 150 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [Spectro Cloud](https://console.spectrocloud.com) account.

## Procedure

### Disable Webhook

1. Clone the **CanvOS** repository.

   ```shell
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change into the **CanvOS** directory.

   ```shell
   cd CanvOS
   ```

3. View the available tags and use the latest available tag. This guide uses `v4.5.0` as an example.

   ```shell
   git tag
   git checkout v4.5.0
   ```

4. In your `user-data` file, set `stylus.imageRedirectWebhook.enable` to `false`. This parameter defaults to true if you
   do not explicitly set it to `false`.

   ```yaml {7}
   #cloud-config
   stylus:
     site:
       edgeHostToken: XXXXXXXXXXXXXX
       paletteEndpoint: XXXXXX
       projectUid: XXXXXX
     imageRedirectWebhook:
       enable: false
   ```

5. Follow the rest of the [Build Edge Artifact](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide and
   build the Installer ISO with the user data configurations. The Edge clusters provisioned with the ISO will no longer
   automatically redirect image pull requests to the external registry or the local Harbor registry.

### Redirect Image Pull

The process to redirect image pulls varies by Kubernetes distribution as well as your registry setup. This section
provides an example that shows how you might customize the image pull behavior of your Edge cluster using PXK-E.

6. Log in to [Palette](https://console.spectrocloud.com).

7. From the left **Main Menu**, click **Profiles**. Click on the profile you use to deploy your Edge cluster.

8. (PXK-E Only) In the Kubernetes layer of the profile, include the following lines in the `initramfs` stage to adjust
   the containerd configuration to supports reading additional files, which you will use to configure the redirect
   behavior and provide registry credentials.

   ```yaml
   stages:
     initramfs:
       - name: "Manage containerd config"
         files:
           - path: /etc/containerd/config.toml
             permissions: 0644
             owner: 0
             group: 0
             content: |-
               version = 2
               imports = ["/etc/containerd/conf.d/*.toml"]
               [plugins]
                 [plugins."io.containerd.grpc.v1.cri"]
                   sandbox_image = "registry.k8s.io/pause:3.9"
                   enable_unprivileged_ports = true
                   enable_unprivileged_icmp = true
                 [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
                   runtime_type = "io.containerd.runc.v2"
                 [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
                   SystemdCgroup = true
                 [plugins."io.containerd.grpc.v1.cri".registry]
                   config_path = "/etc/containerd/certs.d"
   ```

   :::info

   This configuration change is only needed to PXK-E. Since it changes the `initramfs` stage, this will require a reboot
   of the node. If you are using K3s or RKE2, the ability fo read additional files is enabled by default and you don't
   need to add this configuration.

   :::

9. In the Kubernetes layer of the profile, include the following lines in the reconcile stage. For more information,
   refer to [Cloud-init Stages](../../edge-configuration/cloud-init.md). Replace the server address and the host address
   with your registry and its mirror. Since you are only editing the reconcile stage, this will not result in a reboot
   or service restart for your cluster.

   The following example will redirect image pulls for `https://gcr.io` to `https://gcr-io-mirror.company.local`.

   ```yaml {9-11}
   stages:
     reconcile:
       - name: "Redirect registries"
         files:
           - path: /etc/containerd/certs.d/gcr.io/hosts.toml
             owner: 0
             group: 0
             permissions: 0644
             content: |-
               server = "https://gcr.io"
               [host."https://gcr-io-mirror.company.local"]
                   capabilities = ["pull", "resolve"]
   ```

### Provide Registry Credentials

If you are using public registries that do not require authentication, you can skip this step.

If your registries require authentication, you will need to provide credentials to enable image pulls. This example uses
an open source generic Kubernetes credentials provider to provide the resources. There are other resources that you can
take advantage of to provide registry credentials, including using a `registry.yaml` file in
[K3s](https://docs.k3s.io/installation/private-registry) or [RKE2](https://docs.rke2.io/install/private_registry).
However, the advantage of the approach used in this example is that after installation, you will not need to restart
your cluster services to update the registry paths or the registry credentials.

:::info

Refer to the
[`generic-credential-provider` GitHub repository](https://github.com/JonTheNiceGuy/generic-credential-provider) for the
source code for the credential provider on GitHub.

:::

12. Install the generic credential provider by including the following lines in either the OS layer or the Kubernetes
    layer of the cluster profile. This will create the file at `/usr/local/bin/generic-credential-provider`, populate
    the content, and set the file permissions to ensure that it is executable, during the `initramfs` stage. Click on
    the box below to expand the instructions.

     <details>

    <summary>Install Credential Provider </summary>

    ```
    stages:
      initramfs:
          - name: "Install generic-credential-provider binary"
            files:
              - path: /usr/local/bin/generic-credential-provider
                permissions: 0755
                owner: 0
                group: 0
                content: |-
                  #!/usr/bin/env python3
                  import os
                  import sys
                  import json
                  import syslog
                  import logging
                  import argparse

                  logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s')

                  class generic_credential_provider:
                      def __init__(self):
                          args = generic_credential_provider_utilities.parse_args()
                          if not args.debug:
                              logging.disable(logging.DEBUG)
                          if args.version:
                              print(f"generic-credential-provider version 1.0.0")
                              exit(0)

                          base_path = args.credroot

                          syslog.openlog("generic-credential-provider", syslog.LOG_PID, syslog.LOG_USER)

                          # Read the input JSON from stdin
                          input_json = json.load(sys.stdin)
                          repository = generic_credential_provider_utilities.get_image_repository(input_json)

                          # Generate possible JSON filenames
                          possible_filenames = generic_credential_provider_utilities.generate_possible_filenames(repository)

                          # Search for the JSON file in the specified directory
                          found_json_file = generic_credential_provider_utilities.find_json_file(possible_filenames, base_path)

                          if found_json_file:
                              # If a matching JSON file is found, read the username and password
                              credentials = generic_credential_provider_utilities.read_credentials(found_json_file)
                              username = credentials.get("username", "")
                              password = credentials.get("password", "")
                              duration = credentials.get("duration", "0h5m0s")
                          else:
                              syslog.syslog(syslog.LOG_ERR, f"Failed to fulfill credential request for {repository}")
                              logging.error(f'Error running credential provider plugin: {repository} is an unknown source')
                              exit(1)

                          # Create the output JSON response
                          output_json = {
                              "kind": "CredentialProviderResponse",
                              "apiVersion": "credentialprovider.Kubelet.k8s.io/v1",
                              "cacheKeyType": "Registry",
                              "cacheDuration": duration,
                              "auth": {
                                  repository: {
                                      "username": username,
                                      "password": password
                                  }
                              }
                          }
                          syslog.syslog(syslog.LOG_INFO, f"Credential request fulfilled for {repository}")

                          # Print the output JSON response to stdout
                          json.dump(output_json, sys.stdout)

                  class generic_credential_provider_utilities:
                      def parse_args():
                          parser = argparse.ArgumentParser(description="A generic credential provider for Kubernetes")

                          parser.add_argument('--version', '-v', action='store_true', help="version for generic-credential-provider")
                          parser.add_argument('--debug', '-d', action='store_true', help="Enable debug output")
                          parser.add_argument('--credroot', '-c', help="Provide a new credential root, only used for testing", default="/etc/kubernetes/registries/")

                          return parser.parse_args()

                      def get_image_repository(input_json):
                          image = input_json.get("image", "")
                          repository = image.split('/')[0].split(':')[0]
                          logging.debug(f"Got repository name: {repository}")
                          return repository

                      def generate_possible_filenames(repository):
                          possible_filenames = []
                          possible_filename = ""
                          parts = repository.split(".")
                          parts.reverse()
                          for part in parts:
                              if possible_filename == "":
                                  possible_filename = part
                              else:
                                  possible_filename = f"{part}.{possible_filename}"
                              possible_filenames.append(possible_filename)
                          possible_filenames.reverse()
                          return possible_filenames

                      def find_json_file(possible_filenames, base_path):
                          for filename in possible_filenames:
                              json_file_path = os.path.join(base_path, f"{filename}.json")
                              logging.debug(f"Testing json_file_path: {json_file_path}")
                              if os.path.exists(json_file_path):
                                  logging.debug(f"Got it")
                                  return json_file_path
                          return None

                      def read_credentials(json_file_path):
                          with open(json_file_path, "r") as json_file:
                              credentials = json.load(json_file)
                              logging.debug(f"Got credentials: {credentials}")
                              return credentials

                  if __name__ == "__main__":
                      generic_credential_provider()
    ```

     </details>

13. In the Kubernetes layer of your cluster, add the following lines to the `kubeadmconfig.KubeletExtraArgs` field. This
    tells Kubernetes to use the credential provider you installed in the previous step.

    ```yaml
    KubeletExtraArgs:
      cluster:
        config: |
          initConfiguration:
            nodeRegistration:
              KubeletExtraArgs:
                image-credential-provider-bin-dir: /usr/local/bin
                image-credential-provider-config: /opt/kubernetes/generic-credential-provider-config.json
          joinConfiguration:
            discovery: {}
            nodeRegistration:
              KubeletExtraArgs:
                image-credential-provider-bin-dir: /usr/local/bin
                image-credential-provider-config: /opt/kubernetes/generic-credential-provider-config.json
    ```

14. In the Kubernetes or OS layer of your cluster profile, use a `reconcile` stage to define the JSON file with the
    `CredentialProviderConfig` for Kubelet. This configuration specifies the registries that will use the credential
    provider.

    ```yaml {17,18}
    stages:
      reconcile:
        - name: "Registry credential management"
          files:
            - path: /opt/kubernetes/generic-credential-provider-config.json
              owner: 0
              group: 0
              permissions: 0644
              content: |-
                {
                  "apiVersion": "Kubelet.config.k8s.io/v1",
                  "kind": "CredentialProviderConfig",
                  "providers": [
                    {
                      "name": "generic-credential-provider",
                      "matchImages": [
                        "*.io",
                        "*.*.io"
                      ],
                      "defaultCacheDuration": "5m",
                      "apiVersion": "credentialprovider.Kubelet.k8s.io/v1"
                    }
                  ]
                }
    ```

    Registry URLs that match the patterns in the `mathImages` field will use this provider for credentials. For example,
    `*.io` would match `docker.io`, `quay.io`, `gcr.io` and `*.*.io` would cover URLs like `us.gcr.io`. Refer to
    [Kubernetes documentation](https://kubernetes.io/docs/tasks/administer-cluster/Kubelet-credential-provider/#configure-a-Kubelet-credential-provider)
    about the parameters you can use to configure credential providers for Kubelet.

    :::tip

    We suggest that you define a broad pattern, as updating this file requires Kubelet to restart. There are no adverse
    effects when the pattern matches a registry URL for which there is no defined credentials: the Palette agent will
    still perform the image pull, but it will not use the credential provider.

    :::

15. With the credential provider installed and configured, you can now provide your registry credentials. Similar to
    other configurations, you will also perform this step during the `reconcile` stage. Add the following lines to your
    cluster profile in the OS or the Kubernetes layer. Replace `<registry-url>` with the URL of your image registry.
    Replace the username and password fields with your credentials.

    ```yaml {5,11-13}
    stages:
      reconcile:
        - name: "Registry credential management"
          files:
            - path: /etc/kubernetes/registries/<registry-url>.json
              owner: 0
              group: 0
              permissions: 0644
              content: |-
                {
                  "username": "proxy-access",
                  "password": "*****",
                  "duration": "0h5m0s"
                }
    ```

    :::warning

    Avoid entering sensitive information like passwords directly into your cluster profile in plain text. Instead, you
    can either use a
    [cluster profile variable](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
    or a [macro](../../../cluster-management/macros.md).

    :::

    The script will lookup the JSON file by registry naming and allows partial matches. For example, `gcr.io.json` would
    match `gcr.io` as well as `us.gcr.io`, and those image pulls to those registries will use the credentials your
    provided.

## Validate

1. Use the ISO to install Palette Edge on an Edge host. For more information, refer to
   [Installation](../site-installation/site-installation.md).

2. Create a cluster profile that references the image registries you configured.

3. Deploy a cluster with the cluster profile. Confirm that the cluster is able to download the necessary images.
