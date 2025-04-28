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

| Library                                                                                | License                                                     |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| bitbucket.org/bertimus9/systemstat                                                     | [MIT](https://opensource.org/license/mit/)                  |
| cel.dev/expr                                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| dario.cat/mergo                                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/AdaLogics/go-fuzz-headers                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/antlr4-go/antlr/v4                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/armon/circbuf                                                               | [MIT](https://opensource.org/license/mit/)                  |
| github.com/armon/go-socks5                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Azure/go-ansiterm                                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/beorn7/perks                                                                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/blang/semver/v4                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cenkalti/backoff/v4                                                         | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cespare/xxhash/v2                                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/chai2010/gettext-go                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/checkpoint-restore/checkpointctl                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/checkpoint-restore/go-criu/v7                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/cilium/ebpf                                                                 | [MIT](https://opensource.org/license/mit/)                  |
| github.com/container-storage-interface/spec                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/btrfs/v2                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/cgroups/v3                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/console                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/containerd/api                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/continuity                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/errdefs                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/errdefs/pkg                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/fifo                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/go-cni                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/go-runc                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/imgcrypt/v2                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/log                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/nri                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/otelttrpc                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/platforms                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/plugin                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/ttrpc                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/typeurl/v2                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containerd/zfs/v2                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containernetworking/cni                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containernetworking/plugins                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/containers/ocicrypt                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coredns/caddy                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coredns/corefile-migration                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-oidc                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-semver                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/coreos/go-systemd/v22                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/cpuguy83/go-md2man/v2                                                       | [MIT](https://opensource.org/license/mit/)                  |
| github.com/cyphar/filepath-securejoin                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/davecgh/go-spew                                                             | [ISC](https://opensource.org/license/isc-license-txt)       |
| github.com/distribution/reference                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/go-events                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/go-metrics                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/docker/go-units                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/dustin/go-humanize                                                          | [MIT](https://opensource.org/license/mit/)                  |
| github.com/emicklei/go-restful/v3                                                      | [MIT](https://opensource.org/license/mit/)                  |
| github.com/euank/go-kmsg-parser                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/exponent-io/jsonpath                                                        | [MIT](https://opensource.org/license/mit/)                  |
| github.com/fatih/camelcase                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/felixge/httpsnoop                                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/fsnotify/fsnotify                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/fxamacker/cbor/v2                                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/go-errors/errors                                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/go-jose/go-jose/v4                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-logr/logr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-logr/stdr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-logr/zapr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-openapi/jsonpointer                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-openapi/jsonreference                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-openapi/swag                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/go-task/slim-sprig/v3                                                       | [MIT](https://opensource.org/license/mit/)                  |
| github.com/godbus/dbus/v5                                                              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/gogo/protobuf                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/golang-jwt/jwt/v4                                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/golang/groupcache                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/golang/protobuf                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/google/btree                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/cadvisor                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/cel-go                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/gnostic-models                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/go-cmp                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/google/gofuzz                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/pprof                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/shlex                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/google/uuid                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/gorilla/websocket                                                           | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/gregjones/httpcache                                                         | [MIT](https://opensource.org/license/mit/)                  |
| github.com/grpc-ecosystem/go-grpc-middleware                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/go-grpc-middleware/providers/prometheus                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/go-grpc-middleware/v2                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/go-grpc-prometheus                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/grpc-ecosystem/grpc-gateway                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/grpc-ecosystem/grpc-gateway/v2                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/inconshreveable/mousetrap                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/intel/goresctrl                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/ishidawataru/sctp                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/JeffAshton/win_pdh                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/jonboulle/clockwork                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/josharian/intern                                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/json-iterator/go                                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/karrick/godirwalk                                                           | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/klauspost/compress                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/kylelemons/godebug                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/libopenstorage/openstorage                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/liggitt/tabwriter                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/lithammer/dedent                                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mailru/easyjson                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/MakeNowJust/heredoc                                                         | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mdlayher/socket                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mdlayher/vsock                                                              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/go-winio                                                          | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/hcsshim                                                           | [MIT](https://opensource.org/license/mit/)                  |
| github.com/Microsoft/hnslib                                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/miekg/pkcs11                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/mistifyio/go-zfs                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mistifyio/go-zfs/v3                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mitchellh/go-wordwrap                                                       | [MIT](https://opensource.org/license/mit/)                  |
| github.com/moby/ipvs                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/locker                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/spdystream                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/capability                                                         | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/moby/sys/mountinfo                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/sequential                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/signal                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/symlink                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/user                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/sys/userns                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/moby/term                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/modern-go/concurrent                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/modern-go/reflect2                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/mohae/deepcopy                                                              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/monochromegane/go-gitignore                                                 | [MIT](https://opensource.org/license/mit/)                  |
| github.com/mrunalp/fileutils                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/munnerz/goautoneg                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/mxk/go-flowrate                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/NYTimes/gziphandler                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/onsi/ginkgo/v2                                                              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/onsi/gomega                                                                 | [MIT](https://opensource.org/license/mit/)                  |
| github.com/opencontainers/cgroups                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/go-digest                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/image-spec                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/runtime-spec                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/runtime-tools                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/opencontainers/selinux                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/pelletier/go-toml/v2                                                        | [MIT](https://opensource.org/license/mit/)                  |
| github.com/peterbourgon/diskv                                                          | [MIT](https://opensource.org/license/mit/)                  |
| github.com/petermattis/goid                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/pkg/errors                                                                  | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/pmezard/go-difflib                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/pquerna/cachecontrol                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/client_golang                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/client_model                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/common                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/prometheus/procfs                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/robfig/cron/v3                                                              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/russross/blackfriday/v2                                                     | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/sasha-s/go-deadlock                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/seccomp/libseccomp-golang                                                   | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/sirupsen/logrus                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/smallstep/pkcs7                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/soheilhy/cmux                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/spf13/cobra                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/spf13/pflag                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| github.com/stefanberger/go-pkcs11uri                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/stoewer/go-strcase                                                          | [MIT](https://opensource.org/license/mit/)                  |
| github.com/stretchr/objx                                                               | [MIT](https://opensource.org/license/mit/)                  |
| github.com/stretchr/testify                                                            | [MIT](https://opensource.org/license/mit/)                  |
| github.com/syndtr/gocapability                                                         | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause) |
| github.com/tchap/go-patricia/v2                                                        | [MIT](https://opensource.org/license/mit/)                  |
| github.com/tmc/grpc-websocket-proxy                                                    | [MIT](https://opensource.org/license/mit/)                  |
| github.com/urfave/cli                                                                  | [MIT](https://opensource.org/license/mit/)                  |
| github.com/urfave/cli/v2                                                               | [MIT](https://opensource.org/license/mit/)                  |
| github.com/vishvananda/netlink                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/vishvananda/netns                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| github.com/x448/float16                                                                | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xiang90/probing                                                             | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xlab/treeprint                                                              | [MIT](https://opensource.org/license/mit/)                  |
| github.com/xrash/smetrics                                                              | [MIT](https://opensource.org/license/mit/)                  |
| go.etcd.io/bbolt                                                                       | [MIT](https://opensource.org/license/mit/)                  |
| go.etcd.io/etcd/api/v3                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/pkg/v3                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/v2                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/client/v3                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/pkg/v3                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/raft/v3                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.etcd.io/etcd/server/v3                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opencensus.io                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/auto/sdk                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/github.com/emicklei/go-restful/otelrestful | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/metric                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/sdk                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/otel/trace                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.opentelemetry.io/proto/otlp                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| go.uber.org/goleak                                                                     | [MIT](https://opensource.org/license/mit/)                  |
| go.uber.org/multierr                                                                   | [MIT](https://opensource.org/license/mit/)                  |
| go.uber.org/zap                                                                        | [MIT](https://opensource.org/license/mit/)                  |
| golang.org/x/crypto                                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/exp                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/mod                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/net                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/oauth2                                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sync                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/sys                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/term                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/text                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/time                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| golang.org/x/tools                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| google.golang.org/genproto                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/api                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/genproto/googleapis/rpc                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/grpc                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| google.golang.org/protobuf                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| gopkg.in/evanphx/json-patch.v4                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| gopkg.in/go-jose/go-jose.v2                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| gopkg.in/inf.v0                                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) |
| gopkg.in/natefinch/lumberjack.v2                                                       | [MIT](https://opensource.org/license/mit/)                  |
| gopkg.in/yaml.v3                                                                       | [MIT](https://opensource.org/license/mit/)                  |
| k8s.io/api                                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/apimachinery                                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/apiserver                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/client-go                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/component-base                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/cri-api                                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/gengo/v2                                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/klog/v2                                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kube-openapi                                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/kubelet                                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/system-validators                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| k8s.io/utils                                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/apiserver-network-proxy/konnectivity-client                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/json                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/knftables                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/kustomize/api                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/kustomize/kustomize/v5                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/kustomize/kyaml                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/randfill                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/structured-merge-diff/v4                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| sigs.k8s.io/yaml                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| tags.cncf.io/container-device-interface                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |
| tags.cncf.io/container-device-interface/specs-go                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)   |

<!-- vale on -->
