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

This page describes how to set up the proxy, which fields identify the caller and the outcome of each request, and which
alerts to send to your system administrators and Information System Security Officer (ISSO). Use it together with
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
| Account typed at sign-in                   | The `emailId` field of `POST /v1/auth/authenticate`, or the `username` field of `POST /v1/auth/syslogin` | The account a sign-in attempt targeted, for both successful and failed attempts                                                              |
| Platform error                             | The `err_code` response header                                                                           | The reason Palette VerteX refused a request, such as `RestrictedToTenantAdmin`                                                               |
| Request ID                                 | The `svc_req_id` response header                                                                         | The request ID Palette VerteX uses internally, for support cases                                                                             |

The session token arrives in the `Authorization` cookie when a user signs in through a browser, and in the
`Authorization` header when a client calls the API. It is a JSON Web Token (JWT) whose payload the proxy can read. The
proxy logs the token's identity claims, never the token itself.

:::warning

The proxy never logs passwords, session tokens, cookie values, API key values, or any request body other than the
`emailId` and `username` fields of the two sign-in requests. Configure your proxy so it can't log them. Some request
paths carry a token, such as the session refresh that edge hosts send and password activation links, so the
configuration on this page logs the path with long token-like segments replaced by `<redacted>`, and never logs the
query string.

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

## Prerequisites

- A Palette VerteX installation, the host names your users browse to (the System Console and each tenant), and the IP
  address of its console and API endpoint (the VIP). The proxy connects to the IP address, because after you complete
  this page the host names resolve to the proxy.

- A Linux host for the reverse proxy on the network path between your users and Palette VerteX.

- HAProxy 2.8 or later and `rsyslog` with TLS support on the proxy host. The `haproxy` packages in Ubuntu 24.04 and Red
  Hat Enterprise Linux 9 meet this. Ubuntu 22.04 ships HAProxy 2.4, which can't decode the session token. Any reverse
  proxy that can read a cookie, decode a JWT payload, and read one JSON field from a request body works. This page uses
  HAProxy.

  :::info

  If your organization requires FIPS 140-3 validated cryptography, run HAProxy against a validated OpenSSL FIPS provider
  with `default_properties = fips=yes` in the OpenSSL configuration HAProxy loads, for example through the
  `OPENSSL_CONF` environment variable of the HAProxy service. The stock OpenSSL packages on Debian and Ubuntu don't
  include a FIPS provider. To confirm the provider is in force, run `OPENSSL_CONF=<your-config> openssl md5 /dev/null`,
  which fails with `Error setting digest`.

  :::

- A TLS certificate and key for the proxy, issued by your organization's PKI and covering every host name your users
  browse to, combined into one PEM file.

- The certificate of the CA that issued the Palette VerteX certificate. The proxy checks the Palette VerteX certificate
  against this CA and the host name of each request, so the Palette VerteX certificate must also cover those host names.
  Refer to [SSL Certificate Management](./ssl-certificate-management.md).

- The certificate of the CA that issued the Syslog certificate of your SIEM.

- Network controls that let you allow TCP port 443 to Palette VerteX only from the proxy host.

- A SIEM that accepts Syslog, and an account that can create alert rules.

- System Console access as the root administrator, to create named System Console administrators.

## Enablement

1. Install HAProxy and `rsyslog` on the proxy host. The following commands are for Debian or Ubuntu.

   <!-- vale spectrocloud-docs-internal.longform = NO -->

   ```shell
   sudo apt-get install --yes haproxy rsyslog rsyslog-gnutls
   haproxy -v
   ```

   <!-- vale spectrocloud-docs-internal.longform = YES -->

   The first line of the output shows the version, which must be 2.8 or later.

2. Copy the proxy's certificate and key, combined into one PEM file, to `/etc/haproxy/proxy.pem`, and the Palette VerteX
   CA certificate to `/etc/haproxy/vertex-ca.pem`. Allow only the `haproxy` user to read the key.

   ```shell
   sudo chown root:haproxy /etc/haproxy/proxy.pem /etc/haproxy/vertex-ca.pem
   sudo chmod 640 /etc/haproxy/proxy.pem
   ```

