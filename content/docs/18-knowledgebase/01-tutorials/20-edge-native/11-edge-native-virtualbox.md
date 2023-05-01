---
title: "Getting Started with Edge Native on Virtual Box"
metaTitle: "Edge Native - Virtual Box"
metaDescription: "Learn how to get started with edge native on virtual box."
icon: "nodes"
category: ["how-to"]
hideToC: false
fullWidth: false
---

# Edge Native on VirtualBox

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

## Prerequisites

**Installed Software**  
[VirtualBox](https://www.virtualbox.org/wiki/Downloads)  

**Network Requirements**
1 Free Additional IP Address on the same subnet as your desktop  
DHCP Enabled

**Hardware Requirements**  
Enough capacity to support:

* 2vCPU  
* 4GB Memory  
* 50GB HD (this will not all be allocated)

**This Tutorial was written using the following versions:**

VirtualBox 7.0  
Virtual Machine Resources (x86 ONLY)

* 2vCPU  
* 4GB Memory  
* 50GB HD (this will not all be allocated)  

Completion of the [Building Edge Native Artifacts How To](/knowledgebase/how-to/edge-native/edgeforge)

* **This is a prerequisite as it creates the provider and installer images used in this tutorial.**

## Build the VirtualBox VM

1. Get installer ISO

* Download the installer ISO that ws created in the [Building Edge Native Artifacts](/knowledgebase/how-to/edge-native/edgeforge)

2. Launch th Virtual Box Application.
3. Create a New Virtual Machine.

* `Click` New Virtual Machine  
* Give it a name such as `Palette Edge`  
* Select the `ISO Image` you downloaded in step one.  
* Set the `Type` to `Linux` and the `Version` to `Ubuntu (64-bit)`  
* Click `Next`  

4. Adjust the Virtual Machine Memory and CPU.

* 4096MB Memory (4GB)
* 2 CPU  

<InfoBox>
These are the minimums.  In a production environment these would vary by requirements.
</InfoBox>

![HW Settings Image](/tutorials/edge-native-virtualbox/hw_settings.png)

* Click `Next`

4. Adjust the Disk Size.

* Set the Hard Disk to `50GB`

<InfoBox>
    Make sure the `Pre-Allocate Full Size` is NOT checked.
</InfoBox>

![VM Disk](/tutorials/edge-native-virtualbox/vm_disk.png)

* Click `Next`  

* Confirm your settings  
* Click `Finish`  

5. Update VM Settings.

* Select/Highlight the VM you just created.  
    **Be Careful not to double click the vm as this will start it.  We will do that in a later step.**
* Click `Settings`  
* Select `Network`  

* Change the `Attached to:` from `NAT` to `Bridged Adapter`

![VM Network Default](/tutorials/edge-native-virtualbox/vm_network.png)

* Click `OK`

6. Power on the VM.  

* Click `Start`

<InfoBox>
The provisioning process takes around 5 minutes.  The device will shut down when it is complete.  If you find it is taking longer, you can view the log messages by pressing `ALT` + `F1`.  
When the device shuts down, the provisioning is complete.
</InfoBox>

7. Remove the ISO.

* Select/Highlight the VM you just created.  
    **Be Careful not to double click the vm as this will start it.  We will do that in a later step.**
* Click `settings`
* Select `Storage`
* Highlight the ISO we connected earlier `palette-edge-installer.iso`
* Select the `Remove Attachment` icon

![VM Network Update](/tutorials/edge-native-virtualbox/vm_iso_remove.png)

* Confirm with the pop up by selecting `Remove`
* Select `Ok` to close the settings

8. Start the VM

* Highlight the VM we created
* Click `Start`

<InfoBox>
The device will boot and get an IP address from the bridged network of the host machine.  This address should be on the same subnet as the host machine.
</InfoBox>

You should have a screen similar to this.  The IP address of the machine is printed at the top.

![Registration Mode Screen](/tutorials/edge-native-virtualbox/registration.png)

The device is now ready to be provisioned.

## Upload images to registry

<WarningBox>
The rest of this tutorial relies upon using container images that have already been created using our Edge Forge.  If you have not created these please complete the Building Edge Native Artifacts How To before continuing.
</WarningBox>

**[Building Edge Native Artifacts How To](/knowledgebase/how-to/edge-native/edgeforge)**

## Validate images

<InfoBox>
These steps should be done on the machine used to complete the Building Edge Native Artifacts How To
</InfoBox>

1. Verify images exist.

```shell
docker images
```

**Sample Output**

```shell
REPOSITORY               TAG                  IMAGE ID       CREATED          SIZE
ttl.sh/ubuntu-demo       k3s-v1.24.7-v3.3.3   4ae30a34286f   19 minutes ago   2.49GB
ttl.sh/ubuntu-demo       k3s-v1.25.2-v3.3.3   87ef433aa0db   19 minutes ago   2.49GB
earthly/earthly          v0.7.4               d771cc8edc38   2 weeks ago      333MB
```

<InfoBox>
The repository target above is ephemeral and images are not designed to stay for long periods of time.  We are using this repository for demo and quick start purposes but it is not designed for a production environment.  If you wish to use your own registry, tag the docker images appropriately and push them to that registry.
</InfoBox>

2. Push each image to `ttl.sh`

```shell
docker push ttl.sh/ubuntu-demo:k3s-v1.25.2-v3.3.3
```

```shell
docker push ttl.sh/ubuntu-demo:k3s-v1.24.7-v3.3.3
```

<InfoBox>
As a reminder, ttl.sh is a short lived registry.  By default these images have a default time to live of 24 hours.  If you do not complete this tutorial within 24 hours of pushing these images they will no long exist and will need to be re-pushed.
</InfoBox>

## Register Edge Host to Palette

1. Create the Cluster Profile

* Navigate to Palette [Palette Endpoint](https://console.spectrocloud.com/)

* Login to your organization  
If you have not signed up you can sign up for a free trial [Here](https://www.spectrocloud.com/free-tier/)
* Once you are logged in navigate to the `Default` Project

![Default Project Image](/tutorials/edge-native-virtualbox/default_project.png)

* Select `Clusters` from the left hand side.
* Select `Edge Hosts`
* 

```shell
ssh kairos@192.168.1.159
The authenticity of host '192.168.1.159 (192.168.1.159)' can't be established.
ED25519 key fingerprint is SHA256:oSXVM/3pXbILlrVsv2N3uDFf4rsJqURhm32FWuW2wjc.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.1.159' (ED25519) to the list of known hosts.
kairos@192.168.1.159's password:
Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-58-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Palette eXtended Kubernetes Edge
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

kairos@edge-f35b0bef47ff5f4c91eda32e0e28016d:~
```

## Create Palette Profile

1. Create the Cluster Profile

* Navigate to Palette [Palette Endpoint](https://console.spectrocloud.com/)

* Login to your organization  
If you have not signed up you can sign up for a free trial [Here](https://www.spectrocloud.com/free-tier/)

* Once you are logged in navigate to the `Default` Project

![Default Project Image](/tutorials/edge-native-virtualbox/default_project.png)

Select `Profiles` from the left hand menu

* Click `Add New Profile`
* Give the Profile a name


```yaml
system.uri: 'ttl.sh/{{ .spectro.system.clusterprofile.infra.name }}:k3s-{{ .spectro.system.clusterprofile.infra.version}}'
```
