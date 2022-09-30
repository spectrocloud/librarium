---
title: "Practice for Your CKS Exam with Palette"
metaTitle: "Practice for Your CKS Exam with Palette"
metaDescription: "Steps to Practice for Your CKS Exam with Palette"
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


# Tutorial: Practice for Your CKS Exam with Palette

[Certified Kubernetes Security Specialist (CKS)](https://www.cncf.io/certification/cks/) is the hardest exam offered by [CNCF](https://www.cncf.io/). While there are a lot of resources available to study, it's not always so easy to practice what you've learned.

Wouldn't it be great if you could simply fire up a cloud environment that had all the essential tools you need to practice the CKS problems, out of the box?

Well, that's exactly what this tutorial will show you how to access. We hope it will help you out in your preparation—or simply help you learn more about cloud security!

All you need is a Secure Shell (SSH) client, and you will be able to follow along with these steps.<p></p><br />

1. Sign up for [Spectro Cloud Palette](https://docs.spectrocloud.com/getting-started) <p></p><br />
2. Enter your cloud credentials<p></p><br />
3. Launch a cluster with a CKS workshop add-on<p></p><br />
4. Find the bastion host and cluster IP addresses<p></p><br />
5. Log in and practice<p></p><br />
6. Clean up <p></p><br />

We'll go through the details, step by step.<p></p><br />


## Step 1: Sign up for Spectro Cloud Palette

Spectro Clouds Palette helps manage Kubernetes clusters. We will be using it to launch the cluster, so that you can practice the CKS problems. If you haven't done so already, point your browser to the [free trial](http://www.spectrocloud.com/free-trial) and follow the on-screen instructions to sign up.

Your account will be ready, after you've responded to the confirmation email. Let's login!

## Step 2: Enter your cloud credentials

This is an important step! Your cluster needs to run in a cloud environment. We will be using AWS cloud in the rest of the tutorial. Here are the details:


1. Log in to Palette using the credentials created from the last step.<p></p><br />
2. At the top of the [Palette Dashboard](https://docs.spectrocloud.com/getting-started/dashboard), find the dropdown menu, and select the **Default** project.<p></p><br />
3. Next, from the slide menu, select **Project Settings** > **Cloud Accounts** > **Add AWS Account**.<p></p><br />

If you need some free cloud credits to try Palette, please reach out to us on the [Slack community](https://join.slack.com/t/spectrocloudcommunity/shared_invite/zt-g8gfzrhf-cKavsGD_myOh30K24pImLA) or email us at [developer@spectrocloud.com](mailto:developer@spectrocloud.com). Once we understand your use case, we will give you Cloud Credits. For more details, please visit these [documentation pages](https://docs.spectrocloud.com/getting-started/free-cloud-credit).

**Note**: For this exercise, we cannot use managed Kubernetes, such as Elastic Kubernetes Service (EKS), because we need to access the Control Plane node for the CKS exercises.<p></p><br />

## Step 3: Launch a Cluster

At Spectro Cloud, we use the concept of a [cluster profile](https://docs.spectrocloud.com/cluster-profiles) to model and manage clusters. In this section, we will be able to launch a cluster:

1. From the slide menu, click **Clusters** and select the **Add New Cluster** button to create your first cluster.<p></p><br />
2. Choose the **OOTB Configurations** template.<p></p><br />
3. From the list of **Profiles**, choose **CKS-STACK,** and click **Preview** to go to the next screen.<p></p><br />

    ![cks-preview-stack](/cks-tutorial-images/cks-preview-stack.png "#width=500px" "Preview Stack" )<p></p><br />

4. Click **Deploy Cluster** to choose this profile.<p></p><br />
5. Now, we need to fill in some details. Name the cluster and select the **Cloud Account** you entered in Step 2.<p></p><br />

    ![my-cks-cloud-account](/cks-tutorial-images/my-cks-cloud-account.png "#width=500px" "Cloud Account")

6. We do not need to make any changes, so we will click **Next** to go to the **Parameters** tab.<p></p><br />
7. In the next screen, we will add the **Region** and **SSH Key Pair** for that region. (If you do not have one already, you are welcome to check out this AWS documentation [page](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) for details to create one).

    ![my-cks-workshop-basic](/cks-tutorial-images/my-cks-workshop-basic.png "#width=500px" "Basic Information")


8. We will need one (1) Control Plane node and one (1) Worker node for our exercises. We recommend choosing **t3.large** as an Instance Size and just one (1) Availability Zone.<p></p><br />
9. Under **Settings**, click **Next**.<p></p><br />
10. We will complete this section to get the cluster provisioned if the **Review** has no errors!<p></p><br />

**Note**: It will take approximately 15 minutes for the cloud provider to provision the cluster.<p></p><br />

## Step 4: Find the Bastion host and the cluster IP addresses

We need to execute this part using the AWS console. After you log in to the AWS console, proceed to find the **bastion host** public IP address:

![cks-bastion-host](/cks-tutorial-images/cks-bastion-host.png "#width=400px" "Bastion Host")


**Important**: Be sure to keep the SSH key that was needed earlier, because we will need to use it.

```
scp -i <mykey.pem> <mykey.pem> ubuntu@<bastion-ip-address>:
```

You will also need to find out the internal IP addresses of the control plane and worker node. Please click into those instances to find them:

![cks-instance-ip](/cks-tutorial-images/cks-instance-ip.png "#width=400px" "Instance IP")

In the following example, the private IP DNS name is `ip-10-0-1-9.us-west-1.compute.internal` with IP address `10.0.1.9`. Make sure you copy it down for the both control plane (CP) and the worker node as some exercises need to happen on the specific instance.<p></p><br />

![cks-instance-summary](/cks-tutorial-images/cks-instance-summary.png "#width=400px" "Instance Summary")<p></p><br />


## Step 5: Practice the CKS problems

Now that we have copied the key, we can SSH into the bastion host (the reason is that we cannot access the nodes directly):<p></p><br />

```
ssh -i <mykey.pem> ubuntu@<bastion-ip-address>
```

Here let's SSH into the control plane (we have already copied the key file from the previous step):<p></p><br />

```
ssh -i <mykey.pem> ubuntu@<control-plane-internal-ip-address>
```


Then, change to root `sudo -i`, type the command `cks-workshop` and follow the on-screen instructions:<p></p><br />

![cks-workshop](/cks-tutorial-images/cks-workshop.png "#width=400px" "CKS Workshop")<p></p><br />

Good luck with the practice! Know that in some of the exercises you may need to go back to the bastion host and access the Worker Node: <p></p><br />

```
ssh -i <mykey.pem> ubuntu@<worker-node-internal-ip-address>
```

If you need some help with the examples, drop us a line at the [Slack community](https://join.slack.com/t/spectrocloudcommunity/shared_invite/zt-18w8vts77-zUpRlvs5COVXCmg1kKbpOQ) in which we solve issues in real time.<p></p><br />

## Step 6: Clean up

It is a good practice to clean up the instance. After you are done with the practice, go back into Palette to delete the cluster (details [here](/clusters/public-cloud/aws#deletinganawscluster)) to avoid unwanted cloud charges:


![cks-cleanup](/cks-tutorial-images/cks-cleanup.png "#width=200px" "CKS Cleanup")


## Conclusion

That's a wrap! We hope that this tutorial is useful for you in terms of preparing you for your CKS exam. If you have any comments or questions, please feel free to reach out at [developer@spectrocloud.com](mailto:developer@spectrocloud.com).  Thank you, and all the best with your Kubernetes journey!
