---
title: "Image Swap"
metaTitle: "Image Swap"
metaDescription: "Learn how to swap out images and registries through the image swamp webkhook exposed by Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette supports swapping out images and registries at the Kubernetes layer. Palette uses the *ImageSwap* webhook that is exposed by the [ImageSwap Mutating Admission Controller for Kubernetes](https://github.com/phenixblue/imageswap-webhook/blob/master/README.md). You can use this feature to override a specific number of container image registries or particular images. The following are a few common use cases the image swamp feature is a good fit. <br /> <br />

- Avoid rate limit issues encountered with public images by pointing to an alternate image registry that caches public images. This is more common in an Enterprise setting.


- Changing the URL of a container registry, whether internal or external.


- Support air-gapped environments by redirecting public image requests to an internal registry.
 

 To use the image swap, specify an image swap configuration in the Kubernetes's pack YAML. 

 <br />

 ```yaml
 imageSwap:
    imageChange: |-
        default:
        # your custom configuration goes here
 ```


 You can add the `imageSwap` section during the cluster profile creation process or at the cluster deployment. You can customize the image swap functionality in multiple ways. We recommend you review the official [Image Swap configuration](https://github.com/phenixblue/imageswap-webhook/blob/master/README.md#configuration) documentation to learn more. To help you get started, the following are some common configuration patterns.

  <br />

  <InfoBox>

  The `default::`entry specifies the default configuration for all images. The `::` delimiter is used to separate different elements of the configuration.

  </InfoBox>

 # Configuration Examples

 ### Override a Specific Registry

 Disable image swapping for all registries except `example.private.io`. All image requests for `example.private.io` will be swapped for `harbor.internal.example.com`.

 <br />

 ```yaml
imageSwap:
  imageChange: |-
      default::
      example.private.io::harbor.internal.example.com
 ```

### Apply a Global Swap with an Exception

Enable image swapping for all registries except `example.private.io`. All image requests for `example.private.io` will not get swapped. All other image requests will get swapped to `harbor.internal.example.com`.

<br />

```yaml
imageSwap:
  imageChange: |-
    default::harbor.internal.example.com
    example.private.io::
```

### Swap a Specific Image

Swamp out a specific image. The image `example.private.io/demo:v1.0.0` will be swapped with `gcr.io/google-samples/hello-app:1.0`. The syntax format is `[EXACT]<source-image>::<target-image>`.

<br />


```yaml
imageSwap:
  imageChange: |-
    default::
    [EXACT]example.private.io/demo:v1.0.0::gcr.io/google-samples/hello-app:1.0
```


### Replace Image Path


Replace an image path with a custom registry. All image requests that start with `ghcr.io/example*` will get swamped with `example.private.io`.

<br />


```yaml
imageSwap:
  imageChange: |-
    default::
    [REPLACE]ghcr.io/example*::example.private.io
```    

The examples provided are intended to help you get started. Refer to the official [Image Swap configuration](https://github.com/phenixblue/imageswap-webhook/blob/master/README.md#configuration) for more examples and information.


# Image Swap with Palette

Use the following steps to learn how you can use the image swap functionality in Palette.

# Prerequisites

* Kubernetes 1.19.0 or greater.


* Palette v3.4.0 or greater.


# Swap Image

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Profiles**.


3. 


# Validation

<br />