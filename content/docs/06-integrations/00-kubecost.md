---
title: 'Kubecost'
metaTitle: 'Kubecost'
metaDescription: 'Kubecost provides real-time cost visibility and insights for teams using Kubernetes.'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['monitoring']
logoUrl: 'https://blog.kubecost.com/assets/images/kubecost_logo@2x.png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Kubecost

Kubecost provides real-time cost visibility and insights for teams using Kubernetes.

We uncover patterns that create overspending on infrastructure and help teams prioritize where to focus optimization efforts. By identifying root causes for negative patterns, customers using Kubecost save 30-50% or more of their Kubernetes cloud infrastructure costs. Today, Kubecost empowers more than 2,000 teams across companies of all sizes to monitor and reduce costs, while balancing cost, performance, and reliability.

Kubecost is tightly integrated with the open-source cloud-native ecosystem and built for engineers and developers first, making it easy to drive adoption within your organization. Our Spectro Cloud integration makes it a breeze to see and understand your cloud costs in a single pane of glass with actionable insights.

## Key Features
- Unified Cost Monitoring: External costs can be shared and then attributed to any Kubernetes concept for a comprehensive view of spend.

- Optimization Insights: Receive dynamic recommendations for reducing spend without sacrificing performance

- Alerts & Governance: Quickly catch cost overruns and infrastructure outage risks before they become a problem with real-time notifications

## Key Benefits
- Cost Allocation: Breakdown costs by any Kubernetes concepts, including deployment, service, namespace label, and more. View costs across multiple clusters in a single view or via a single API endpoint

- Right Size Your Environment: Avoid under or over-provisioning resources to your environment. This will ensure your Kubernetes deployment is cost-effective and meets the requirements for your application to run and scale as needed.

- Know What to Expect: With continuous monitoring, Kubecost can notify you when anomalies are detected, giving you the ability to take action and not have any surprise bills.

# Versions Supported

**v1.102.2**

# Prerequisites

* If your cluster is version 1.23 or later, you must have the [Amazon EBS CSI driver](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) installed on your cluster.

# Parameters

The Kubecost pack supports all the parameters exposed by the Kubecost Helm Chart. Refer to the [Kubecost Helm Chart](https://github.com/kubecost/cost-analyzer-helm-chart) documentation for details.

# Usage

The Kubecost pack works out-of-the-box and tou can optionally configure the pack values.yaml for your setup. Add the Kubecost pack to a cluster profile to get started with Kubecost. You can create a new cluster profile that has the Kubecost as an add-on pack or you can [update an existing cluster profile](/cluster-profiles/task-update-profile) by adding the Kubecost pack.


Once Kubecost is installed and exposed. You can now start monitoring your Amazon EKS cluster cost and efficiency. Depending on your organization’s requirements and set up, you may have different options to expose Kubecost for internal access. You can check Kubecost documentation for [Ingress Examples](ingress-examples.md) as a reference for using Nginx ingress controller with basic auth.


Learn more about how to use Kubecost at [Getting Started](https://docs.kubecost.com/install-and-configure/install/getting-started)


# References

- [Kubecost documentation](https://docs.kubecost.com/)


- [Kubecost Helm Chart](https://github.com/kubecost/cost-analyzer-helm-chart) 


- [Contact us](https://docs.kubecost.com/other-resources/contactus)
