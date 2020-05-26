### Pack Registry

Spectro Cloud provides multiple configuration options in a cluster profile for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These configuration options are provided in the form of *Packs*. A pack is a Spectro Cloud content package that decribes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artifacts required to deploy and manage that integration. For example, Spectro Cloud also provides packs for core layers of the Kubernetes stack; Operating Systems; Kubernetes distributions, Networking and Storage.

Spectro Cloud maintains a public registry containing various packs that can be used in any cluster profile. The pack content in this registry is constantly updated with new integrations. Optionally, a customer can host their own Private Pack Registry.

#### Pack Content

A pack is a zip archive that consists of a manifest file called `pack.json` that describes the pack and additional components such as Helm charts, manifests and Ansible roles.

#### Private Pack Registry

Spectro Cloud provides the ability to extend the capabilities of the platform. Additional pack registries can be set up with customized packs and synchronized with the Spectro Cloud SaaS, enabling clusters to be built using additional or more customized integrations beyond what's available out of the box. For private cloud environmnets such as VMWare, a private pack registry is automatically installed and configured with Spectro Cloud's SaaS.

#### Spectro CLI

Spectro Cloud provides a simple Command Line Utility to manage pack content in the registry. The CLI utility can be run on any Linux or MacOS based system that has connectivity to the registry server.

[Text](/introduction/what-is#organization)
