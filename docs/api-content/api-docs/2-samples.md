---
title: "Example Usage"
sidebar_label: "Example Usage"
description: "Learn how to use the Spectro Cloud API through examples."
icon: ""
hide_table_of_contents: false
hiddenFromNav: false
---

This workflow demonstrates how to use Spectro Cloud API. You can use the API to automate the provisioning of Kubernetes
clusters and applications on Spectro Cloud.

The API is a RESTful API that uses JSON for serialization and supports HTTP Basic Authentication and token
authentication. The API is available at `https://api.spectrocloud.com`.

Use the following examples to familiarize yourself with the API.

:::warning

The following samples are for demonstration purposes only and may lack all the required payload values. They are not
intended for production use. We recommend exploring the API using a tool such as [Postman](https://www.postman.com/) and
our available Postman collection. Check out the [Palette Postman collection](/api/postman-collection) resource to learn
more about the Postman collection.

:::

## Prerequisites

- You must have a Spectro Cloud account. If you do not have an account, you can create one at
  [https://console.spectrocloud.com](https://console.spectrocloud.com).

- An Authentication header with a token value or an API key. Learn more about authentication credentials by reviewing
  the [authentication methods](https://docs.spectrocloud.com/user-management/authentication/) resource.

- The respective language runtime and package manager installed on your machine.

- [jq](https://stedolan.github.io/jq/download/) - A command-line JSON processor.

## Configure Scope and Authentication

Variables shown in the following examples are used to interact with the Palette API. The values for these variables are
specific to your environment. The project ID is the Unique Identifier (UID) of the project in which you want to create
the cluster. You can find the project ID at top right in the Palette dashboard.

<br />

```shell
export API_value="Your API Key"
```

<br />

```shell
export PROJECT_ID="Your Project UID"
```

Some of the endpoints require a cluster ID.

:::info

If you do not provide the projectUid header, then the assumed scope is of the tenant.

:::

## Deploy a Cluster

You can use the following endpoint to deploy a cluster. The provider value represents the cloud provider on which you
want to deploy the cluster, such as public cloud or on-prem.

**Endpoint**: `https://api.spectrocloud.com/v1/spectroclusters/{provider}`

Set the provider as an environment variable.

```shell
export PROVIDER="Your Provider"
```

<br />

```shell
export PAYLOAD='{
	"metadata": {
		"annotations": {},
		"name": "my-cluster",
		"labels": {}
	},
	"spec": {....}
}'
```

<Tabs>

<TabItem label="curl" value="cluster-create-curl">

```shell
curl --location 'https://api.spectrocloud.com/v1/spectroclusters/$PROVIDER?projectUid=$PROJECT_ID"' \
 --header 'Content-Type: application/json' \
 --header 'Accept: application/json' \
 --header "apiKey: $API_KEY"
 --data  "$PAYLOAD"
```

</TabItem>

<TabItem label="JavaScript" value="cluster-create-js">

```js
const apiKey = process.env.API_KEY;
const projectID = process.env.PROJECT_ID;
const provider = process.env.PROVIDER; // Or specify the provider directly such as "aws", "aks", "openstack"

// Build the request URL
const url = `https://api.spectrocloud.com/v1/spectroclusters/${provider}?projectUid=${projectID}`;

// Define data payload for the request
const data = {
  metadata: {
    annotations: {},
    name: "my-cluster",
    labels: {},
  },
  spec: {
    // ...
  },
};

// Define headers for the request
const headers = new Headers({
  "Content-Type": "application/json",
  Accept: "application/json",
  apiKey: apiKey,
});

// Define async function to send POST request
async function sendRequest() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error(error);
  }
}
sendRequest();
```

</TabItem>

<TabItem label="Go" value="cluster-create-go">

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	projectID := os.Getenv("PROJECT_ID")
	provider := os.Getenv("PROVIDER")

	url := fmt.Sprintf("https://api.spectrocloud.com/v1/spectroclusters/%s?projectUid=%s", provider, projectID)


	data := map[string]interface{}{
		"metadata": map[string]interface{}{
			"annotations": map[string]interface{}{},
			"name":        "my-cluster",
			"labels":      map[string]interface{}{},
		},
		"spec": map[string]interface{}{
			// ...
		},
	}

	// Convert data payload to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	// Define headers for the request
	headers := http.Header{}
	headers.Set("Content-Type", "application/json")
	headers.Set("Accept", "application/json")
	headers.Set("apiKey", apiKey)

	// Send POST request with data payload
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// Parse response data as JSON
	var responseData map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&responseData)
	if err != nil {
		panic(err)
	}

	fmt.Println(responseData)
}
```

</TabItem>

<TabItem label="Python" value="cluster-create-python">

```python
import os
import json
import requests

def send_request():
    # Get the required environment variables
    apiKey = os.environ['API_KEY']
    projectID = os.environ['PROJECT_ID']
    provider = os.environ['PROVIDER'] # Or specify the provider directly such as "aws", "aks", "openstack"

    # Build the request URL
    url = f"https://api.spectrocloud.com/v1/spectroclusters/{provider}?projectUid={projectID}"

    # Define data payload for the request
    data = {
      "metadata": {
        "annotations": {},
        "name": "my-cluster",
        "labels": {}
      },
      "spec": {
        # ...
      }
    }

    # Define headers for the request
    headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "apiKey": apiKey
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status() # Raise an exception if the response code is not 2xx
        responseData = response.json()
        print(responseData)
    except requests.exceptions.HTTPError as error:
        print(f"HTTP error {response.status_code}: {error}")
    except Exception as error:
        print(f"Error: {error}")

def main():
    send_request()

if __name__ == '__main__':
    main()
```

</TabItem>

<TabItem label="Rust" value="cluster-create-rust">

```rust
use std::collections::HashMap;
use std::env;
use std::io::Read;

use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug)]
struct ClusterData {
    metadata: Metadata,
    spec: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Metadata {
    annotations: HashMap<String, String>,
    name: String,
    labels: HashMap<String, String>,
}

async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api_key = env::var("API_KEY")?;
    let project_id = env::var("PROJECT_ID")?;
    let provider = env::var("PROVIDER")?;

    let url = format!(
        "https://api.spectrocloud.com/v1/spectroclusters/{}?projectUid={}",
        provider, project_id
    );

    let data = ClusterData {
        metadata: Metadata {
            annotations: HashMap::new(),
            name: "my-cluster".to_string(),
            labels: HashMap::new(),
        },
        spec: HashMap::new(),
    };

    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert("Accept", HeaderValue::from_static("application/json"));
    headers.insert("apiKey", HeaderValue::from_str(&api_key)?);

    let resp = client.post(&url).headers(headers).json(&data).send().await?;
    let mut resp_body = String::new();
    resp.text().await?.read_to_string(&mut resp_body)?;

    let response_data: HashMap<String, serde_json::Value> = serde_json::from_str(&resp_body)?;
    println!("{:?}", response_data);

    Ok(())
}
```

</TabItem>

</Tabs>

## Monitor Cluster Creation Progress

You can use the following endpoint to monitor the progress of cluster creation.

**Endpoint**: `https://api.spectrocloud.com/v1/spectroclusters/{uid}`

Ensure you specify the cluster ID. You can set the cluster ID as an environment variable.

```shell
export CLUSTER_ID="Your Cluster ID"
```

<br />

<Tabs>

<TabItem label="curl" value="cluster-create-status-curl">

```shell
curl -s --location "https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID?projectUid=$PROJECT_ID" \
 --header 'Accept: application/json' \
 --header "apiKey: $API_KEY" \
 | jq -r '.status'
```

</TabItem>

<TabItem label="JavaScript" value="cluster-create-status-js">

```js
const apiKey = process.env.API_KEY;
const projectID = process.env.PROJECT_ID;
const clusterID = process.env.CLUSTER_ID;

const url = `https://api.spectrocloud.com/v1/spectroclusters/${clusterID}?projectUid=${projectID}`;
const headers = {
  Accept: "application/json",
  apiKey: apiKey,
};

try {
  const response = await fetch(url, { headers });
  const data = await response.json();
  const status = data.status;
  console.log(status);
} catch (error) {
  console.error("Error:", error);
}
```

</TabItem>

<TabItem label="Go" value="cluster-create-status-go">

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	clusterID := os.Getenv("CLUSTER_ID")
	projectID := os.Getenv("PROJECT_ID")
	apiKey := os.Getenv("API_KEY")

	url := fmt.Sprintf("https://api.spectrocloud.com/v1/spectroclusters/%s?projectUid=%s", clusterID, projectID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("apiKey", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}

	var responseMap map[string]interface{}
	err = json.Unmarshal(body, &responseMap)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return
	}

	status := responseMap["status"].(map[string]interface{})
	prettyStatus, err := json.MarshalIndent(status, "", "  ")
	if err != nil {
		fmt.Println("Error marshalling status JSON:", err)
		return
	}

	fmt.Println(string(prettyStatus))
}
```

</TabItem>

<TabItem label="Python" value="cluster-create-status-python">

```python
import os
import requests

def get_cluster_status():
    # Get the required environment variables
    apiKey = os.environ['API_KEY']
    projectID = os.environ['PROJECT_ID']
    clusterID = os.environ['CLUSTER_ID']

    # Build the request URL
    url = f"https://api.spectrocloud.com/v1/spectroclusters/{clusterID}?projectUid={projectID}"

    # Define headers for the request
    headers = {
      'Accept': 'application/json',
      'apiKey': apiKey,
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status() # Raise an exception if the response code is not 2xx
        data = response.json()
        status = data['status']
        print(status)
    except requests.exceptions.HTTPError as error:
        print(f"HTTP error {response.status_code}: {error}")
    except Exception as error:
        print(f"Error: {error}")

def main():
    get_cluster_status()

if __name__ == '__main__':
    main()
```

</TabItem>

<TabItem label="Rust" value="cluster-create-status-rust">

```
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT};
use serde_json::Value;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cluster_id = env::var("CLUSTER_ID").unwrap();
    let project_id = env::var("PROJECT_ID").unwrap();
    let api_key = env::var("API_KEY").unwrap();

    let url = format!(
        "https://api.spectrocloud.com/v1/spectroclusters/{}?projectUid={}",
        cluster_id, project_id
    );

    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));
    headers.insert("apiKey", HeaderValue::from_str(&api_key)?);

    let client = reqwest::Client::new();
    let resp = client.get(&url).headers(headers).send().await?;

    let data: Value = resp.json().await?;
    let status = data.get("status").unwrap();

    println!("{:#}", status);

    Ok(())
}
```

</TabItem>

</Tabs>

## Cluster Nodes and Node Status

You can use the following endpoint to retrieve the list of nodes in a cluster and their status.

**Endpoint**: `https://api.spectrocloud.com/v1/spectroclusters/{uid}`

Ensure you specify the cluster ID. You can set the cluster ID as an environment variable.

```shell
export CLUSTER_ID="Your Cluster ID"
```

## All Cluster Node Data

<br />

<Tabs>

<TabItem label="curl" value="node-status-curl">

```shell
curl --location "https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID?projectUid=$PROJECT_ID" \
 --header 'Accept: application/json' \
 --header "apiKey: $API_KEY"
```

</TabItem>

<TabItem label="JavaScript" value="node-status-js">

```js
// Get API key, project ID, and cluster ID from environment variables
const apiKey = process.env.API_KEY;
const projectID = process.env.PROJECT_ID;
const clusterID = process.env.CLUSTER_ID;

// Build the request URL
const url = `https://api.spectrocloud.com/v1/spectroclusters/${clusterID}?projectUid=${projectID}`;

// Define headers for the request
const headers = new Headers({
  Accept: "application/json",
  apiKey: apiKey,
});

// Define an async function to send the HTTP request
async function fetchData() {
  try {
    // Send the HTTP request using the fetch() method
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    console.log("Response data:", data);
  } catch (error) {
    console.error(error);
  }
}

// Call the async function to send the HTTP request
fetchData();
```

</TabItem>

<TabItem label="Go" value="node-status-go">

```go
package main

import (
	"fmt"
	"net/http"
	"io/ioutil"
	"os"
)

func main() {
	// Get API key, project ID and cluster ID from environment variables
	apiKey := os.Getenv("API_KEY")
	projectID := os.Getenv("PROJECT_ID")
	clusterID := os.Getenv("CLUSTER_ID")

	// Create a new HTTP request
	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.spectrocloud.com/v1/spectroclusters/%s?projectUid=%s", clusterID, projectID), nil)
	if err != nil {
		fmt.Println("Error creating HTTP request:", err)
		return
	}

	// Add headers to the request
	req.Header.Add("Accept", "application/json")
	req.Header.Add("apiKey", apiKey)

	// Send the HTTP request
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending HTTP request:", err)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading HTTP response:", err)
		return
	}

	// Print the response body
	fmt.Println(string(body))
}

