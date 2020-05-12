### Clusters

Kubernetes clusters are collections of master and worker nodes that cooperate to execute workloads.

Within a project, *Clusters* are where you provision and manage Kubernetes clusters. The clusters are provisioned and managed in your own cloud account environment. Each cluster is provisioned from a template called a 'cluster profile.'

#### Cluster Profiles

Spectro Cloud provides flexibility for organizations to roll and maintain their own Kubernetes infrastructure stacks, whether for distinct organizations or for distinct use cases. A Kubernetes infrastructure stack is composed of layers that are combined into cluster construction templates called 'cluster profiles'. The layers in a Cluster Profile include base operating system, Kubernetes, network, storage, security and other infrastruture components such as logging, monitoring, load balancing, and others. For each layer, Spectro Cloud provides multiple out-of-the-box options and versions - but users can bring their own implementations and content.

The diagram below shows several examples of cluster profiles, each defining an infrastructure stack for a specific use case:

![Image](https://www.spectrocloud.com/static/spectrocloud.com_1-447ecbf5b54c6029bcb8e2e70185cc0d.png)