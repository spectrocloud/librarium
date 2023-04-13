---
title: "Air Gap Mode "
metaTitle: "Air Gap Mode"
metaDescription: "Learn how to install Palette into an air gap environment."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import Tabs from 'shared/components/ui/Tabs';

# Overview


You can install a self-hosted version of Palette into a VMware environment without direct internet access. This type of installation is referred to as an airgap installation.   

During a standard Palette installation, the following artifacts are, by default, downloaded.

* Platform manifests from a publicly hosted artifact repository.


* Container images for core platform components and 3rd party dependencies from various public repositories.


* Packs from the public pack registry.


* VMWare Worker images for various Kubernetes versions.

To address the internet connectivity limitation, we provide an OVA image containing three required installation artifacts mentioned earlier. 

Due to the large size of VMWare worker images,  they are not included in the installer OVA image. Any VMware worker image you may need will require you to download the image from an Amazon S3 bucket and upload the worker images to vCenter before the installation. 




# Prerequisites

* The following minimum resources are required for deploying Palette.
    * 2 vCPU
    * 4 GB of Memory
    * 100 GB of Storage. Storage sizing depends on your intended update frequency and data retention model. <br /> <br />

* Ensure the following ports allow inbound network traffic. 
    * 80
    * 443
    * 5000
    * 8000


* Request the Palette Self-hosted installer image. To request the installer image, please contact our support team by sending an email to support@spectrocloud.com. Kindly provide the following information in your email:

    - Your full name
    - Organization name (if applicable)
    - Email address
    - Phone number (optional)
    - A brief description of your intended use for the Palette Self-host installer image.

Our dedicated support team will promptly get in touch with you to provide the necessary assistance and share the installer image. 

If you have any questions or concerns, please feel free to contact support@spectrocloud.com.

<br />


# Deploy Air-Gapped Appliance


1. Log in to vCenter Server by using the vSphere Client.


2. Navigate to the Datacenter and select the cluster you want to use for the installation. Right-click on the cluster and select **Deploy OVF Template**.


3. Select the OVA installer image you downloaded after receiving guidance from our support team.


4. Select the folder where you want to install the Virtual Machine (VM) and assign a name to the virtual machine.


5. Next, select the compute resource.


6. Review the details page. You may get a warning message stating the certificate is not trusted, you can ignore this message and select **Next**.


7. Select your storage device and storage policy. Click on **Next** to proceed.


8. Choose the network your appliance should use and select **Next**.


9. Fill out the remaining template customization options. You can modify the following input fields. <br /><br />

  | Parameter | Description |  Default Value |
  | --- | --- | -- |
  | Encoded user-data | In order to fit into a xml attribute, this value is base64 encoded . This value will be decoded, and then processed normally as user-data. | - |
  | ssh public keys | This field is optional, but indicates that the instance should populate the default user's `authorized_keys` with this publick key provided | -|
  | Default User's password|  If set, the default user's password will be set to this value to allow password based login.  The password will be good for only a single login.  If set to the string `RANDOM` then a random password will be generated, and written to the console. | - |
  | A Unique Instance ID for this instance|  Specifies the instance id. This is required and used to determine if the machine should take "first boot" actions| `id-ovf`|
  |hostname| Specifies the hostname for the appliance. | `ubuntuguest` |
  |Url to seed instance data from| This field is optional, but indicates that the instance should 'seed' user-data and meta-data from the given url.| -|

10. Click on **Next** to complete the deployment wizard. Upon completion, the cloning process will begin. The cloning process takes a few minutes to complete.


11. Power on the VM and click on the **Launch Web Console** button to access the instance's terminal.