```

</TabItem>

<TabItem label="Python" value="node-status-python">

```python
import os
import requests


def get_cluster_info():
    # Get API key, project ID, and cluster ID from environment variables
    api_key = os.environ.get("API_KEY")
    project_id = os.environ.get("PROJECT_ID")
    cluster_id = os.environ.get("CLUSTER_ID")

    # Build the request URL
    url = f"https://api.spectrocloud.com/v1/spectroclusters/{cluster_id}?projectUid={project_id}"

    # Define headers for the request
    headers = {
      "Accept": "application/json",
      "apiKey": api_key
    }

    # Send the HTTP request using the requests library
    response = requests.get(url, headers=headers)

    # Check the response status code
    if response.status_code == 200:
        # Print the response data (JSON format)
        print("Response data:", response.json())
    else:
        # Print the error message if the request failed
        print("Request failed with status code:", response.status_code)


def main():
    get_cluster_info()


if __name__ == '__main__':
    main()
```

</TabItem>

<TabItem label="Rust" value="node-status-rust">

```
use std::env;
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, APIKEY};

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    // Set API key, project ID, and cluster ID as environment variables
    let api_key = env::var("API_KEY").unwrap();
    let project_id = env::var("PROJECT_ID").unwrap();
    let cluster_id = env::var("CLUSTER_ID").unwrap();

    // Build the request URL
    let url = format!("https://api.spectrocloud.com/v1/spectroclusters/{}?projectUid={}", cluster_id, project_id);

    // Define headers for the request
    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));
    headers.insert(APIKEY, HeaderValue::from_str(&api_key).unwrap());

    // Send the HTTP request using the reqwest crate
    let response = reqwest::Client::new()
        .get(&url)
        .headers(headers)
        .send()
        .await?;

    // Check the response status code
    if response.status().is_success() {
        // Print the response data (JSON format)
        let body = response.text().await?;
        println!("Response data: {}", body);
    } else {
        // Print the error message if the request failed
        println!("Request failed with status code: {}", response.status());
    }

    Ok(())
}
```

</TabItem>

</Tabs>

## Retrieve the Cluster Cloud Config Identifier

The cloud config identifier is a unique identifier for the cloud config that is used to provision the cluster. The
values are found in the `spec.cloudConfigRef` field of the cluster object. You can use the following code snippet to
retrieve the cluster cloud config identifier `uid` and `kind`.

<br />

<Tabs>

<TabItem label="curl" value="config-identifier-curl">

```shell
curl -s --location "https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID?projectUid=$PROJECT_ID" \
 --header 'Accept: application/json' \
 --header "apiKey: $API_KEY" \
 | jq -r '.spec.cloudConfigRef | "\(.kind) \(.uid)"'
