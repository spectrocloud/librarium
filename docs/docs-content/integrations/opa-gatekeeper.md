---
sidebar_label: 'OpenPolicyAgent'
title: 'Open Policy Agent'
description: 'OpenPolicyAgent security pack in Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['security', 'amd64', 'arm64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.dev.spectrocloud.com/v1/open-policy-agent/blobs/sha256:fcbad202dc9ca5e7a756562d8f9fc180ee77474034447dabc302d8a5a2bbe148?type=image/png" alt="OpenPolicyAgent logo'
tags: ['packs', 'open-policy-agent', 'security']
---


Palette users can leverage the **Open Policy Agent (OPA) Gatekeeper** to strengthen the security administration of Kubernetes environment. The major motivation behind the deployment is admission customization via configurations without code. Gatekeeper provides an admission control system based on policies or rules implemented through parameterized and admin configurable constraints. Palette supports **Gatekeeper v3.0**.

The major features of OPA are:

* **Validating Admission Control**
* **Policies and Constraints**
  * **Sample Policies**:
    * All namespaces must have a label that lists a point-of-contact.
    * All pods must have an upper bound for resource usage.
    * All images must be from an approved repository.
    * Services must all have globally unique selectors.
  * **Constraint Properties**
    * AND-ed together
    * Schema validation
    * Selection semantics
* **Audit**: The periodical evaluation of resources against constraints.
* **Data Replication**: Constraints to be compared against other objects in the cluster.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="3.9.x" value="3.9.x">

* **3.11.0**
* **3.9.0**

</TabItem>


<TabItem label="3.7.x" value="3.7.x">

**3.7.0**

</TabItem>

<TabItem label="3.6.x" value="3.6.x">

**3.6.0**

</TabItem>

<TabItem label="3.5.x" value="3.5.x">

**3.5.1**

</TabItem>

</Tabs>

## References

- [Open Policy Agent Documentation](https://open-policy-agent.github.io/gatekeeper/website/docs)

- [Open Policy Agent GitHub](https://github.com/open-policy-agent/gatekeeper)


