# Packs Layout

All Spectro Cloud Packs docs are expected to have the same look and feel. The text and voice must adhere to the Spectro
Cloud [style guide](https://github.com/rahulhazra97/Documentation-Guide/wiki/Spectro-Cloud-Style-Guide) for a universal
look and feel. The packs doc layout must also feel familiar to the reader and follow the layout standard described on
this page.

A Packs doc is no different than a regular documentation page, except that it includes supported versions and a
References section that links to external sources instead of a Resources section.

# Table of Contents

[Markdown Layout](#markdown-layout)

[Section Breakdown](#section-breakdown)

[Examples](#examples)

## Markdown Layout

The following is a high-level overview of the markdown structure that packs docs should contain. Note the markdown
heading sizes. Since there are several packs categories, headings in green may vary depending on the pack.

```
# Title


# Versions Supported

< Tabs for multiple versions >

< Bullet for single version >


For each version tab: Prerequisites, Parameters, Usage


## Prerequisites


## Parameters


## Usage


# Troubleshooting


# Terraform


# References

```

## Section Breakdown

<table>
<tr>
<td> Section </td> <td> Description </td>
</tr>
<tr> <!-- Title row -->
<td> Title </td>
<td>

A minimal feature overview. <br /> In pack docs with a Components section, remove the heading and include the components
list here. This is typically a list of resources and integration adds, deploys, or creates, such as a Controller,
Ingress or Egress Gateway, or UI. Only a few of the packs docs have this section.<br /> If a pack adds only one
resource, use a sentence to say what resource the pack adds.

</td>
</tr> <!-- End Title row -->
<tr> <!-- Versions Supported row -->
<td> Versions Supported </td>
<td>

Each numbered version tab has these headings:

- Prerequisites
- Parameters
- Usage
  <br /> If several versions are supported, list them in tabs with the latest version at left. Label tabs as follows
  with a **.x** extension. Do not list specific versions. For example:
  <br />
  ![image](https://github.com/rahulhazra97/Documentation-Guide/assets/126905240/496fc564-0eab-4b06-b614-deb681024a32)

</td>
</tr> <!-- End Versions Supported row -->
<tr> <!-- Prerequisites row -->
<td> Prerequisites </td>
<td>

List the required software version or hardware the user is required to have installed and available to integrate the
pack.

</td>
</tr> <!-- End Prerequisites row -->
<tr> <!-- Parameters row -->
<td> Parameters </td>
<td>

:warning: Most times, parameters will apply, but if they don’t, then omit this section. <br /> <br /> If applicable,
list and describe only the most commonly used parameters, especially if there are 10 or more that might apply. Include
an introductory sentence to clarify these are commonly used parameters: <br /> “The table lists the most commonly used
parameters you can configure when adding this pack.” <br /> <br /> If using a table to list parameters, include the
following columns: <br /> <br /> Columns: **Parameter**, **Description**. <br /> <br /> You may include a **Required**
column if the user must modify the parameter. A required column may not apply to all Packs. The same guidance required
applies to a column for the **Default** value of a parameter.

</td>
</tr> <!-- End Parameters row -->
<tr> <!-- Usage row -->
<td> Usage </td>
<td>

Describe the common use case and an example if applicable. Include any customization information that may apply. This
section should give the reader an idea of how to use the pack. This is separate from informing the user how to add the
pack.

</td>
</tr> <!-- End Usage row -->
<tr> <!-- Troubleshooting row -->
<td> Troubleshooting </td>
<td>

:warning: If no troubleshooting steps are available then omit this section. <br /> <br /> This section contains
troubleshooting steps pertaining to the respective Pack.

</td>
</tr> <!-- End Troubleshooting row -->
<tr> <!-- Terraform row -->
<td> Terraform </td>
<td>

^ Extra blank line above!

```terraform
    data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "spectro-proxy" {
  name    = "spectro-proxy"
  version = "1.2.0"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</td>
</tr> <!-- End Terraform row -->
<tr> <!-- Reference row -->
<td> Reference </td>
<td>

List at least one external source users can reference to learn more about the pack they are integrating. References must
be in standard MarkDown link format [_link_label_](_https://link_).

</td>
</tr>
</table>

## Examples

Use the following examples to better understand how to structure a Packs page.

- [Kubernetes](https://docs.spectrocloud.com/integrations/kubernetes) - No Defaults and Required column for parameters.
- [Prometheus Agent](https://docs.spectrocloud.com/integrations/prometheus-agent) - Only a single required parameter
- [Spectro Kubernetes Dashboard](https://docs.spectrocloud.com/integrations/spectro-k8s-dashboard) - Default values for
  parameters
