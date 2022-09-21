---
title: "Palette with Terraform Tutorial"
metaTitle: "Get started with Terraform and Palette"
metaDescription: "Steps to Terraform and Palette Tutorial"
icon: ""
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Get Started with Palette and Terraform

This tutorial is based on the Terraform source code available at: [spectro-terraform-kubeflow](https://github.com/spectrocloud/plg-track/tree/main/spectro-terraform-kubeflow). It assumes that you have working knowledge of Terraform and have some understanding how clusters work in Palette.

By the time you complete this tutorial, you will have done the following:

1. Deploy a cluster via Spectro Cloud Terraform provider on Amazon Elastic Kubernetes Service (EKS) with an infrastructure profile. <p></p><br />
2. Modify a cluster profile to include add-ons and deploy. <p></p><br />
3. Clean up by destroying the cluster. <p></p><br />

# Tutorial Objectives
1. Use Terraform to create a Cluster Profile. <p></p><br />
1. Use Terraform to build and destroy a Cluster in Palette.

# Prerequisites
To create a cluster on Palette, the following information is required:<p></p><br />
- [AWS account](https://aws.amazon.com/free) and [credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html) (Access key ID, secret key) <p></p><br />
- [Spectro API Key](/user-management/user-authentication#creatinganapikeyasatenantadmin) (can be retrieved on Palette: Administration/Tenant Settings/API Keys) <p></p><br />
- Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) ≥ 1.0.x <p></p><br />
- [Spectro Cloud Palette v2.7+](https://docs.spectrocloud.com/getting-started) <p></p><br />


# Terraform Configuration File

The configuration file contains three sections: Provider, Variable, and Modules.

## Providers

Terraform-required providers are defined in the `provider.tf ` file. The Spectro Cloud provider is configured with credentials, host, and project name as illustrated below:<p></p><br />

```terraform
terraform {
  required_providers {
    random = {
      source = "hashicorp/random"
      version = "3.1.0"
    }
    local = {
      source = "hashicorp/local"
      version = "2.1.0"
    }
    null = {
      source = "hashicorp/null"
      version = "3.1.0"
    }
    spectrocloud = {
      source = "spectrocloud/spectrocloud"
      version = "0.6.1-pre"
    }
  }
  required_version = ">= 0.14.9"
}

provider "spectrocloud"   {
    # Configuration options
    host         = var.spectro_host
    api_key      = var.spectro_api_key
    project_name = vars.spectro_project_name
}
```

  <p></p><br />

## Variables

  You can have multiple environment variables. Each environment has its variables defined in a file within the `./tfvars` directory. <p></p><br />

  ```terraform
  aws_access_key = "To fill"
  aws_secret_key = "To fill"

  spectro_host          = "api.spectro.com"
  spectro_api_key       = "To fill"
  spectro_project_name  = "Default"

  cluster_name            = "my-test-cluster"
  cluster_profile         = "eks-profile"
  cluster_profile_cloud   = "eks"

  aws_region              = "us-east-1"
  worker_nodes_count      = "5"
  worker_instance_type    = "t3.large"
  worker_disk_size        = "30"
  aws_ssh_key_name        = "To fill"
  ```

  In the example above, we define in the `dev.tfvars` file variables for a development environment. It contains credentials and cluster specifications such as number of worker nodes and instance type, and so on.

  **Note**: A key pair must be created in the desired AWS region.<p></p><br />

## Modules

  In the `main.tf` file, three submodules are called to create resources on Palette:<p></p><br />

  * **Cloud Accoun**t: It creates and configures the AWS account on Palette using access key id and secret key, it's required for next steps. <p></p><br />

  ```terraform
  resource "spectrocloud_cloudaccount_aws" "aws-1" {
    name =  "aws-1"
    aws_access_key = var.aws_access_key
    aws_secret_key = var.aws_secret_key
  }

  terraform {
    required_providers {
    spectrocloud = {
      source = "spectrocloud/spectrocloud"
      version = "0.6.1-pre"
      }
    }
  }
  ```
<br />

  * **Cluster Profile**: It encapsulates the Kubernetes cluster configuration.

  Palette uses packs to define layers like OS, CNI plugins, K8s version and storage interface. These packs are retrieved as data sources on Terraform.

  A Cluster Profile is defined by a set of packs. In the example below, the type is _cluster_, because it's a configuration of a Kubernetes cluster. <p></p><br />

  ```terraform
  data "spectrocloud_pack" "amazon-linux-eks" {
    name    = "amazon-linux-eks"
    version = "1.0.0"
  }

  data "spectrocloud_pack" "cni" {
    name    = "cni-aws-vpc-eks"
    version = "1.0"
  }

  data "spectrocloud_pack" "k8s" {
    name    = "kubernetes-eks"
    version = "1.2.1"
  }

  data "spectrocloud_pack" "csi" {
    name    = "csi-aws"
    # version = "1.0.0"
  }
  ```

  ```terraform
  resource "spectrocloud_cluster_profile" "profile" {
    name  = var.cluster_profile
    cloud = var.cluster_profile_cloud
    type  = "cluster"

  pack {
    name = data.spectrocloud_pack.amazon-linux-eks.name
    tag = "1.0.0"
    uid = data.spectrocloud_pack.amazon-linux-eks.id
  }

  pack {
    name = data.spectrocloud_pack.k8s.name
    tag = "1.21.x"
    uid = data.spectrocloud_pack.k8s.id
  }
  pack {
    name = "cni-aws-vpc-eks"
    tag = "1.0"
    uid = data.spectrocloud_pack.cni.id
  }

  pack {
    name = "csi-aws"
    tag = "1.0.0"
    uid = data.spectrocloud_pack.csi.id
  }
  ```
<p></p><br />

  * **Add-on Packs** - On the other hand, a cluster profile of type _add-on_ is used to template application configurations, such as Kubeflow.  See this example below.

    <br />

  ```terraform
  data "spectrocloud_pack" "kubeflow" {
    name    = "kubeflow"
    version = "1.2.0"
  }

  resource "spectrocloud_cluster_profile" "addon-profile" {
    name        = "kubeflow"
    description = "Kubeflow"
    type        = "add-on"

    pack {
      name   = data.spectrocloud_pack.kubeflow.name
      tag    = data.spectrocloud_pack.kubeflow.name
      uid    = data.spectrocloud_pack.amazon-linux-eks.id
      values = data.spectrocloud_pack.kubeflow.values
    }
  }
  ```

# Building the Infrastructure

All dependencies between the three submodules are managed in the `main.tf` file automatically by Terraform. It creates a Cloud Account first, then the Cluster Profile, and finally, the Cluster.<p></p><br />

### Deploy the Cluster
To provision all resources with Terraform, execute the following commands:<p></p><br />

1. Initialize the backend and download the required providers and plugins.<p></p><br />

  ```
  # terraform init
  ```
  Terraform automatically downloads all used providers and its dependencies.

  ![terraform](/tf-finished-installing.png "Terraform Initialized")

  ![tf-initializing](/tf-initializing.png "Terraform Initializing")

2. Apply the Terraform code to provision resources. We provide an environment variables file.<p></p><br />

  ```
  terraform apply -var-file tfvars/dev.tfvars
  ```

  Terraform will describe the desired resources state. There are three types of provisioning:<p></p><br />
   * **Add** - A new resource will be created.<p></p><br />
   * **Change** - An existing resource will be updated, one or more attributes will be modified.<p></p><br />
   * **Destroy** - A resource will be deleted.<p></p><br />

  ![tf-apply](/tf-apply.png "Applying the code ")<p></p><br />

1. Type _yes_ to confirm the provisioning plan. Provisioning all resources might take several minutes.

  ![tf-provision-plan](/tf-provision-plan.png "Terraform Provisioning")<p></p><br />

2. Once completed, log in to Palette to view the newly created cluster.<p></p><br />

  ![provisioned-cluster](/tf-provisioned-cluster.png "Sampled of Provisioned Cluster")<p></p><br />

3. Update the Terraform code to provision an add-on to install Kubeflow on your cluster.<p></p><br />

  ![tf-newly-created](/newly-created-cluster.png "Newly Created Terraform")<p></p><br />

### Modify the Cluster 

1. Run the _terraform apply_ command again to detect the change in the desired infrastructure state.<p></p><br />

  ![tf-apply](/tf-apply.png "Terraform Apply")<p></p><br />

2. Type _yes_ to create the add-on. Terraform will only create missing resources.<p></p><br />

  ![create-missing-resources](/tf-create-missing-resources.png "Create Missing Resources")<p></p><br />

3. Verify that Kubeflow is successfully added to the cluster on Palette.<p></p><br />

  ![tf-kubeflow](/tf-kubeflow.png "Terraform Kubeflow")<p></p><br />

### Clean Your Lab

Finally, you can easily tear down all resources and quickly clean up your lab. To destroy resources with Terraform, run the following command:

   `terraform destroy -var-file tfvars/dev.tfvars` <p></p><br />

1. Type _yes_ to confirm that you want to destroy all resources.<p></p><br />

  ![destroy-complete](/tf-destroy-complete.png "Destroy Completed")<p></p><br />

2. Once confirmed, Terraform destroys all resources present in the state file.<p></p><br />

  ![tf-destroy-complete](/tf-destroy.png "Terraform Destroy Complete")<p></p><br />

3.  Your resources in Palette are cleared.<p></p><br />

# Conclusion

With this quick introduction, you deployed a cluster via the Spectro Cloud Terraform provider on Amazon Elastic Kubernetes. You also modified the cluster and added some packs. Go ahead and try adding and removing other packs. 

Don't forget to clean you lab when you're done!