```

</TabItem>

<TabItem label="JavaScript" value="config-identifier-js">

```js
// Get API key, project ID, and cluster ID from environment variables
const apiKey = process.env.API_KEY;
const projectID = process.env.PROJECT_ID;
const clusterID = process.env.CLUSTER_ID;

// Build the request URL
const url = `https://api.spectrocloud.com/v1/spectroclusters/${clusterID}?projectUid=${projectID}`;

// Define headers for the request
const headers = new Headers({
  Accept: "application/json",
  apiKey: apiKey,
});

// Define an async function to send the HTTP request
async function fetchData() {
  try {
    // Send the HTTP request using the fetch() method
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    // Parse the response as JSON
    const data = await response.json();

    // Extract the required values from the response
    const cloudConfigRef = data.spec.cloudConfigRef;
    const kind = cloudConfigRef.kind;
    const uid = cloudConfigRef.uid;

    // Print the values
    console.log(`kind: ${kind}`);
    console.log(`uid: ${uid}`);
  } catch (error) {
    console.error(error);
  }
}

// Call the async function to send the HTTP request
fetchData();
```

</TabItem>

<TabItem label="Go" value="config-identifier-go">

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

type Response struct {
	Spec struct {
		CloudConfigRef struct {
			Kind string `json:"kind"`
			Uid  string `json:"uid"`
		} `json:"cloudConfigRef"`
	} `json:"spec"`
}

func main() {
	// Get API key, project ID and cluster ID from environment variables
	apiKey := os.Getenv("API_KEY")
	projectID := os.Getenv("PROJECT_ID")
	clusterID := os.Getenv("CLUSTER_ID")

	// Create a new HTTP request
	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.spectrocloud.com/v1/spectroclusters/%s?projectUid=%s", clusterID, projectID), nil)
	if err != nil {
		fmt.Println("Error creating HTTP request:", err)
		return
	}

	// Add headers to the request
	req.Header.Add("Accept", "application/json")
	req.Header.Add("apiKey", apiKey)

	// Send the HTTP request
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending HTTP request:", err)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading HTTP response:", err)
		return
	}

	// Unmarshal the JSON response into a Response struct
	var response Response
	err = json.Unmarshal(body, &response)
	if err != nil {
		fmt.Println("Error unmarshaling JSON response:", err)
		return
	}

	// Print the cloudConfigRef kind and uid
	fmt.Printf("Kind: %s\nUid: %s\n", response.Spec.CloudConfigRef.Kind, response.Spec.CloudConfigRef.Uid)
}
```

