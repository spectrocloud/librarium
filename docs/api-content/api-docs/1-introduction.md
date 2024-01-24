---
title: "Introduction"
sidebar_label: "Introduction"
description: "Palette API Introduction"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "graph"
---

Palette offers a range of capabilities you can access through the REST APIs. These REST APIs are designed in accordance
with open API standards, which ensure that the platform's features can be integrated with other applications and
systems. By utilizing these APIs, you can tap into the platform's capabilities through programmatic methods. Use the
APIs to build custom integrations and workflows that leverage the power of the Palette.

## Paths

Every API's URI has the prefix of the version and the Palette resource, such as: `v1/spectroclusters/...`

## Authentication

Palette supports two types of user authentication methods:

### Using Authorization Token

- All requests must be authenticated with an API token that is passed using the HTTP request header `Authorization`.
- Activated users can use the `/auth/authenticate` API to authenticate and obtain the Authorization token.
- Every authorization token is valid for 15 min.
- To refresh the token use [this GET call](https://docs.spectrocloud.com/api/v1/auth/): `GET /v1/auth/refresh/{token}`

### Using the API Key

Palette uses API keys to provide secure API authentication and authorization. This enables the usage of Palette APIs
without requiring user credentials such as username and password. The API key must be present in individual API requests
in order to authenticate and authorize the request. The API Key is passed as part of the HTTP request header and in the
following format:

- Key: ApiKey
- Value: API key copied from the Palette Console. E.g. QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl

[Read More...](/user-management/user-authentication)

## Requests

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

## Response Codes

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

## Palette API Lifecycle

Palette APIs maintain backward compatibility until deprecation. The three API phases in the lifecycle are _Production_,
_Sunset_, and _Deprecated_. Spectro Cloud will inform users when APIs transition through this lifecycle.

### Production

The Palette APIs are designed to work as intended and expected.

### Sunset

As the API approaches deprecation because it is being replaced or will no longer be supported, a notice will be provided
in the documentation that outlines our intent and provides a cut-off date. Within three months of the deprecation date,
a notice will be shared that counts down to the end date and recommends the API to use instead.

### Deprecated

We indicate that an API is deprecated when it is no longer supported or recommended for use by including a tag to
indicate its state. The API documentation will remain available as a subsection of deprecated APIs.

<br />

:::info

The API lifecycle also applies to external-facing tools such as Terraform.

:::

## Versioning

The version information is included in the API URI, such as `v1alpha1` or `v1`. Future APIs will increment the version,
leaving the earlier version intact. The existing API request and response schema will be modified to add new attributes
or query parameters while maintaining backward compatibility with earlier schemas. Prior notice will be given before
advancing to the next version, and users will be advised to migrate to the new API.

## Scope

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

## Pagination

API endpoints that return a list have a limit of 50 items per return payload. Pagination is necessary for this purpose.
The API response for the list includes the listMeta resource that contains the `continue` token. To perform pagination,
you need to check whether the `continue` token value is present in the API response. For subsequent requests, use the
`continue` token as a query parameter to paginate the remaining resource items.

<br />

```json hideClipboard
    "listmeta": {
        "continue": "eyJvZmZzZXQiOjUwLCJjb3VudCI6MTE3LCJ0b2tlbiI6IiJ9",
        "count": 117,
        "limit": 50,
        "offset": 50
    }
```

<br />

Example of a subsequent request using the `continue` token.

<br />

```shell hideClipboard
curl --location 'https://api.spectrocloud.com/v1/packs?continue=eyJvZmZzZXQiOjUwLCJjb3VudCI6MTE3LCJ0b2tlbiI6IiJ9' \
 --header 'Accept: application/json' \
 --header 'ProjectUid: yourProjectUid' \
 --header 'apiKey: yourAPIKey'
```

## Rate Limits

The API rate limits are as follows:

- There is a limit of ten API requests per second for each source IP address. The API supports additional bursts through
  the usage of a burst queue. The default burst queue size is set to five. You could make 50 (10 \* 5) requests in
  seconds before the API returns a `429 - TooManyRequests` error. Refer to the
  [Endpoint Prefix Rate](#endpointprefixrate) for additional information.

- API request limits are categorized by the parent resources, such as `/v1/cloudconfig/:uid` and `/v1/roles`. You can
  find a list of all resource types in the [API documentation](/api/category/palette-api-v1). The requests are counted
  together if you make multiple requests to the same resource type but use different sub-resources. For example, if you
  make five requests to `/v1/clusterprofiles` and five requests to `/v1/clusterprofiles/macros`, the requests are
  counted together as ten requests to the resource `clusterprofiles`.

- If too many requests are issued, you may receive an error with HTTP code `429` - `TooManyRequests.` We recommend
  retrying the API call after a few moments.

## Endpoint Prefix Rate

| **Endpoint Prefix**                                                                      | **Request Per Second** | **Burst Size** | **Max with Burst** |
| ---------------------------------------------------------------------------------------- | ---------------------- | -------------- | ------------------ |
| /v1/auth                                                                                 | 10                     | 5              | 50                 |
| /v1/nats                                                                                 | 10                     | 5              | 50                 |
| /v1/users                                                                                | 10                     | 5              | 50                 |
| /v1/userprofiles                                                                         | 10                     | 5              | 50                 |
| /v1/permissions                                                                          | 10                     | 5              | 50                 |
| /v1/roles                                                                                | 10                     | 5              | 50                 |
| /v1/teams                                                                                | 10                     | 5              | 50                 |
| /v1/tenants                                                                              | 10                     | 5              | 50                 |
| /v1/projects                                                                             | 10                     | 5              | 50                 |
| /v1/plans                                                                                | 10                     | 5              | 50                 |
| /v1/payments                                                                             | 10                     | 5              | 50                 |
| /v1/audits                                                                               | 10                     | 5              | 50                 |
| /v1/apiKeys                                                                              | 10                     | 5              | 50                 |
| /v1/datasinks                                                                            | 10                     | 5              | 50                 |
| /v1/notifications                                                                        | 10                     | 5              | 50                 |
| /v1/events                                                                               | 10                     | 5              | 50                 |
| /v1/crypto                                                                               | 10                     | 5              | 50                 |
| /v1/async                                                                                | 10                     | 5              | 50                 |
| /v1/errlogs                                                                              | 10                     | 5              | 50                 |
| /v1/jobs                                                                                 | 10                     | 5              | 50                 |
| /v1/health                                                                               | 10                     | 5              | 50                 |
| /v1/cache                                                                                | 10                     | 5              | 50                 |
| /v1/cloudaccounts                                                                        | 10                     | 5              | 50                 |
| /v1/packs                                                                                | 10                     | 5              | 50                 |
| /v1/workspaces                                                                           | 10                     | 5              | 50                 |
| /v1/installers                                                                           | 10                     | 5              | 50                 |
| /v1/git/webhook                                                                          | 10                     | 5              | 50                 |
| /v1/registries                                                                           | 10                     | 5              | 50                 |
| /v1/services                                                                             | 10                     | 5              | 50                 |
| /v1/overlords                                                                            | 10                     | 5              | 50                 |
| /v1/cluster                                                                              | 10                     | 5              | 50                 |
| /v1/cloudconfigs                                                                         | 10                     | 5              | 50                 |
| /v1/cloudconfigs/\{cloudType}/\{uid}/machinePools                                        | 10                     | 5              | 50                 |
| /v1/edgehosts                                                                            | 10                     | 5              | 50                 |
| /v1/metrics                                                                              | 10                     | 5              | 50                 |
| /v1/system                                                                               | 10                     | 5              | 50                 |
| /v1/mgmt                                                                                 | 10                     | 5              | 50                 |
| /v1/oidc                                                                                 | 10                     | 5              | 50                 |
| /v1/clouds                                                                               | 10                     | 5              | 50                 |
| /v1/events/components                                                                    | 10                     | 5              | 50                 |
| /v1/dashboard                                                                            | 10                     | 5              | 50                 |
| /v1/cloudconfigs/\{cloudType}/:uid/machinePools/\{machinePoolName}/\machines             | 10                     | 5              | 50                 |
| /v1/cloudconfigs/\{cloudType}/:uid/machinePools/\{machinePoolName}/\machines/:machineUid | 10                     | 5              | 50                 |
| /v1/auth/authenticate                                                                    | 10                     | 5              | 50                 |
| /v1/auth/services/login                                                                  | 10                     | 5              | 50                 |
| /v1/auth/services/edge/login                                                             | 10                     | 5              | 50                 |
| /v1/files                                                                                | 10                     | 5              | 50                 |
| /v1/edgehosts/registers                                                                  | 10                     | 5              | 50                 |
| /v1/edgehosts/:uid/health                                                                | 10                     | 5              | 50                 |
| /v1/edgehosts/:uid/spc/download                                                          | 10                     | 5              | 50                 |
| /v1/spectroclusters/features/logFetcher                                                  | 10                     | 5              | 50                 |
| /v1/spectroclusters/:uid/assets                                                          | 10                     | 5              | 50                 |
| /v1/spectroclusters/cost                                                                 | 10                     | 5              | 50                 |
| /v1/spectroclusters/usage                                                                | 10                     | 5              | 50                 |
| /v1/spectroclusters/:uid/download                                                        | 10                     | 5              | 50                 |
| /v1/spectroclusters/acquire                                                              | 10                     | 5              | 50                 |
| /v1/auth/user/password/reset                                                             | 2                      | 5              | 10                 |
| /v1/spectroclusters                                                                      | 50                     | 5              | 250                |
| /v1/clusterprofiles                                                                      | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/packs                                                           | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/packs/manifests                                                 | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/packs/\{packName}/manifests                                     | 50                     | 5              | 250                |
| /v1/clusterprofiles/validate/packs                                                       | 50                     | 5              | 250                |
| /v1/clusterprofiles/:uid/validate/packs                                                  | 50                     | 5              | 250                |
| /v1/spectroclusters/:uid/profiles                                                        | 50                     | 5              | 250                |
