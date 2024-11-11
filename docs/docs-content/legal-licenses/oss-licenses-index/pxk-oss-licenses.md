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

<br />

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

<br />

## Open Source Dependencies

The following table lists the open source libraries and modules currently in use by PXK and the Federal Information
Processing Standards (FIPS) compliant version of PXK.

| Library                                                                                | License                                                          |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| github.com/modern-go/concurrent                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/davecgh/go-spew/spew                                                        | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/miekg/pkcs11                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/gogo/protobuf                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.opentelemetry.io/otel/trace                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-systemd/v22                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-middleware/providers/prometheus                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/user                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/locker                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/fifo                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/term                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/time/rate                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/component-base/logs/logreduction                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/typeurl/v2                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/go-runc                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/uuid                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/inf.v0                                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/apimachinery/third_party/forked/golang                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/api/core/v1                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/docker/go-events                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/bbolt                                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/otelttrpc                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/genproto/googleapis/api/httpbody                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mistifyio/go-zfs/v3                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| tags.cncf.io/container-device-interface                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opencontainers/selinux                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/client-go                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/json-iterator/go                                                            | [MIT](https://opensource.org/license/mit/)                       |
| github.com/go-jose/go-jose/v4                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/genproto/googleapis/rpc                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/utils/internal/third_party/forked/golang/net                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/errdefs                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/modern-go/reflect2                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containernetworking/cni                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/nri                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containers/ocicrypt                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/log                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/klauspost/compress/internal/snapref                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.opentelemetry.io/otel/metric                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/tchap/go-patricia/v2/patricia                                               | [MIT](https://opensource.org/license/mit/)                       |
| vendor/golang.org/x/text                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/distribution/reference                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/cri-api/pkg                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/xrash/smetrics                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/moby/spdystream                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/checkpoint-restore/checkpointctl/lib                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/klauspost/compress/zstd/internal/xxhash                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/platforms                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/prometheus/common                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/proto/otlp                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/emicklei/go-restful/v3                                                      | [MIT](https://opensource.org/license/mit/)                       |
| sigs.k8s.io/json                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/signal                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apiserver/pkg/endpoints/responsewriter                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/text                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/klauspost/compress                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/userns                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Microsoft/hcsshim/cmd/containerd-shim-runhcs-v1                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/go-cni                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mdlayher/socket                                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mxk/go-flowrate/flowrate                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/vishvananda/netlink                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/vishvananda/netns                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/plugin                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/beorn7/perks/quantile                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/fxamacker/cbor/v2                                                           | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/zfs/v2                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/syndtr/gocapability/capability                                              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| tags.cncf.io/container-device-interface/specs-go                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/docker/go-units                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mdlayher/vsock                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/pelletier/go-toml/v2                                                        | [MIT](https://opensource.org/license/mit/)                       |
| sigs.k8s.io/structured-merge-diff/v4/value                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/mod/semver                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/prometheus/procfs                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/gofuzz                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| dario.cat/mergo                                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/google/go-cmp/cmp                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/opencontainers/runtime-tools                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/yaml/goyaml.v2                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/imgcrypt/v2                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/golang/protobuf/proto                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/russross/blackfriday/v2                                                     | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/go-jose/go-jose/v4/json                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/sys                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/yaml                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/felixge/httpsnoop                                                           | [MIT](https://opensource.org/license/mit/)                       |
| go.opentelemetry.io/otel                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/prometheus/client_golang/prometheus                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/intel/goresctrl/pkg                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opencontainers/image-spec                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/fsnotify/fsnotify                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/godbus/dbus/v5                                                              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/cpuguy83/go-md2man/v2/md2man                                                | [MIT](https://opensource.org/license/mit/)                       |
| google.golang.org/protobuf                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/munnerz/goautoneg                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/x448/float16                                                                | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/oauth2                                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/checkpoint-restore/go-criu/v7                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/net                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/cespare/xxhash/v2                                                           | [MIT](https://opensource.org/license/mit/)                       |
| github.com/prometheus/client_model/go                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/utils                                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/yaml.v3                                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/sirupsen/logrus                                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/opencontainers/go-digest                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/errdefs/pkg                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/docker/go-metrics                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/console                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/grpc-gateway/v2                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/containerd/v2                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/sync                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/cenkalti/backoff/v4                                                         | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/btrfs/v2                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kubelet/pkg/cri/streaming                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/exp                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/stefanberger/go-pkcs11uri                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-logr/stdr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/symlink                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cilium/ebpf                                                                 | [MIT](https://opensource.org/license/mit/)                       |
| go.mozilla.org/pkcs7                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/stretchr/testify/assert                                                     | [MIT](https://opensource.org/license/mit/)                       |
| vendor/golang.org/x/net                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| vendor/golang.org/x/crypto                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/opencontainers/runtime-spec/specs-go                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/yaml.v2                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containernetworking/plugins/pkg/ns                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/crypto                                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| crypto/internal/boring                                                                 | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| github.com/containerd/ttrpc                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/sdk                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/AdaLogics/go-fuzz-headers                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/containerd/api                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/mountinfo                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/cgroups/v3                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apimachinery/pkg                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/urfave/cli/v2                                                               | [MIT](https://opensource.org/license/mit/)                       |
| google.golang.org/grpc                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/continuity                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/klog/v2                                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| vendor/golang.org/x/sys/cpu                                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/go-logr/logr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/gorilla/websocket                                                           | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/pmezard/go-difflib/difflib                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/prometheus/client_golang/internal/github.com/golang/gddo/httputil           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/oschwald/maxminddb-golang                                                   | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/Azure/go-autorest/tracing                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/go-autorest/autorest/azure/auth                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| cloud.google.com/go/compute/metadata                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| cloud.google.com/go/auth/oauth2adapt                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/farsightsec/golang-framestream                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/jmespath/go-jmespath                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/go-libddwaf/v3                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/internal/configsources                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.uber.org/multierr                                                                   | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/pkg/errors                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-openapi/swag                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/ryanuber/go-glob                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/internal/sync/singleflight                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/Azure/go-autorest/autorest/to                                               | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/Azure/go-autorest/autorest/azure/cli                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mitchellh/go-homedir                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/golang/groupcache/lru                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/datadog-go/v5/statsd                                                | [MIT](https://opensource.org/license/mit/)                       |
| go.uber.org/atomic                                                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/josharian/intern                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/matttproud/golang_protobuf_extensions/pbutil                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/DataDog/dd-trace-go.v1                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/apparentlymart/go-cidr/cidr                                                 | [MIT](https://opensource.org/license/mit/)                       |
| cloud.google.com/go/auth                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/gnostic-models                                                       | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kube-openapi/pkg                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/spec                                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/openzipkin-contrib/zipkin-go-opentracing                                    | [MIT](https://opensource.org/license/mit/)                       |
| github.com/flynn/go-shlex                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/tinylib/msgp/msgp                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/secure-systems-lab/go-securesystemslib/cjson                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coredns/caddy                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/smithy-go/internal/sync/singleflight                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.uber.org/zap                                                                        | [MIT](https://opensource.org/license/mit/)                       |
| github.com/Azure/go-autorest/autorest/date                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opencensus.io                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/api/v3                                                                 | [MIT](https://opensource.org/license/mit/)                       |
| github.com/outcaste-io/ristretto/z                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/dustin/go-humanize                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/go-autorest/autorest                                                  | [MIT](https://opensource.org/license/mit/)                       |
| github.com/golang-jwt/jwt/v4                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/client/pkg/v3                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opentracing-contrib/go-observer                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/datadog-agent/pkg/remoteconfig/state                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/exp/rand                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/internal/ini                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/Azure/go-autorest/autorest/adal                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/googleapis/gax-go/v2                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/service/secretsmanager                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mailru/easyjson                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/api                                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/miekg/dns                                                                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/grpc-ecosystem/grpc-opentracing/go/otgrpc                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/aws/smithy-go                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/golang/protobuf                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.etcd.io/etcd/client/v3                                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/structured-merge-diff/v4                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/quic-go/quic-go                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/api/internal/third_party/uritemplates                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/imdario/mergo                                                               | [MIT](https://opensource.org/license/mit/)                       |
| github.com/openzipkin/zipkin-go                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/hashicorp/go-sockaddr                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/Azure/azure-sdk-for-go                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/api                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/service/sso                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-systemd/v22/journal                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/s2a-go                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/coreos/go-semver/semver                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/go-openapi/jsonpointer                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/infobloxopen/go-trees                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/dimchansky/utfbom                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/eapache/queue/v2                                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/coredns/coredns                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opentracing/opentracing-go                                                  | [MIT](https://opensource.org/license/mit/)                       |
| github.com/Azure/go-autorest/logger                                                    | [MIT](https://opensource.org/license/mit/)                       |
| github.com/aws/aws-sdk-go-v2/service/internal/presigned-url                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/oschwald/geoip2-golang                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/DataDog/go-tuf                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/hashicorp/go-secure-stdlib/strutil                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/DataDog/appsec-internal-go                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/config                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/dnstap/golang-dnstap                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/genproto/googleapis/api                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apimachinery/third_party/forked/golang/reflect                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/DataDog/datadog-agent/pkg/obfuscate                                         | [MIT](https://opensource.org/license/mit/)                       |
| github.com/ebitengine/purego                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kube-openapi/pkg/internal/third_party/go-json-experiment/json                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/spf13/pflag                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/philhofer/fwd                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/sketches-go/ddsketch                                                | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)                |
| github.com/go-openapi/jsonreference                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/outcaste-io/ristretto                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/xerrors                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/expr-lang/expr                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/aws/aws-sdk-go-v2/feature/ec2/imds                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/service/sts                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go/internal/sync/singleflight                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/googleapis/enterprise-certificate-proxy/client                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/credentials                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/internal/endpoints/v2                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/aws/aws-sdk-go-v2/service/ssooidc                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mitchellh/mapstructure                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/hashicorp/go-secure-stdlib/parseutil                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cri-client/pkg                                                                  | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubectl/pkg/util                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/liggitt/tabwriter                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/onsi/ginkgo/v2                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/bahlo/generic-list-go                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mitchellh/go-wordwrap                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/docker/docker/api/types/time                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/invopop/jsonschema                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/wk8/go-ordered-map/v2                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/buger/jsonparser                                                            | [ISC](https://opensource.org/license/isc-license-txt)            |
| k8s.io/kubelet/pkg/types                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/client-go/third_party/forked/golang/template                                    | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)                |
| sigs.k8s.io/cri-tools                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/sys/unix                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cli-runtime/pkg/printers                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/term                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/onsi/gomega                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/component-base                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/blang/semver/v4                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cri-api/pkg/apis                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/soheilhy/cmux                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/VividCortex/ewma                                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/spf13/cobra                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/jonboulle/clockwork                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/rivo/uniseg                                                                 | [MIT](https://opensource.org/license/mit/)                       |
| go.etcd.io/etcd/tests/v3                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/etcdctl/v3                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mattn/go-colorable                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/btree                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mattn/go-isatty                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/etcdutl/v3                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/stretchr/testify                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/natefinch/lumberjack.v2                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/client/v2                                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.etcd.io/etcd/pkg/v3                                                                 | [MIT](https://opensource.org/license/mit/)                       |
| github.com/tmc/grpc-websocket-proxy/wsproxy                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/v3                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-middleware/logging/settable                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-prometheus                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mattn/go-runewidth                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/olekukonko/tablewriter                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/xiang90/probing                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/bgentry/speakeasy                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/fatih/color                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/raft/v3                                                                     | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| go.etcd.io/gofail/runtime                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cheggaaa/pb/v3                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/server/v3                                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/square/go-jose.v2                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/lithammer/dedent                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-logr/zapr                                                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/armon/circbuf                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/antlr4-go/antlr/v4                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/knftables                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apiextensions-apiserver                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/pquerna/cachecontrol                                                        | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)                |
| k8s.io/kube-aggregator/pkg                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/libopenstorage/openstorage                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/controller-manager                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kubernetes/third_party/forked/golang                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/square/go-jose.v2/json                                                        | [MIT](https://opensource.org/license/mit/)                       |
| go.etcd.io/etcd/raft/v3                                                                | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/exponent-io/jsonpath                                                        | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/ishidawataru/sctp                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/yaml/goyaml.v3                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/tools                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/robfig/cron/v3                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/errors                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/sample-apiserver/pkg/apis/wardle                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/peterbourgon/diskv                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/apiserver-network-proxy/konnectivity-client                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/NYTimes/gziphandler                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-oidc                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/grpc-ecosystem/go-grpc-middleware                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cyphar/filepath-securejoin                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/cloud-provider                                                                  | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| github.com/gregjones/httpcache                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/karrick/godirwalk                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/chai2010/gettext-go                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/MakeNowJust/heredoc                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/monochromegane/go-gitignore                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/grpc-gateway                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubernetes/third_party/forked/vishhstress                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/xlab/treeprint                                                              | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubernetes/third_party/forked/gonum/graph                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/stoewer/go-strcase                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/kustomize/kustomize/v5/commands/build                                      | [MIT](https://opensource.org/license/mit/)                       |
| github.com/container-storage-interface/spec/lib/go/csi                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| bitbucket.org/bertimus9/systemstat                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/evanphx/json-patch.v4                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/utils/inotify                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/system-validators/validators                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/stretchr/objx                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubernetes                                                                      | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/metrics/pkg                                                                     | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubelet                                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubernetes/third_party/forked/cgroups                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/apiserver                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/genproto/protobuf/field_mask                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kubectl/pkg                                                                     | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/utils/internal/third_party/forked/golang                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/pod-security-admission                                                          | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubernetes/third_party/forked/libcontainer                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/contrib/instrumentation/github.com/emicklei/go-restful/otelrestful | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/opencontainers/runc/libcontainer                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-errors/errors                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-controller-manager/config/v1alpha1                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/dynamic-resource-allocation                                                     | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/cluster-bootstrap                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/validate                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.uber.org/goleak                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/euank/go-kmsg-parser/kmsgparser                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mohae/deepcopy                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/strfmt                                              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| k8s.io/kubernetes/third_party/forked/gotestsum/junitxml                                | [MIT](https://opensource.org/license/mit/)                       |
| sigs.k8s.io/kustomize/api                                                              | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/mount-utils                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/coredns/caddy/caddyfile                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coredns/corefile-migration/migration                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/moby/ipvs                                                                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mrunalp/fileutils                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mistifyio/go-zfs                                                            | [MIT](https://opensource.org/license/mit/)                       |
| github.com/google/shlex                                                                | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/externaljwt/apis/v1alpha1                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/endpointslice                                                                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cli-runtime/pkg                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/csi-translation-lib                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/asaskevich/govalidator                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/cel-go                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kms                                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/cadvisor                                                             | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/component-helpers                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| cel.dev/expr                                                                           | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kube-proxy/config/v1alpha1                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/kustomize/kyaml                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-scheduler                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/fatih/camelcase                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/networkplumbing/go-nft/nft                                                  | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mdlayher/packet                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/coreos/go-iptables/iptables                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/josharian/native                                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/net/bpf                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/alexflint/go-filemutex                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/safchain/ethtool                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/u-root/uio                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/pierrec/lz4/v4                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/insomniacslk/dhcp                                                           | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/sync/errgroup                                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mattn/go-shellwords                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containernetworking/plugins                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containernetworking/cni/pkg                                                 | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| github.com/coreos/go-systemd/v22/activation                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/checkpoint-restore/go-criu/v6                                               | [MIT](https://opensource.org/license/mit/)                       |
| github.com/urfave/cli                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| vendor/golang.org/x/net/dns/dnsmessage                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/opencontainers/runc                                                         | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/exp/constraints                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |

<!-- vale on -->
