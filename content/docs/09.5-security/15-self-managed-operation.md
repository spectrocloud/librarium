---
title: "Self-Managed Operation"
metaTitle: "Self-Managed Operation"
metaDescription: "Self-Managed operation security"
icon: ""
hideToC: true
fullWidth: false
---

# Self-Managed Operation

In self-managed operation, where Palette is typically deployed on-prem behind the firewall, you must ensure security controls in your environment. Palette automatically generates security keys at installation and stores them in the management cluster. You can import an optional certificate and private key to match the management cluster fully qualified domain name (FQDN). Palette supports enabling disk encryption policies for management cluster VMs if required. 

In on-prem deployments, the OVA can operate in stand-alone mode for quick proof of concept (POC) or in enterprise mode, which launches a three-node HA cluster as the Spectro Cloud management cluster. The management cluster provides a browser-based web interface that allows you to set up a tenant and provision and manage tenant clusters. 

In deployments that require a proxy internet connection, both the private cloud gateway (PCG) component and the management agent support SOCKS5 or HTTPS proxy.

Spectro Cloud does not phone home or send telemetry or customer data back to the SaaS platform.
<br />
