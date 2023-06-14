---
title: "Self-Hosted Operation"
metaTitle: "Self-Hosted Operation"
metaDescription: "Learn about Palette security in a self-Hosted environment."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Self-Hosted Operation

In [self-hosted operation](/enterprise-version), where Palette is typically deployed on-prem behind a firewall, you must ensure your environment has security controls. Palette automatically generates security keys at installation and stores them in the management cluster. You can import an optional certificate and private key to match the Fully Qualified Domain Name (FQDN) management cluster. Palette supports enabling disk encryption policies for management cluster virtual machines (VMs) if required.

In self-hosted deployments, the Open Virtualization Appliance (OVA) can operate in stand-alone mode for quick Proof of Concept (POC) or in enterprise mode, which launches a three-node High Availability (HA) cluster as the Palette management cluster. The management cluster provides a browser-based web interface that allows you to set up a tenant and provision and manage tenant clusters. You can also deploy Palette to a Kubernetes cluster by using the Palette Helm Chart. Refer to the [Install Using Helm Chart](/enterprise-version/deploying-palette-with-helm) guide to learn more.


The following points apply to self-hosted deployments:

* In deployments that require a proxy internet connection, both the Private Cloud Gateway (PCG) component and the management agent support SOCKS5 or HTTPS proxy.

* Customers manage their own SSH public keys unless an agreement is in place for Spectro Cloud to maintain their environment.

* Self-hosted Palette does not connect to Palette SaaS or send telemetry or customer data back to the Palette SaaS platform.



<br />

# Resources

[SaaS Operation](/security/product-architecture/saas-operation)

<br />

<br />

<br />

<br />