</TabItem>

<TabItem label="Python" value="config-identifier-python">

```python
import os
import requests

# Get API key, project ID, and cluster ID from environment variables
api_key = os.environ.get("API_KEY")
project_id = os.environ.get("PROJECT_ID")
cluster_id = os.environ.get("CLUSTER_ID")

# Build the request URL
url = f"https://api.spectrocloud.com/v1/spectroclusters/{cluster_id}?projectUid={project_id}"

# Define headers for the request
headers = {
  "Accept": "application/json",
  "apiKey": api_key
}

# Send the HTTP request using the requests library
response = requests.get(url, headers=headers)

# Check the response status code
if response.status_code == 200:
  # Parse the response JSON and extract the values
  response_json = response.json()
  kind = response_json['spec']['cloudConfigRef']['kind']
  uid = response_json['spec']['cloudConfigRef']['uid']

  # Print the extracted values
  print(f"Kind: {kind}")
  print(f"UID: {uid}")
else:
  # Print the error message if the request failed
  print("Request failed with status code:", response.status_code)
```

</TabItem>

<TabItem label="Rust" value="config-identifier-rust">

```
use std::env;
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, APIKEY};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Deserialize, Serialize)]
struct SpectroCluster {
    metadata: Value,
    spec: SpectroClusterSpec,
}

#[derive(Debug, Deserialize, Serialize)]
struct SpectroClusterSpec {
    cloud_config_ref: CloudConfigRef,
}

#[derive(Debug, Deserialize, Serialize)]
struct CloudConfigRef {
    kind: String,
    uid: String,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    // Set API key, project ID, and cluster ID as environment variables
    let api_key = env::var("API_KEY").unwrap();
    let project_id = env::var("PROJECT_ID").unwrap();
    let cluster_id = env::var("CLUSTER_ID").unwrap();

    // Build the request URL
    let url = format!("https://api.spectrocloud.com/v1/spectroclusters/{}?projectUid={}", cluster_id, project_id);

    // Define headers for the request
    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));
    headers.insert(APIKEY, HeaderValue::from_str(&api_key).unwrap());

    // Send the HTTP request using the reqwest crate
    let response = reqwest::Client::new()
        .get(&url)
        .headers(headers)
        .send()
        .await?;

    // Check the response status code
    if response.status().is_success() {
        // Deserialize the response data to a SpectroCluster struct
        let cluster: SpectroCluster = response.json().await?;

        // Extract spec.cloudConfigRef.kind and spec.cloudConfigRef.uid
        let kind = cluster.spec.cloud_config_ref.kind;
        let uid = cluster.spec.cloud_config_ref.uid;
        println!("kind: {}", kind);
        println!("uid: {}", uid);
    } else {
        // Print the error message if the request failed
        println!("Request failed with status code: {}", response.status());
    }

    Ok(())
}
```

