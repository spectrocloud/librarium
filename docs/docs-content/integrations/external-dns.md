---
sidebar_label: "ExternalDNS"
title: "External DNS"
description: "ExternalDNS pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["load balancers", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/external-dns/blobs/sha256:1bfd6dceb0b50efee4068cd6321511f6b24be86e2d613e0a8206e716ba7aea3f?type=image.webp"
tags: ["packs", "external-dns", "network"]
---

The integration helps configure public DNS servers with information about Kubernetes services to make them discoverable.

## Prerequisites

Providers have to be set up for this pack to get deployed and work seamlessly. For a list of supported providers and the
prerequisites to be set up, visit [providers](https://github.com/kubernetes-sigs/external-dns#status-of-providers)
section

## Versions Supported

<Tabs>

<TabItem label="0.12.x" value="0.12.x">

- **0.13.1**
- **0.12.2**

</TabItem>
<TabItem label="0.7.x" value="0.7.x">

- **0.7.2**

</TabItem>

</Tabs>

## Components

Integration deploys the following components:

- External DNS

## ExternalDNS for Services on AWS Route53 Example

### Setup prerequisites for AWS Route53

- Create the following IAM policy in the AWS account. This is needed for externalDNS to list and create Route53
  resources.

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

- Create an IAM role and associate the policy created above. Make a note of the role ARN which will be used in
  ExternalDNS deployment later
- Setup hosted zone in AWS Route53
  ```bash
  # Create a DNS zone through AWS CLI
  aws route53 create-hosted-zone --name "external-dns-test.my-org.com." --caller-reference "external-dns-test-$(date +%s)"
  ```

### Deploy ExternalDNS on the cluster

- Add ExternalDNS pack to the desired profile and deploy it to the cluster. You may want to configure the following in
  pack values.yaml

  - Configure AWS provider details (line #86)

    - Credentials, Zone Type
    - AssumeRoleArn with the Role ARN created above

  - Configure txtOwnerId with the ID of the hosted zone created above (line #366)
    ```bash
    aws route53 list-hosted-zones-by-name --output json --dns-name "external-dns-test.my-org.com." | jq -r '.HostedZones[0].Id'
    ```
  - Optionally change externalDNS policy and logLevel

### Deploy Ingress Controller on the cluster

- Deploy one of the Ingress Controller on the cluster

### Deploy Applications with Ingress on the cluster

- Add Prometheus-Operator addon to the same profile where ExternalDNS is added

  - Change serviceType to ClusterIP (line #408)
  - Enable Ingress for the add-on packs. In this example, let us use Prometheus-Operator integration. Ingress config for
    Grafana will look like the following:

    ```yaml
    #Ingress config
    ingress:
      ## If true, Grafana Ingress will be created
      ##
      enabled: true

      hosts:
        - grafana.external-dns-test.my-org.com

      ## Path for grafana ingress
      path: /
    ```

    When Prometheus-Operator gets deployed in the Cluster, Ingress resource for Grafana will also get created and will
    look like

    ```yaml
    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: grafana-ingress
      namespace: monitoring
    spec:
      rules:
        - host: grafana.external-dns-test.my-org.com
          http:
            paths:
              - backend:
                  serviceName: grafana
                  servicePort: 80
                path: /
    status:
      loadBalancer:
        ingress:
          - hostname: a9a2eadb64c8e4c2fb37a1f69afb0a30-330939473.us-west-2.elb.amazonaws.com
    ```

### Verify ExternalDNS (Ingress example)

- If all goes well, after 2 minutes, ExternalDNS would have inserted 2 records on your hosted zone

  ```bash
  aws route53 list-resource-record-sets --output json --hosted-zone-id "/hostedzone/ZEWFWZ4R16P7IB" \
      --query "ResourceRecordSets[?Name == 'grafana.external-dns-test.my-org.com.']|[?Type == 'A']"
  ```

- After which, if you access http://grafana.external-dns-test.my-org.com on your browser, you will be able to view the
  Grafana login page

### Troubleshooting

- Make sure Ingress resource gets created for the Applications deployed and a LoadBalancer hostname / IP address is set
  on the Ingress resource
- Check the `external-dns` pod for any issues with ExternalDNS not inserting records. If required, change `logLevel` to
  debug to see additional info on the logs

## References

- [External DNS Home](https://github.com/kubernetes-sigs/external-dns)
- [External DNS Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/external-dns)
