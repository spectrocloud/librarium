---
title: "Introduction"
metaTitle: "This is the title tag of this page"
metaDescription: "This is the meta description"
icon: "graph"
hideToC: false
---

# Spectro Cloud API

Spectro Cloud API provides APIs for a subset of features. The Spectro Cloud APIs are based on REST APIs. The APIs can be used to create and modify the tenant and project scope resources as well as for integrating with other applications.

# Paths

Every API's URI has the prefix of the version and the Spectro Cloud resource: `version/resource/...`

# Authentication

All requests must be authenticated with an API token. Use the HTTP header `Authorization` with the value &lt;token&gt; obtained using the authenticate API.

After the user creation, if the authentication type is password-based, then the user has to manually activate and reset the password received via email. Post that, the user can use the `/auth/authenticate` API to authenticate and obtain the Authorization token. Not all of the `/auth/` prefixed APIs require an Authentication token.

# Requests

All the requests are in the `JSON` format. In general, the request payload has three sections: *metadata, spec and status*. The *metadata* is a common definition for all the resources and the *spec* takes the resource definition whereas *status* contains the derived or the status information of the resource. The API does not support creating or modifying the status section. However, certain update request schema have restricted spec resource definition and certain fields like uid, creation timestamp are not allowed to be modified post creation.

| HTTP Method | Documentation |
| --- | --- |
| POST | To create a resource or a sub-resource. |
| PUT | To update the resource or a sub-resource. The PUT request will overwrite the resource data. |
| PATCH | To add, modify, remove a specific item or sub-resource within a resource. |
| DELETE | To delete the resource. |

# Response Codes

The API returns standard HTTP response codes:

| HTTP Code | Description |
| --- | --- |
| 200 | For a successful response. The response payload will vary depending upon the API. Refer the respective API response schema. |
| 201 | For a successful resource creation. The response payload contains the uid of the created resource. |
| 204 | Response without any content for a successful operation. These operations include update, delete and the other actions on the resource. |
| 400 | Bad request. The request does not adhere to the API request payload schema. |
| 401 | Missing authorization token or invalid authorization token. |
| 403 | The API operation is forbidden for the user. |
| 404 | The resource or the dependent resource is not found for the operation. |
| 500 | Operational error. For 500 error code, the server responds with an explicit error code and an error message. |

# Versioning

The version information is part of the API URI like `v1alpha1`, `v1`. Future APIs will increment the version, leaving the earlier version API intact. The existing API request and response schema will undergo changes like adding new attributes or query params with backward compatibility of earlier schema. While advancing to the next version, ample notice to migrate to the new API will be provided based on contracted agreements.

# Scope

Spectro Cloud applications operate in *tenant* and *project* scopes. The resources can be logically grouped as projects and API requests within a project should carry the project uid in the context. The project scope  can be specified in the API request as a HTTP header with the key as `projectUid` and value as the &lt;project uid&gt;

# Pagination

The resources list APIs are limited to 50 items and pagination has to be performed to retrieve the complete resources list. The list API response contains `listMeta` with the `continue` token. The pagination can be performed based on the presence of the `continue` token value, and the subsequent request can be performed with the `continue` token as query param to paginate the rest of the resource items.