</TabItem>

</Tabs>

## Cluster Workloads

You can retrieve information about the active workloads on a cluster, such as the number of pods, nodes, and containers.
Use the namespace filter to retrieve information about workloads in specific namespaces.

**Endpoint**: `https://api.spectrocloud.com/v1/dashboard/spectroclusters/{uid}/workloads/pod`

Ensure you specify the cluster ID. You can set the cluster ID as an environment variable.

```shell
export CLUSTER_ID="Your Cluster ID"
```

<br />

<Tabs>

<TabItem label="curl" value="cluster-workloads-curl">

```shell
 curl --location "https://api.spectrocloud.com/v1/dashboard/spectroclusters/$CLUSTER_ID/workloads" \
 --header "Content-Type: application/json" \
 --header "Accept: application/json" \
 --header "projectUid: $PROJECT_ID" \
 --header "apiKey: $API_KEY" \
 --data '{
   "filter": {
     "namespaces": ["default", "myOtherNamespace"]
   }
 }'
```

</TabItem>

<TabItem label="JavaScript" value="cluster-workloads-js">

```js
const API_KEY = process.env.API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const CLUSTER_ID = process.env.CLUSTER_ID;

const url = `https://api.spectrocloud.com/v1/dashboard/spectroclusters/${CLUSTER_ID}/workloads`;

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    projectUid: PROJECT_ID,
    apiKey: API_KEY,
  },
  body: JSON.stringify({
    filter: {
      namespaces: ["default", "myOtherNamespace"],
    },
  }),
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
} catch (error) {
  console.error(error);
}
```

</TabItem>

<TabItem label="Go" value="cluster-workloads-go">

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	projectID := os.Getenv("PROJECT_ID")
	clusterID := os.Getenv("CLUSTER_ID")

	url := fmt.Sprintf("https://api.spectrocloud.com/v1/dashboard/spectroclusters/%s/workloads", clusterID)

	filter := struct {
		Namespaces []string `json:"namespaces"`
	}{
		Namespaces: []string{"default", "myOtherNamespace"},
	}

	requestBody, err := json.Marshal(struct {
		Filter interface{} `json:"filter"`
	}{
		Filter: filter,
	})

	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	request.Header.Set("projectUid", projectID)
	request.Header.Set("apiKey", apiKey)

	client := &http.Client{}

	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	defer response.Body.Close()

	var data interface{}
	if err := json.NewDecoder(response.Body).Decode(&data); err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println(data)
}
```

</TabItem>

<TabItem label="Python" value="cluster-workloads-python">

