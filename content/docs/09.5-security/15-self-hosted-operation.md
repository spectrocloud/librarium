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

In self-hosted operation, where Palette is typically deployed on-prem behind a firewall, you must ensure security controls in your environment. Palette automatically generates security keys at installation and stores them in the management cluster. You can import an optional certificate and private key to match the management cluster Fully Qualified Domain Name (FQDN). Palette supports enabling disk encryption policies for management cluster virtual machines (VMs) if required. 

In on-prem deployments, the OVA can operate in stand-alone mode for quick Proof of Concept (POC) or in enterprise mode, which launches a three-node High Availability (HA) cluster as the Palette management cluster. The management cluster provides a browser-based web interface that allows you to set up a tenant and provision and manage tenant clusters. 

In deployments that require a proxy internet connection, both the Private Cloud Gateway (PCG) component and the management agent support Socks5 or HTTPS proxy.

Palette does not phone home or send telemetry or customer data back to the SaaS platform.

<br />

# Resources

[SaaS Operation](/security/saas-operation)

<br />

<br />

<br />

<br />

