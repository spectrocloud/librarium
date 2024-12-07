---
sidebar_label: "Share Local UI Authentication"
title: "Share Local UI Authentication"
description:
  "Learn how to integration your application and have your application share Local UI's authentication token."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

Accessing Local UI requires authentication. Local UI will store a JSON Web Token (JWT) as a cookie in your browser once
authentication is successful, and you won't need to log in again as long as the cookie exists and remains valid. If you
have applications in your cluster that also require authentication, you can have your application consume the same
cookie to streamline the authentication process for your users.

When you develop your application, you need to be aware that your application needs access to two items when the cluster
becomes operational:

- The JWT itself. This token is stored in your browser inside a cookie, but only if your user has previously logged in
  to Local UI. If your cluster has multiple nodes, then each node has its own cookie based on the IP address of the
  node.
- The public key that is used to validate the JWT token. This token is exposed as a secret in the `spectro-system`
  namespace when you provision your Kubernetes cluster. If your cluster has multiple nodes, each node will also have its
  own public key.

## Limitations

- The cookies issued by Local UI do not have an expiration date.

## Prerequisites

- The application whose authentication you want to integrate with Local UI must support HTTPS. Traffic to the
  application service must be over HTTPS.

- A [Spectro Cloud](https://console.spectrocloud.com) account.

- A tool that allows you to build image of containerized applications such as [Docker](https://docker.io).

- [Kubectl](https://kubernetes.io/docs/reference/kubectl/) is installed on your host machine.

## Procedure

1. Determine the location where the public key file will be relative to your containerized application. The public key
   file will be named `server.pem` in a Kubernetes secret once your have an active cluster.

   You need to remember this location and mount the secret volume to the corresponding location in a subsequent step.
   For example, if you decide location of the key file will be `/app/keys/server.pem`, and your application is expecting
   the public key at that location, you'll need to mount the secret volume to `/apps/key/` later.

   :::tip

   We suggest you use an environment variable instead of hard-coding a path. Using an environment variable gives you
   more flexibility later on when you mount the volume containing the public key.

   :::

2. In your containerized application, implement a mechanism that can verify the validity of the JWT using the public
   key. The JWT is stored as a cookie named `Authorization`. The implementation of this mechanism will vary greatly
   depending on your application.

   For example, the following is an implementation of an [Express.js](https://expressjs.com/) middleware that can be
   used to verify the JWT before your server responds to an incoming HTTP request.

   ```javascript
   const express = require("express");

   function checkAuth(req, res, next) {
     const token = req.cookies["Authorization"];
     if (!token) {
       return res.redirect(getAuthURL(req)); // Redirect to the login screen if no token is detected
     }

     jwt.verify(token, secretKey, (err, decoded) => {
       if (err) {
         console.log("Error verifying token", err);
         return res.redirect(getAuthURL(req)); // Redirect to the login screen if the token is invalid
       }
       req.user = decoded; // Return the decoded user information if the token is valid
       next();
     });
   }
   ```

   The middleware verifies the JWT using the public key. If it is valid, it decodes the JWT and return the user
   information contained in the JWT. If the JWT doesn't exist or is not valid, it will redirect the user to the login
   page. At this point, you can mark application routes as either protected or unprotected. Protecting routes varies by
   library and framework utilized. Refer to your application framework or authentication library's documentation for
   more details.

3. Build the image containing your application and push it to a registry that your host has access to.

4. Create a Kubernetes manifest that you can use to deploy your containerized application.

5. In the manifest for your application, define a volume that contains a Kubernetes secret. The secret name is
   `<edge-host-ID>-public-key`. Replace `<edge-host-ID>` with the ID of your Edge host. This secret contains the public
   key that your application will use to verify the token.

   :::info

   To find your Edge host ID, you can log in to [Local UI](../host-management/access-console.md). In the **Overview**
   section is the Edge host ID. If you didn't enable Local UI, you can log in to
   [Palette](https://console.spectrocloud.com) and find the Edge host ID in the
   [Edge host grid view](../../site-deployment/edge-host-view.md) page in the **Machine ID** column.

   :::

6. In the manifest for your application, mount the volume containing the secret to the location specified in your
   application. For example, if your application is trying to access `/app/keys/server.pem`, you should mount the volume
   to `/app/keys/`.

   If you have previously used an environment variable to store the path of the public key, define the corresponding
   environment variable in your container specification. For example, if your application will try to access an
   environment variable `KEY_LOCATION`, you can define the environment variable using configurations similar to the
   following.

   ```yaml
   spec:
     containers:
       - name: sample-auth-app
         image: gcr.io/example-app:latest
         volumeMounts:
           - name: jwt-secret
             mountPath: /app/keys
             readOnly: true
         env:
           - name: KEY_LOCATION
             value: "/app/keys/server.pem"
     volumes:
       - name: jwt-secret
         secret:
           secretName: <edge-host-ID>-public-key
   ```

7. Create an add-on profile and use the manifest you created in the add-on profile. For more information, refer to
   [Add a Manifest](../../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md).

8. Deploy your cluster using your cluster profile. For more information, refer to
   [Create Cluster Definition](../../site-deployment/cluster-deployment.md).

   During the deployment, you may encounter error messages that suggest the volume mount has failed to be created. This
   is because the secret may not exist the namespace where your application is deployed. The secret resides in the
   `spectro-system` namespace. This is expected and you can fix this in the next step.

9. Issue the following command to copy the secret to the namespace where your application is deployed. Replace
   `<app-namespace>` with the namespace where your application is deployed. Replace `<edge-host-ID>` with the ID of your
   Edge host.

   ```bash
   kubectl get secret <edge-host-ID>-public-key --namespace spectro-system --output json | jq '.metadata.namespace = <app-namespace> | del(.metadata.resourceVersion, .metadata.creationTimestamp, .metadata.uid)' | kubectl apply --file -
   ```

   This will create secret in a new namespace and will resolve the error.

   :::info

   You can create the cluster without the application layer first. After the cluster is up, issue the command to copy
   the secret to a new namespace where you expect to deploy the application, and then add the add-on layer to the
   profile of the active cluster. If you do this, you won't encounter the error regarding volume mounts failing to be
   created.

   Alternatively, you can use a Kubernetes
   [service account role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions) and
   an initialization script that accesses the secret from the `spectro-system` namespace. This is an advanced workflow
   but allows for single-shot deployments. Check out the
   [Accessing the Kubernetes API from a Pod](https://kubernetes.io/docs/tasks/run-application/access-api-from-pod/)
   guide for an example on how to use a service account role's credentials inside a container.

   :::

## Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. After logging in, attempt to visit your web application at a URL that requires authentication.

3. Confirm that you are automatically logged in.