```python
import os
import json
import requests

def main():
    api_key = os.getenv("API_KEY")
    project_id = os.getenv("PROJECT_ID")
    cluster_id = os.getenv("CLUSTER_ID")

    url = f"https://api.spectrocloud.com/v1/dashboard/spectroclusters/{cluster_id}/workloads"

    filter = {
        "namespaces": ["default", "myOtherNamespace"]
    }

    request_body = {
        "filter": filter
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "projectUid": project_id,
        "apiKey": api_key
    }

    response = requests.post(url, json=request_body, headers=headers)

    if response.status_code != 200:
        print(f"Error: {response.status_code} {response.text}")
        return

    data = response.json()

    print(data)

if __name__ == "__main__":
    main()
```

</TabItem>

<TabItem label="Rust" value="cluster-workloads-rust">

```
use std::env;
use std::error::Error;
use serde::{Serialize, Deserialize};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE, ACCEPT};

#[derive(Serialize)]
struct Filter {
    namespaces: Vec<String>,
}

#[derive(Serialize)]
struct Request {
    filter: Filter,
}

#[derive(Deserialize)]
struct Response {
    // Define the response struct based on the API response
    // The structure of this is assumed and might need to be adjusted
    // based on the actual response from the API
    data: Vec<serde_json::Value>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let cluster_id = env::var("CLUSTER_ID")?;
    let project_id = env::var("PROJECT_ID")?;
    let api_key = env::var("API_KEY")?;

    let url = format!(
        "https://api.spectrocloud.com/v1/dashboard/spectroclusters/{}/workloads",
        cluster_id
    );

    let filter = Filter {
        namespaces: vec!["default".to_string(), "myOtherNamespace".to_string()],
    };

    let request = Request { filter };

    let request_body = serde_json::to_string(&request)?;

    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));
    headers.insert("projectUid", HeaderValue::from_str(&project_id)?);
    headers.insert("apiKey", HeaderValue::from_str(&api_key)?);

    let client = reqwest::Client::new();
    let response = client
        .post(&url)
        .headers(headers)
        .body(request_body)
        .send()
        .await?;

    let response_text = response.text().await?;

    let response_data: Response = serde_json::from_str(&response_text)?;

    println!("{:#?}", response_data);

    Ok(())
}
```

</TabItem>

</Tabs>

## Filter Clusters

You can filter host clusters by specifying the tags you want to filter on.

**Endpoint**: `https://api.spectrocloud.com/v1/dashboard/spectroclusters/search`

Ensure you specify the cluster ID. You can set the cluster ID as an environment variable.

```shell
export CLUSTER_ID="Your Cluster ID"
```

In the following example, a filter for the tags `dev` and `team:bravo-2` is specified. You can learn more about filters
and how to

<br />

<Tabs>

<TabItem label="curl" value="cluster-search-curl">

```shell
 curl --location 'https://api.spectrocloud.com/v1/dashboard/spectroclusters/search?limit=20' \
 --header 'Content-Type: application/json' \
 --header 'Accept: application/json' \
 --header "projectUid: $PROJECT_ID" \
 --header "apiKey: $API_KEY" \
 --data '{
   "filter": {
     "conjunction": "and",
     "filterGroups": [
       {
         "conjunction": "and",
         "filters": [
           {
             "property": "tag",
             "type": "string",
             "condition": {
               "string": {
                 "operator": "eq",
                 "negation": false,
                 "match": {
                   "conjunction": "or",
                   "values": [
                     "dev",
                     "team:bravo-2"
                   ]
                 },
                 "ignoreCase": false
               }
             }
           }
         ]
       }
     ]
   },
   "sort": []
 }'
```

</TabItem>

<TabItem label="JavaScript" value="cluster-search-js">

```js
async function searchSpectroclusters() {
  const url = "https://api.spectrocloud.com/v1/dashboard/spectroclusters/search?limit=20";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    projectUid: process.env.PROJECT_UID,
    apiKey: process.env.API_KEY,
  };
  const body = JSON.stringify({
    filter: {
      conjunction: "and",
      filterGroups: [
        {
          conjunction: "and",
          filters: [
            {
              property: "tag",
              type: "string",
              condition: {
                string: {
                  operator: "eq",
                  negation: false,
                  match: {
                    conjunction: "or",
                    values: ["dev", "team:bravo-2"],
                  },
                  ignoreCase: false,
                },
              },
            },
          ],
        },
      ],
    },
    sort: [],
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

searchSpectroclusters();
```

</TabItem>

<TabItem label="Go" value="cluster-search-go">

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

