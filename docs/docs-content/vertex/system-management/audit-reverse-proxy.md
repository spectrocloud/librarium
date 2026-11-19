---
sidebar_label: "Record Console Activity at a Reverse Proxy"
title: "Record Console Activity at a Reverse Proxy"
description:
  "Record every sign-in attempt, refused request and System Console action in Palette VerteX by placing a logging
  reverse proxy in front of the appliance and sending its log to your SIEM."
icon: ""
hide_table_of_contents: false
sidebar_position: 45
tags: ["vertex", "management", "audit"]
keywords: ["self-hosted", "vertex", "audit", "siem", "reverse proxy", "stig"]
---

Palette VerteX records successful actions in its [audit logs](../../audit-logs/audit-logs.md). Some events aren't
recorded there today: failed sign-in attempts, requests that Palette VerteX refuses, and actions taken in the System
Console, which don't name the administrator who acted. Organizations that must record every attempt to use the consoles
and API, such as those following the DoD Container Platform SRG, can record these events at a reverse proxy in front of
Palette VerteX and send the proxy log to their Security Information and Event Management (SIEM) system.

This page describes what the reverse proxy must do, which fields identify the caller and the outcome of each request,
and which alerts to send to your system administrators and Information System Security Officer (ISSO). You can use any
reverse proxy that meets the [requirements](#reverse-proxy-requirements). The page includes example configurations for
HAProxy and Nginx. Use it together with
[Audit Trails](../../audit-logs/audit-logs.md#push-audit-trails-to-amazon-cloudwatch-or-splunk), which forwards the
events Palette VerteX already records.

The proxy only reads requests and responses. You don't install or change anything in Palette VerteX.

This page is not about the reverse proxy that host clusters use to reach their Kubernetes API server. For that, refer to
[Configure Reverse Proxy](./reverse-proxy.md).

## How It Works

![Users, API clients, workload clusters and edge hosts connect to a logging reverse proxy, which forwards their requests to Palette VerteX and sends one log line per request to the SIEM. Palette VerteX also sends Audit Trails to the SIEM, which alerts system administrators and the ISSO.](/vertex_system-management_audit-reverse-proxy_architecture.webp)

The proxy terminates TLS with your certificate, re-encrypts to Palette VerteX, and writes one log line for each request.
Every line records the following.

| Field                                      | Source                                                                                                   | What it tells you                                                                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Time, client address, method, path, status | The request and the response                                                                             | When and from where a client sent the request, what it asked for, and whether it succeeded                                                   |
| User and email                             | The `token.UserUid` and `email` claims of the session token                                              | Which Tenant Console user made the request, including users who signed in through SSO. Requests from edge host agents show the user `lodge`. |
| Tenant                                     | The `token.TenantUid` claim                                                                              | Which tenant the user belongs to                                                                                                             |
| System Console                             | The `token.IsSystem` claim                                                                               | Whether the request came from a System Console session                                                                                       |
| Administrator type                         | The `token.SystemAdmin.AdminType` claim                                                                  | `AccountAdmin` or `OperationAdmin` for a named System Console administrator                                                                  |
| Account typed at sign-in                   | The `emailId` field of `POST /v1/auth/authenticate`, or the `username` field of `POST /v1/auth/syslogin` | The account that a sign-in attempt targeted. Successful and failed attempts both record it.                                                  |
| Platform error                             | The `err_code` response header                                                                           | The reason Palette VerteX refused a request, such as `RestrictedToTenantAdmin`                                                               |
| Request ID                                 | The `svc_req_id` response header                                                                         | The request ID Palette VerteX uses internally, for support cases                                                                             |

The session token arrives in the `Authorization` cookie when a user signs in through a browser, and in the
`Authorization` header when a client calls the API. It is a JSON Web Token (JWT) whose payload the proxy can read. The
proxy logs the token's identity claims, never the token itself.

:::warning

The proxy must never log passwords, session tokens, cookie values, API key values, or any request body other than the
`emailId` and `username` fields of the two sign-in requests. Some request paths carry a token, such as the session
refresh that edge hosts send and password activation links. The example configurations on this page log the path without
the query string and with long token-like segments replaced by `<redacted>`.

:::

## Limitations

- **API keys.** The proxy logs requests that authenticate with the `ApiKey` header with `api_key=yes`, but it can't tell
  which user the key belongs to. Restrict API keys to the accounts that need them and review the key list in the Tenant
  Console.
- **Root System Console administrator.** Every root administrator session shows the user as `sysadmin`. Create a named
  System Console administrator for each person, and keep the root credentials in a vault that records each checkout so
  you can tie a root session to a person.
- **Unverified identity on rejected tokens.** The proxy reads the token without checking its signature. Palette VerteX
  rejects a forged or expired token with HTTP 401, so the user shown on a 401 line is not trustworthy. The user on any
  other line is.
- **Single sign-on.** Users who sign in through SAML or OIDC enter their password at your identity provider, not at
  Palette VerteX, so a failed SSO sign-in never reaches the proxy. Record failed SSO sign-ins in your identity
  provider's log and forward that log to the same SIEM. A successful SSO sign-in appears in the proxy log as
  `GET /v1/auth/org/<tenant>/oidc/callback` with status `303`, followed by requests that name the user.
- **Paths that don't pass through the proxy.** SSH to the appliance nodes, the Kubernetes API on port 6443, and the
  [Local UI](../../clusters/edge/local-ui/local-ui.md) on port 5080 don't use the console and API address. The host
  audit log and the Kubernetes API server audit log record activity on these paths. Forward both to your SIEM.
- **Field names.** The cookie name, token claims, and response headers on this page are what Palette VerteX uses today.
  After every upgrade, repeat the [Validate](#validate) steps to confirm that the fields haven't changed.

## Reverse Proxy Requirements

The reverse proxy you choose must do the following. Each requirement prevents a failure that breaks the consoles, the
clusters, or the log.

| Requirement                                                                                                                                                           | Why                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Serve TLS with a certificate that covers every host name your users browse to and that your clusters and edge hosts trust.                                            | Clusters and edge hosts reach Palette VerteX through the proxy after you change DNS, and they verify its certificate.                      |
| Serve HTTP/2 and HTTP/1.1 to clients, and support WebSocket upgrades.                                                                                                 | Browsers and agents use HTTP/2. Agents also open WebSocket connections, for example on `/v1/tunnel-ws`.                                    |
| Connect to the IP address of the Palette VerteX console and API endpoint, not its host name.                                                                          | After you change DNS, the host name resolves to the proxy, and the proxy would connect to itself.                                          |
| Pass the request's host name to Palette VerteX unchanged, and use it as the TLS server name.                                                                          | Palette VerteX picks the tenant from the host name. A rewritten host name sends every tenant request to the System Console's organization. |
| Verify the Palette VerteX certificate against your CA and the request's host name, and refuse the request if verification fails.                                      | Without verification, the proxy forwards credentials to any server that answers on the address.                                            |
| Send gRPC requests to Palette VerteX over HTTP/2. These requests use the paths `/BrokerService/`, `/Broker/`, and `/wormhole.*/`.                                     | Clusters and edge hosts use gRPC on these paths.                                                                                           |
| Keep idle client connections, open streams, and WebSocket connections for at least one hour, while still limiting how long a client can take to send request headers. | Edge hosts keep a remote shell connection open and idle until an operator uses it. A short idle timeout drops it.                          |
| Read the session token from the `Authorization` cookie or header and log the claims listed in [How It Works](#how-it-works).                                          | These claims identify the caller.                                                                                                          |
| Read only the `emailId` or `username` field of the two sign-in request bodies.                                                                                        | These fields identify the account a sign-in attempt targeted.                                                                              |
| Log the `err_code` and `svc_req_id` response headers.                                                                                                                 | These headers carry the reason for a refusal and the request ID.                                                                           |
| Write one JSON record per request, up to 4 KB long, without truncating it.                                                                                            | Long paths exceed some proxies' default line limit, and a truncated line is not valid JSON.                                                |
| Never log query strings, cookie values, header values, or request bodies, and remove token-like path segments.                                                        | Some paths and queries carry session tokens or one-time codes.                                                                             |
| Forward the log to your SIEM over TLS.                                                                                                                                | The log is an audit record.                                                                                                                |
| Run the processes that handle traffic as an unprivileged user.                                                                                                        | The proxy handles untrusted input from the network.                                                                                        |

## Prerequisites

- A Palette VerteX installation, the host names your users browse to (the System Console and each tenant), and the IP
  address of its console and API endpoint (the VIP).

- A Linux host for the reverse proxy, on the network path between your users and Palette VerteX.

- A reverse proxy that meets the [requirements](#reverse-proxy-requirements), and `rsyslog` with TLS support, on the
  proxy host. The examples on this page use the following packages.

  - HAProxy 2.8 or later. The `haproxy` packages in Ubuntu 24.04 and Red Hat Enterprise Linux 9 meet this. Ubuntu 22.04
    ships HAProxy 2.4, which can't decode the session token.
  - Nginx 1.24 or later with the `njs` module, such as the `nginx` and `libnginx-mod-http-js` packages in Ubuntu 24.04.

  :::info

  If your organization requires FIPS 140-3 validated cryptography, run the proxy against a FIPS-validated cryptographic
  module that your operating system supports, such as Red Hat Enterprise Linux in FIPS mode or the Ubuntu Pro FIPS
  packages. A FIPS provider that is newer than the OpenSSL library on the host might not load. To confirm that the FIPS
  provider is in force, run `OPENSSL_CONF=<your-config> openssl list -providers` and check that it lists the FIPS
  provider as active. With the same configuration, `openssl sha256` must succeed and `openssl md5` must fail.

  :::

- A TLS certificate and key for the proxy, issued by your organization's PKI and covering every host name your users
  browse to.

- The certificate of the CA that issued the Palette VerteX certificate. The proxy checks the Palette VerteX certificate
  against this CA and the host name of each request, so the Palette VerteX certificate must also cover those host names.
  Refer to [SSL Certificate Management](./ssl-certificate-management.md).

- The certificate of the CA that issued the Syslog certificate of your SIEM.

- Network controls that let you allow TCP port 443 to Palette VerteX only from the proxy host.

- A SIEM that accepts Syslog, and an account that can create alert rules.

- System Console access as the root administrator, to create named System Console administrators.

- `curl` and `jq` on a workstation, for the [Validate](#validate) steps.

## Enablement

### Configure the Proxy

Use the tab for your reverse proxy. The examples are for Ubuntu 24.04. Replace `10.10.10.5` with the IP address of your
Palette VerteX console and API endpoint.

<Tabs groupId="reverse-proxy">
<TabItem label="HAProxy" value="haproxy">

1. Install HAProxy and `rsyslog`.

   <!-- vale spectrocloud-docs-internal.longform = NO -->

   ```shell
   sudo apt-get install --yes haproxy rsyslog rsyslog-gnutls
   haproxy -v
   ```

   <!-- vale spectrocloud-docs-internal.longform = YES -->

   The first line of the output shows the version, which must be 2.8 or later.

2. Combine the proxy's certificate and key into one PEM file at `/etc/haproxy/proxy.pem`, and copy the Palette VerteX CA
   certificate to `/etc/haproxy/vertex-ca.pem`. Allow only the `haproxy` group to read the key.

   ```shell
   sudo chown root:haproxy /etc/haproxy/proxy.pem /etc/haproxy/vertex-ca.pem
   sudo chmod 640 /etc/haproxy/proxy.pem
   ```

3. Replace `/etc/haproxy/haproxy.cfg` with the following configuration.

   ```text
   global
       log /dev/log len 4096 local0
       user haproxy
       group haproxy
       tune.bufsize 65536

   defaults
       mode http
       log global
       option http-buffer-request
       option dontlognull
       timeout connect 5s
       timeout http-request 10s
       timeout http-keep-alive 1h
       timeout client 1h
       timeout server 1h
       timeout tunnel 1h

   frontend vertex
       bind :443 ssl crt /etc/haproxy/proxy.pem alpn h2,http/1.1

       # Who is calling: the browser sends the session in the Authorization cookie, API clients in the Authorization header.
       http-request set-var(txn.tok) req.cook(Authorization)
       http-request set-var(txn.tok) req.hdr(Authorization),regsub(^Bearer\ ,) if !{ var(txn.tok) -m found }
       http-request set-var(txn.user) var(txn.tok),jwt_payload_query('$.token.UserUid')
       http-request set-var(txn.email) var(txn.tok),jwt_payload_query('$.email')
       http-request set-var(txn.tenant) var(txn.tok),jwt_payload_query('$.token.TenantUid')
       http-request set-var(txn.system) var(txn.tok),jwt_payload_query('$.token.IsSystem')
       http-request set-var(txn.admintype) var(txn.tok),jwt_payload_query('$.token.SystemAdmin.AdminType')
       http-request set-var(txn.apikey) str(yes) if { req.hdr(ApiKey) -m found }

       # Some paths carry a token (session refresh, password activation). Log the path with long token-like segments removed.
       http-request set-var(txn.path) path,regsub('[A-Za-z0-9_=-]{32}[A-Za-z0-9_=.-]*','<redacted>','g')

       # Sign-in attempts: record the account typed, never the password.
       http-request set-var(txn.login) req.body,json_query('$.emailId') if { path_beg /v1/auth/authenticate }
       http-request set-var(txn.login) req.body,json_query('$.username') if { path_beg /v1/auth/syslogin }

       # Outcome: the reason Palette VerteX refused a request, and its request ID.
       http-response set-var(txn.err) res.hdr(err_code)
       http-response set-var(txn.reqid) res.hdr(svc_req_id)

       log-format '{"time":"%[date,ltime(%Y-%m-%dT%H:%M:%S%z)]","client":"%ci","method":"%HM","path":"%[var(txn.path)]","status":%ST,"user":"%[var(txn.user)]","email":"%[var(txn.email)]","tenant":"%[var(txn.tenant)]","system_console":"%[var(txn.system)]","admin_type":"%[var(txn.admintype)]","api_key":"%[var(txn.apikey)]","sign_in_as":"%[var(txn.login)]","platform_error":"%[var(txn.err)]","request_id":"%[var(txn.reqid)]"}'
       default_backend vertex

   backend vertex
       server vertex 10.10.10.5:443 ssl verify required ca-file /etc/haproxy/vertex-ca.pem sni req.hdr(host),field(1,:) alpn h2,http/1.1
   ```

   The `log-format` line writes one JSON object per request. Keep `alpn h2,http/1.1` on both the `bind` and `server`
   lines. Without it on the `server` line, HAProxy converts browser HTTP/2 requests to HTTP/1.1, and the System Console
   intermittently fails to load. Without `timeout http-keep-alive 1h`, HAProxy closes an idle connection after the
   10-second `timeout http-request`. The `user` and `group` lines make HAProxy drop root privileges after it starts.

4. Check the configuration and restart HAProxy.

   <!-- vale spectrocloud-docs-internal.longform = NO -->

   ```shell
   sudo haproxy -c -V -f /etc/haproxy/haproxy.cfg
   sudo systemctl restart haproxy
   ```

   <!-- vale spectrocloud-docs-internal.longform = YES -->

   The check prints `Configuration file is valid`.

</TabItem>
<TabItem label="Nginx" value="nginx">

1. Install Nginx, the `njs` module, and `rsyslog`.

   <!-- vale spectrocloud-docs-internal.longform = NO -->

   ```shell
   sudo apt-get install --yes nginx libnginx-mod-http-js rsyslog rsyslog-gnutls
   nginx -v
   ```

   <!-- vale spectrocloud-docs-internal.longform = YES -->

   The output shows the version, which must be 1.24 or later.

2. Copy the proxy's certificate to `/etc/nginx/proxy.crt`, its key to `/etc/nginx/proxy.key`, and the Palette VerteX CA
   certificate to `/etc/nginx/vertex-ca.pem`. Allow only `root` to read the key.

   ```shell
   sudo chown root:root /etc/nginx/proxy.crt /etc/nginx/proxy.key /etc/nginx/vertex-ca.pem
   sudo chmod 600 /etc/nginx/proxy.key
   ```

3. Create `/etc/nginx/njs/audit.js` with the following content. It reads the session token's claims and the sign-in
   field for the log.

   ```javascript
   // Who is calling and what they sent, for the audit log. Reads the session token's payload (never logs the token itself).
   function b64url(s) {
     s = s.replace(/-/g, "+").replace(/_/g, "/");
     while (s.length % 4) {
       s += "=";
     }
     return Buffer.from(s, "base64").toString();
   }
   function claims(r) {
     var t = r.variables.cookie_Authorization || r.headersIn["Authorization"] || "";
     t = t.replace(/^Bearer /, "");
     var parts = t.split(".");
     if (parts.length < 2) {
       return null;
     }
     try {
       return JSON.parse(b64url(parts[1]));
     } catch (e) {
       return null;
     }
   }
   function dig(o, keys) {
     for (var i = 0; i < keys.length; i++) {
       if (o === null || o === undefined) {
         return undefined;
       }
       o = o[keys[i]];
     }
     return o;
   }
   function out(x) {
     if (x === true) {
       return "1";
     }
     if (x === false) {
       return "0";
     }
     return x === undefined || x === null || x === "" ? "-" : String(x);
   }
   function user(r) {
     return out(dig(claims(r), ["token", "UserUid"]));
   }
   function email(r) {
     return out(dig(claims(r), ["email"]));
   }
   function tenant(r) {
     return out(dig(claims(r), ["token", "TenantUid"]));
   }
   function system(r) {
     return out(dig(claims(r), ["token", "IsSystem"]));
   }
   function adminType(r) {
     return out(dig(claims(r), ["token", "SystemAdmin", "AdminType"]));
   }
   function apiKey(r) {
     return r.headersIn["ApiKey"] ? "yes" : "-";
   }
   // Sign-in attempts: the account typed, never the password.
   function signInAs(r) {
     var p = r.variables.request_uri.split("?")[0];
     var field =
       p.indexOf("/v1/auth/authenticate") === 0 ? "emailId" : p.indexOf("/v1/auth/syslogin") === 0 ? "username" : null;
     if (!field) {
       return "-";
     }
     try {
       return out(JSON.parse(r.variables.request_body || "{}")[field]);
     } catch (e) {
       return "-";
     }
   }
   // Some paths carry a token (session refresh, password activation). Log the path without the query string and with long token-like segments removed.
   function path(r) {
     return r.variables.request_uri.split("?")[0].replace(/[A-Za-z0-9_=-]{32}[A-Za-z0-9_=.-]*/g, "<redacted>");
   }
   export default { user, email, tenant, system, adminType, apiKey, signInAs, path };
   ```

4. Create `/etc/nginx/conf.d/vertex-audit.conf` with the following configuration.

   ```text
   # /etc/nginx/conf.d/vertex-audit.conf  (nginx 1.24 with the njs module)
   js_path /etc/nginx/njs/;
   js_import audit from audit.js;
   js_set $audit_user audit.user;
   js_set $audit_email audit.email;
   js_set $audit_tenant audit.tenant;
   js_set $audit_system audit.system;
   js_set $audit_admin_type audit.adminType;
   js_set $audit_api_key audit.apiKey;
   js_set $audit_sign_in_as audit.signInAs;
   js_set $audit_path audit.path;

   map $upstream_http_err_code $audit_err { "" "-"; default $upstream_http_err_code; }
   map $upstream_http_svc_req_id $audit_reqid { "" "-"; default $upstream_http_svc_req_id; }
   map $http_upgrade $connection_upgrade { default upgrade; "" ""; }

   log_format vertex_audit escape=json '{"time":"$time_iso8601","client":"$remote_addr","method":"$request_method","path":"$audit_path","status":$status,"user":"$audit_user","email":"$audit_email","tenant":"$audit_tenant","system_console":"$audit_system","admin_type":"$audit_admin_type","api_key":"$audit_api_key","sign_in_as":"$audit_sign_in_as","platform_error":"$audit_err","request_id":"$audit_reqid"}';

   upstream vertex {
       server 10.10.10.5:443;
       keepalive 32;
   }

   server {
       listen 443 ssl http2;
       ssl_certificate     /etc/nginx/proxy.crt;
       ssl_certificate_key /etc/nginx/proxy.key;

       access_log syslog:server=unix:/dev/log,facility=local0,tag=vertex_audit,nohostname vertex_audit;

       # Keep request bodies in memory so the sign-in fields can be read for the log.
       client_body_buffer_size 64k;
       client_body_in_single_buffer on;
       client_max_body_size 0;

       client_header_timeout 10s;
       keepalive_timeout 3600s;

       # Re-encrypt to Palette VerteX, verify its certificate against the request's host name, and pass the host name unchanged.
       proxy_ssl_trusted_certificate /etc/nginx/vertex-ca.pem;
       proxy_ssl_verify on;
       proxy_ssl_verify_depth 3;
       proxy_ssl_server_name on;
       proxy_ssl_name $host;
       grpc_ssl_trusted_certificate /etc/nginx/vertex-ca.pem;
       grpc_ssl_verify on;
       grpc_ssl_verify_depth 3;
       grpc_ssl_server_name on;
       grpc_ssl_name $host;

       # gRPC paths used by clusters and edge hosts need HTTP/2 to Palette VerteX.
       location ~ ^/(BrokerService|Broker|wormhole\.[A-Za-z]+)/ {
           grpc_pass grpcs://vertex;
           grpc_set_header Host $host;
           grpc_read_timeout 3600s;
           grpc_send_timeout 3600s;
       }

       location / {
           proxy_pass https://vertex;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection $connection_upgrade;
           proxy_read_timeout 3600s;
           proxy_send_timeout 3600s;
       }
   }
   ```

   The `log_format` line writes one JSON object per request. Nginx sends normal requests to Palette VerteX over
   HTTP/1.1, so the separate `location` block sends gRPC requests over HTTP/2 with `grpc_pass`. On Nginx 1.25.1 or
   later, replace `listen 443 ssl http2;` with `listen 443 ssl;` and add `http2 on;`.

5. Check the configuration and restart Nginx.

   <!-- vale spectrocloud-docs-internal.longform = NO -->

   ```shell
   sudo nginx -t
   sudo systemctl restart nginx
   ```

   <!-- vale spectrocloud-docs-internal.longform = YES -->

   The check prints `syntax is ok` and `test is successful`.

</TabItem>
</Tabs>

If the proxy can't verify the Palette VerteX certificate, it refuses the request with an error (HAProxy returns `503`,
Nginx returns `502`) and sends nothing to Palette VerteX.

### Forward the Log and Route Traffic

1. Forward the proxy log to your SIEM. Both example configurations write to the local Syslog socket with facility
   `local0`. Copy the CA certificate of your SIEM to `/etc/ssl/certs/siem-ca.pem` and create
   `/etc/rsyslog.d/40-proxy-siem.conf`. Replace `siem.example.com` with the host name on the SIEM certificate.

   ```text
   local0.* action(type="omfwd" target="siem.example.com" port="6514" protocol="tcp"
                   StreamDriver="gtls" StreamDriverMode="1" StreamDriverAuthMode="x509/name"
                   StreamDriverPermittedPeers="siem.example.com"
                   StreamDriver.CAFile="/etc/ssl/certs/siem-ca.pem")
   ```

   The filename must sort before `49-haproxy.conf`, which the Debian and Ubuntu `haproxy` package installs. That file
   writes HAProxy messages to `/var/log/haproxy.log` and stops processing them, so a rule in a later file never runs.

   Restart `rsyslog` with `sudo systemctl restart rsyslog`. If the SIEM certificate doesn't match the CA or host name,
   `rsyslog` sends nothing and logs `not permitted to talk to peer`. In the SIEM, restrict access to the proxy log, and
   keep it for as long as you keep audit records.

   Each event arrives with a Syslog header in front of the JSON object, for example
   `<134>Nov 19 14:49:43 proxy haproxy[812]: {"time":...}`. Configure your SIEM to parse the JSON object at the end of
   each message. In Splunk, for example, `rex "(?<proxy_json>\{.*\})" | spath input=proxy_json` extracts every field.

2. Update your DNS or load balancer so users and API clients reach Palette VerteX through the proxy's address.

   Workload clusters and edge hosts connect to Palette VerteX on the same address, so their traffic also passes through
   the proxy after this step. They verify the certificate the proxy presents. Issue the proxy's certificate from a CA
   that your clusters and edge hosts already trust, such as the CA that issued the Palette VerteX certificate.

3. On your firewall or network security group, allow TCP port 443 to Palette VerteX only from the proxy host. This makes
   sure every console and API request passes through the proxy. Before you apply the rule, confirm that every cluster
   and edge host reaches Palette VerteX by host name, not by IP address. A host that uses the IP address bypasses the
   proxy, and the rule cuts it off.

4. Create a named System Console administrator for each person who administers Palette VerteX, so the proxy log names
   the person instead of the shared root administrator. Refer to
   [Manage System Accounts](./account-management/manage-system-accounts.md). Named administrators sign in with their
   email address as the username. Keep the root administrator credentials in a vault that records each checkout.

5. Configure [Audit Trails](../../audit-logs/audit-logs.md#push-audit-trails-to-amazon-cloudwatch-or-splunk) in each
   tenant so the events Palette VerteX records reach the same SIEM.

   :::warning

   Palette VerteX 4.10 rejects a Splunk HEC endpoint whose host name resolves to a private IP address. **Validate**
   fails with `resolved IP is in a disallowed range`.

   :::

6. In your SIEM, create alert rules that notify your system administrators and your ISSO. The following rules cover the
   events that Palette VerteX doesn't record in its audit logs.

   | Alert                                | Match                                                                                                                                   |
   | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
   | Failed sign-in                       | `status` is `403` and `path` is `/v1/auth/authenticate` or `/v1/auth/syslogin`                                                          |
   | Repeated failed sign-ins             | More failed sign-ins for one `sign_in_as` value, or from one `client`, than your organization's threshold allows within its time window |
   | System Console sign-in               | `path` is `/v1/auth/syslogin` and `status` is `200`                                                                                     |
   | Refused request                      | `status` is `401` or `403`, or `status` is `500` and `platform_error` is not `-`, on a path that starts with `/v1/`                     |
   | System Console activity              | `system_console` is `1`                                                                                                                 |
   | Tenant deactivated or re-activated   | `method` is `PATCH` and `path` matches `/v1/tenants/*/activate`                                                                         |
   | User restored                        | `method` is `POST` and `path` matches `/v1/users/*/restore`                                                                             |
   | System Console administrator changed | `method` is `POST` or `DELETE` and `path` starts with `/v1/system/admins`                                                               |

   Some refusals return HTTP 500 instead of 403. Those lines carry the reason in `platform_error`, for example
   `RestrictedToTenantAdmin`, which tells them apart from a server fault.

## Validate

Run these checks after you set up the proxy and again after every Palette VerteX upgrade. Use a test user and a test
System Console administrator of type Account Admin, and delete both afterwards. In the commands, `<tenant-host>` is the
host name of the test user's tenant and `<system-console-host>` is the host name of the System Console. Both now resolve
to the proxy.

1. From a workstation, sign in to the Tenant Console through the proxy with a wrong password for an existing test user.

   ```shell
   curl --silent --output /dev/null --write-out '%{http_code}\n' \
     --request POST "https://<tenant-host>/v1/auth/authenticate" \
     --header 'Content-Type: application/json' \
     --data '{"emailId":"<test-user-email>","password":"<wrong-password>"}'
   ```

   The command prints `403`. The proxy log has a line like the following. It names the account typed and contains no
   password.

   ```json
   {
     "method": "POST",
     "path": "/v1/auth/authenticate",
     "status": 403,
     "user": "-",
     "sign_in_as": "<test-user-email>",
     "platform_error": "-"
   }
   ```

2. Sign in as the test user through the proxy, then read your own profile and request a page the user's role does not
   allow, such as the tenant password policy.

   ```shell
   TOKEN=$(curl --silent --request POST "https://<tenant-host>/v1/auth/authenticate" \
     --header 'Content-Type: application/json' \
     --data '{"emailId":"<test-user-email>","password":"<password>"}' | jq -r .Authorization)
   curl --silent --output /dev/null --write-out '%{http_code}\n' "https://<tenant-host>/v1/users/me" --header "Authorization: $TOKEN"
   curl --silent --output /dev/null --write-out '%{http_code}\n' "https://<tenant-host>/v1/tenants/<tenant-uid>/password/policy" --header "Authorization: $TOKEN"
   ```

   The commands print `200` and then `500` for a user with the Tenant Viewer role. The proxy log has a line for each,
   with the user's ID and email, and the refusal carries its reason in `platform_error`.

   ```json
   {"method":"GET","path":"/v1/users/me","status":200,"user":"<user-uid>","email":"<test-user-email>","tenant":"<tenant-uid>","system_console":"0"}
   {"method":"GET","path":"/v1/tenants/<tenant-uid>/password/policy","status":500,"user":"<user-uid>","email":"<test-user-email>","platform_error":"RestrictedToTenantAdmin"}
   ```

3. Sign in to the System Console through the proxy as the test administrator, then create and delete a second test
   administrator.

   ```shell
   ADMIN_TOKEN=$(curl --silent --request POST "https://<system-console-host>/v1/auth/syslogin?setCookie=false" \
     --header 'Content-Type: application/json' \
     --data '{"username":"<test-admin-email>","password":"<password>"}' | jq -r .Authorization)
   SECOND_ADMIN=$(curl --silent --request POST "https://<system-console-host>/v1/system/admins" \
     --header "Authorization: $ADMIN_TOKEN" --header 'Content-Type: application/json' \
     --data '{"metadata":{"name":"<second-admin-name>"},"spec":{"emailId":"<second-admin-email>","firstName":"Test","lastName":"Admin","adminType":"OperationAdmin"}}' | jq -r .uid)
   curl --silent --output /dev/null --write-out '%{http_code}\n' --request DELETE \
     "https://<system-console-host>/v1/system/admins/$SECOND_ADMIN" --header "Authorization: $ADMIN_TOKEN"
   ```

   The last command prints `204`. The proxy log has the sign-in with the email address typed, and the two changes with
   the administrator's ID and type.

   ```json
   {"method":"POST","path":"/v1/auth/syslogin","status":200,"sign_in_as":"<test-admin-email>"}
   {"method":"POST","path":"/v1/system/admins","status":201,"user":"<admin-uid>","system_console":"1","admin_type":"AccountAdmin"}
   {"method":"DELETE","path":"/v1/system/admins/<second-admin-uid>","status":204,"user":"<admin-uid>","system_console":"1","admin_type":"AccountAdmin"}
   ```

4. Search the proxy log for the test user's password, the test administrator's password, and the `TOKEN` and
   `ADMIN_TOKEN` values. None of them appear.

5. From a host other than the proxy, connect to the Palette VerteX IP address on port 443 directly.

   ```shell
   curl --silent --show-error --max-time 10 --output /dev/null https://10.10.10.5/
   ```

   The command fails with `Could not connect to server` if your firewall rejects the connection, or
   `Connection timed out` if it drops it.

6. In your SIEM, confirm that the failed sign-in from step 1 and the System Console sign-in from step 3 raised alerts.
