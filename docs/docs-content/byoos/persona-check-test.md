---
sidebar_label: "Persona Check Test Page"
title: "Persona Check Test Page"
description: "Temporary page used to exercise the persona-check GitHub Action (DOC-2473)."
hide_table_of_contents: false
sidebar_position: 99
sidebar_custom_props:
  icon: "person-walking-luggage"
tags: ["operating system", "byoos", "test"]
---

{/* PERSONA-CHECK-TEST: temporary file, remove before merge (DOC-2473) */}

This page is fictional content created to test the persona-check workflow. It describes a made-up
feature called the **OS Image Cache** so that an LLM persona has enough material to review. None of
the steps below are real, and the page can be deleted before this pull request merges.

The OS Image Cache stores frequently used operating system images closer to your cluster nodes. When
a node provisions, it pulls the image from the local cache instead of the upstream registry, which
reduces provisioning time and network egress.

## Prerequisites

- A Palette tenant with administrator access.
- At least one registered edge host or cloud account.
- A custom operating system image already uploaded to Palette.

## Enable the OS Image Cache

1. Log in to Palette and switch to the **Tenant Admin** scope.

2. From the left main menu, select **Settings**, and then select **OS Image Cache**.

3. Select **Enable Cache** and provide a cache size in gigabytes. The recommended size is 50 GB.

4. Choose the regions where the cache should replicate. Each region maintains an independent copy.

5. Select **Save** to apply the configuration.

## Validate the cache

After you enable the cache, provision a new cluster and confirm that nodes report a cache hit. You can
verify the behavior in two ways:

- Open the cluster **Events** tab and look for an `image-cache-hit` event during node provisioning.
- Run `palettectl cache status` from a connected host to view the current hit ratio and stored images.

If nodes continue to pull images from the upstream registry, confirm that the cache has finished its
initial replication. Replication can take up to 30 minutes for large images.

## Resources

- The OS Image Cache is fictional and exists only to test automated documentation review.