12. Configure a static IP address on the node by editing **/etc/netplan/50-cloud-init.yaml**. 

  <br />

  ```shell
  sudo vi /etc/netplan/50-cloud-init.yaml
  ```

  Use the following sample configuration as a starting point but feel free to change the configuration file as required for your environment. To learn more about Netplan, check out the [Netplan configuration examples](https://netplan.io/examples) from Canonical.

  <br />

  ```yaml
  network:
    version: 2
    renderer: networkd
    ethernets:
      ens192:
        dhcp4: false
        addresses:
          - 10.10.244.9/18 # your static IP and subnet mask
        gateway4: 10.10.192.1 # your gateway IP
        nameservers:
            addresses: [10.10.128.8] # your DNS nameserver IP address.
  ```

  Press the **ESC** key and type `:q!`, followed by the **Enter** key to exit Vi. <br /> <br />

13. Issue the `netplan` command to update the network settings.  

  <br />

  ```shell
  sudo netplan apply
  ```

14. Give the instance one to two minutes before issuing the following command. The next step is to start the airgap setup script that stands up the Spectro Repository. Issue the command below and replace `X.X.X.X` with the static IP you provided to the Netplan configuration file.

  <br />

  ```shell
  sudo /bin/airgap-setup.sh X.X.X.X
  ```

  Record the output of the setup command as you will use it when deploying the Quick Start appliance later on in the installation process.

  Example Output: 
  ```shell
  Setting up Manifests
  Setting up Manifests
  Setting up SSL Certs
  Setup Completed

  Details:
    -------
  Spectro Cloud Repostory
  UserName: spectro
  Password: admin@airgap
  Location: https://10.10.249.12
  Artifact Repo Certificate:
  LS0tLS1CRUdJ.............<condensed>

  Pack Registry
  URL: https://10.10.249.12:5000
  Username: admin
  Password: admin@airgap
  ```

15. If you need to configure the instance with proxy settings, go ahead and do so now. You can configure proxy settings by using environment variables. Replace the values with your environment's respective values.

  <br />

  ```shell
  export http_proxy=http://10.1.1.1:8888
  export https_proxy=https://10.1.1.1:8888
  export no_proxy=.example.dev,10.0.0.0/8
  ```

16. The next set of steps will download the required binaries to support a Palette installation, such as the Palette Installer, required Kubernetes packages, and Kubeadm pages. You can download these artifacts from the instance, or externally and transfer them to the instance. Click on each tab for further guidance.

  <br />

  <WarningBox>

  You must download the three following resources. The credentials and download URL will be provided to you by the support team.
  Click on each tab to learn more about each resource and steps for downloading.

  </WarningBox>

<br />

<Tabs>

<Tabs.TabPane tab="Palette Installer" key="palette-installer">

  Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/airgap-k8s-v3.3.15.bin \
   --output airgap-k8s-v3.3.15.bin
  ```

  <InfoBox>

   If you receive a certificate error, use the `-k` or `--insecure` flag.
  
  </InfoBox>

  Assign the proper permissions and start the download script.

  <br />

  ```shell
  sudo chmod 755 ./airgap-k8s-v3.3.15.bin && sudo ./airgap-k8s-v3.3.15.bin
  ```

  Example Output:
  ```shell
  sudo ./airgap-k8s-v3.3.15.bin
  Verifying archive integrity...  100%   MD5 checksums are OK. All good.
  Uncompressing Airgap K8S Images Setup - Version 3.3.15  100%
  Setting up Packs
  Setting up Images
    - Pushing image k8s.gcr.io/kube-controller-manager:v1.22.10
    - Pushing image k8s.gcr.io/kube-proxy:v1.22.10
    - Pushing image k8s.gcr.io/kube-apiserver:v1.22.10
    - Pushing image k8s.gcr.io/kube-scheduler:v1.22.10
    …
  Setup Completed
  ```




</Tabs.TabPane>

<Tabs.TabPane tab="Kubernetes Packages" key="k8s-packages">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/airgap-k8s-v3.3.15.bin \
   --output airgap-k8s-v3.3.15.bin
  ```

  <InfoBox>

   If you receive a certificate error, use the `-k` or `--insecure` flag.
  
  </InfoBox>

   Assign the proper permissions and start the download script.

  <br />

  ```shell
  sudo chmod 755 ./airgap-k8s-v3.3.15.bin && sudo ./airgap-k8s-v3.3.15.bin
  ```

  Example Output:
  ```shell
  sudo ./airgap-k8s-v3.3.15.bin
  Verifying archive integrity...  100%   MD5 checksums are OK. All good.
  Uncompressing Airgap K8S Images Setup - Version 3.3.15  100%
  Setting up Packs
  Setting up Images
    - Pushing image k8s.gcr.io/kube-controller-manager:v1.22.10
    - Pushing image k8s.gcr.io/kube-proxy:v1.22.10
    - Pushing image k8s.gcr.io/kube-apiserver:v1.22.10
    - Pushing image k8s.gcr.io/kube-scheduler:v1.22.10
    …
  Setup Completed
  ```


</Tabs.TabPane>

<Tabs.TabPane tab="Kubeadm Packages" key="kubeadm-packages">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-kubeadm.bin \
   --output airgap-edge-kubeadm.bin
  ```

  <InfoBox>

   If you receive a certificate error, use the `-k` or `--insecure` flag.
  
  </InfoBox>

   Assign the proper permissions and start the download script.

  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-kubeadm.bin && sudo ./airgap-edge-kubeadm.bin
  ```

  Example Output:
  ```shell
  sudo ./airgap-edge-kubeadm.bin
  Verifying archive integrity...  100%   MD5 checksums are OK. All good.
  Uncompressing Airgap Edge Packs - Kubeadm Images   100%
  Setting up Images
    - Skipping image k8s.gcr.io/coredns/coredns:v1.8.6
    - Pushing image k8s.gcr.io/etcd:3.5.1-0
    - Pushing image k8s.gcr.io/kube-apiserver:v1.23.12
    - Pushing image k8s.gcr.io/kube-controller-manager:v1.23.12
    - Pushing image k8s.gcr.io/kube-proxy:v1.23.12
    …
  Setup Completed
  ```

</Tabs.TabPane>


</Tabs>

<br />

17. If you will be using Edge deployments then go ahead and download the packages you believe you will need. If you are not planning on using Edge, skip to end. You can come back to this step in the future and add the packages if needed. Click on the `...` tab for additional options.


<br />

<Tabs>

<Tabs.TabPane tab="Ubuntu 22.04 - K3s " key="ubuntu-22-k3s">

  Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-ubuntu22-k3s.bin \
   --output airgap-edge-ubuntu22-k3s.bin
  ```

  <InfoBox>

   If you receive a certificate error, use the `-k` or `--insecure` flag.
  
  </InfoBox>

 Assign the proper permissions and start the download script.

  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-ubuntu22-k3s.bin && sudo ./airgap-edge-ubuntu22-k3s.bin
  ```


</Tabs.TabPane>


<Tabs.TabPane tab="Ubuntu 22.04 - RKE " key="ubuntu-22-rke">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-ubuntu22-rke.bin \
   --output airgap-edge-ubuntu22-rke.bin
  ```

  <InfoBox>

   If you receive a certificate error, use the `-k` or `--insecure` flag.
  
  </InfoBox>

   Assign the proper permissions and start the download script.

  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-ubuntu22-rke.bin && sudo ./airgap-edge-ubuntu22-rke.bin
  ```

</Tabs.TabPane>

<Tabs.TabPane tab="Ubuntu 22.04 - Kubeadm" key="ubuntu-22-kubeadm">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-ubuntu22-kubeadm.bin \
   --output airgap-edge-ubuntu22-kubeadm.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-ubuntu22-kubeadm.bin && sudo ./airgap-edge-ubuntu22-kubeadm.bin
  ```

</Tabs.TabPane>

<Tabs.TabPane tab="Ubuntu 20.04 - K3s" key="ubuntu-20-k3s">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-ubuntu20-k3s.bin \
   --output airgap-edge-ubuntu20-k3s.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-ubuntu20-k3s.bin && sudo ./airgap-edge-ubuntu20-k3s.bin
  ```

</Tabs.TabPane>

<Tabs.TabPane tab="Ubuntu 20.04 - RKE" key="ubuntu-20-rke">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-ubuntu20-rke.bin \
   --output airgap-edge-ubuntu20-rke.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-ubuntu20-rke.bin && sudo ./airgap-edge-ubuntu20-rke.bin
  ```

</Tabs.TabPane>


<Tabs.TabPane tab="Ubuntu 20.04 - Kubeadm" key="ubuntu-20-kubeadm">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-ubuntu20-kubeadm.bin \
   --output airgap-edge-ubuntu20-kubeadm.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-ubuntu20-kubeadm.bin && sudo ./airgap-edge-ubuntu20-kubeadm.bin
  ```

</Tabs.TabPane>

<Tabs.TabPane tab="OpenSuse - K3s" key="opensuse-k3s">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-opensuse-k3s.bin \
   --output airgap-edge-opensuse-k3s.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-opensuse-k3s.bin && sudo ./airgap-edge-opensuse-k3s.bin
  ```

</Tabs.TabPane>

<Tabs.TabPane tab="OpenSuse - RKE" key="opensuse-rke">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-opensuse-rke.bin \
   --output airgap-edge-opensuse-rke.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-opensuse-rke.bin && sudo ./airgap-edge-opensuse-rke.bin
  ```

</Tabs.TabPane>

<Tabs.TabPane tab="OpenSuse - Kubeadm" key="opensuse-kubeadm">

   Download the binary by using the URL provided by the Palette support team. Change the version number as needed.

  <br />

  ```shell
  curl --user XXXX:YYYYY https://<provided-by-support>/airgap/packs/3.3/airgap-edge-opensuse-kubeadm.bin \
   --output airgap-edge-opensuse-kubeadm.bin
  ```

  <InfoBox>

  If you receive a certificate error, use the `-k` or `--insecure` flag.

  </InfoBox>

   Assign the proper permissions and start the download script.
  
  <br />

  ```shell
  sudo chmod 755 ./airgap-edge-opensuse-kubeadm.bin && sudo ./airgap-edge-opensuse-kubeadm.bin
  ```

</Tabs.TabPane>


</Tabs>

<br />

----

<br />


The next step of the installation process is to begin the deployment of an appliance using the instructions in the [Migrate Cluster to Enterprise Mode](/enterprise-version/deploying-an-enterprise-cluster). If you need to review the Spectro Cloud Repository details, issue the following command for detailed output.

<br />

```shell
sudo /bin/airgap-setup.sh
```



# Validate

You can validate that the Spectro Repository you deployed is available and ready for the next steps of the installation process. If you provided the appliance an SSH key then you can skip to step six.

1. Log in to vCenter Server by using the vSphere Client.


2. Navigate to your Datacenter and locate your VM. Click on the VM to access its details page.


3. Power on the VM.


4. Click on **Launch Web Console** to access the terminal.


5. Log in with the user `ubuntu` and the user password you specified during the installation.


6. Verify the registry server is up and available. Replace the `10.1.1.1` value with your appliance's IP address.

  <br />

  ```shell
  curl -k https://10.1.1.1:5000/health
  ```

  Output:
  ```shell
  {"status":"UP"}
  ```

7. Ensure you can log into your registry server. Use the default credentials `admin:admin@airgap`. Replace the `10.1.1.1` value with your appliance's IP address.

  <br />

  ```shell
  curl -ku admin:admin@airgap https://10.1.1.1:5000/v1/_catalog
  ```

  Output:
  ```
  {"metadata":{"lastUpdatedTime":"2023-04-11T21:12:09.647295105Z"},"repositories":[{"name":"amazon-linux-eks","tags":[]},{"name":"aws-efs","tags":[]},{"name":"centos-aws","tags":[]},{"name":"centos-azure","tags":[]},{"name":"centos-gcp","tags":[]},{"name":"centos-libvirt","tags":[]},{"name":"centos-vsphere","tags":[]},{"name":"cni-aws-vpc-eks","tags":[]},{"name":"cni-aws-vpc-eks-helm","tags":[]},{"name":"cni-azure","tags":[]},{"name":"cni-calico","tags":[]},{"name":"cni-calico-azure","tags":[]},{"name":"cni-cilium-oss","tags":[]},{"name":"cni-custom","tags":[]},{"name":"cni-kubenet","tags":[]},{"name":"cni-tke-global-router","tags":[]},{"name":"csi-aws","tags":[]},{"name":"csi-aws-ebs","tags":[]},{"name":"csi-aws-efs","tags":[]},{"name":"csi-azure","tags":[]},{"name":"csi-gcp","tags":[]},{"name":"csi-gcp-driver","tags":[]},{"name":"csi-longhorn","tags":[]},{"name":"csi-longhorn-addon","tags":[]},{"name":"csi-maas-volume","tags":[]},{"name":"csi-nfs-subdir-external","tags":[]},{"name":"csi-openstack-cinder","tags":[]},{"name":"csi-portworx-aws","tags":[]},{"name":"csi-portworx-gcp","tags":[]},{"name":"csi-portworx-generic","tags":[]},{"name":"csi-portworx-vsphere","tags":[]},{"name":"csi-rook-ceph","tags":[]},{"name":"csi-rook-ceph-addon","tags":[]},{"name":"csi-tke","tags":[]},{"name":"csi-topolvm-addon","tags":[]},{"name":"csi-vsphere-csi","tags":[]},{"name":"csi-vsphere-volume","tags":[]},{"name":"edge-k3s","tags":[]},{"name":"edge-k8s","tags":[]},{"name":"edge-microk8s","tags":[]},{"name":"edge-native-byoi","tags":[]},{"name":"edge-native-opensuse","tags":[]},{"name":"edge-native-ubuntu","tags":[]},{"name":"edge-rke2","tags":[]},{"name":"external-snapshotter","tags":[]},{"name":"generic-byoi","tags":[]},{"name":"kubernetes","tags":[]},{"name":"kubernetes-aks","tags":[]},{"name":"kubernetes-coxedge","tags":[]},{"name":"kubernetes-eks","tags":[]},{"name":"kubernetes-eksd","tags":[]},{"name":"kubernetes-konvoy","tags":[]},{"name":"kubernetes-microk8s","tags":[]},{"name":"kubernetes-rke2","tags":[]},{"name":"kubernetes-tke","tags":[]},{"name":"portworx-add-on","tags":[]},{"name":"spectro-mgmt","tags":[]},{"name":"tke-managed-os","tags":[]},{"name":"ubuntu-aks","tags":[]},{"name":"ubuntu-aws","tags":[]},{"name":"ubuntu-azure","tags":[]},{"name":"ubuntu-coxedge","tags":[]},{"name":"ubuntu-edge","tags":[]},{"name":"ubuntu-gcp","tags":[]},{"name":"ubuntu-libvirt","tags":[]},{"name":"ubuntu-maas","tags":[]},{"name":"ubuntu-openstack","tags":[]},{"name":"ubuntu-vsphere","tags":[]},{"name":"volume-snapshot-controller","tags":[]}],"listMeta":{"continue":""}}
  ```


<br />