type Filter struct {
	Conjunction  string `json:"conjunction"`
	FilterGroups []struct {
		Conjunction string `json:"conjunction"`
		Filters     []struct {
			Property  string `json:"property"`
			Type      string `json:"type"`
			Condition struct {
				String struct {
					Operator   string `json:"operator"`
					Negation   bool   `json:"negation"`
					Match      Match  `json:"match"`
					IgnoreCase bool   `json:"ignoreCase"`
				} `json:"string"`
			} `json:"condition"`
		} `json:"filters"`
	} `json:"filterGroups"`
}

type Match struct {
	Conjunction string   `json:"conjunction"`
	Values      []string `json:"values"`
}

func main() {
	url := "https://api.spectrocloud.com/v1/dashboard/spectroclusters/search?limit=20"

	filter := Filter{
		Conjunction: "and",
		FilterGroups: []FilterGroup{
			{
				Conjunction: "and",
				Filters: []Filter{
					{
						Property: "tag",
						Type:     "string",
						Condition: Condition{
							String: StringCondition{
								Operator:   "eq",
								Negation:   false,
								Match:      Match{Conjunction: "or", Values: []string{"dev", "team:bravo-2"}},
								IgnoreCase: false,
							},
						},
					},
				},
			},
		},
	}

	jsonData, err := json.Marshal(filter)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("projectUid", os.Getenv("PROJECT_UID"))
	req.Header.Set("apiKey", os.Getenv("API_KEY"))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(body))
}
```

</TabItem>

<TabItem label="Python" value="cluster-search-python">

```python
import requests
import os
import json

def main():

url = 'https://api.spectrocloud.com/v1/dashboard/spectroclusters/search?limit=20'

filter = {
  "filter": {
    "conjunction": "and",
    "filterGroups": [
      {
        "conjunction": "and",
        "filters": [
          {
            "property": "tag",
            "type": "string",
            "condition": {
              "string": {
                "operator": "eq",
                "negation": False,
                "match": {
                  "conjunction": "or",
                  "values": [
                    "dev",
                    "team:bravo-2"
                  ]
                },
                "ignoreCase": False
              }
            }
          }
        ]
      }
    ]
  },
  "sort": []
}

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'projectUid': os.getenv('PROJECT_UID'),
    'apiKey': os.getenv('API_KEY')
}

response = requests.post(url, headers=headers, json=filter)

print(response.json())

if __name__ == "__main__":
    main()
```

</TabItem>

<TabItem label="Rust" value="cluster-search-rust">

```
use reqwest::header::{HeaderMap, HeaderValue};
use std::env;

#[derive(Serialize)]
struct Filter {
    conjunction: String,
    filterGroups: Vec<FilterGroup>,
}

#[derive(Serialize)]
struct FilterGroup {
    conjunction: String,
    filters: Vec<Filter>,
}

#[derive(Serialize)]
struct Filter {
    property: String,
    r#type: String,
    condition: Condition,
}

#[derive(Serialize)]
struct Condition {
    string: StringCondition,
}

#[derive(Serialize)]
struct StringCondition {
    operator: String,
    negation: bool,
    r#match: Match,
    ignoreCase: bool,
}

#[derive(Serialize)]
struct Match {
    conjunction: String,
    values: Vec<String>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = "https://api.spectrocloud.com/v1/dashboard/spectroclusters/search?limit=20".to_string();

    let filter = Filter {
        conjunction: "and".to_string(),
        filterGroups: vec![FilterGroup {
            conjunction: "and".to_string(),
            filters: vec![Filter {
                property: "tag".to_string(),
                r#type: "string".to_string(),
                condition: Condition {
                    string: StringCondition {
                        operator: "eq".to_string(),
                        negation: false,
                        r#match: Match {
                            conjunction: "or".to_string(),
                            values: vec!["dev".to_string(), "team:bravo-2".to_string()],
                        },
                        ignoreCase: false,
                    },
                },
            }],
        }],
    };

    let headers = {
        let mut headers = HeaderMap::new();
        headers.insert(
            "Content-Type",
            HeaderValue::from_static("application/json"),
        );
        headers.insert("Accept", HeaderValue::from_static("application/json"));
        headers.insert(
            "projectUid",
            HeaderValue::from_str(&env::var("PROJECT_UID").unwrap()).unwrap(),
        );
        headers.insert(
            "apiKey",
            HeaderValue::from_str(&env::var("API_KEY").unwrap()).unwrap(),
        );
        headers
    };

    let client = reqwest::Client::new();
    let response = client
        .post(&url)
        .headers(headers)
        .json(&filter)
        .send()
        .await?
        .text()
        .await?;

    println!("{}", response);

    Ok(())
}
```

</TabItem>

</Tabs>

## Download Cluster Kubeconfig

You can download the kubeconfig file of a host cluster. To download the kubeconfig file, you need to provide the cluster
UID.

**Endpoint**: `https://api.spectrocloud.com/v1/spectroclusters/{uid}/assets/kubeconfig`

