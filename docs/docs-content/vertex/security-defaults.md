---
sidebar_label: "Security Defaults"
title: "Security Defaults"
description: "Security behavior that Palette VerteX enforces by default and that operators cannot reconfigure."
icon: ""
hide_table_of_contents: false
sidebar_position: 45
tags: ["vertex", "security", "fips", "compliance", "audit"]
keywords: ["self-hosted", "vertex", "stig", "fips"]
---

Palette VerteX ships with the security behavior on this page built in. Unless a setting is listed in
[Operator-Configurable Settings](#operator-configurable-settings), no System Console page, Tenant Console page, Local UI
page, API field or install-time setting changes the behavior described here.

The behavior on this page was verified on Palette VerteX 4.10.33. Most sections end with a command you can run to
confirm the behavior on your own installation.

## Transport Encryption

Palette VerteX serves the following interfaces over Transport Layer Security (TLS) only.

| Interface                         | Port  |
| --------------------------------- | ----- |
| Tenant Console and management API | 443   |
| System Console                    | 443   |
| Local UI                          | 5080  |
| Kubernetes API server             | 6443  |
| etcd                              | 2379  |
| Kubelet                           | 10250 |
| Built-in pack registry            | 30003 |

Port 80 answers every request with a redirect to the HTTPS address and returns no other content. A sign-in request sent
over plain HTTP is redirected, not processed.

On every interface in the table:

- TLS 1.2 is the minimum protocol version and TLS 1.3 the maximum. TLS 1.1, TLS 1.0, SSL 3.0 and SSL 2.0 are refused.
- Only AES-GCM cipher suites are offered:
  - TLS 1.3: `TLS_AES_128_GCM_SHA256` and `TLS_AES_256_GCM_SHA384`.
  - TLS 1.2: `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`, `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`,
    `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256` and `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`. Each interface negotiates
    the RSA or ECDSA pair that matches its certificate key.
- Key agreement uses ECDHE over NIST curves. ChaCha20, CBC and 3DES suites and the X25519 curve are refused.
- Handshakes are signed with SHA-256 or SHA-384. A handshake limited to SHA-1 signatures is refused.

When a client requires the Commercial National Security Algorithm Suite (CNSA) 1.0 parameters (AES-256-GCM, ECDH P-384
and SHA-384), the Tenant Console, System Console, management API, Kubernetes API server, etcd and built-in pack registry
negotiate them. The Local UI negotiates AES-256-GCM and SHA-384 and offers only P-256 for key agreement. The Kubelet
negotiates AES-256-GCM and P-384 and signs the handshake with SHA-256, because its certificate carries a P-256 key. The
cluster certificate authority signs that certificate with SHA-256 and RSA, like every other certificate in the cluster.

The platform database accepts TLS connections only and runs TLS in FIPS mode.

<details>
<summary>Verify</summary>

From a workstation that reaches the appliance, confirm that TLS 1.1 is refused and that an AES-GCM suite is negotiated.
Repeat with port 5080 for the Local UI.

```shell
echo | openssl s_client -connect <appliance-address>:443 -tls1_1 -cipher 'DEFAULT:@SECLEVEL=0' 2>&1 | grep --ignore-case 'alert protocol version'
echo | openssl s_client -connect <appliance-address>:443 2>/dev/null | grep --extended-regexp 'Protocol +:|Cipher +:'
```

```text hideClipboard
SSL routines:ssl3_read_bytes:tlsv1 alert protocol version
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_128_GCM_SHA256
```

</details>

## Cryptographic Modules

Palette VerteX performs its cryptography in FIPS 140-3 validated modules selected at build time:

- The management plane services, the Kubernetes control-plane components, etcd and the Kubelet are built against the
  Spectro Cloud Cryptographic Library
  ([CMVP certificate #5061](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5061)).
  Refer to [FIPS-Compliant Components](./fips/fips-compliant-components.md).
- The Traefik ingress proxy, which terminates TLS for the Tenant Console, the System Console and the management API, and
  the built-in pack registry are built against the Go Cryptographic Module v1.0.0
  ([CMVP certificate #5247](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5247))
  with FIPS 140-3 mode on by default.
- Appliance nodes run the Ubuntu Pro FIPS kernel with FIPS mode enabled.

The tenant settings **Allow non-FIPS packs**, **Allow non-FIPS features** and **Allow cluster import** govern the packs,
features and imported clusters a tenant uses. They do not change the cryptographic modules of the management plane.
Refer to [Enable non-FIPS Settings](./system-management/enable-non-fips-settings/enable-non-fips-settings.md).

<details>
<summary>Verify</summary>

On a control-plane node, confirm kernel FIPS mode and the ingress proxy's module.

```shell
cat /proc/sys/crypto/fips_enabled
sudo grep --text --only-matching --extended-regexp 'build[[:space:]](GOFIPS140|DefaultGODEBUG)=[^[:space:]]*' /proc/$(pgrep --exact traefik)/exe | sort --unique
```

```text hideClipboard
1
build	DefaultGODEBUG=fips140=on
build	GOFIPS140=v1.0.0-c2097c7c
```

</details>

## Certificates and Signatures

- Every certificate in the appliance cluster's public key infrastructure (the Kubernetes certificate authority, API
  server, etcd, front proxy and Kubelet certificates) and the certificates the consoles present after installation are
  signed with SHA-256 (`sha256WithRSAEncryption`).
- Each TLS interface refuses a handshake when the client offers only SHA-1 signature algorithms.
- A certificate uploaded on the System Console **Administration** > **System Address** tab must verify against the
  certificate authority supplied with it and match the system address, or the upload is refused. A certificate signed
  with SHA-1 fails that verification. Selecting **Insecure Skip Verify** does not bypass this check.

<details>
<summary>Verify</summary>

From a workstation that reaches the appliance, confirm that a handshake limited to SHA-1 signatures is refused.

```shell
echo | openssl s_client -connect <appliance-address>:443 -tls1_2 -sigalgs 'RSA+SHA1:ECDSA+SHA1' -cipher 'DEFAULT:@SECLEVEL=0' 2>&1 | grep --ignore-case alert
```

The output contains `alert handshake failure` and `SSL alert number 40`.

</details>

## SSH on Appliance Nodes

The SSH daemon on each appliance node offers only the following algorithms. They are set in the host image.

| Type         | Algorithms                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| Ciphers      | `aes256-ctr`, `aes256-gcm@openssh.com`, `aes192-ctr`, `aes128-ctr`, `aes128-gcm@openssh.com`             |
| MACs         | `hmac-sha2-512`, `hmac-sha2-512-etm@openssh.com`, `hmac-sha2-256`, `hmac-sha2-256-etm@openssh.com`       |
| Key exchange | `ecdh-sha2-nistp256`, `ecdh-sha2-nistp384`, `ecdh-sha2-nistp521`, `diffie-hellman-group-exchange-sha256` |

:::info

The algorithms are set in `/etc/ssh/sshd_config.d/00-complianceascode-hardening.conf`, which `/etc/ssh/sshd_config`
includes. Compliance scanners that read only `/etc/ssh/sshd_config` can report these settings as missing. Use `sshd -T`
to read the effective values.

:::

<details>
<summary>Verify</summary>

```shell
sudo sshd -T | grep --extended-regexp '^(ciphers|macs|kexalgorithms) '
```

```text hideClipboard
ciphers aes256-ctr,aes256-gcm@openssh.com,aes192-ctr,aes128-ctr,aes128-gcm@openssh.com
macs hmac-sha2-512,hmac-sha2-512-etm@openssh.com,hmac-sha2-256,hmac-sha2-256-etm@openssh.com
kexalgorithms ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group-exchange-sha256
```

</details>

## Authentication

### Sign-In Feedback

Every sign-in surface masks the password as it is typed and answers a failed sign-in with one message, whether the
account does not exist or the password is wrong. The following table lists the message on each interface.

| Interface                         | Failure message                                             |
| --------------------------------- | ----------------------------------------------------------- |
| Tenant Console and System Console | `Invalid credentials specified or too many failed attempts` |
| Local UI                          | `Login failed due to incorrect credentials`                 |
| Node console menu                 | `invalid username or password`                              |

The node console menu masks the password with asterisks.

### API Keys

API keys are generated inside the management API from the random bit generator of the Spectro Cloud Cryptographic
Library. Each key is a 128-bit random value. The key is shown once, when it is created. Palette VerteX stores only a
salted one-way hash of the key, and no API response returns the key after creation. No field selects a generator, key
length or format. Refer to [Create API Key](/user-management/authentication/api-key/create-api-key/).

### Session Tokens

- Tenant Console, System Console and password-authenticated API sessions use a JSON Web Token (JWT) protected with HS256
  (HMAC-SHA-256) under a signature key generated at installation and stored as a secret on the management cluster.
- Local UI sessions use a JWT signed with RS256 under a key pair generated on each host.
- When Palette VerteX acts as an OpenID Connect identity provider for clusters, it signs the tokens it issues with RS256
  under a per-tenant key pair.
- The only token setting an operator can change is the session lifetime, from 15 to 1440 minutes. Values outside that
  range are refused. Refer to [Session Timeout](/tenant-settings/session-timeout/).

<details>
<summary>Verify</summary>

Sign in over the API and decode the token header.

```shell
curl --silent --insecure --header 'Content-Type: application/json' --data '{"emailId":"<user>","password":"<password>"}' https://<appliance-address>/v1/auth/authenticate | jq --raw-output '.Authorization | split(".")[0] | @base64d'
```

```text hideClipboard
{"alg":"HS256","typ":"JWT"}
```

</details>

## Audit Records

### Audit Layers

The following audit layers ship enabled. None can be turned off from a console, the API or an install option.

| Layer                           | Where to read it                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Management API audit trail      | Tenant Console **Audit Logs** page, or `GET /v1/audits`                           |
| Kubernetes API server audit log | `/var/log/apiserver/audit.log` on control-plane nodes                             |
| Host audit daemon (`auditd`)    | `/var/log/audit/audit.log` on each node                                           |
| systemd journal                 | `journalctl` on each node                                                         |
| Local UI audit log              | `/var/log/stylus-audit.log` on each node, or Local UI **Diagnostics** > **Audit** |

### Time Stamps

Every layer takes its time stamps from the system clock of the node that writes the record. When Network Time Protocol
(NTP) servers are configured, they discipline that clock. No layer uses another time source.

Every layer records UTC, and every node runs in UTC. The Tenant Console **Audit Logs** page displays times in the
viewer's local time zone, to the minute. The Local UI displays times in the viewer's local time zone and labels the
offset, for example `(Local: UTC-05:00)`. The stored records are unchanged.

Every layer records fractions of a second, in the following formats.

| Layer                           | Format                       | Precision    |
| ------------------------------- | ---------------------------- | ------------ |
| Management API audit trail      | RFC 3339 with `Z`            | Milliseconds |
| Kubernetes API server audit log | RFC 3339 with `Z`            | Microseconds |
| Host audit daemon               | Seconds since the Unix epoch | Milliseconds |
| systemd journal                 | ISO 8601 with `+0000`        | Microseconds |

### Maintenance and Diagnostic Sessions

- Tenant Console and System Console sessions are recorded in the management API audit trail with the actor and the
  action, starting with the sign-in.
- Local UI sessions are recorded in the Local UI audit log with the actor, the action and the outcome, including failed
  sign-ins.
- SSH sessions are recorded by the SSH daemon with the user, the accepted key and the source address, and by the host
  audit daemon with the session open and close. Commands run with `sudo` are recorded.
- Kubernetes API requests are recorded in the API server audit log with the user, verb, resource, source address and
  result code.

### Kubernetes API Audit Policy

The shipped Kubernetes API server audit policy records requests at the `Metadata` level or higher and ends in a
catch-all `Metadata` rule. A refused request is recorded with code `403`. The policy does not record the following
routine requests:

- Requests for `events`.
- The `/healthz`, `/version` and `/swagger` endpoints.
- Reads and watches that Kubernetes system components make on their own objects: kube-proxy watches of endpoints and
  services, node status reads by Kubelets, endpoint reads and updates in `kube-system` by the controller manager,
  scheduler and endpoint controller, ConfigMap reads in `kube-system` by `system:unsecured`, ConfigMap and endpoint
  reads and updates in `kube-system` by the cluster autoscaler, namespace reads by the API server, and metrics reads by
  the controller manager.

### Access to Runtime Objects

The container runtime socket, `/run/containerd/containerd.sock`, is accessible to root only. The host audit daemon
records every file open refused to a non-root account.

<details>
<summary>Verify</summary>

On a control-plane node, read the newest API server audit record and confirm the UTC, sub-second time stamp.

```shell
sudo tail --lines=1 /var/log/apiserver/audit.log | grep --only-matching --extended-regexp '"requestReceivedTimestamp":"[^"]+"'
```

```text hideClipboard
"requestReceivedTimestamp":"2026-11-13T14:58:43.536483Z"
```

</details>

## Workload Isolation

- The management plane's security services (authentication, user and role management, the management API and system
  administration) each run as a separate Kubernetes Deployment under its own service account, as a non-root user, with
  the `RuntimeDefault` secure computing mode (`seccomp`) profile and the containerd AppArmor profile. Their namespace
  enforces the `baseline` Pod Security Standard. The console front end, ingress, image registry, storage and networking
  run in their own namespaces.
- No container shares the host PID or mount namespace.
- Only a fixed set of infrastructure components shipped in the appliance image uses the host network, UTS, IPC or cgroup
  namespaces, or host paths: the Kubernetes control-plane components, kube-vip, kube-proxy, the Calico network agent,
  the LINSTOR and DRBD storage components, and the cluster agent's pack cache at `/usr/local/spectrocloud/packs`.
- Every unprivileged container runs under the containerd AppArmor profile. The only privileged containers are the Calico
  network agent, kube-proxy and the LINSTOR storage components.
- The Kubelet runs with `protectKernelDefaults: true`.
- Workloads are grouped by function in dedicated Kubernetes namespaces. Nothing runs in the `default` namespace.

<details>
<summary>Verify</summary>

On a control-plane node, count the containers that share the host PID or mount namespace.

```shell
for c in $(sudo crictl --runtime-endpoint unix:///run/containerd/containerd.sock ps --quiet 2>/dev/null); do p=$(sudo crictl --runtime-endpoint unix:///run/containerd/containerd.sock inspect --output go-template --template '{{.info.pid}}' $c 2>/dev/null); [ "$(sudo readlink /proc/$p/ns/pid)" = "$(sudo readlink /proc/1/ns/pid)" ] || [ "$(sudo readlink /proc/$p/ns/mnt)" = "$(sudo readlink /proc/1/ns/mnt)" ] && echo $c; done | wc --lines
```

```text hideClipboard
0
```

</details>

## API Input Handling

The management API declares a type for every request parameter and request body in its published
[API specification](/api/introduction/). It binds each request body to its declared type and refuses a body of the wrong
type with a `400` response that names the field. Typed query parameters on resource endpoints are checked the same way
and refused with a `422` response that names the parameter. The Local UI API refuses request bodies of the wrong type
the same way.

<details>
<summary>Verify</summary>

Send a query parameter of the wrong type.

```shell
curl --silent --insecure --write-out ' %{http_code}\n' --header "ApiKey: <api-key>" "https://<appliance-address>/v1/audits?limit=abc"
```

```text hideClipboard
{"code":601,"message":"limit in query must be of type int64: \"abc\""} 422
```

</details>

## Operator-Configurable Settings

The following related settings can be changed. Nothing else described on this page is configurable.

| Setting                                                                          | Where                                                                                           |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Console certificate, key and certificate authority                               | System Console **Administration** > **System Address**                                          |
| Session lifetime, 15 to 1440 minutes (default 240)                               | Tenant Console **Tenant Settings** > **Platform** > **Platform Settings** > **Session timeout** |
| NTP servers                                                                      | Local UI **Cluster** > **Actions** > **Cluster Settings** > **Network Time Protocol (NTP)**     |
| Pack registry certificates, or an external registry in place of the built-in one | Local UI **Cluster** > **Configuration** > **Container Registry**                               |
| Audit log forwarding                                                             | Tenant Console **Tenant Settings** > **Infrastructure** > **Audit Trails**                      |
| Non-FIPS packs, features and imported clusters                                   | Tenant Console **Tenant Settings** > **Platform** > **Platform Settings**                       |
