---
sidebar_label: "Set Up Kube-vip"
title: "Set Up Kube-vip"
description: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

You can use kube-vip to provide a virtual IP address for your cluster.

Using kube-vip, you can expose services inside your cluster externally with a virtual IP address even if you do not have control over your host's network. kube-vip can also act as a load balancer for both your control plane and Kubernetes services of type `LoadBalancer`.