<br />

```shell
export CLUSTER_ID="Your Cluster ID"
```

<br />

<Tabs>

<TabItem label="cURL" value="cluster-kubeconfig-curl">

```shell
 curl --location 'https://api.spectrocloud.com/v1/spectroclusters/$CLUSTER_ID/assets/kubeconfig' \
 --header 'Accept: application/octet-stream' \
 --header 'projectUid: $PROJECT_ID' \
 --header 'apiKey: $API_KEY'
```

</TabItem>

<TabItem label="JavaScript" value="cluster-kubeconfig-js">

```js
const apiKey = process.env.API_KEY;
const projectID = process.env.PROJECT_ID;
const clusterID = process.env.CLUSTER_ID;

const url = `https://api.spectrocloud.com/v1/spectroclusters/${clusterID}/assets/kubeconfig?frp=true`;
const headers = {
  Accept: "application/octet-stream",
  projectUid: projectID,
  apiKey: apiKey,
};

try {
  const response = await fetch(url, { headers });
  const data = await response.text();
  console.log(data);
} catch (error) {
  console.error("Error:", error);
}
```

</TabItem>

<TabItem label="Go" value="cluster-kubeconfig-go">

```go
package main

import (
    "fmt"
    "os"
    "net/http"
    "io/ioutil"
)

func main() {
    // Get API key and project ID from environment variables
    apiKey := os.Getenv("API_KEY")
    projectID := os.Getenv("PROJECT_ID")
    clusterID := os.Getenv("CLUSTER_ID")

    // Build the request URL
    url := fmt.Sprintf("https://api.spectrocloud.com/v1/spectroclusters/%s/assets/kubeconfig?frp=true", clusterID)

    // Create a new HTTP request
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }

    // Set headers for the request
    req.Header.Set("Accept", "application/octet-stream")
    req.Header.Set("projectUid", projectID)
    req.Header.Set("apiKey", apiKey)

    // Send the HTTP request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()

    // Check the response status code
    if resp.StatusCode == http.StatusOK {
        // Print the response data (as a string)
        bodyBytes, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            fmt.Println("Error:", err)
            return
        }
        fmt.Println(string(bodyBytes))
    } else {
        // Print the error message if the request failed
        fmt.Printf("Request failed with status code: %d\n", resp.StatusCode)
    }
}
```

</TabItem>

<TabItem label="Python" value="cluster-kubeconfig-python">

```python
import os
import requests

def main():
    # Get API key and project ID from environment variables
    api_key = os.environ.get("API_KEY")
    project_id = os.environ.get("PROJECT_ID")
    cluster_id = os.environ.get("CLUSTER_ID")

    # Build the request URL
    url = f"https://api.spectrocloud.com/v1/spectroclusters/{cluster_id}/assets/kubeconfig?frp=true"

    # Define headers for the request
    headers = {
        "Accept": "application/octet-stream",
        "projectUid": project_id,
        "apiKey": api_key
    }

    try:
        # Send the HTTP request using the requests library
        response = requests.get(url, headers=headers)
        response.raise_for_status() # Raise an exception if the response code is not 2xx

        # Print the response content
        print(response.content.decode('utf-8'))
    except requests.exceptions.HTTPError as error:
        print(f"HTTP error {response.status_code}: {error}")
    except Exception as error:
        print(f"Error: {error}")

if __name__ == '__main__':
    main()
```

</TabItem>

<TabItem label="Rust" value="cluster-kubeconfig-rust">

```
use std::env;
use reqwest::header::{HeaderMap, HeaderValue};

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    // Get API key and project ID from environment variables
    let api_key = env::var("API_KEY").unwrap();
    let project_id = env::var("PROJECT_ID").unwrap();
    let cluster_id = env::var("CLUSTER_ID").unwrap();

    // Build the request URL
    let url = format!("https://api.spectrocloud.com/v1/spectroclusters/{}/assets/kubeconfig?frp=true", cluster_id);

    // Define headers for the request
    let mut headers = HeaderMap::new();
    headers.insert("Accept", HeaderValue::from_static("application/octet-stream"));
    headers.insert("projectUid", HeaderValue::from_str(&project_id).unwrap());
    headers.insert("apiKey", HeaderValue::from_str(&api_key).unwrap());

    // Send the HTTP request using the reqwest library
    let response = reqwest::Client::new()
        .get(&url)
        .headers(headers)
        .send()
        .await?;

    // Check the response status code
    if response.status().is_success() {
        // Print the response data (as a string)
        let content = response.text().await?;
        println!("{}", content);
    } else {
        // Print the error message if the request failed
        println!("Request failed with status code: {}", response.status());
    }

    Ok(())
}
```

</TabItem>

</Tabs>
