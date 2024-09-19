---
sidebar_label: "Deploy a Cluster to AWS"
title: "Deploy a Cluster to Amazon Web Services (AWS)"
description: "Spectro Cloud Getting Started with AWS"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started", "aws"]
---

Palette supports integration with [Amazon Web Services](https://aws.amazon.com). You can deploy and manage
[Host Clusters](../../glossary-all.md#host-cluster) in AWS. The concepts you learn about in the Getting Started section
are centered around a fictional case study company. This approach gives you a solution focused approach, while
introducing you with Palette workflows and capabilities.

## Case Study

Spacetastic Ltd., our fictional example company, is on a mission to teach its users about space. They have assembled a
team of phycists and engineers who are passionate about astronomy and the universe. They are a start up that is gaining
popularity, as they expand their dashboards and grow their subscribers. Their small team has been in charge of
developing new features alongside scaling and maintaining their infrastructure, but they are dedicated to providing the
best astronomy education platform on Planet Earth.

> "I'm the resident space expert around here!" says Anya, Spacetastic's Lead Astrophycist, smiling with a glint in here
> eye. "My mission is to make astrophysics, the science of space, accessible to everyone."
>
> "I'm here to support you and your mission. I build all the dashboards, pages and features that bring your vast space
> knowledge to our users in a beautiful visual format!" says Wren, Founding Engineer at Spacetastic.
>
> Kai smiles and nods. "I work closely with both Wren and Anya. As Platform Engineer, I ensure that our platform is
> reliable and scalable for everyone around the world, and beyond!"
>
> Meera, Head of Cybersecurity, is the final member of the Spacetastic team. "Let's not forget about the security of our
> platform. I make sure that all our systems are designed and implemented with security in mind, the true SecDevOps
> way." she exclaims.

![Meet the Spacetastic team](/getting-started/getting-started_landing_meet-the-team.webp)

The team has deployed their services to a single cloud provider. They rely on Kubernetes for the reliability and
scalability of their systems. The team must ensure the systems are secure, patched regularly, scalable, and meet
reliability SLA of at least 99% uptime. The following diagram presents an overview of their systems.

![Spacetastic system diagram](/getting-started/getting-started_landing_spacetastic-systems.webp)

While the system architecture they have chosen was a great place to start, the team soon start to face common challenges
that many growing organisations face with Kubernetes.

> Wren hurriedly walks into the office, looking at his phone with a worried expression. "Users are reporting that our
> systems are down on social media! This must be related to the new feature we have just released." he says.
>
> Meera looks up from her monitor. "I've also received an alert about a new zero-day vulnerability. We need to patch our
> services without further downtime, as soon as you are able to stabilize our platform."
>
> "Team, we need to rethink our platform engineering tools. We need a solution that can help us scale and deploy with
> confidence, ultimately supporting the growth of our company." says Kai with a determined look in his eye.

![Kubernetes challenges](/getting-started/getting-started_landing_kubernetes-challenges.webp)

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to AWS by using Palette. Once
your cluster is deployed, you can update it using cluster profile updates.

<SimpleCardGrid
  cards={[
    {
      title: "Set up Palette with AWS",
      description: "Set up the prerequisites of using Palette with AWS.",
      buttonText: "Learn more",
      relativeURL: "./setup",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      relativeURL: "./create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster to AWS.",
      buttonText: "Learn more",
      relativeURL: "./deploy-k8s-cluster",
    },
    {
      title: "Deploy Cluster Profile Updates",
      description: "Update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      relativeURL: "./update-k8s-cluster",
    },
    {
      title: "Cluster Management with Terraform",
      description: "Deploy and update a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      relativeURL: "./deploy-manage-k8s-cluster-tf",
    },
    {
      title: "Scale, Upgrade, and Secure Clusters",
      description: "Learn how to scale, upgrade, and secure Palette host clusters deployed to AWS.",
      buttonText: "Learn more",
      relativeURL: "./scale-secure-cluster",
    },
  ]}
/>
