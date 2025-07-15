---
sidebar_label: "Additional Capabilities"
title: "Additional Capabilities"
description: "Learn more about Palette's Additional Capabilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "tutorial"]
---

Palette offers a range of additional capabilities designed to enable its users to deploy, scale, and effectively manage
Kubernetes workloads across a wide variety of environments and deployment options.

This section introduces you to some of Palette's additional capabilities, which include:

- Supporting high-security requirements with our FIPS-validated [VerteX](./self-hosted.md#palette-vertex) edition.
- Self-hosting the Palette management plane in your own environment with
  [Self-Hosted Palette](./self-hosted.md#self-hosted-palette).
- Integrating virtual machine workloads into Kubernetes environments with [Virtual Machine Orchestrator](./vmo.md).

![A drawing of Palette with humans interacting](/getting-started/getting-started_additional-capabilities_palette.webp)

The concepts you learn about in the Getting Started section are centered around a fictional case study company,
Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

Spacetastic has been a Palette customer for a few months. In this time, they have become the leading astronomy education
platform. They want to keep pushing the limits of their platform and implement some innovative capabilities. To support
this growth, they will need to expand their team, infrastructure, and systems. They continue exploring the Getting
Started section to learn how they can grow with Palette and have a long-term relationship with Spectro Cloud.

> As we continue to grow, we need a more flexible infrastructure that can handle both our containerized applications and
> virtual machine-based services, as we have some legacy scientific tools that cannot be containerized," says Anya, the
> lead astrophysicist and the team's dreamer. "Supporting these tools while modernizing and scaling our platform is
> essential to bringing astronomy into everyone's home."
>
> Kai is in charge of scaling the Spacetastic platform. "That would be a challenge for us, Anya." they say.
>
> "You know, we might be able to make your dream happen!" says Wren, Founding Engineer. "Palette's Virtual Machine
> Orchestrator allows you to deploy, manage, and scale VM workloads side by side with containerized applications."
>
> "I can't believe my ears!" says Kai laughing. "Wren, our resident Palette skeptic, has well and truly embraced our new
> platform solution."
>
> Wren laughs and quickly responds. "Oh and one more thing! Palette VMO doesn't lock us into a single tech stack or
> cloud provider, so we can deploy our services in many locations."
>
> "With VMO, we'll be able to use VMs for sensitive workloads, ensuring that critical data is securely isolated. says
> Meera, Head of Cybersecurity, joining in. "We'll make your dream a reality and bring Spacetastic to everyone, Anya.
> The sky's the limit for us!"

## The Journey Continues

In this section, you get an overview of other parts of Palette not yet covered by your Getting Started journey so far.
Explore more through the following pages.

<SimpleCardGrid
  hideNumber="true"
  cards={[
    {
      title: "VerteX and Self-Hosted Palette",
      description: "Read about our dedicated Palette offerings, VerteX and Self-Hosted Palette.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/additional-capabilities/self-hosted",
    },
    {
      title: "Virtual Machine Orchestrator",
      description: "Learn about Palette's Virtual Machine Orchestrator (VMO) and its management capabilities.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/additional-capabilities/vmo",
    },
  ]}
/>
