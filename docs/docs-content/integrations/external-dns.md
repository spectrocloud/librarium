---
sidebar_label: "ExternalDNS"
title: "External DNS"
description: "ExternalDNS pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["load balancers", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "external-dns", "network"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="0.12.x" value="0.12.x">

### AWS Route53

To use ExternalDNS with AWS Route53, you need to create an IAM policy and role with the following permissions.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["route53:ChangeResourceRecordSets"],
      "Resource": ["arn:aws:route53:::hostedzone/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["route53:ListHostedZones", "route53:ListResourceRecordSets"],
      "Resource": ["*"]
    }
  ]
}
```

You also need to meet the following prerequisites:

- Create an IAM role and associate the policy created above. Make a note of the role ARN which will be used in
  ExternalDNS deployment later

- Setup hosted zone in AWS Route53. Use the following command to create a hosted zone in Route53 using the AWS CLI.

  ```bash
  aws route53 create-hosted-zone --name "external-dns-test.my-org.com." --caller-reference "external-dns-test-$(date +%s)"
  ```

</TabItem>
<TabItem label="0.7.x" value="0.7.x">

### AWS Route53

To use ExternalDNS with AWS Route53, you need to create an IAM policy and role with the following permissions.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["route53:ChangeResourceRecordSets"],
      "Resource": ["arn:aws:route53:::hostedzone/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["route53:ListHostedZones", "route53:ListResourceRecordSets"],
      "Resource": ["*"]
    }
  ]
}
```

You also need to meet the following prerequisites:

- Create an IAM role and associate the policy created above. Make a note of the role ARN which will be used in
  ExternalDNS deployment later

- Setup hosted zone in AWS Route53. Use the following command to create a hosted zone in Route53 using the AWS CLI.

  ```bash
  aws route53 create-hosted-zone --name "external-dns-test.my-org.com." --caller-reference "external-dns-test-$(date +%s)"
  ```

</TabItem>

</Tabs>

### Troubleshooting

- Make sure an _Ingress_ resource gets created for the applications deployed and a _LoadBalancer_ hostname or IP address
  is set on the Ingress resource

- Check the `external-dns` pod for any issues with ExternalDNS not inserting records. If required, change `logLevel` to
  debug to see additional info on the logs

## Terraform

You can reference the External DNS pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "palette_registry" {
  name = "Palette Registry"
}

data "spectrocloud_pack" "external-dns" {
  name         = "external-dns"
  version      = "0.13.6
  registry_uid = data.spectrocloud_registry.palette_registry.id
}
```
