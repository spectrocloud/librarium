---
title: "Introduction"
sidebar_label: "Introduction"
description: "Palette API Introduction"
hide_table_of_contents: false
hiddenFromNav: false
sidebar_custom_props:
  icon: "graph"
---

The API documentation section includes documentation for Palette API and Edge Management API.

## Palette API

Palette offers a range of capabilities you can access through the REST APIs. These REST APIs are designed in accordance
with open API standards, which ensure that the platform's features can be integrated with other applications and
systems. By utilizing these APIs, you can tap into the platform's capabilities through programmatic methods. Use the
APIs to build custom integrations and workflows that leverage the power of the Palette.

### Paths

Every API's URI has the prefix of the version and the Palette resource, such as: `v1/spectroclusters/...`

### Authentication

Palette supports two types of API authentication methods that can be used to authenticate API requests:

- [Authorization Token](#authorization-token)

- [API Key](#api-key)

#### Authorization Token

You can acquire authorization tokens from Palette that have a 15-minute lifetime. The authorization token is passed as
part of the HTTP request header. You can use the authorization token to authenticate and authorize the request. The
header name is `Authorization`, and the token is the header value. Refer to the
[Authorization Token](/user-management/authentication/authorization-token) section to learn more about the authorization
token.

:::info

[System configuration API endpoints](/api/v1/system) expose sensitive system details and can only be accessed using
privileged [authorization tokens](/user-management/authentication/authorization-token).

:::

#### API Key

You can use API keys to authenticate with the Palette API. API keys allow you to interact with Palette APIs without
requiring user credentials such as username and password. The API key must be present in each API request to
authenticate and authorize the request. The API Key is passed as part of the HTTP request header. The header name is
`apiKey`, and the API key is the header value.

The following example shows how to pass the API key in the HTTP request header:

```shell hideClipboard
curl --location "https://api.spectrocloud.com/v1/spectroclusters/123456789?ProjectUid=12345678" \
 --header 'Accept: application/json' \
 --header "apiKey: 123456789"
```

Refer to the [API Key](/user-management/authentication/api-key/) section to learn how to create and manage API keys.

### Requests

All requests are in the `JSON` format. In general, the request payload has three sections: _metadata, spec and status_.

- _Metadata_ consists of common attributes for all the resources such as ids, names, creation timestamps etc.
- _Spec_ consists of attributes that define the resource
- _Status_ contains the status information of the resource. The API does not support creating or modifying the status
  section.

:::info

Certain update request schemas have restricted spec resource definitions, and specific fields like uid and creation
timestamp cannot be modified post-creation.

:::

| **HTTP Method** | **Description**                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| POST            | To create a resource or a sub-resource.                                                              |
| PUT             | To update the resource or a sub-resource. The PUT request will overwrite the existing resource data. |
| PATCH           | To add, modify, remove a specific attribute or sub-resource within a resource.                       |
| DELETE          | To delete the resource.                                                                              |

### Response Codes

The API returns standard HTTP response codes:

| **HTTP Code** | **Description**                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Request succeeded. The response payload will vary depending upon the API. Refer to the respective API response schema.                  |
| 201           | A resource was successfully created. The response payload contains the uid of the created resource.                                     |
| 204           | Response without any content for a successful operation. These operations include update, delete and the other actions on the resource. |
| 400           | Bad request. The request does not adhere to the API request payload schema.                                                             |
| 401           | Missing authorization token or invalid authorization token.                                                                             |
| 403           | The API operation is forbidden for the user.                                                                                            |
| 404           | The resource or the dependent resource is not found for the operation.                                                                  |
| 500           | Operational error. For 500 error code, the server responds with an explicit error code and an error message.                            |

### Palette API Lifecycle

Palette APIs maintain backward compatibility until deprecation. The three API phases in the lifecycle are _Production_,
_Sunset_, and _Deprecated_. Spectro Cloud will inform users when APIs transition through this lifecycle.

#### Production

The Palette APIs are designed to work as intended and expected.

#### Sunset

As the API approaches deprecation because it is being replaced or will no longer be supported, a notice will be provided
in the documentation that outlines our intent and provides a cut-off date. Within three months of the deprecation date,
a notice will be shared that counts down to the end date and recommends the API to use instead.

#### Deprecated

We indicate that an API is deprecated when it is no longer supported or recommended for use by including a tag to
indicate its state. The API documentation will remain available as a subsection of deprecated APIs.

:::info

The API lifecycle also applies to external-facing tools such as Terraform.

:::

### Versioning

The version information is included in the API URI, such as `v1alpha1` or `v1`. Future APIs will increment the version,
leaving the earlier version intact. The existing API request and response schema will be modified to add new attributes
or query parameters while maintaining backward compatibility with earlier schemas. Prior notice will be given before
advancing to the next version, and users will be advised to migrate to the new API.

### Scope

Palette groups resources under either a Tenant or Project scope. When making API requests targeting resources belonging
to a project, the project scope should be specified. To specify the project scope, use the HTTP header key `ProjectUid`
with the value `<Project Uid>` in the API request. The `ProjectUid` needs to be specified for a request to be applied
under a specific project scope.

**Example**:

```shell
 curl --location --request \
 GET 'https://api.spectrocloud.com/v1/edgehosts/ad3d90ab-de6e-3e48-800f-4d663cec3060?resolvePackValues=false' \
 --header 'Accept: application/json' \
 --header 'ProjectUid: ad3d90ab-de6e-3e48-800f-4d663cec3060'
```

:::info

If you do not provide the ProjectUid header, then the assumed scope is of the tenant.

:::

### Pagination

API endpoints that return a list have a limit of 50 items per return payload. Pagination is necessary for this purpose.
The API response for the list includes the listMeta resource that contains the `continue` token. To perform pagination,
you need to check whether the `continue` token value is present in the API response. For subsequent requests, use the
`continue` token as a query parameter to paginate the remaining resource items.

```json hideClipboard
    "listmeta": {
        "continue": "eyJvZmZzZXQiOjUwLCJjb3VudCI6MTE3LCJ0b2tlbiI6IiJ9",
        "count": 117,
        "limit": 50,
        "offset": 50
    }
```

Example of a subsequent request using the `continue` token.

```shell hideClipboard
curl --location 'https://api.spectrocloud.com/v1/packs?continue=eyJvZmZzZXQiOjUwLCJjb3VudCI6MTE3LCJ0b2tlbiI6IiJ9' \
 --header 'Accept: application/json' \
 --header 'ProjectUid: yourProjectUid' \
 --header 'apiKey: yourAPIKey'
```

### Rate Limits

The API rate limits are as follows:

- Most Palette APIs have a limit of ten API requests per second for each source IP address. The API supports additional
  bursts through the usage of a burst queue. The default burst queue size is set to five. You could make 50 (10 \* 5)
  requests in seconds before the API returns a `429 - TooManyRequests` error. Refer to the
  [Endpoint Prefix Rate](#endpoint-prefix-rate) for additional information.

- API request limits are categorized by the parent resources, such as `/v1/cloudconfig/:uid` and `/v1/roles`. You can
  find a list of all resource types in the [API documentation](/api/category/palette-api-v1). The requests are counted
  together if you make multiple requests to the same resource type but use different sub-resources. For example, if you
  make five requests to `/v1/clusterprofiles` and five requests to `/v1/clusterprofiles/macros`, the requests are
  counted together as ten requests to the resource `clusterprofiles`.

- If too many requests are issued, you may receive an error with HTTP code `429` - `TooManyRequests.` We recommend
  retrying the API call after a few moments.

### Endpoint Prefix Rate

| **Endpoint Prefix**                                                                     | **Request Per Second** | **Burst Size** | **Max with Burst** |
| --------------------------------------------------------------------------------------- | ---------------------- | -------------- | ------------------ |
| /v1/apiKeys                                                                             | 10                     | 5              | 50                 |
| /v1/async                                                                               | 10                     | 5              | 50                 |
| /v1/audits                                                                              | 10                     | 5              | 50                 |
| /v1/auth                                                                                | 10                     | 5              | 50                 |
| /v1/auth/authenticate                                                                   | 10                     | 5              | 50                 |
| /v1/auth/services/edge/login                                                            | 10                     | 5              | 50                 |
| /v1/auth/services/login                                                                 | 10                     | 5              | 50                 |
| /v1/auth/user/password/reset                                                            | 2                      | 5              | 10                 |
| /v1/cache                                                                               | 10                     | 5              | 50                 |
| /v1/cloudaccounts                                                                       | 10                     | 5              | 50                 |
| /v1/cloudconfigs                                                                        | 50                     | 5              | 250                |
| /v1/cloudconfigs/\{cloudType}/:uid/machinePools/\{machinePoolName}/machines             | 50                     | 5              | 250                |
| /v1/cloudconfigs/\{cloudType}/:uid/machinePools/\{machinePoolName}/machines/:machineUid | 50                     | 5              | 250                |
| /v1/cloudconfigs/\{cloudType}/\{uid}/machinePools                                       | 50                     | 5              | 250                |
| /v1/clouds                                                                              | 10                     | 5              | 50                 |
| /v1/cluster                                                                             | 10                     | 5              | 50                 |
| /v1/clusterprofiles                                                                     | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/packs                                                          | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/packs/\{packName}/manifests                                    | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/packs/manifests                                                | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/validate/packs                                                 | 50                     | 5              | 250                |
| /v1/clusterprofiles/validate/packs                                                      | 50                     | 5              | 250                |
| /v1/crypto                                                                              | 10                     | 5              | 50                 |
| /v1/dashboard                                                                           | 10                     | 5              | 50                 |
| /v1/datasinks                                                                           | 10                     | 5              | 50                 |
| /v1/edgehosts                                                                           | 10                     | 5              | 50                 |
| /v1/edgehosts/:uid/health                                                               | 10                     | 5              | 50                 |
| /v1/edgehosts/:uid/spc/download                                                         | 10                     | 5              | 50                 |
| /v1/edgehosts/registers                                                                 | 10                     | 5              | 50                 |
| /v1/errlogs                                                                             | 10                     | 5              | 50                 |
| /v1/events                                                                              | 10                     | 5              | 50                 |
| /v1/events/components                                                                   | 50                     | 5              | 250                |
| /v1/files                                                                               | 10                     | 5              | 50                 |
| /v1/git/webhook                                                                         | 10                     | 5              | 50                 |
| /v1/health                                                                              | 10                     | 5              | 50                 |
| /v1/installers                                                                          | 10                     | 5              | 50                 |
| /v1/jobs                                                                                | 10                     | 5              | 50                 |
| /v1/metrics                                                                             | 10                     | 5              | 50                 |
| /v1/mgmt                                                                                | 10                     | 5              | 50                 |
| /v1/notifications                                                                       | 10                     | 5              | 50                 |
| /v1/oidc                                                                                | 10                     | 5              | 50                 |
| /v1/overlords                                                                           | 10                     | 5              | 50                 |
| /v1/packs                                                                               | 10                     | 5              | 50                 |
| /v1/payments                                                                            | 10                     | 5              | 50                 |
| /v1/permissions                                                                         | 10                     | 5              | 50                 |
| /v1/plans                                                                               | 10                     | 5              | 50                 |
| /v1/projects                                                                            | 10                     | 5              | 50                 |
| /v1/registries                                                                          | 10                     | 5              | 50                 |
| /v1/roles                                                                               | 10                     | 5              | 50                 |
| /v1/services                                                                            | 10                     | 5              | 50                 |
| /v1/spectroclusters                                                                     | 50                     | 5              | 250                |
| /v1/spectroclusters/:uid/assets                                                         | 10                     | 5              | 50                 |
| /v1/spectroclusters/:uid/download                                                       | 10                     | 5              | 50                 |
| /v1/spectroclusters/:uid/profiles                                                       | 50                     | 5              | 250                |
| /v1/spectroclusters/acquire                                                             | 10                     | 5              | 50                 |
| /v1/spectroclusters/cost                                                                | 10                     | 5              | 50                 |
| /v1/spectroclusters/features/logFetcher                                                 | 10                     | 5              | 50                 |
| /v1/spectroclusters/usage                                                               | 10                     | 5              | 50                 |
| /v1/system                                                                              | 10                     | 5              | 50                 |
| /v1/teams                                                                               | 10                     | 5              | 50                 |
| /v1/tenants                                                                             | 10                     | 5              | 50                 |
| /v1/userprofiles                                                                        | 10                     | 5              | 50                 |
| /v1/users                                                                               | 10                     | 5              | 50                 |
| /v1/workspaces                                                                          | 10                     | 5              | 50                 |

## Edge Management API

An Edge host has its own set of API endpoints. These API endpoints are available on each Edge host instead of on a
Palette instance. You can use Edge Management API endpoints to programmatically perform tasks such as retrieve
information about Edge clusters, retrieve the list of available images on your Edge host, and create local clusters
using embedded cluster definitions.

You can find the Open API Swagger specification for the Edge Management API at the following location:
https://raw.githubusercontent.com/spectrocloud/librarium/version-4-4/docs/api-content/api-docs/edge-v1/emc-api.json

### Authentication

Use the `POST /v1/users/default/login` endpoint to generate an authentication token with your OS username and password.
The following curl command is an example. Replace `edge-host-ip` with the IP of your Edge host and replace `os-username`
and `os-password` with your OS user credentials.

```shell
curl --location 'https://edge-host-ip:5080/v1/users/default/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "os-username",
    "password": "os-password"
}'
```

If your credentials are valid, you will receive a authorization token.

```hideClipboard
{
    "Token": {
        "Authorization": "******"
    }
}

```

Include this token in the header of your subsequent requests to the Local Management API to authenticate your requests.
For example, the following request retrieves information about the Edge host such as the processor architecture and the
host name.

```shell
curl --location 'https://10.10.135.182:5080/v1/edge-mgmt/edgehosts/current' \
--header 'Authorization: *******'
```

```hideClipboard
{
    "metadata": {
        "creationTimestamp": "2024-02-29T20:31:42.204Z",
        "id": "edge-bc4a38428b71300e371150263b651b8d",
        "lastModifiedTimestamp": "0001-01-01T00:00:00.000Z",
        "name": "edge-bc4a38428b71300e371150263b651b8d"
    },
    "spec": {
        "connectionMode": "airgap",
        "hardwareSpec": {
            "archType": "amd64",
            "cpu": {
                "cores": 4
            },
            "disks": [
                {
                    "controller": "SCSI",
                    "partitions": [
                        {
                            "fileSystemType": "ext4",
                            "freeSpace": 13,
                            "mountPoint": "/run/initramfs/cos-state",
                            "totalSpace": 24,
                            "usedSpace": 9
                        }
                    ],
                    "size": 300,
                    "vendor": "VMware"
                },
                {
                    "controller": "SCSI",
                    "partitions": [],
                    "size": 4,
                    "vendor": "NECVMWar"
                },
                {
                    "controller": "SCSI",
                    "partitions": [],
                    "vendor": "NECVMWar"
                }
            ],
            "gpus": [],
            "memory": {
                "sizeInMB": 7930
            },
            "os": {
                "family": "kairos-core-sles",
                "version": "v2.4.3"
            }
        },
        "networkInfo": [
            {
                "dns": [
                    "10.10.128.8"
                ],
                "gateway": "10.10.128.1",
                "ip": "10.10.135.182",
                "isDefault": true,
                "macAddr": "00:50:56:b8:9e:98",
                "nicName": "ens160",
                "subnet": "255.255.192.0"
            }
        ]
    },
    "status": {
        "agentVersion": "4.3.0-rc4",
        "configurationStatus": "pending",
        "dns": {
            "nameservers": [
                "10.10.128.8"
            ],
            "options": [],
            "searchDomains": [
                "."
            ]
        },
        "hostName": "edge-bc4a38428b71300e371150263b651b8d",
        "ntp": {
            "fallbackNtpServers": [],
            "ntpServers": []
        },
        "registrationStatus": "not applicable"
    }
}
```

### List of Endpoints Unavailable to Connected Edge Hosts

Most Edge Management API endpoints are available for Edge hosts with or without a connection to Palette. However, some
endpoints are not available to connected Edge hosts and are available to airgapped Edge hosts only. Specifically,
endpoints that create or update clusters, create or update cluster profile variables, and update cluster settings are
unavailable, as those operations must be performed from Palette.

The following is a list of endpoints that are only available to Edge hosts that are not connected to Palette:

- `POST https://edge-host-ip:5080/v1/edge-mgmt/cluster`
- `PATCH https://edge-host-ip:5080/v1/edge-mgmt/cluster`
- `PUT https://edge-host-ip:5080/v1/edge-mgmt/cluster`
- `PUT https://edge-host-ip:5080/v1/edge-mgmt/cluster/profiles`
- `PUT https://edge-host-ip:5080/v1/edge-mgmt/cluster/settings`
- `POST https://edge-host-ip:5080/v1/edge-mgmt/cluster/profiles/variables/validate`
