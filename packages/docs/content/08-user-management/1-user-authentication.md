---
title: "User Authentication"
metaTitle: "API Key for API Authentication"
metaDescription: "Palette's API key for user authentication for API access "
icon: ""
hideToC: false
fullWidth: false
---
# Overview

Palette supports two types of user authentication methods for its users: 
# Using Authorization Token
  * All requests must be authenticated with an API token that are passed using the HTTP request header `Authorization`. 
  * Activated users can use the `/auth/authenticate` API to authenticate and obtain the Authorization token. 
  * Every authorization token is valid for 15 min. 
  * To refresh the token use: `GET /v1/auth/refresh/:token` 

# Using API Key
Palette enables secure authentication and authorization for API with the help of API Keys. This is the method of accessing the API without referring to the actual user. The API key will be part of individual API requests to identify and authorize the request. This is a relatively more straight forward method of authentication. 

## Scope of Palette API Keys:
* Tenant admin can create an API Key for any of his users. 
* In addition, users can create API Keys for themselves.

## Creating an API key
* Login to Palette Console and go to tenant settings.
* Select API Keys from Tenant Settings.
* Click on “Add New API Key” to create a new API key. The following information is required for creating a new API Key:
	* API Key Name: The tenant/user-specified custom name for the key.
	* Description(Optional) : An optional description about the key.
	* Username: Select the user for whom the Key is created from the drop-down.
	* Expiration Date: Set an expiry date for the key from the options available. The expiration date can be further customized after the key creation. The various options available for the expiration dates are:
		* 7 days
		* 30 days
		* 60 days
		* 90 days
* Custom: Select a custom expiry date from the calendar.
Confirm the information to complete the wizard.

### Manage the API Keys
* Once the key is created, the detailed status of the key can be observed from the palette dashboard. In addition to the key's name, description, and expiration date, the Palette console displays the encrypted key, the user to which the key is assigned, and the status of the key.
* To view all the keys assigned to a particular user, select the user's name at “User Name” on top of the page, below the “Manage API Keys”.
* For each key from the Kabab menu, we can:
	* Edit: The following information can be edited from the menu,
		* API Key name
		* Description(optional)
		* Expiration Date
	* Revoke: Change the status of the key from ‘active’ to ‘inactive’.
	* Re-activate: Change the status of the key from ‘inactive’ to ‘active’. 
	* Delete: Delete the key.
## Using your API key
To use Palette generated API key, there are two ways:
* Copy the API  key from the Palette dashboard and pass it to the REST API call as a query parameter with the following format. 
		`v1/spectroclusters?ApiKey=<apiKey>`
* The API Key is passed using HTTP request header in the following format:
	* Key: ApiKey
	* Value: API key copied from the Palette Console. 
	* E.g.: QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl


