---
sidebar_label: "Build RHEL 9 STIG-based Images"
title: "Build RHEL 9 STIG-based Images"
description: "Learn how to build RHEL 9 STIG-based Images."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
tags: ["edge", "rhel", "stig"]
---

[Security Technical Implementation Guides (STIGs)](https://access.redhat.com/compliance/disa-stig?utm_source=chatgpt.com)
are standardized security hardening guidelines developed by the Defense Information Systems Agency (DISA) to help secure
OS and applications in regulated environments. With Palette Edge, you can build Red Hat Enterprise Linux (RHEL) 9
STIG-compliant images for your Edge hosts using the EdgeForge workflow.

In this guide, you will use the CanvOS utility to build a base RHEL 9 STIG image and then build an ISO image based on it
for your Palette Edge deployment.

## Limitations

- The RHEL 9 STIG implementation in Palette Edge deviates from certain STIG compliance requirements due to platform
  design and Kubernetes operational needs:

  - Kairos-based systems use an
    [A/B partitioning scheme](../../cluster-management/upgrade-behavior.md#ab-partitioning-in-upgrades) for system
    recovery and upgrades. This does not align with STIG partitioning requirements.

  - Mount points are managed by Kairos and cannot be adjusted to fully match STIG guidelines.

  - [Federal Information Processing Standards (FIPS)](../palette-canvos/fips.md) mode is enabled in Palette Edge via
    `user-data` configuration. Although the system operates in FIPS mode, it does not meet the criteria used by STIG
    validation checks, resulting in false negatives.

  - Kairos-based images do not include all STIG-recommended packages (for example, AIDE and USBGuard). These components
    are not required for Kubernetes operation, but you can add them by
    [customizing the Dockerfile](../palette-canvos/palette-canvos.md?difficulty=advanced_create_artifacts#instructions-1).
    However, only the modules included by default are verified by Spectro Cloud.

  - Security-Enhanced Linux (SELinux) is not enabled on Kairos-based systems.

  - IP forwarding (`net.ipv4.ip_forward` and `net.ipv4.conf.all.forwarding`) is enabled to support Kubernetes
    networking, which deviates from STIG requirements.

  - Reverse path filtering (`rp_filter`) is disabled to prevent interference with Kubernetes overlay networking.

- The RHEL 9 STIG implementation in Palette Edge only supports the following Kubernetes distributions:

  - <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> (the
    `K8S_DISTRIBUTION=kubeadm` value in the `.arg` file for non-FIPS or `K8S_DISTRIBUTION=kubeadm-fips` for FIPS)

  - <VersionedLink text="Palette Optimized RKE2" url="/integrations/packs/?pack=edge-rke2" /> (the
    `K8S_DISTRIBUTION=rke2` value in the `.arg` file)

## Prerequisites

- Valid Red Hat subscription credentials (username and password).

- A Palette registration token for pairing Edge hosts with Palette. You need tenant admin access to Palette to generate
  a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../../site-deployment/site-installation/create-registration-token.md) guide.

- A physical or virtual Linux machine with an AMD64 (also known as `x86_64`) processor architecture and the following
  minimum hardware configuration:

  - 4 CPUs
  - 8 GB memory
  - 150 GB storage

- A user account with permission to run commands using `sudo` privileges.

- Access to a public or private image registry and permissions to push images. This page uses a public
  [Docker Hub](https://www.docker.com/products/docker-hub/) registry as an example. If you need to use a private
  registry, refer to the
  [Deploy Cluster with a Private Provider Registry](../../site-deployment/deploy-custom-registries/deploy-private-registry.md)
  guide for instructions on how to configure the credentials.

- The following software installed on the Linux machine:

  - [Docker Engine](https://docs.docker.com/engine/install/) with BuildKit enabled (default in Docker 23+; set
    `DOCKER_BUILDKIT=1` for older versions)
  - (Optional) [Earthly](https://earthly.dev/)
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Build RHEL 9 STIG-based Images

1.  Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository, which contains the starter code.

    ```bash
    git clone https://github.com/spectrocloud/CanvOS.git
    ```

2.  Navigate to the `CanvOS` directory.

    ```bash
    cd CanvOS
    ```

3.  View the available [git tags](https://github.com/spectrocloud/CanvOS/tags).

    ```bash
    git tag
    ```

4.  Check out the newest available tag.

    ```bash
    git checkout <newest-available-tag>
    ```

5.  (Optional) To ensure reproducible builds and consistent compliance behavior, you can pin a specific STIG content
    version before building the base RHEL 9 STIG image.

    ```bash
    bash rhel-stig/scripts/update-stig-content.sh <stig-content-version>
    ```

    :::tip

    You can find the latest STIG content version via GitHub API using the following command (requires jq).

    ```bash
    curl --silent https://api.github.com/repos/ComplianceAsCode/content/releases/latest | jq --raw-output .tag_name
    ```

    :::

    Verify that the command generates static remediation artifacts `ssg-rhel9-ds.xml` and `stig-fix.sh` in the `static`
    directory. These files are copied into the image during the build.

    ```bash
    ls rhel-stig/static
    ```

    ```bash hideClipboard title="Example Output"
    VERSION  ssg-rhel9-ds.xml  stig-fix.sh
    ```

    If you skip this step, the build uses the STIG content available in the system repositories at build time and
    generates remediation dynamically. As a result, different STIG versions may be applied across builds.

6.  Build the base RHEL 9 STIG image. Replace `<username>` and `<password>` with your Red Hat credentials and
    `<base-image-name>` with the desired image name.

    <Tabs group="fips-compliance">

    <TabItem value="Non-FIPS">

    ```bash
    bash rhel-stig/build.sh.rhel9 <username> <password> <base-image-name> false
    ```

    </TabItem>

    <TabItem value="FIPS">

    ```bash
    bash rhel-stig/build.sh.rhel9 <username> <password> <base-image-name> true
    ```

    </TabItem>

    </Tabs>

    The build process takes some time to complete. You can monitor the progress in the terminal.

    ```bash hideClipboard
    Building RHEL 9 STIG image...
    Building 510.1s (41/41) FINISHED
    ```

7.  Confirm the RHEL 9 STIG image was built successfully. Replace `<base-image-name>` with the image name.

    ```bash
    docker images | grep <base-image-name>
    ```

    ```bash hideClipboard title="Example Output"
    WARNING: This output is designed for human readability. For machine-readable output, please use --format.
    <base-image-name>:latest                                              29814a348637        1.9GB             0B
    ```

8.  After you built the image, push it to a remote container registry so Earthly can access it. This guide uses Docker
    as an example. Issue the following command to log in to Docker Hub. Provide your Docker ID and password when
    prompted.

    ```bash
    docker login
    ```

    ```bash hideClipboard
    Login Succeeded
    ```

    Tag the image. Replace `<registry>` and `<tag>` with values appropriate for your environment.

    ```bash
    docker tag <base-image-name> <registry>/<base-image-name>:<tag>
    ```

    Push the image to the registry.

    ```bash
    docker push <registry>/<base-image-name>:<tag>
    ```

9.  Issue the command below to create an `.arg` file. Configure the RHEL OS (`OS_DISTRIBUTION=rhel`) and the AMD64
    architecture (`ARCH=amd64`). Replace the placeholders with the desired values.

    <Tabs group="fips-compliance">

    <TabItem value="Non-FIPS">

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=<image-registry>
    OS_DISTRIBUTION=rhel
    IMAGE_REPO=<image-repository>
    K8S_DISTRIBUTION=<k8s-distribution> # the supported values are `rke2` and `kubeadm`
    K8S_VERSION=<k8s-version>
    ARCH=amd64
    BASE_IMAGE=<base-image-name>
    IMAGE_NAME=<image-name>
    EOF
    ```

    </TabItem>

    <TabItem value="FIPS">

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=<image-registry>
    OS_DISTRIBUTION=rhel
    IMAGE_REPO=<image-repository>
    K8S_DISTRIBUTION=<k8s-distribution> # the supported values are `rke2` and `kubeadm-fips`
    K8S_VERSION=<k8s-version>
    FIPS_ENABLED=true
    ARCH=amd64
    BASE_IMAGE=<base-image-name>
    IMAGE_NAME=<image-name>
    EOF
    ```

    </TabItem>

    </Tabs>

    Refer to [Edge Artifact Build Configurations](./arg.md) for a complete list of supported configuration parameters.

10. Prepare the `user-data` file. Refer to
    [Prepare User Data and Argument Files](../prepare-user-data.md#prepare-user-data) for instructions. Additionally,
    you must configure firewall rules. Expand the applicable sections below to display the list of required
    configurations.

        <details>

             <summary>Kubernetes Core</summary>
             | **Port / Range** | **Protocol** | **Direction** | **Description** | **Notes** |
             | ---------------- | ------------ | ------------- | -------------------------------- | ------------- |
             | 6443 | Transmission Control Protocol (TCP)| Inbound | API server | |
             | 6444 | TCP | Inbound | Alternative API server (RKE2 or K3s)| |
             | 9345 | TCP | Both | RKE2 supervisor API | RKE2-specific |
             | 2379–2380 | TCP | Inbound | etcd client and peer API | |
             | 2381 | TCP | Inbound | etcd metrics endpoint | |
             | 10250 | TCP | Both | Kubelet API | |
             | 10257 | TCP| Inbound | kube-controller-manager (secure) | |
             | 10259 | TCP | Inbound | kube-scheduler (secure) | |
             | 30000–32767| TCP / User Datagram Protocol (UDP) | Inbound | NodePort service range | |

        </details>

        <details>

            <summary>CNI: Cilium, Calico, Flannel, Weave</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                 | **Notes**                 |
            | ---------------- | ------------ | ------------- | ------------------------------- | ------------------------- |
            | 8472             | UDP          | Both          | Virtual Extensible Local Area Network (VXLAN) overlay                   | Cilium, Flannel           |
            | 4789             | UDP          | Both          | VXLAN overlay (alternative port)        | Calico, Flannel           |
            | 179              | TCP          | Both          | Border Gateway Protocol (BGP) peering                     | Calico, Cilium            |
            | 4240             | TCP          | Both          | Cilium health checks            | Cilium                    |
            | 4244             | TCP          | Both          | Hubble server (flow visibility) | Cilium                    |
            | 4245             | TCP          | Both          | Hubble Relay                    | Cilium                    |
            | 51871            | UDP          | Both          | WireGuard tunnel                | Cilium or Flannel if enabled |
            | 5473             | TCP          | Both          | Calico Typha proxy              | Calico                    |
            | 9099             | TCP          | Inbound       | Felix health check              | Calico                    |
            | 6783–6784        | TCP / UDP      | Both          | Weave Net control and data plane  | Weave               |
            | 12345            | UDP          | Both          | Weave Net gossip protocol (node communication)| Weave                 |
            | Protocol 4       | IP in IP (IPIP)         | Both          | IPIP encapsulation          | Calico IPIP mode          |

        </details>

        <details>

            <summary>MetalLB</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**               | **Notes**           |
            | ---------------- | ------------ | ------------- | ----------------------------- | ------------------- |
            | 7472             | TCP          | Inbound       | Speaker Prometheus metrics    |                     |
            | 7473             | TCP          | Inbound       | Controller Prometheus metrics |                     |
            | 7946             | TCP/UDP      | Both          | memberlist (Layer 2 speaker coordination)|                     |
            | 179              | TCP          | Both          | BGP mode (upstream router)    | Shared with CNI BGP |

        </details>

        <details>

            <summary>Longhorn</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                     | **Notes**                  |
            | ---------------- | ------------ | ------------- | ----------------------------------- | -------------------------- |
            | 9500             | TCP          | Both          | Manager API and manager–replica communication |                            |
            | 9501             | TCP          | Both          | Conversion Webhook                  | v1.5.0+                    |
            | 9502             | TCP          | Both          | Admission Webhook                   | v1.5.0+                    |
            | 9503             | TCP          | Both          | Recovery Backend                    | v1.5.0+                    |
            | 9504             | TCP          | Both          | Instance Manager (data plane)       |                            |
            | 9505             | TCP          | Both          | Share Manager (shared read/write access via a Network File System (NFS))             |                            |
            | 9506             | TCP          | Both          | Backing Image Manager               |                            |
            | 10000–12000      | TCP          | Both          | Instance manager pod replication    | Required per Longhorn documenttion |
            | 8080             | TCP          | Inbound       | Longhorn UI      | Via Ingress or port-forward   |

        </details>

        <details>

            <summary>Rook-Ceph</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                                     |
            | ---------------- | ------------ | ------------- | --------------------------------------------------- |
            | 6789             | TCP          | Both          | Ceph Monitor (Messenger v1)                         |
            | 3300             | TCP          | Both          | Ceph Monitor (Messenger v2)                         |
            | 6800–7300        | TCP          | Both          | Object Storage Daemon (OSD) ports (up to 3 per OSD) |
            | 7480             | TCP          | Inbound       | Reliable Autonomic Distributed Object Store (RADOS) Gateway (RGW) object storage endpoint over Hypertext Transfer Protocol (HTTP)|
            | 9283             | TCP          | Inbound       | Ceph Manager Prometheus metrics                     |
            | 8443             | TCP          | Inbound       | Ceph dashboard over Hypertext Transfer Protocol Secure (HTTPS)|

        </details>

        <details>

            <summary>Prometheus, Grafana, Alertmanager</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                                                                   |           |
            | ---------------- | ------------ | ------------- | --------------------------------------------------------------------------------- | --------- |
            | 9090             | TCP          | Inbound       | Prometheus server UI and API |
            | 9091             | TCP          | Inbound       | Pushgateway                                                                       |           |
            | 9093             | TCP          | Inbound       | Alertmanager HTTP endpoint                                                        |           |
            | 9094             | TCP/UDP      | Both          | Alertmanager cluster high availability (HA) mesh                                  |           |
            | 9100             | TCP          | Inbound       | Node Exporter metrics endpoint                                                    |           |
            | 3000             | TCP          | Inbound       | Grafana UI                                                                        |           |
            | 6060             | TCP          | Inbound       | Profiling endpoint (`pprof`)                                                      |           |

        </details>

        <details>

            <summary>Nginx Ingress</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                   |
            | ---------------- | ------------ | ------------- | --------------------------------- |
            | 80               | TCP          | Inbound       | HTTP ingress                      |
            | 443              | TCP          | Inbound       | HTTPS ingress                     |
            | 8443             | TCP          | Inbound       | Admission webhook                 |
            | 10254            | TCP          | Inbound       | Health check and metrics endpoint |

        </details>

        <details>

            <summary>Vault</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                                             | **Notes**  |
            | ---------------- | ------------ | ------------- | ----------------------------------------------------------- | ---------- |
            | 8200             | TCP          | Inbound       | Vault API and UI                                            |            |
            | 8201             | TCP          | Both          | Vault cluster communication (Raft and HA) |            |
            | 8202             | TCP          | Both          | Vault replication (disaster recovery (DR) and performance)  | Enterprise |

        </details>

        <details>

            <summary>Misc, System</summary>
            | **Port / Range** | **Protocol** | **Direction** | **Description**                                                                                       | **Notes**                 |
            | ---------------- | ------------ | ------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- |
            | 22               | TCP          | Inbound       | Secure Shell (SSH)                                                                                    |                           |
            | 5080             | TCP          | Inbound       | Local UI                                                                                              |                           |
            | 8500             | TCP          | Inbound       | Consul HTTP API                                                                                       | If used                   |
            | 5355             | UDP          | Both          | Link-Local Multicast Name Resolution (LLMNR) and Multicast Domain Name System (mDNS) (`systemd-resolved`) | Can usually be restricted |
            | Protocol 4       | IPIP         | Both          | IP-in-IP encapsulation                                                                                | Calico IPIP mode          |

        </details>

         The following example shows how to configure `firewalld` in `user-data` to create a dedicated `k8s` zone and open the ports and protocols required for Kubernetes and commonly used add-ons.

        <details>

        <summary>Example</summary>

        ````yaml
         #cloud-config
         stylus:
           site:
             paletteEndpoint: api.spectrocloud.com
             edgeHostToken: <your-registration-token>

                 install:
                   poweroff: true

                 stages:
                   initramfs:
                     - name: Create user and assign to sudo group
                       users:
                         kairos:
                           groups:
                             - sudo
                           passwd: kairos

                   boot:
                     - name: configure firewalld baseline for k8s
                       commands:
                         - |-
                           firewall-cmd --set-default-zone=k8s || true
                           firewall-cmd --reload || true

                   network.after:
                     - name: configure firewalld for k8s
                       commands:
                         - |-
                           firewall-cmd --permanent --new-zone=k8s || true
                           firewall-cmd --reload
                           firewall-cmd --permanent --zone=k8s --add-service=ssh
                           firewall-cmd --permanent --zone=k8s --add-forward
                           firewall-cmd --permanent --zone=k8s --add-masquerade
                           firewall-cmd --permanent --zone=k8s --add-source=192.168.0.0/16
                           firewall-cmd --zone=k8s --add-source=10.10.0.0/16 --permanent
                           firewall-cmd --permanent --zone=k8s --add-port=6443/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=4443/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=6444/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=7472/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=7473/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=2379-2380/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=10250/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=10259/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=10257/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=30000-32767/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=30000-32767/udp
                           firewall-cmd --permanent --zone=k8s --add-port=2381/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=7946/udp
                           firewall-cmd --permanent --zone=k8s --add-port=9100/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=8472/udp
                           firewall-cmd --permanent --zone=k8s --add-port=5355/udp
                           firewall-cmd --permanent --zone=k8s --add-port=12345/udp
                           firewall-cmd --permanent --zone=k8s --add-port=4789/udp
                           firewall-cmd --permanent --zone=k8s --add-port=179/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=4240/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=4244-4245/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=51871/udp
                           firewall-cmd --permanent --zone=k8s --add-port=5473/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=6783-6784/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=6783-6784/udp
                           firewall-cmd --permanent --zone=k8s --add-port=9500-9506/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=10000-12000/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=443/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=6789/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=3300/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=6800-7300/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=7480/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9283/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=8443/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=8500/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9345/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=7946/tcp
                           firewall-cmd --permanent --zone=k8s --add-protocol=4
                           firewall-cmd --permanent --zone=k8s --add-port=3000/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=6060/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9090/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9091/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=8080/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9094/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9094/udp
                           firewall-cmd --permanent --zone=k8s --add-port=9093/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=9093/udp
                           firewall-cmd --permanent --zone=k8s --add-port=80/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=10254/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=8200-8202/tcp
                           firewall-cmd --permanent --zone=k8s --add-port=5080/tcp
                           firewall-cmd --zone=k8s --add-source=100.64.192.0/23 --permanent
                           firewall-cmd --zone=k8s --add-rich-rule='rule family="ipv4" source address="0.0.0.0/0" destination address="255.255.255.255" protocol value="udp" accept' --permanent

                           IFACE="$(ip --oneline route show default | awk '{print $5; exit}')"
                           if [ -n "$IFACE" ]; then
                               firewall-cmd --zone=public --remove-interface="$IFACE" || true
                               firewall-cmd --zone=k8s --change-interface="$IFACE"
                           fi

                           firewall-cmd --set-default-zone=k8s
                           firewall-cmd --reload
                ```

        </details>

    :::warning

    Configure the firewall through `user-data`, as some rules are required during cluster registration. If you add them
    later (for example, in a cluster profile), overlay clusters may fail to come up.

    The example configuration is not exhaustive. Depending on the packs and applications deployed in the cluster, you
    may need to allow additional ports, protocols, or rich rules. Refer to the documentation for those components to
    determine the required network settings.

    :::

11. (Optional) To enable FIPS, add the following to your `user-data` `cloud-config` to set the required kernel boot
    option.

```yaml
#cloud-config
install:
grub_options:
  extra_cmdline: "fips=1 selinux=0"
```

12. Once the `user-data` file is ready, issue the following command to build the ISO image.

```bash
 sudo ./earthly.sh iso
```

The build process takes some time to finish.

```bash hideClipboard {2}
# Output condensed for readability
===================== Earthly Build SUCCESS =====================
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```

You can find the ISO image in the `build` folder.

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.
