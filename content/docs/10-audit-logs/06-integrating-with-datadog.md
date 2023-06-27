<!-- Output copied to clipboard! -->

<!-----

You have some errors, warnings, or alerts. If you are using reckless mode, turn it off to see inline alerts.
* ERRORs: 0
* WARNINGs: 0
* ALERTS: 8

Conversion time: 3.312 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β34
* Tue Jun 27 2023 01:55:24 GMT-0700 (PDT)
* Source doc: Palette Datadog Integration
* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server. NOTE: Images in exported zip file from Google Docs may not appear in  the same order as they do in your doc. Please check the images!

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 0; ALERTS: 8.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>
<a href="#gdcalert3">alert3</a>
<a href="#gdcalert4">alert4</a>
<a href="#gdcalert5">alert5</a>
<a href="#gdcalert6">alert6</a>
<a href="#gdcalert7">alert7</a>
<a href="#gdcalert8">alert8</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>



# Palette Datadog Integration


## Prerequisites:



1. Access to Palette
2. Kubernetes Cluster
3. Datadog account with API key


## Installation


### Datadog preparation



1. If you don’t already have access to Datadog, open [https://app.datadoghq.eu/signup](https://app.datadoghq.eu/signup)  choose your region (EU1 in my case), give your name, email address and company name, and press “Sign up”

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")

2. Fill your information on the next page and choose “Kubernetes” on the following page. Note that Datadog will give you your API key, take a note of it. Also note it’s waiting for our first agent to report at the bottom of the page.

<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")



### Palette configuration



1. Let’s now login to Palette and datadog Helm repo: click on “Tenant Settings” on the left, then on “Registries”, then on “Add New Helm Registry” and add new Helm registry with the name “Datadog” and endpoint “[https://helm.datadoghq.com](https://helm.datadoghq.com)”. It’ll take a couple of minutes to synchronize.

This document was written at the end of June 2023 when the Palette Datadog Pack was still in development. When it’s released, the recommended approach may change.



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image3.png "image_tooltip")




2. When the repository is synced, we can go ahead and create a new addon Datadog profile via Helm chart: Click on “Profiles”, then “Add Cluster Profile”, give the profile name “datadog” and choose “Add-on” type.

    Then click on “Add new pack”, choose Pack Type “Helm Chart” and Registry as “Datadog”. Then pick the “datadog” chart and its latest version.

<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image4.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image4.png "image_tooltip")


3. This will open a Helm chart modification window, we need to make a couple of changes here so that our Datadog installation collects all the necessary data:

    

<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image5.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image5.png "image_tooltip")


    1. choose namespace on line 2
    2. add api key on line 36: 417cd5625286c624f2e3e64e37583607
    3. site: 'datadoghq.eu' on line 117 (I’m in EU, choose yours)
    4. change _false_ to _true_ on line 403 (enable logs collector)
    5. change _false_ to _true_ on line 408 (activating containerCollectAll)
    6. change _false_ to _true_ on line 546 (enable process collection)
    7. change _false_ to _true_ on line 655 (enable network monitoring)
    8. change _false_ to _true_ on line 659 (enable service monitoring)
    9. change _false_ to _true_ on line 669 (enable security agent)

    Logs are now ready, let’s enable audit logs

    10. paste the following stanza around lines 1109 and Line 1546
    11. paste the following stanzas around lines 1115 and 1564

(make sure mountPath and path for apiserver are corresponding to what you have in kube-apiserver-arg arguments of your k8s cluster)

Don’t forget so save the profile after making all these changes!



4. Let’s now apply our profile to the cluster: I go to “Profiles” of my cluster, click on blue “plus” sign and choose my “datadog” profile and click on “confirm”

<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image6.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image6.png "image_tooltip")

5. If you wait a bit, you notice in the Datadog interface that the agent has started reporting, it’s a good sign, we can click “Finish” to get to the Datadog Panel and verify that logs are indeed being transferred to it.

<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image7.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image7.png "image_tooltip")

6. Let’s enable configmap for our cluster to collect data: on your laptop create a datadog-configmap.yaml file with the following content

    and apply it as so with the proper kubeconfig file from our cluster: 


(make sure path for apiserver is corresponding to what you have in kube-apiserver-arg arguments of your k8s cluster, in my case it’s /var/log/apiserver)



7. Let’s now open Datadog console by clicking “Logs” on the left hand side and make sure we’re seeing our logs flowing to it

<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image8.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image8.png "image_tooltip")


Resources:



* [https://docs.spectrocloud.com/audit-logs/kube-api-audit-logging](https://docs.spectrocloud.com/audit-logs/kube-api-audit-logging)
* [https://docs.datadoghq.com/integrations/kubernetes_audit_logs/](https://docs.datadoghq.com/integrations/kubernetes_audit_logs/)
