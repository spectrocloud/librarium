import React from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";
import moment from "moment";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  max-width: 1024px;
  margin: 30px auto 0;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 680px;
`;

const Card = styled.div`
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #F2F2F2;
`;

const Description = styled.div`
  font-size: 12px;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #bbb;
  margin-top: 5px;
`;

// TODO: To be added from graphql query
const mock = {
  "allMdx": {
    "edges": [
      {
        "node": {
          "fields": {
            "title": "cluster"
          },
          "excerpt": "Cluster lorem",
          "parent": {
            "name": "cluster",
            "modifiedTime": "2020-06-20T07:06:47.089Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "accent"
          },
          "excerpt": "accent accent",
          "parent": {
            "name": "accent",
            "modifiedTime": "2020-06-20T07:06:47.088Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "apple"
          },
          "excerpt": "apple apple",
          "parent": {
            "name": "apple",
            "modifiedTime": "2020-06-20T07:06:47.089Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "bundle"
          },
          "excerpt": "Bundle test",
          "parent": {
            "name": "bundle",
            "modifiedTime": "2020-06-20T07:06:47.089Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "API"
          },
          "excerpt": "API ipsum",
          "parent": {
            "name": "api",
            "modifiedTime": "2020-06-20T07:06:47.088Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "annotation"
          },
          "excerpt": "annotation annotation",
          "parent": {
            "name": "annotation",
            "modifiedTime": "2020-06-20T07:06:47.088Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Home"
          },
          "excerpt": "",
          "parent": {
            "name": "00-index",
            "modifiedTime": "2020-06-30T13:27:16.261Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Getting Started"
          },
          "excerpt": "Getting Started: Deploying your first cluster Deploying your first  cluster  should be a walk in the park. As an overview, Spectro Cloud…",
          "parent": {
            "name": "02-getting-started",
            "modifiedTime": "2020-06-24T08:12:26.809Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Introduction to Spectro Cloud"
          },
          "excerpt": "Welcome to Spectro Cloud! Welcome to Spectro Cloud. This is the documentation section where you should be able to find answers to most…",
          "parent": {
            "name": "01-introduction",
            "modifiedTime": "2020-06-24T08:12:26.785Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Cluster Profiles"
          },
          "excerpt": "Cluster Profiles Cluster profiles are like templates that are created with pre-configured layers/components needed for cluster deployments…",
          "parent": {
            "name": "03-cluster-profiles",
            "modifiedTime": "2020-06-22T08:01:00.041Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Pack Integrations"
          },
          "excerpt": "",
          "parent": {
            "name": "06-integrations",
            "modifiedTime": "2020-06-22T08:01:00.055Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "User management"
          },
          "excerpt": "User management This section touches upon the initial login aspects for tenant admins and non-admin users; and about RBAC setup within…",
          "parent": {
            "name": "08-user-management",
            "modifiedTime": "2020-06-24T08:12:26.840Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Projects"
          },
          "excerpt": "Projects A project helps to organize the cluster resources in a logical grouping. The resources which are created within a project are…",
          "parent": {
            "name": "07-projects",
            "modifiedTime": "2020-06-22T16:59:31.107Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Registries and packs"
          },
          "excerpt": "Packs Overview A pack is a collection of files such as manifests, helm charts, ansible roles, configuration files, etc. It is the building…",
          "parent": {
            "name": "09-registries-and-packs",
            "modifiedTime": "2020-06-24T08:12:26.841Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Release Notes"
          },
          "excerpt": "June 23, 2020 - Release 1.0 The following features are included as part of Spectro Cloud 1.0: Multi cluster deployment and lifecycle…",
          "parent": {
            "name": "12-release-notes",
            "modifiedTime": "2020-06-22T15:57:17.593Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Adding a custom registry"
          },
          "excerpt": "Adding custom registries Setting up a custom pack registry involves the installation of a registry server and configuring it with the tenant…",
          "parent": {
            "name": "1-adding-a-custom-registry",
            "modifiedTime": "2020-06-23T06:54:44.708Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Spectro Cloud CLI Tool"
          },
          "excerpt": "Overview The Spectro CLI is a command-line interface for the Spectro Registry server to upload or download the packs using commands. Pre…",
          "parent": {
            "name": "2-spectro-cli-reference",
            "modifiedTime": "2020-06-23T06:54:44.708Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Audit Logs"
          },
          "excerpt": "About Audit Logs The Spectro Cloud SaaS application captures audit logs to track the user interaction with the application resources along…",
          "parent": {
            "name": "10-audit-logs",
            "modifiedTime": "2020-06-22T08:01:00.073Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Adding a custom pack using helm charts"
          },
          "excerpt": "Add-on packs using helm charts An add-on pack defines deployment specifics of a Kubernetes application to be installed on a running…",
          "parent": {
            "name": "4-adding-custom-packs-using-helm-charts",
            "modifiedTime": "2020-06-23T06:54:44.709Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Adding a custom pack using manifests"
          },
          "excerpt": "Add-on packs using manifests Add-on packs can be built using Kubernetes manifests. These manifests contain deployment specifications for…",
          "parent": {
            "name": "5-add-custom-packs-manifests",
            "modifiedTime": "2020-06-23T06:54:44.710Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "CentOS"
          },
          "excerpt": "CentOS",
          "parent": {
            "name": "centos",
            "modifiedTime": "2020-06-22T08:01:00.056Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Calico"
          },
          "excerpt": "Overview Spectro Network Pack(s) helps provision resources for setting up Cluster networking in Kubernetes. Design goals for Kubernetes…",
          "parent": {
            "name": "calico",
            "modifiedTime": "2020-06-24T08:12:26.840Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Citrix IPAM"
          },
          "excerpt": "Citrix IPAM and Ingress controller The integration helps with IP address management and provides load balancing capabilities for external…",
          "parent": {
            "name": "citrix-ipam",
            "modifiedTime": "2020-06-22T08:01:00.056Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Falco"
          },
          "excerpt": "Falco The Falco integration is a behavioral activity monitor designed to detect anomalous activity in your applications. You can use Falco…",
          "parent": {
            "name": "falco",
            "modifiedTime": "2020-06-22T08:01:00.057Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Dex"
          },
          "excerpt": "Dex Dex is an identity service to drive authentication for Kubernetes API Server through the  OpenID Connect  plugin. Clients such as…",
          "parent": {
            "name": "dex",
            "modifiedTime": "2020-06-22T08:01:00.057Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Fluentbit"
          },
          "excerpt": "Fluentbit Fluent-Bit is a multi-platform log forwarder. The default integration will help forward logs from the Kubernetes cluster to an…",
          "parent": {
            "name": "fluentbit",
            "modifiedTime": "2020-06-22T08:01:00.058Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Kibana"
          },
          "excerpt": "Elasticsearch-Fluentd-Kibana The logging integration installs a production grade ElasticSearch cluster with Kibana and Fluentd by default on…",
          "parent": {
            "name": "kibana",
            "modifiedTime": "2020-06-22T08:01:00.058Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Istio"
          },
          "excerpt": "Istio Operator This Integration aims to automate and simplify rollout of the various Istio components which helps with service mesh use…",
          "parent": {
            "name": "istio",
            "modifiedTime": "2020-06-22T15:57:17.591Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Kubernetes Dashboard"
          },
          "excerpt": "Kubernetes Dashboard Kubernetes Dashboard  is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage…",
          "parent": {
            "name": "kubernetes-dashboard",
            "modifiedTime": "2020-06-22T08:01:00.060Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Kong"
          },
          "excerpt": "Kong Ingress Controller Kong integration is an  Ingress controller  responsible for fulfilling the Ingress, usually with a load balancer…",
          "parent": {
            "name": "kong",
            "modifiedTime": "2020-06-22T08:01:00.059Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Kubernetes"
          },
          "excerpt": "Kubernetes This pack defines the properties that will be used by Spectro Cloud to bring up the Kubernetes cluster. Most of the Kubernetes…",
          "parent": {
            "name": "kubernetes",
            "modifiedTime": "2020-06-22T08:01:00.060Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Kubevious"
          },
          "excerpt": "Kubevious Kubevious integration provides a graphical interface which renders easy to understand, application centric Kubernetes…",
          "parent": {
            "name": "kubevious",
            "modifiedTime": "2020-06-22T08:01:00.061Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "MetalLB"
          },
          "excerpt": "MetalLB MetalLB is a load-balancer implementation for bare metal  Kubernetes  clusters, using standard routing protocols. This integration…",
          "parent": {
            "name": "metallb",
            "modifiedTime": "2020-06-22T08:01:00.061Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Nginx"
          },
          "excerpt": "Nginx Ingress resource(s) in Kubernetes helps provide Service(s) externally-reachable URLs, load balance traffic, terminate SSL / TLS, and…",
          "parent": {
            "name": "nginx",
            "modifiedTime": "2020-06-22T08:01:00.063Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Permission Manager"
          },
          "excerpt": "Permission Manager This integration provides a graphical user interface for RBAC management in Kubernetes. You can create users, assign…",
          "parent": {
            "name": "permission-manager",
            "modifiedTime": "2020-06-22T08:01:00.063Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Prometheus Operator"
          },
          "excerpt": "Prometheus Operator The Prometheus Operator uses Kubernetes  custom resources  to simplify the deployment and configuration of Prometheus…",
          "parent": {
            "name": "prometheus-operator",
            "modifiedTime": "2020-06-22T08:01:00.064Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "CSI"
          },
          "excerpt": "Setup Spectro Storage Pack(s) helps provision StorageClasses on the Kubernetes infrastructure. StorageClasses in Kubernetes are essentially…",
          "parent": {
            "name": "storage-pack-csi",
            "modifiedTime": "2020-06-24T08:12:26.840Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Ubuntu"
          },
          "excerpt": "Ubuntu",
          "parent": {
            "name": "ubuntu",
            "modifiedTime": "2020-06-22T08:01:00.065Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Vault"
          },
          "excerpt": "Vault Vault  helps secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and…",
          "parent": {
            "name": "vault",
            "modifiedTime": "2020-06-22T08:01:00.066Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Creating Cluster Profiles"
          },
          "excerpt": "Creating Cluster Profiles Cluster profiles are created by configuring various layers of the Kubernetes Infrastructure stack. The following…",
          "parent": {
            "name": "1-task-define-profile",
            "modifiedTime": "2020-07-01T07:01:34.571Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Updating Cluster Profiles"
          },
          "excerpt": "Updating Cluster Profiles Cluster profiles are typically updated to change the configuration of various layers in a Kubernetes stack. Basic…",
          "parent": {
            "name": "2-task-update-profile",
            "modifiedTime": "2020-06-22T08:01:00.042Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Examples"
          },
          "excerpt": "Examples Cluster profiles can be built to launch clusters for specific use cases. Clusters launched for development purposes are typically…",
          "parent": {
            "name": "3-examples",
            "modifiedTime": "2020-06-24T08:12:26.811Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "AWS: Your First Cluster"
          },
          "excerpt": "Your First AWS Cluster The following steps will be taken to provision your first AWS cluster: Create Cluster Profile. Add AWS Cloud Account…",
          "parent": {
            "name": "1-aws-your-first-cluster",
            "modifiedTime": "2020-06-24T08:12:26.810Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Creating Azure Clusters"
          },
          "excerpt": "Overview Azure cluster resources are placed within an existing Resource Group, and nodes will be provisioned within a Virtual Network that…",
          "parent": {
            "name": "2-azure-clusters",
            "modifiedTime": "2020-06-29T07:49:45.748Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Azure: Your First Cluster"
          },
          "excerpt": "Your First Azure Cluster The following steps will be taken to provision your first Azure cluster: Create Cluster Profile. Add Azure Cloud…",
          "parent": {
            "name": "2-azure-your-first-cluster",
            "modifiedTime": "2020-06-24T08:12:26.810Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "VMware: Your First Cluster"
          },
          "excerpt": "VMWare Your First Cluster The following steps will be taken to provision your first VMware cluster: Create a Private Cloud Gateway. Create…",
          "parent": {
            "name": "3-vmware-your-first-cluster",
            "modifiedTime": "2020-06-24T08:12:26.810Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Concept Overviews"
          },
          "excerpt": "Concept Overviews This page gives a quick introduction to various concepts that constitute the unique selling proposition of Spectro Cloud…",
          "parent": {
            "name": "2-concept-overviews",
            "modifiedTime": "2020-06-24T08:12:26.785Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Clusters"
          },
          "excerpt": "Overview Kubernetes clusters in Spectro Cloud are instantiated from cluster profiles. A cluster definition in Spectro Cloud consists of a…",
          "parent": {
            "name": "04-clusters",
            "modifiedTime": "2020-06-22T15:57:17.589Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Adding a custom pack"
          },
          "excerpt": "Add custom packs Custom packs are built by users and deployed to custom registries using Spectro Cloud’s CLI tool. Steps to create a custom…",
          "parent": {
            "name": "3-add-custom-packs",
            "modifiedTime": "2020-06-23T06:54:44.708Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "SAML SSO Setup"
          },
          "excerpt": "SAML 2.0 Based SSO To setup IdP based SSO, log in to the Spectro Cloud console as the tenant admin. Access the tenant admin settings area by…",
          "parent": {
            "name": "1-saml-sso",
            "modifiedTime": "2020-06-24T08:12:26.841Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Creating AWS Clusters"
          },
          "excerpt": "Overview The following is the deployment architecture for an AWS cluster. The Kubernetes nodes are distributed across multiple AZs to…",
          "parent": {
            "name": "1-aws-clusters",
            "modifiedTime": "2020-06-23T06:54:44.706Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Creating VMware Clusters"
          },
          "excerpt": "Overview Spectro Cloud SaaS does not need direct access to the VMware environment. A Private Cloud Gateway needs to be setup within the…",
          "parent": {
            "name": "3-vmware-clusters",
            "modifiedTime": "2020-06-30T11:49:30.754Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Home"
          },
          "excerpt": "",
          "parent": {
            "name": "0-index",
            "modifiedTime": "2020-06-29T07:49:45.735Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Audit Logs"
          },
          "excerpt": "Audit Logs",
          "parent": {
            "name": "03-audits",
            "modifiedTime": "2020-06-24T08:12:26.777Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Authentication"
          },
          "excerpt": "Authentication",
          "parent": {
            "name": "01-auth",
            "modifiedTime": "2020-06-24T08:12:26.777Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Cloud Accounts"
          },
          "excerpt": "Cloud Accounts",
          "parent": {
            "name": "05-cloudaccounts",
            "modifiedTime": "2020-06-24T08:12:26.777Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Introduction"
          },
          "excerpt": "Spectro Cloud API Spectro Cloud API provides APIs for a subset of features. The Spectro Cloud APIs are based on REST APIs. The APIs can be…",
          "parent": {
            "name": "1-introduction",
            "modifiedTime": "2020-06-30T11:14:41.305Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Cloud Config"
          },
          "excerpt": "Cloud Config",
          "parent": {
            "name": "07-cloudconfig",
            "modifiedTime": "2020-06-24T08:12:26.778Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Clouds"
          },
          "excerpt": "Clouds",
          "parent": {
            "name": "09-clouds",
            "modifiedTime": "2020-06-24T08:12:26.778Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Clusters"
          },
          "excerpt": "Clusters",
          "parent": {
            "name": "10-clusters",
            "modifiedTime": "2020-06-24T08:12:26.778Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Cluster Profiles"
          },
          "excerpt": "Cluster Profiles",
          "parent": {
            "name": "11-clusterprofiles",
            "modifiedTime": "2020-06-24T08:12:26.779Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Dashboard"
          },
          "excerpt": "Dashboard",
          "parent": {
            "name": "15-dashboard",
            "modifiedTime": "2020-06-24T08:12:26.779Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Events"
          },
          "excerpt": "Events",
          "parent": {
            "name": "19-events",
            "modifiedTime": "2020-06-24T08:12:26.780Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Files"
          },
          "excerpt": "Files",
          "parent": {
            "name": "21-files",
            "modifiedTime": "2020-06-24T08:12:26.780Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Metrics"
          },
          "excerpt": "Metrics",
          "parent": {
            "name": "27-metrics",
            "modifiedTime": "2020-06-24T08:12:26.781Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Notifications"
          },
          "excerpt": "Notifications",
          "parent": {
            "name": "31-notifications",
            "modifiedTime": "2020-06-24T08:12:26.781Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Private Cloud Gateway"
          },
          "excerpt": "Private Cloud Gateway",
          "parent": {
            "name": "33-overlords",
            "modifiedTime": "2020-06-24T08:12:26.781Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Packs"
          },
          "excerpt": "Packs",
          "parent": {
            "name": "35-packs",
            "modifiedTime": "2020-06-24T08:12:26.781Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Projects"
          },
          "excerpt": "Projects",
          "parent": {
            "name": "39-projects",
            "modifiedTime": "2020-06-24T08:12:26.782Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Registries"
          },
          "excerpt": "Registries",
          "parent": {
            "name": "41-registries",
            "modifiedTime": "2020-06-24T08:12:26.782Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Roles"
          },
          "excerpt": "Roles",
          "parent": {
            "name": "43-roles",
            "modifiedTime": "2020-06-24T08:12:26.782Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Services"
          },
          "excerpt": "Services",
          "parent": {
            "name": "45-services",
            "modifiedTime": "2020-06-24T08:12:26.782Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Teams"
          },
          "excerpt": "Teams",
          "parent": {
            "name": "49-teams",
            "modifiedTime": "2020-06-24T08:12:26.782Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Tenants"
          },
          "excerpt": "Tenants",
          "parent": {
            "name": "51-tenants",
            "modifiedTime": "2020-06-24T08:12:26.783Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "Users"
          },
          "excerpt": "Users",
          "parent": {
            "name": "53-users",
            "modifiedTime": "2020-06-24T08:12:26.783Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "RBAC"
          },
          "excerpt": "RBAC RBAC stands for Role-Based Access Control. This is a method that allows for the same user to have a different type of access control…",
          "parent": {
            "name": "2-rbac",
            "modifiedTime": "2020-07-01T07:29:45.644Z"
          }
        }
      },
      {
        "node": {
          "fields": {
            "title": "What is Spectro Cloud?"
          },
          "excerpt": "What is Spectro Cloud? Spectro Cloud’s SaaS-based product brings the managed Kubernetes experience to users' own unique enterprise…",
          "parent": {
            "name": "1-what-is",
            "modifiedTime": "2020-07-01T07:31:33.772Z"
          }
        }
      }
    ]
  }
}

// const query = graphql`
// {
//   allMdx {
//     edges {
//       node {
//         fields {
//           title
//         }
//         excerpt
//         parent {
//           ... on File {
//             id
//             name
//             modifiedTime
//           }
//         }
//       }
//     }
//   }
// }
// `;

function DocUpdatesSection({ title }) {
  const lastChanges = [...mock.allMdx.edges].map(({ node }) => ({ ...node })).sort((node1, node2) => {
    const modifiedTime1 = moment(node1.parent.modifiedTime);
    const modifiedTime2 = moment(node2.parent.modifiedTime);
    return moment(modifiedTime2).diff(modifiedTime1);
  });

  lastChanges.splice(4, lastChanges.length - 4);

  return (
    <Wrapper>
      <h3>{title}</h3>
      <CardsWrapper>
        {lastChanges.map((doc) => (
          <Card>
            <h4>{doc.fields.title}</h4>
            <Description>{doc.excerpt}</Description>
            <Timestamp>{moment(doc.parent.modifiedTime).format("MMM DD YYYY")}</Timestamp>
          </Card>
        ))}
      </CardsWrapper>
    </Wrapper>
  )
}

export default DocUpdatesSection;
