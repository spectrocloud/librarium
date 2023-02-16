---
title: "Introduction"
metaTitle: "Introduction"
metaDescription: "Palette API Introduction"
icon: "graph"
hideToC: false
fullWidth: false
hiddenFromNav: false
hideToCSidebar: false
---
import {Intro, IntroButtons} from "shared/components"
import {Layout} from "shared"
import InfoBox from "shared/components/InfoBox"

<Intro>

# Palette APIs

</Intro>

Spectro Cloud Palette platform capabilities are exposed via REST APIs, providing a subset of features that comply with open application programming interface (API) standards. 

### APIs and External Resources 
Palette interacts with external-facing utility tools such as Terraform to provision, change, and manage your environment automatically and efficiently.

# Paths

Every API's URI has the prefix of the version and the Palette resource, such as: `v1/spectroclusters/...`

# Authentication
Palette supports two types of user authentication methods: 

### Using Authorization Token
  * All requests must be authenticated with an API token that are passed using the HTTP request header `Authorization`. 
  * Activated users can use the `/auth/authenticate` API to authenticate and obtain the Authorization token. 
  * Every authorization token is valid for 15 min. 
  * To refresh the token use [this GET call](https://docs.spectrocloud.com/api/v1/auth/): `GET /v1/auth/refresh/{token}` 
  
### Using the API Key
Palette enables secure authentication and authorization for API with the help of API Keys. This is the method of accessing the API without referring to the actual user credentials. The API key will be part of individual API requests to identify and authorize the request. This is a relatively more straight forward method of authentication. The API Key is passed using HTTP request header in the following format:
  * Key: ApiKey
  * Value: API key copied from the Palette Console. E.g. QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl

[Read More...](/user-management/user-authentication/#usingapikey)         
# Requests

All requests are in the `JSON` format. In general, the request payload has three sections: *metadata, spec and status*.

* *Metadata* consists of common attributes for all the resources such as ids, names, creation timestamps etc. 
* *Spec* consists of attributes that define the resource
* *Status* contains the status information of the resource. The API does not support creating or modifying the status section. 

<InfoBox>
Certain update request schema have restricted spec resource definition and certain fields like uid, creation timestamp are not allowed to be modified post creation.
</InfoBox>

| HTTP Method | Documentation |
| --- | --- |
| POST | To create a resource or a sub-resource. |
| PUT | To update the resource or a sub-resource. The PUT request will overwrite the existing resource data. |
| PATCH | To add, modify, remove a specific attribute or sub-resource within a resource. |
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

# Palette API Lifecycle
The Palette API will remain backward compatible until it's deprecated, and we will keep you informed of its lifecycle phases, which are *Production*, *Sunset*, and *Deprecated*.
### Production
The Palette APIs are designed to work as intended and expected.
### Sunset
As the API approaches retirement, whether because it is being replaced or will no longer be supported, we include a notice in the documentation that outlines our intent and provides a cut-off date. Within three months of the deprecation date, we share a notice that counts down to the end date and recommends the API to use instead.
### Deprecated
We indicate that an API is deprecated when it is no longer supported or recommended for use by including a tag to indicate its state. The API documentation will remain available as a subsection of deprecated APIs..

<br />

<InfoBox>

The API lifecycle also applies to external-facing tools such as Terraform, and they will be managed accordingly.

</InfoBox>

# Versioning

The version information is included in the API URI, such as `v1alpha1` or `v1`. Future APIs will increment the version, leaving the earlier version API intact. The existing API request and response schema will be modified to add new attributes or query parameters while maintaining backward compatibility with earlier schema. Prior notice will be given before advancing to the next version, and users will be advised to migrate to the new API.

# Scope

Palette groups resources under either a Tenant or Project scope. When making API requests targeting resources belonging to a project, the project scope should be specified. To specify the project scope, use the HTTP header key `ProjectUid` with the value `<Project Uid>` in the API request. The `ProjectUid` needs to be specified for a request to be applied under a specific project scope.

**Example**:

```shell
curl --location --request \
GET 'https://api.spectrocloud.com/v1/edgehosts/ad3d90ab-de6e-3e48-800f-4d663cec3060?resolvePackValues=false' \
--header 'Accept: application/json' \
--header 'ProjectUid: ad3d90ab-de6e-3e48-800f-4d663cec3060'
```


# Pagination

The resources list APIs are limited to 50 items, and therefore pagination is required to retrieve the complete resources list. The list API response includes listMeta with the continue token. To perform pagination, check the presence of the continue token value in the API response. For subsequent requests, use the continue token as a query parameter to paginate the remaining resource items.
