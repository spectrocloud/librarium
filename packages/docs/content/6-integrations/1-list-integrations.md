### Private Cloud Support

Spectro Cloud supports end to end lifecycle and management of Kubernetes Clusters in private cloud environments. Private cloud deployments look different from public cloud ones due to the need for a Spectro Cloud Gateway, an on-prem component to serve as a bridge to the Spectro Cloud SaaS.

The following sections describe various aspects pertaining to support for private cloud environments.

#### Supported Environments

vSphere versions XX+

<br>

#### Spectro Cloud Gateway

Spectro Cloud Gateway is Spectro Cloud's on-prem component to enable support for isolated private datacenre environments. The Spectro Cloud Gateway, once installed on-prem, registers itself with the Spectro Cloud's SaaS portal and enables secure communication between the SaaS portal and private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Spectro Cloud's SaaS portal.

The Spectro Cloud Gateway is itself a multi-node Kubernetes cluster, which is installed and set up from the Spectro Cloud SaaS portal like any other Kubernetes cluster managed by Spectro Cloud. This ensures serviceability and lifecycle management of this component that facilitates the installation of the Spectro Cloud Gateway. Once the gateway is installed, the Spectro Cloud Gateway installer VM can be safely powered down and deleted. Installation and configuration of the gateway involve actions on both the SaaS portal as well as the vSphere environment.

#### Architectural Highlights

- Spectro Cloud Gateway provides secure access into a private cloud environment from SaaS portal
- The Gateway watches for new cluster creation and deletion requests originating from the SaaS portal and bootstraps the process
- The Gateway makes relevant vSphere API calls for various orchestration tasks.
- Gateways are authenticated via a pairing code generated on the SaaS portal. The initial handshake after the authentication involves the exchange of keys to enable secure communication over an encrypted TLS channel.

#### Gateway Cloud Account

A new vSphere cloud account is auto-created using the vSphere credentials provided during the Gateway configuration. This account is used to retrieve the infrastructure properties like Datacenter names, Folder names, Network names, etc. This account is shared with all projects in this tenant for convenience so that it can be used for orchestrationn of tenant clusters. As of now, this is the default behaviour and there is no option to prevent this account from being shared.

#### Private Cloud Private Pack Registry

An instance of the Spectro Cloud Pack registry is installed on the Spectro Ckoud Gateway by default, and Spectro Cloud's SaaS portal is configured to regularly synchronize content with this registry. This registry can be used to host customized packs for operating systems, Kubernetes and other integrations that may not be available on Spectro Cloud's public registry by default. Packs from this registry can be combined with those from Spectro Cloud's public registry when constructing Cluster proiles. Spectro Cloud provides a simple CLI tool to manage pack content in this registry.