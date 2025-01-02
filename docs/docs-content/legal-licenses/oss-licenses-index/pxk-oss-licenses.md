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
| github.com/containerd/continuity                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-logr/logr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/oauth2                                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/cilium/ebpf                                                                 | [MIT](https://opensource.org/license/mit/)                       |
| github.com/grpc-ecosystem/go-grpc-middleware/providers/prometheus                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| crypto/internal/boring                                                                 | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| github.com/opencontainers/image-spec                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/trace                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-systemd/v22                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cenkalti/backoff/v4                                                         | [MIT](https://opensource.org/license/mit/)                       |
| github.com/moby/sys/symlink                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/vishvananda/netlink                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/syndtr/gocapability/capability                                              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/docker/go-units                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/cri-api/pkg                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/log                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containers/ocicrypt                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cpuguy83/go-md2man/v2/md2man                                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/opencontainers/runtime-spec/specs-go                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kubelet/pkg/cri/streaming                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/spdystream                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-logr/stdr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apimachinery/pkg                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/api/core/v1                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/grpc                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/time/rate                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/nri                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/imgcrypt/v2                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-jose/go-jose/v4                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/AdaLogics/go-fuzz-headers                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/platforms                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/pelletier/go-toml/v2                                                        | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/client-go                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mxk/go-flowrate/flowrate                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/go-jose/go-jose/v4/json                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/golang/protobuf/proto                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/console                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/sdk                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/genproto/googleapis/api/httpbody                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/x448/float16                                                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containernetworking/cni                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/miekg/pkcs11                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/munnerz/goautoneg                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/fxamacker/cbor/v2                                                           | [MIT](https://opensource.org/license/mit/)                       |
| github.com/intel/goresctrl/pkg                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/xrash/smetrics                                                              | [MIT](https://opensource.org/license/mit/)                       |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Microsoft/hcsshim/cmd/containerd-shim-runhcs-v1                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/google/gofuzz                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/gorilla/websocket                                                           | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| dario.cat/mergo                                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/errdefs/pkg                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/klauspost/compress/zstd/internal/xxhash                                     | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/mod/semver                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/moby/locker                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/docker/go-metrics                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mdlayher/socket                                                             | [MIT](https://opensource.org/license/mit/)                       |
| sigs.k8s.io/structured-merge-diff/v4/value                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/userns                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/distribution/reference                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/otelttrpc                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/term                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/go-cni                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/zfs/v2                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/typeurl/v2                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opencontainers/go-digest                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/sys/user                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cespare/xxhash/v2                                                           | [MIT](https://opensource.org/license/mit/)                       |
| github.com/google/uuid                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/google/go-cmp/cmp                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.opentelemetry.io/otel                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/prometheus/common                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/otel/exporters/otlp/otlptrace                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containernetworking/plugins/pkg/ns                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/urfave/cli/v2                                                               | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/errdefs                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apimachinery/third_party/forked/golang                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/stefanberger/go-pkcs11uri                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/gogo/protobuf                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| vendor/golang.org/x/net                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/fifo                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/json-iterator/go                                                            | [MIT](https://opensource.org/license/mit/)                       |
| vendor/golang.org/x/sys/cpu                                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/text                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/prometheus/client_golang/prometheus                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/docker/go-events                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/exp/constraints                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| tags.cncf.io/container-device-interface                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opencontainers/selinux                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containerd/go-runc                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/json                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/modern-go/concurrent                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/yaml.v3                                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/containerd/api                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| vendor/golang.org/x/crypto                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/moby/sys/mountinfo                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/checkpoint-restore/checkpointctl/lib                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/vishvananda/netns                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/genproto/googleapis/rpc                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/prometheus/procfs                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.mozilla.org/pkcs7                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mistifyio/go-zfs/v3                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/checkpoint-restore/go-criu/v7                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/sirupsen/logrus                                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/opencontainers/runtime-tools                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/felixge/httpsnoop                                                           | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/plugin                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mdlayher/vsock                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/modern-go/reflect2                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apiserver/pkg/endpoints/responsewriter                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| google.golang.org/protobuf                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/klauspost/compress                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/fsnotify/fsnotify                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/cgroups/v3                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/russross/blackfriday/v2                                                     | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/pmezard/go-difflib/difflib                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/sync                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/moby/sys/signal                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/prometheus/client_golang/internal/github.com/golang/gddo/httputil           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/klog/v2                                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/component-base/logs/logreduction                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/emicklei/go-restful/v3                                                      | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/crypto                                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| vendor/golang.org/x/text                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.opentelemetry.io/otel/metric                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/prometheus/client_model/go                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/proto/otlp                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/grpc-gateway/v2                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/inf.v0                                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/yaml                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/yaml/goyaml.v2                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/bbolt                                                                       | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/utils/internal/third_party/forked/golang/net                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/yaml.v2                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/godbus/dbus/v5                                                              | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/davecgh/go-spew/spew                                                        | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/tchap/go-patricia/v2/patricia                                               | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/net                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| tags.cncf.io/container-device-interface/specs-go                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/beorn7/perks/quantile                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/btrfs/v2                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/stretchr/testify/assert                                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containerd/containerd/v2                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/sys                                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/containerd/ttrpc                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/klauspost/compress/internal/snapref                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/utils                                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/flynn/go-shlex                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/api                                                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/eapache/queue/v2                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/hashicorp/go-secure-stdlib/parseutil                                        | [MIT](https://opensource.org/license/mit/)                       |
| github.com/Azure/go-autorest/autorest/date                                             | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)                |
| go.uber.org/multierr                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| cloud.google.com/go/compute/metadata                                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mailru/easyjson                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/go-tuf                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/quic-go/quic-go                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/Azure/go-autorest/autorest/azure/cli                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/service/sso                                               | [MIT](https://opensource.org/license/mit/)                       |
| google.golang.org/genproto/googleapis/api                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/oschwald/geoip2-golang                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/datadog-agent/pkg/remoteconfig/state                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/xerrors                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/go-openapi/jsonpointer                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apimachinery/third_party/forked/golang/reflect                                  | [ISC](https://opensource.org/license/isc-license-txt)            |
| k8s.io/kube-openapi/pkg                                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/imdario/mergo                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/oschwald/maxminddb-golang                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/config                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.etcd.io/etcd/client/pkg/v3                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/dustin/go-humanize                                                          | [MIT](https://opensource.org/license/mit/)                       |
| github.com/infobloxopen/go-trees                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/go-autorest/autorest                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/structured-merge-diff/v4                                                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/go-openapi/swag                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/outcaste-io/ristretto                                                       | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mitchellh/mapstructure                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opencensus.io                                                                       | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/googleapis/gax-go/v2                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/feature/ec2/imds                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/openzipkin/zipkin-go                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/datadog-go/v5/statsd                                                | [MIT](https://opensource.org/license/mit/)                       |
| github.com/DataDog/sketches-go/ddsketch                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coredns/caddy                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/internal/third_party/go-json-experiment/json                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opentracing-contrib/go-observer                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/go-autorest/autorest/to                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/DataDog/dd-trace-go.v1                                                        | [MIT](https://opensource.org/license/mit/)                       |
| github.com/grpc-ecosystem/grpc-opentracing/go/otgrpc                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/coreos/go-semver/semver                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/tinylib/msgp/msgp                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/secure-systems-lab/go-securesystemslib/cjson                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.uber.org/automaxprocs                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/internal/endpoints/v2                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/appsec-internal-go                                                  | [MIT](https://opensource.org/license/mit/)                       |
| github.com/aws/aws-sdk-go-v2/internal/sync/singleflight                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/matttproud/golang_protobuf_extensions/pbutil                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/ebitengine/purego                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/client/v3                                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/smithy-go                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/service/ssooidc                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/jmespath/go-jmespath                                                        | [MIT](https://opensource.org/license/mit/)                       |
| github.com/golang/groupcache/lru                                                       | [MIT](https://opensource.org/license/mit/)                       |
| google.golang.org/api/internal/third_party/uritemplates                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/credentials                                               | [MIT](https://opensource.org/license/mit/)                       |
| github.com/golang-jwt/jwt/v4                                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| google.golang.org/api                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/internal/ini                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.uber.org/zap                                                                        | [MIT](https://opensource.org/license/mit/)                       |
| go.uber.org/atomic                                                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/go-openapi/jsonreference                                                    | [MIT](https://opensource.org/license/mit/)                       |
| github.com/hashicorp/go-secure-stdlib/strutil                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/googleapis/enterprise-certificate-proxy/client                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/hashicorp/go-sockaddr                                                       | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/DataDog/go-libddwaf/v3                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/s2a-go                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/apparentlymart/go-cidr/cidr                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/azure-sdk-for-go                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/service/secretsmanager                                    | [MIT](https://opensource.org/license/mit/)                       |
| github.com/dimchansky/utfbom                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| cloud.google.com/go/auth/oauth2adapt                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/philhofer/fwd                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/Azure/go-autorest/logger                                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/smithy-go/internal/sync/singleflight                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/spec                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/go-autorest/tracing                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go/internal/sync/singleflight                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/pkg/errors                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/ryanuber/go-glob                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/miekg/dns                                                                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/golang/protobuf                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/api/v3                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/outcaste-io/ristretto/z                                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/coredns/coredns                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| cloud.google.com/go/auth                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/service/sts                                               | [MIT](https://opensource.org/license/mit/)                       |
| github.com/coreos/go-systemd/v22/journal                                               | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/exp/rand                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/aws/aws-sdk-go-v2/internal/configsources                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/service/internal/presigned-url                            | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)                |
| github.com/Azure/go-autorest/autorest/adal                                             | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| github.com/aws/aws-sdk-go                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/expr-lang/expr                                                              | [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)                |
| github.com/mitchellh/go-homedir                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/josharian/intern                                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/spf13/pflag                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/dnstap/golang-dnstap                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/gnostic-models                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/openzipkin-contrib/zipkin-go-opentracing                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opentracing/opentracing-go                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/Azure/go-autorest/autorest/azure/auth                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/farsightsec/golang-framestream                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/aws/aws-sdk-go-v2                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/DataDog/datadog-agent/pkg/obfuscate                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mitchellh/go-wordwrap                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/client-go/third_party/forked/golang/template                                    | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/sys/unix                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/moby/term                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| github.com/liggitt/tabwriter                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/cri-client/pkg                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/onsi/gomega                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/cri-tools                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubectl/pkg/util                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/bahlo/generic-list-go                                                       | [MIT](https://opensource.org/license/mit/)                       |
| github.com/buger/jsonparser                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/invopop/jsonschema                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/component-base                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cri-api/pkg/apis                                                                | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| github.com/onsi/ginkgo/v2                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/docker/docker/api/types/time                                                | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cli-runtime/pkg/printers                                                        | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubelet/pkg/types                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/wk8/go-ordered-map/v2                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/blang/semver/v4                                                             | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.etcd.io/etcd/etcdctl/v3                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/VividCortex/ewma                                                            | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mattn/go-colorable                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mattn/go-runewidth                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/tmc/grpc-websocket-proxy/wsproxy                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/fatih/color                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-middleware/logging/settable                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/go-grpc-prometheus                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/olekukonko/tablewriter                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/spf13/cobra                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/tests/v3                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/raft/v3                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| go.etcd.io/etcd/v3                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/cheggaaa/pb/v3                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/rivo/uniseg                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/bgentry/speakeasy                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/etcdutl/v3                                                             | [MIT](https://opensource.org/license/mit/)                       |
| go.etcd.io/etcd/server/v3                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/jonboulle/clockwork                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/soheilhy/cmux                                                               | [MIT](https://opensource.org/license/mit/)                       |
| go.etcd.io/gofail/runtime                                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mattn/go-isatty                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/pkg/v3                                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/btree                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| gopkg.in/natefinch/lumberjack.v2                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/stretchr/testify                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.etcd.io/etcd/client/v2                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/xiang90/probing                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coredns/caddy/caddyfile                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| bitbucket.org/bertimus9/systemstat                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/stoewer/go-strcase                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/endpointslice                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubernetes/third_party/forked/gotestsum/junitxml                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apiserver                                                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/cyphar/filepath-securejoin                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| google.golang.org/genproto/protobuf/field_mask                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cli-runtime/pkg                                                                 | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/kustomize/api                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/controller-manager                                                              | [MIT](https://opensource.org/license/mit/)                       |
| github.com/opencontainers/runc/libcontainer                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| sigs.k8s.io/kustomize/kyaml                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/MakeNowJust/heredoc                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/tools                                                                     | [MIT](https://opensource.org/license/mit/)                       |
| github.com/grpc-ecosystem/go-grpc-middleware                                           | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/monochromegane/go-gitignore                                                 | [MIT](https://opensource.org/license/mit/)                       |
| github.com/karrick/godirwalk                                                           | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/utils/internal/third_party/forked/golang                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/externaljwt/apis/v1alpha1                                                       | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kube-proxy/config/v1alpha1                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coredns/corefile-migration/migration                                        | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kube-scheduler                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mohae/deepcopy                                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/peterbourgon/diskv                                                          | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubernetes/third_party/forked/gonum/graph                                       | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/antlr4-go/antlr/v4                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/strfmt                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.uber.org/goleak                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/apiextensions-apiserver                                                         | [MIT](https://opensource.org/license/mit/)                       |
| sigs.k8s.io/knftables                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/exponent-io/jsonpath                                                        | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/dynamic-resource-allocation                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/mrunalp/fileutils                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/yaml/goyaml.v3                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/lithammer/dedent                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/validate                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/evanphx/json-patch.v4                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubernetes                                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/system-validators/validators                                                    | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/cluster-bootstrap                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/robfig/cron/v3                                                              | [OpenSSL](https://openssl-library.org/source/license/index.html) |
| sigs.k8s.io/apiserver-network-proxy/konnectivity-client                                | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubectl/pkg                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/pquerna/cachecontrol                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/grpc-ecosystem/grpc-gateway                                                 | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/cloud-provider                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| cel.dev/expr                                                                           | [MIT](https://opensource.org/license/mit/)                       |
| github.com/chai2010/gettext-go                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| sigs.k8s.io/kustomize/kustomize/v5/commands/build                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/xlab/treeprint                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/mount-utils                                                                     | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/utils/inotify                                                                   | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/go-errors/errors                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/stretchr/objx                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| golang.org/x/exp                                                                       | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/kubernetes/third_party/forked/golang                                            | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/square/go-jose.v2                                                             | [MIT](https://opensource.org/license/mit/)                       |
| github.com/mistifyio/go-zfs                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/cel-go                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/moby/ipvs                                                                   | [MIT](https://opensource.org/license/mit/)                       |
| k8s.io/sample-apiserver/pkg                                                            | [MIT](https://opensource.org/license/mit/)                       |
| go.etcd.io/etcd/raft/v3                                                                | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| k8s.io/kubelet                                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/csi-translation-lib                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/pod-security-admission                                                          | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| go.opentelemetry.io/contrib/instrumentation/github.com/emicklei/go-restful/otelrestful | [BSD-2-Clause](https://opensource.org/license/bsd-2-clause)      |
| k8s.io/kube-controller-manager/config/v1alpha1                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| gopkg.in/square/go-jose.v2/json                                                        | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/asaskevich/govalidator                                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/google/shlex                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kubernetes/third_party/forked/libcontainer                                      | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| k8s.io/kubernetes/third_party/forked/vishhstress                                       | [ISC](https://opensource.org/license/isc-license-txt)            |
| github.com/gregjones/httpcache                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-aggregator/pkg                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/google/cadvisor                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kms                                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/container-storage-interface/spec/lib/go/csi                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/fatih/camelcase                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/kube-openapi/pkg/validation/errors                                              | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/armon/circbuf                                                               | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/ishidawataru/sctp                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/metrics/pkg                                                                     | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/NYTimes/gziphandler                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/libopenstorage/openstorage                                                  | [MIT](https://opensource.org/license/mit/)                       |
| github.com/go-logr/zapr                                                                | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-oidc                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| k8s.io/component-helpers                                                               | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/euank/go-kmsg-parser/kmsgparser                                             | [MIT](https://opensource.org/license/mit/)                       |
| golang.org/x/net/bpf                                                                   | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/alexflint/go-filemutex                                                      | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-iptables/iptables                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mattn/go-shellwords                                                         | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/u-root/uio                                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| golang.org/x/sync/errgroup                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/mdlayher/packet                                                             | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/networkplumbing/go-nft/nft                                                  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/safchain/ethtool                                                            | [MIT](https://opensource.org/license/mit/)                       |
| github.com/insomniacslk/dhcp                                                           | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/pierrec/lz4/v4                                                              | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/josharian/native                                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/containernetworking/plugins                                                 | [MIT](https://opensource.org/license/mit/)                       |
| github.com/containernetworking/cni/pkg                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/coreos/go-systemd/v22/activation                                            | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/opencontainers/runc                                                         | [MIT](https://opensource.org/license/mit/)                       |
| vendor/golang.org/x/net/dns/dnsmessage                                                 | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/urfave/cli                                                                  | [BSD-3-Clause](https://opensource.org/license/bsd-3-clause)      |
| github.com/moby/sys/capability                                                         | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)        |
| github.com/checkpoint-restore/go-criu/v6                                               | [MIT](https://opensource.org/license/mit/)                       |

<!-- vale on -->