3. Replace `/etc/haproxy/haproxy.cfg` with the following configuration. Replace `10.10.10.5` with the IP address of your
   Palette VerteX console and API endpoint. Don't use its host name, which resolves to the proxy after step 6.

   ```text
   global
       log /dev/log len 4096 local0
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

   The `log-format` line writes one JSON object per request. The configuration reads only the two sign-in fields from
   request bodies. The proxy passes each request's host name to Palette VerteX unchanged, so the System Console and
   every tenant keep working, and checks the Palette VerteX certificate against that host name. If the certificate check
   fails, the proxy answers `503` and sends nothing to Palette VerteX.

   Keep `alpn h2,http/1.1` on both the `bind` and `server` lines. Without it on the `server` line, the proxy converts
   browser HTTP/2 requests to HTTP/1.1, and the System Console intermittently fails to load. The one-hour timeouts keep
   the long-lived connections that clusters and edge hosts hold open to Palette VerteX. Without
   `timeout http-keep-alive 1h`, HAProxy closes an idle connection after the 10-second `timeout http-request`, and the
   edge host's remote shell service loses its connection. `timeout http-request` still limits how long a client can take
   to send a request.

4. Check the configuration and restart HAProxy.

   <!-- vale spectrocloud-docs-internal.longform = NO -->

   ```shell
   sudo haproxy -c -V -f /etc/haproxy/haproxy.cfg
   sudo systemctl restart haproxy
   ```

   <!-- vale spectrocloud-docs-internal.longform = YES -->

   The check prints `Configuration file is valid`.

5. Forward the proxy log to your SIEM. HAProxy writes to the local Syslog socket with facility `local0`. Configure
   `rsyslog` to send `local0` to your SIEM over TLS. Copy the CA certificate of your SIEM to
   `/etc/ssl/certs/siem-ca.pem` and create `/etc/rsyslog.d/40-haproxy-siem.conf`. Replace `siem.example.com` with the
   host name on the SIEM certificate.

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
   `<134>Nov 19 14:49:43 proxy haproxy[812]: {"time":...}`. Configure your SIEM to parse the JSON object that follows
   `haproxy[<pid>]:`. In Splunk, for example, `rex "(?<proxy_json>\{.*\})" | spath input=proxy_json` extracts every
   field.

6. Update your DNS or load balancer so users and API clients reach Palette VerteX through the proxy's address.

   Workload clusters and edge hosts connect to Palette VerteX on the same address, so their traffic also passes through
   the proxy after this step. They verify the certificate the proxy presents. Issue the proxy's certificate from a CA
   that your clusters and edge hosts already trust, such as the CA that issued the Palette VerteX certificate.

7. On your firewall or network security group, allow TCP port 443 to Palette VerteX only from the proxy host. This makes
   sure every console and API request passes through the proxy. Before you apply the rule, confirm that every cluster
   and edge host reaches Palette VerteX by host name, not by IP address. A host that uses the IP address bypasses the
   proxy, and the rule cuts it off.

8. Create a named System Console administrator for each person who administers Palette VerteX, so the proxy log names
   the person instead of the shared root administrator. Refer to
   [Manage System Accounts](./account-management/manage-system-accounts.md). Named administrators sign in with their
   email address as the username. Keep the root administrator credentials in a vault that records each checkout.

9. Configure [Audit Trails](../../audit-logs/audit-logs.md#push-audit-trails-to-amazon-cloudwatch-or-splunk) in each
   tenant so the events Palette VerteX records reach the same SIEM.

   :::warning

   Palette VerteX 4.10 rejects a Splunk HEC endpoint whose host name resolves to a private IP address. **Validate**
   fails with `resolved IP is in a disallowed range`.

   :::

10. In your SIEM, create alert rules that notify your system administrators and your ISSO. The following rules cover the
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
System Console administrator, and delete both afterwards. In the commands, `<tenant-host>` is the host name of the test
user's tenant, which now resolves to the proxy.

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

3. Sign in to the System Console through the proxy as a test System Console administrator of type Account Admin, then
   create and delete a second test administrator. The proxy log has the sign-in with the email address typed, and the
   two changes with the administrator's ID and type.

   ```json
   {"method":"POST","path":"/v1/auth/syslogin","status":200,"sign_in_as":"<test-admin-email>"}
   {"method":"POST","path":"/v1/system/admins","status":201,"user":"<admin-uid>","system_console":"1","admin_type":"AccountAdmin"}
   {"method":"DELETE","path":"/v1/system/admins/<second-admin-uid>","status":204,"user":"<admin-uid>","system_console":"1","admin_type":"AccountAdmin"}
   ```

4. Search the proxy log for the test user's password and for any value of the `Authorization` cookie or header. Neither
   appears.

5. From a host other than the proxy, connect to the Palette VerteX IP address on port 443 directly.

   ```shell
   curl --silent --show-error --max-time 10 --output /dev/null https://10.10.10.5/
   ```

   The command fails with `Could not connect to server` if your firewall rejects the connection, or
   `Connection timed out` if it drops it.

6. In your SIEM, confirm that the failed sign-in from step 1 and the System Console sign-in from step 3 raised alerts.
