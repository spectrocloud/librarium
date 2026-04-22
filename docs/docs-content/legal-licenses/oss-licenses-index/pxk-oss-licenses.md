---
sidebar_label: "Palette eXtended Kubernetes"
title: "PXK Open Source Licenses"
description:
  "Review the open source licenses tied to the libraries and modules currently in use by Palette eXtended Kubernetes
  (PXK)."
sidebar_position: 20
tags: ["legal", "licenses", "pxk"]
---

<!-- vale off -->
<!-- prettier-ignore -->
The following table lists the open source licenses associated with the libraries and modules currently in use by <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> and the Federal Information Processing Standards (FIPS) compliant version of PXK.

## PXK License

PXK is released under the [Apache-2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

## PXK Components

All PXK components and supporting open source components are compiled in their native programming language. Below is a
list of the core and auxiliary Kubernetes components that are included in PXK.

### Core Kubernetes Components

| **Component**      | **Description**                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| API Server         | The API server is the central management entity that receives all REST requests for the cluster.                                   |
| Controller Manager | The controller manager is a daemon that embeds the core control loops shipped with Kubernetes.                                     |
| Scheduler          | The scheduler is a daemon that finds the best node for a pod, based on the scheduling requirements you specify.                    |
| Kubelet            | The kubelet is the primary _node agent_ that is deployed on each node.                                                             |
| Kube-proxy         | The kube-proxy is a network proxy that operates on each node in your cluster, implementing part of the Kubernetes Service concept. |
| Kubeadm            | Kubeadm is a tool built to provide best-practice “fast paths” for creating Kubernetes clusters.                                    |
| Kubectl            | Kubectl is a command line interface for issuing commands against Kubernetes clusters.                                              |

### Auxiliary Kubernetes Components

| **Component** | **Description**                                                                               |
| ------------- | --------------------------------------------------------------------------------------------- |
| CoreDNS       | CoreDNS is a Domain Name System (DNS) server deployed as a cluster DNS service.               |
| Etcd          | Etcd is a distributed key-value store used as Kubernetes’ backing store for all cluster data. |

### Runtime Components

| **Component**           | **Description**                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| containerd              | Containerd is an industry-standard container runtime with an emphasis on simplicity, robustness, and portability. |
| containerd-shim         | Containerd-shim is a shim used by containerd to launch containers.                                                |
| containerd-shim-runc-v1 | Containerd-shim-runc-v1 is a shim used by containerd to launch containers.                                        |
| containerd-shim-runc-v2 | Containerd-shim-runc-v2 is a shim used by containerd to launch containers.                                        |
| ctr                     | Ctr is a command line interface for containerd.                                                                   |
| crictl                  | Crictl is a command line interface for CRI-compatible container runtimes.                                         |
| runc                    | Runc is a CLI tool for spawning and managing containers according to the OCI specification.                       |

## Open Source Dependencies

The following table lists the open source libraries and modules currently in use by PXK and the Federal Information
Processing Standards (FIPS) compliant version of PXK.

| Library                                                                                | Version                                           | License                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| bitbucket.org/bertimus9/systemstat                                                     | v0.5.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| cel.dev/expr                                                                           | v0.25.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| cloud.google.com/go/auth                                                               | v0.18.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| cloud.google.com/go/auth/oauth2adapt                                                   | v0.2.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| cloud.google.com/go/compute/metadata                                                   | v0.9.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| cyphar.com/go-pathrs                                                                   | v0.2.4                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| cyphar.com/go-pathrs                                                                   | v0.2.2                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| cyphar.com/go-pathrs                                                                   | v0.2.1                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| dario.cat/mergo                                                                        | v1.0.2                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/AdaLogics/go-fuzz-headers                                                   | v0.0.0-20240806141605-e8a1dd7889d6                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/alexflint/go-filemutex                                                      | v1.3.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/antlr4-go/antlr/v4                                                          | v4.13.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/apparentlymart/go-cidr                                                      | v1.1.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/aws/aws-sdk-go-v2                                                           | v1.41.4                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/config                                                    | v1.32.12                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/credentials                                               | v1.19.12                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/feature/ec2/imds                                          | v1.18.20                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/internal/configsources                                    | v1.4.20                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/internal/endpoints/v2                                     | v2.7.20                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/internal/ini                                              | v1.8.6                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding                          | v1.13.7                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/internal/presigned-url                            | v1.13.20                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/route53                                           | v1.62.4                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/secretsmanager                                    | v1.41.4                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/signin                                            | v1.0.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/sso                                               | v1.30.13                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/ssooidc                                           | v1.35.17                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/aws-sdk-go-v2/service/sts                                               | v1.41.9                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/aws/smithy-go                                                               | v1.24.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/azure-sdk-for-go                                                      | v68.0.0+incompatible                              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Azure/go-ansiterm                                                           | v0.0.0-20250102033503-faa5f7b0171c                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Azure/go-ansiterm                                                           | v0.0.0-20230124172434-306776ec8161                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Azure/go-autorest                                                           | v14.2.0+incompatible                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/autorest                                                  | v0.11.30                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/autorest/adal                                             | v0.9.22                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/autorest/azure/auth                                       | v0.5.13                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/autorest/azure/cli                                        | v0.4.6                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/autorest/date                                             | v0.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/autorest/to                                               | v0.2.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/logger                                                    | v0.2.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/Azure/go-autorest/tracing                                                   | v0.6.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/bahlo/generic-list-go                                                       | v0.2.0                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/beorn7/perks                                                                | v1.0.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/bgentry/speakeasy                                                           | v0.2.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/blang/semver/v4                                                             | v4.0.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/buger/jsonparser                                                            | v1.1.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/buger/jsonparser                                                            | v1.1.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cenkalti/backoff/v5                                                         | v5.0.3                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cespare/xxhash/v2                                                           | v2.3.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/chai2010/gettext-go                                                         | v1.0.2                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/checkpoint-restore/checkpointctl                                            | v1.5.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/checkpoint-restore/go-criu/v7                                               | v7.2.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/cheggaaa/pb/v3                                                              | v3.1.7                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/cihub/seelog                                                                | v0.0.0-20170130134532-f561c5e57575                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/cilium/ebpf                                                                 | v0.17.3                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cilium/ebpf                                                                 | v0.16.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/clipperhouse/displaywidth                                                   | v0.10.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/clipperhouse/uax29/v2                                                       | v2.6.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/container-storage-interface/spec                                            | v1.9.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/btrfs/v2                                                         | v2.0.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/cgroups/v3                                                       | v3.1.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/cgroups/v3                                                       | v3.0.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/console                                                          | v1.0.5                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/containerd/api                                                   | v1.11.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/containerd/api                                                   | v1.10.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/continuity                                                       | v0.4.5                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/errdefs                                                          | v1.0.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/errdefs                                                          | v0.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/errdefs/pkg                                                      | v0.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/fifo                                                             | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/go-cni                                                           | v1.1.13                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/go-runc                                                          | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/imgcrypt/v2                                                      | v2.0.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/log                                                              | v0.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/nri                                                              | v0.11.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/otelttrpc                                                        | v0.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/platforms                                                        | v1.0.0-rc.3                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/plugin                                                           | v1.0.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/ttrpc                                                            | v1.2.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/ttrpc                                                            | v1.2.7                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/typeurl/v2                                                       | v2.2.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/typeurl/v2                                                       | v2.2.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/zfs/v2                                                           | v2.0.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containernetworking/cni                                                     | v1.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containernetworking/plugins                                                 | v1.9.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containers/ocicrypt                                                         | v1.2.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coredns/caddy                                                               | v1.1.4-0.20250930002214-15135a999495              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coredns/caddy                                                               | v1.1.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coredns/corefile-migration                                                  | v1.0.31                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-iptables                                                          | v0.8.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-oidc                                                              | v2.5.0+incompatible                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-semver                                                            | v0.3.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-systemd/v22                                                       | v22.7.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-systemd/v22                                                       | v22.6.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/cpuguy83/go-md2man/v2                                                       | v2.0.7                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cpuguy83/go-md2man/v2                                                       | v2.0.6                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cyphar/filepath-securejoin                                                  | v0.6.1                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/cyphar/filepath-securejoin                                                  | v0.6.0                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/DataDog/datadog-agent/comp/core/tagger/origindetection                      | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/obfuscate                                         | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/opentelemetry-mapping-go/otlp/attributes          | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/proto                                             | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/remoteconfig/state                                | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| <!-- VERIFIED --> github.com/DataDog/datadog-agent/pkg/template                        | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/trace                                             | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/util/log                                          | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/util/scrubber                                     | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-agent/pkg/version                                           | v0.75.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/datadog-go/v5                                                       | v5.8.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/DataDog/dd-trace-go/v2                                                      | v2.7.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/go-libddwaf/v4                                                      | v4.8.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/go-runtime-metrics-internal                                         | v0.0.4-0.20260217080614-b0f4edc38a6d              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/DataDog/go-sqllexer                                                         | v0.1.10                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/DataDog/go-tuf                                                              | v1.1.1-0.5.2                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/DataDog/sketches-go                                                         | v1.4.7                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/davecgh/go-spew                                                             | v1.1.2-0.20180830191138-d8f796af33cc              | [ISC](https://opensource.org/license/isc-license-txt)       |
| github.com/davecgh/go-spew                                                             | v1.1.1                                            | [ISC](https://opensource.org/license/isc-license-txt)       |
| github.com/dimchansky/utfbom                                                           | v1.1.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/distribution/reference                                                      | v0.6.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/dnstap/golang-dnstap                                                        | v0.4.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/docker                                                               | v28.5.2+incompatible                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/go-events                                                            | v0.0.0-20190806004212-e31b211e4f1c                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/go-metrics                                                           | v0.0.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/go-units                                                             | v0.5.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/dustin/go-humanize                                                          | v1.0.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/ebitengine/purego                                                           | v0.9.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/emicklei/go-restful/v3                                                      | v3.13.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/emicklei/go-restful/v3                                                      | v3.12.2                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/euank/go-kmsg-parser                                                        | v2.0.0+incompatible                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/exponent-io/jsonpath                                                        | v0.0.0-20210407135951-1de76d718b3f                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/expr-lang/expr                                                              | v1.17.8                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/farsightsec/golang-framestream                                              | v0.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/fatih/camelcase                                                             | v1.0.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/fatih/color                                                                 | v1.19.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/felixge/httpsnoop                                                           | v1.0.4                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/flynn/go-shlex                                                              | v0.0.0-20150515145356-3f9db97f8568                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/fsnotify/fsnotify                                                           | v1.9.0                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/fxamacker/cbor/v2                                                           | v2.9.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/go-errors/errors                                                            | v1.4.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/go-jose/go-jose/v4                                                          | v4.1.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-logr/logr                                                                | v1.4.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-logr/stdr                                                                | v1.2.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-logr/zapr                                                                | v1.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-ole/go-ole                                                               | v1.3.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/go-ole/go-ole                                                               | v1.2.6                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/go-openapi/jsonpointer                                                      | v0.21.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-openapi/jsonreference                                                    | v0.20.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-openapi/swag                                                             | v0.23.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-task/slim-sprig/v3                                                       | v3.0.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/godbus/dbus/v5                                                              | v5.2.2                                            | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/godbus/dbus/v5                                                              | v5.1.0                                            | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/gogo/protobuf                                                               | v1.3.2                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/golang-jwt/jwt/v4                                                           | v4.5.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/golang-jwt/jwt/v5                                                           | v5.3.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/golang-jwt/jwt/v5                                                           | v5.3.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/golang/groupcache                                                           | v0.0.0-20241129210726-2c02b8208cf8                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/golang/groupcache                                                           | v0.0.0-20210331224755-41bb18bfe9da                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/golang/protobuf                                                             | v1.5.4                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/google/btree                                                                | v1.1.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/cadvisor                                                             | v0.56.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/cel-go                                                               | v0.26.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/certtostore                                                          | v1.0.6                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/deck                                                                 | v0.0.0-20230104221208-105ad94aa8ae                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/gnostic-models                                                       | v0.7.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/go-cmp                                                               | v0.7.0                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/google/pprof                                                                | v0.0.0-20260115054156-294ebfa9ad83                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/pprof                                                                | v0.0.0-20250820193118-f64d9cf942d6                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/s2a-go                                                               | v0.1.9                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/uuid                                                                 | v1.6.0                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/googleapis/enterprise-certificate-proxy                                     | v0.3.14                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/googleapis/gax-go/v2                                                        | v2.18.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/gorilla/websocket                                                           | v1.5.4-0.20250319132907-e064f32e3674              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/gorilla/websocket                                                           | v1.5.0                                            | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/grpc-ecosystem/go-grpc-middleware/providers/prometheus                      | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/go-grpc-middleware/v2                                        | v2.3.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/go-grpc-middleware/v2                                        | v2.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/grpc-gateway/v2                                              | v2.28.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/grpc-ecosystem/grpc-gateway/v2                                              | v2.27.7                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/grpc-ecosystem/grpc-gateway/v2                                              | v2.27.3                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/grpc-ecosystem/grpc-opentracing                                             | v0.0.0-20180507213350-8e809c8a8645                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/hashicorp/cronexpr                                                          | v1.1.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/hashicorp/errwrap                                                           | v1.1.0                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| github.com/hashicorp/go-cleanhttp                                                      | v0.5.2                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| github.com/hashicorp/go-multierror                                                     | v1.1.1                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| github.com/hashicorp/go-rootcerts                                                      | v1.0.2                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| github.com/hashicorp/go-version                                                        | v1.8.0                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| <!-- VERIFIED --> github.com/hashicorp/golang-lru/v2                                   | v2.0.7                                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| github.com/hashicorp/nomad/api                                                         | v0.0.0-20250909143645-a3b86c697f38                | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)           |
| github.com/inconshreveable/mousetrap                                                   | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/infobloxopen/go-trees                                                       | v0.0.0-20200715205103-96a057b8dfb9                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/insomniacslk/dhcp                                                           | v0.0.0-20240829085014-a3a4c1f04475                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/intel/goresctrl                                                             | v0.12.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/invopop/jsonschema                                                          | v0.13.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/ishidawataru/sctp                                                           | v0.0.0-20250521072954-ae8eb7fa7995                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/JeffAshton/win_pdh                                                          | v0.0.0-20161109143554-76bb4ee9f0ab                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/jonboulle/clockwork                                                         | v0.5.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/josharian/intern                                                            | v1.0.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/josharian/native                                                            | v1.1.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| <!-- VERIFIED --> github.com/jpillora/backoff                                          | v1.0.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/json-iterator/go                                                            | v1.1.12                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/klauspost/compress                                                          | v1.18.5                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/klauspost/compress                                                          | v1.18.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/klauspost/cpuid/v2                                                          | v2.2.3                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/knqyf263/go-plugin                                                          | v0.9.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/kylelemons/godebug                                                          | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/liggitt/tabwriter                                                           | v0.0.0-20181228230101-89fcab3d43de                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/linkdata/deadlock                                                           | v0.5.5                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/lithammer/dedent                                                            | v1.1.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/lufia/plan9stats                                                            | v0.0.0-20250317134145-8bc96cf8fc35                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/mailru/easyjson                                                             | v0.7.7                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/MakeNowJust/heredoc                                                         | v1.0.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Masterminds/semver/v3                                                       | v3.4.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mattn/go-colorable                                                          | v0.1.14                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mattn/go-isatty                                                             | v0.0.20                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mattn/go-runewidth                                                          | v0.0.19                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mattn/go-shellwords                                                         | v1.0.12                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mdlayher/packet                                                             | v1.1.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mdlayher/socket                                                             | v0.5.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mdlayher/vsock                                                              | v1.2.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/go-winio                                                          | v0.6.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/hcsshim                                                           | v0.14.0-rc.1                                      | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/hcsshim                                                           | v0.13.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/hnslib                                                            | v0.1.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/miekg/dns                                                                   | v1.1.72                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/miekg/pkcs11                                                                | v1.1.1                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/minio/simdjson-go                                                           | v0.4.5                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mistifyio/go-zfs                                                            | v2.1.2-0.20190413222219-f784269be439+incompatible | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mistifyio/go-zfs/v3                                                         | v3.0.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mitchellh/go-homedir                                                        | v1.1.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mitchellh/go-wordwrap                                                       | v1.0.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mitchellh/mapstructure                                                      | v1.5.1-0.20231216201459-8508981c8b6c              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/moby/ipvs                                                                   | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/locker                                                                 | v1.0.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/spdystream                                                             | v0.5.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/capability                                                         | v0.4.0                                            | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/moby/sys/mountinfo                                                          | v0.7.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/sequential                                                         | v0.6.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/signal                                                             | v0.7.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/symlink                                                            | v0.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/user                                                               | v0.4.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/userns                                                             | v0.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/term                                                                   | v0.5.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/term                                                                   | v0.5.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/modern-go/concurrent                                                        | v0.0.0-20180306012644-bacd9c7ef1dd                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/modern-go/reflect2                                                          | v1.0.3-0.20250322232337-35a7c28c31ee              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/monochromegane/go-gitignore                                                 | v0.0.0-20200626010858-205db1a8cc00                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mrunalp/fileutils                                                           | v0.5.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/munnerz/goautoneg                                                           | v0.0.0-20191010083416-a7dc8b61c822                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| <!-- VERIFIED --> github.com/mwitkow/go-conntrack                                      | v0.0.0-20190716064945-2f068394615f                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mxk/go-flowrate                                                             | v0.0.0-20140419014527-cca7078d478f                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/networkplumbing/go-nft                                                      | v0.4.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/NYTimes/gziphandler                                                         | v1.1.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/olekukonko/cat                                                              | v0.0.0-20250911104152-50322a0618f6                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/olekukonko/errors                                                           | v1.2.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/olekukonko/ll                                                               | v0.1.6                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/olekukonko/tablewriter                                                      | v1.1.4                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/onsi/ginkgo/v2                                                              | v2.28.1                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/onsi/ginkgo/v2                                                              | v2.25.1                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/onsi/gomega                                                                 | v1.39.1                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/onsi/gomega                                                                 | v1.38.1                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/opencontainers/cgroups                                                      | v0.0.6                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/go-digest                                                    | v1.0.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/image-spec                                                   | v1.1.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/runtime-spec                                                 | v1.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/runtime-tools                                                | v0.9.1-0.20251114084447-edf4cb3d2116              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/selinux                                                      | v1.13.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/selinux                                                      | v1.13.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opentracing-contrib/go-observer                                             | v0.0.0-20170622124052-a52f23424492                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opentracing/opentracing-go                                                  | v1.2.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/openzipkin-contrib/zipkin-go-opentracing                                    | v0.5.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/openzipkin/zipkin-go                                                        | v0.4.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/oschwald/geoip2-golang/v2                                                   | v2.1.0                                            | [ISC](https://opensource.org/license/isc-license-txt)       |
| github.com/oschwald/maxminddb-golang/v2                                                | v2.1.1                                            | [ISC](https://opensource.org/license/isc-license-txt)       |
| github.com/outcaste-io/ristretto                                                       | v0.2.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/pelletier/go-toml/v2                                                        | v2.2.4                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/peterbourgon/diskv                                                          | v2.0.1+incompatible                               | [MIT](https://opensource.org/license/mit/)                  |
| github.com/petermattis/goid                                                            | v0.0.0-20250813065127-a731cc31b4fe                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/petermattis/goid                                                            | v0.0.0-20240813172612-4fcff4a6cae7                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/philhofer/fwd                                                               | v1.2.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/pierrec/lz4/v4                                                              | v4.1.21                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/pires/go-proxyproto                                                         | v0.11.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/pkg/errors                                                                  | v0.9.1                                            | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/planetscale/vtprotobuf                                                      | v0.6.1-0.20240319094008-0393e58bdf10              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/pmezard/go-difflib                                                          | v1.0.1-0.20181226105442-5d4384ee4fb2              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/power-devops/perfstat                                                       | v0.0.0-20240221224432-82ca36839d55                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/pquerna/cachecontrol                                                        | v0.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/client_golang                                                    | v1.23.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/client_golang                                                    | v1.23.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/client_model                                                     | v0.6.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/common                                                           | v0.67.5                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/common                                                           | v0.66.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| <!-- VERIFIED --> github.com/prometheus/exporter-toolkit                               | v0.15.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/procfs                                                           | v0.19.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/procfs                                                           | v0.17.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/procfs                                                           | v0.16.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/puzpuzpuz/xsync/v3                                                          | v3.5.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/quic-go/qpack                                                               | v0.6.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/quic-go/quic-go                                                             | v0.59.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/robfig/cron/v3                                                              | v3.0.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/russross/blackfriday/v2                                                     | v2.1.0                                            | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/safchain/ethtool                                                            | v0.6.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/sasha-s/go-deadlock                                                         | v0.3.5                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/seccomp/libseccomp-golang                                                   | v0.11.1                                           | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/secure-systems-lab/go-securesystemslib                                      | v0.9.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/shirou/gopsutil/v4                                                          | v4.25.11                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/sirupsen/logrus                                                             | v1.9.4                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/sirupsen/logrus                                                             | v1.9.3                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/smallstep/pkcs7                                                             | v0.1.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/soheilhy/cmux                                                               | v0.1.5                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/spf13/cobra                                                                 | v1.10.2                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/spf13/pflag                                                                 | v1.0.10                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/spf13/pflag                                                                 | v1.0.9                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/StackExchange/wmi                                                           | v0.0.0-20190523213315-cbe66965904d                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/stefanberger/go-pkcs11uri                                                   | v0.0.0-20230803200340-78284954bff6                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/stoewer/go-strcase                                                          | v1.3.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/stretchr/objx                                                               | v0.5.2                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/stretchr/testify                                                            | v1.11.1                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/tchap/go-patricia/v2                                                        | v2.3.3                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/tetratelabs/wazero                                                          | v1.10.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/tinylib/msgp                                                                | v1.6.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/tklauser/go-sysconf                                                         | v0.3.16                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/tklauser/numcpus                                                            | v0.11.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/tmc/grpc-websocket-proxy                                                    | v0.0.0-20220101234140-673ab2c3ae75                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/tmc/grpc-websocket-proxy                                                    | v0.0.0-20201229170055-e5319fda7802                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/trailofbits/go-mutexasserts                                                 | v0.0.0-20250514102930-c1f3d2e37561                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/u-root/uio                                                                  | v0.0.0-20240224005618-d2acac8f3701                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/urfave/cli                                                                  | v1.22.17                                          | [MIT](https://opensource.org/license/mit/)                  |
| github.com/urfave/cli/v2                                                               | v2.27.7                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/vishvananda/netlink                                                         | v1.3.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/vishvananda/netns                                                           | v0.0.5                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/VividCortex/ewma                                                            | v1.2.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/wk8/go-ordered-map/v2                                                       | v2.1.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/x448/float16                                                                | v0.8.4                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xiang90/probing                                                             | v0.0.0-20221125231312-a49e3df8f510                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xiang90/probing                                                             | v0.0.0-20190116061207-43a291ad63a2                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xlab/treeprint                                                              | v1.2.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xrash/smetrics                                                              | v0.0.0-20240521201337-686a1a2994c1                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/yusufpapurcu/wmi                                                            | v1.2.4                                            | [MIT](https://opensource.org/license/mit/)                  |
| go.etcd.io/bbolt                                                                       | v1.4.3                                            | [MIT](https://opensource.org/license/mit/)                  |
| go.etcd.io/etcd/api/v3                                                                 | v3.6.9                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/api/v3                                                                 | v3.6.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/pkg/v3                                                          | v3.6.9                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/pkg/v3                                                          | v3.6.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/v3                                                              | v3.6.9                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/v3                                                              | v3.6.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/pkg/v3                                                                 | v3.6.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/server/v3                                                              | v3.6.8                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/gofail                                                                      | v0.2.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/raft/v3                                                                     | v3.6.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/raft/v3                                                                     | v3.6.0-beta.0.0.20260116184858-6d944ca211ee       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opencensus.io                                                                       | v0.24.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/auto/sdk                                                           | v1.2.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/collector/component                                                | v1.48.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/collector/featuregate                                              | v1.48.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/collector/pdata                                                    | v1.48.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/collector/pdata/pprofile                                           | v0.142.0                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/github.com/emicklei/go-restful/otelrestful | v0.65.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc            | v0.67.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc            | v0.65.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp                          | v0.67.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp                          | v0.65.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp                          | v0.61.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel                                                               | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel                                                               | v1.40.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace                                      | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace                                      | v1.40.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc                        | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc                        | v1.40.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp                        | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/metric                                                        | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/metric                                                        | v1.40.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/sdk                                                           | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/sdk                                                           | v1.40.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/trace                                                         | v1.42.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/trace                                                         | v1.40.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/proto/otlp                                                         | v1.9.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.uber.org/atomic                                                                     | v1.11.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| go.uber.org/automaxprocs                                                               | v1.6.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| go.uber.org/goleak                                                                     | v1.3.0                                            | [MIT](https://opensource.org/license/mit/)                  |
| go.uber.org/multierr                                                                   | v1.11.0                                           | [MIT](https://opensource.org/license/mit/)                  |
| go.uber.org/zap                                                                        | v1.27.1                                           | [MIT](https://opensource.org/license/mit/)                  |
| go.yaml.in/yaml/v2                                                                     | v2.4.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.yaml.in/yaml/v3                                                                     | v3.0.4                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| golang.org/x/crypto                                                                    | v0.49.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/crypto                                                                    | v0.48.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/crypto                                                                    | v0.47.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/exp                                                                       | v0.0.0-20251219203646-944ab1f22d93                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/exp                                                                       | v0.0.0-20251209150349-8475f28825e9                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/exp                                                                       | v0.0.0-20241108190413-2d47ceb2692f                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/mod                                                                       | v0.34.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/mod                                                                       | v0.33.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/mod                                                                       | v0.32.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/net                                                                       | v0.52.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/net                                                                       | v0.51.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/net                                                                       | v0.50.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/net                                                                       | v0.49.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/net                                                                       | v0.43.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/oauth2                                                                    | v0.36.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/oauth2                                                                    | v0.35.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/oauth2                                                                    | v0.34.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sync                                                                      | v0.20.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sync                                                                      | v0.19.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sync                                                                      | v0.16.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sys                                                                       | v0.42.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sys                                                                       | v0.41.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sys                                                                       | v0.40.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sys                                                                       | v0.35.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/term                                                                      | v0.41.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/term                                                                      | v0.40.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/term                                                                      | v0.39.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/text                                                                      | v0.35.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/text                                                                      | v0.34.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/text                                                                      | v0.33.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/text                                                                      | v0.28.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/time                                                                      | v0.15.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/time                                                                      | v0.14.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/tools                                                                     | v0.43.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/tools                                                                     | v0.42.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/tools                                                                     | v0.41.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/tools                                                                     | v0.36.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/xerrors                                                                   | v0.0.0-20231012003039-104605ab7028                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| google.golang.org/api                                                                  | v0.272.0                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| google.golang.org/genproto/googleapis/api                                              | v0.0.0-20260217215200-42d3e9bedb6d                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/api                                              | v0.0.0-20260209200024-4cfbd4190f57                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/api                                              | v0.0.0-20260128011058-8636f8732409                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/rpc                                              | v0.0.0-20260311181403-84a4fc48630c                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/rpc                                              | v0.0.0-20260226221140-a57be14db171                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/rpc                                              | v0.0.0-20260209200024-4cfbd4190f57                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/rpc                                              | v0.0.0-20260128011058-8636f8732409                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/rpc                                              | v0.0.0-20241015192408-796eee8c2d53                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/grpc                                                                 | v1.79.3                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/grpc                                                                 | v1.69.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/protobuf                                                             | v1.36.12-0.20260120151049-f2248ac996af            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| google.golang.org/protobuf                                                             | v1.36.11                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| google.golang.org/protobuf                                                             | v1.36.7                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| gopkg.in/evanphx/json-patch.v4                                                         | v4.13.0                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| gopkg.in/go-jose/go-jose.v2                                                            | v2.6.3                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| gopkg.in/inf.v0                                                                        | v0.9.1                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| gopkg.in/ini.v1                                                                        | v1.67.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| gopkg.in/natefinch/lumberjack.v2                                                       | v2.2.1                                            | [MIT](https://opensource.org/license/mit/)                  |
| gopkg.in/yaml.v3                                                                       | v3.0.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/api                                                                             | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/api                                                                             | v0.35.3                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/apimachinery                                                                    | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/apimachinery                                                                    | v0.35.3                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/cli-runtime                                                                     | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/client-go                                                                       | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/client-go                                                                       | v0.35.3                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/component-base                                                                  | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/cri-api                                                                         | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/cri-api                                                                         | v0.35.3                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/cri-client                                                                      | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/gengo/v2                                                                        | v2.0.0-20250922181213-ec3ebc5fd46b                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/klog/v2                                                                         | v2.140.0                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kube-openapi                                                                    | v0.0.0-20260319004828-5883c5ee87b9                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kube-openapi                                                                    | v0.0.0-20260317180543-43fb72c5454a                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kube-openapi                                                                    | v0.0.0-20250910181357-589584f1c912                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kubectl                                                                         | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kubelet                                                                         | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| <!-- VERIFIED --> k8s.io/streaming                                                     | v0.36.0-beta.0                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/system-validators                                                               | v1.12.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/utils                                                                           | v0.0.0-20260319190234-28399d86e0b5                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/utils                                                                           | v0.0.0-20260210185600-b8788abfbbc2                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/utils                                                                           | v0.0.0-20260108192941-914a6e750570                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/utils                                                                           | v0.0.0-20251002143259-bc988d571ff4                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/apiserver-network-proxy/konnectivity-client                                | v0.34.0                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/json                                                                       | v0.0.0-20250730193827-2d320260d730                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/knftables                                                                  | v0.0.21                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/knftables                                                                  | v0.0.18                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/kustomize/api                                                              | v0.21.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/kustomize/kustomize/v5                                                     | v5.8.1                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/kustomize/kyaml                                                            | v0.21.1                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/mcs-api                                                                    | v0.4.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/randfill                                                                   | v1.0.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/structured-merge-diff/v6                                                   | v6.3.2                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/structured-merge-diff/v6                                                   | v6.3.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/yaml                                                                       | v1.6.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| tags.cncf.io/container-device-interface                                                | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| tags.cncf.io/container-device-interface/specs-go                                       | v1.1.0                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |

<!-- vale on -->
