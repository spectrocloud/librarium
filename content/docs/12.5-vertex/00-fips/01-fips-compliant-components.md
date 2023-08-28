---
title: "FIPS-Compliant Components"
metaTitle: "FIPS-Compliant Components"
metaDescription: "Learn about FIPS-Component Components supported by Palette VerteX."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Federal Information Processing Standards (FIPS) is a series of standards developed by the National Institute of Standards and Technology (NIST) in the United States for computer security and encryption algorithms. 

FIPS 140-2 is a specific standard for security requirements for cryptographic modules. It outlines the criteria these modules must meet to ensure their security and integrity. 


## FIPS Support in Clusters

Palette VerteX provides FIPS-compliant infrastructure components in Kubernetes clusters it deploys. These components are:
    
<br />

- Operating System (OS) 
  - Ubuntu Pro


- Kubernetes
  - Palette eXtended Kubernetes (PXK) 
  - Palette eXtended Kubernetes - Edge (PXK-E)


- Container Network Interface (CNI) 
  - Calico


- Container Storage Interface (CSI)
  - vSphere CSI


## Management Plane

All services in the management plane are FIPS compiled with Go using [BoringCrypto libraries](https://pkg.go.dev/crypto/internal/boring) and static linking. Refer to the [Spectro Cloud Cryptographic Module](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4349) to learn more.


## Kubernetes

Refer to the [Palette eXtended Kubernetes (PXK)](/integrations/kubernetes) and [Palette eXtended Kubernetes-Edge (PXK-E)](/integrations/kubernetes-edge)  to learn about these security-hardened packs.

<!-- <br />

- Helm
- Open Container Initiative (OCI) Registry As Storage (ORAS)
- DevSpace open-source developer tool for Kubernetes
- Kubectl command line tool
- Kustomize to enable customizing YAML files
- Amazon Web Services (AWS) IAM Authenticator
- etcd -->



<br />

<br />


