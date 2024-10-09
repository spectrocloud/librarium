---
sidebar_label: "Share Local UI Authentication"
title: "Share Local UI Authentication"
description:
  "Learn how to integration your application and have your application share Local UI's authentication token."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

Accessing Local UI requires authentication. Local UI will store a JSON Web Token (JWT) as a cookie in your browser once
authentication is successful, and you won't need to log in again as long as the token exists and remains valid. If you
have applications in your cluster that also require authentication, you can have your application consume the same token
to streamline the authentication process for your users.

When you develop your application, you need to be aware that your application needs access to two items when the cluster
becomes operational:

- The JWT itself. This token will be stored in the browser if your user has previously logged in to Local UI.
- The public key that is used to validate the JWT token. This token is exposed as a secret in the `spectro-system`
  namespace when you provision your Kubernetes cluster. If your cluster has multiple nodes, each node will have its own
  public key.

## Prerequisites

- The application whose authentication you want to integrate with Local UI must support HTTPS. Traffic to the
  application service must be over HTTPS.

## Procedure

1. Determine the location where the public key file will be relative to your containerized application. At this time,
   the public key file does not exist yet because you do not yet have a cluster. Therefore, you need to remember this
   location and mount secret volume to the corresponding location in a subsequent step. For example, if you decide
   location of the key file will be `/app/keys/server.pem`, then you'll need to mount the secret volume to `/apps/key/`
   later.

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

   The middleware verifies and the JWT. If it is valid, it decodes the JWT and return the user information contained in
   the JWT. If the JWT doesn't exist or is not valid, it will redirect the user to the login page.

3. Build the image containing your application and push it to a registry that your host has access to.

4. Create a Kubernetes manifest that you can use to deploy your containerized application.

5. In the manifest for your application, define a volume that contains a Kubernetes secret. The secret name is
   `<edge-host-ID>-public-key`. Replace `<edge-host-ID>` with the ID of your Edge host. This secret contains the public
   key that your application will use to verify the token.

   :::info

   To find your Edge host ID, you can log in to [Local UI](../host-management/access-console.md). In the **Overview**
   section is the Edge host ID. If you didn't enable local UI, you can log in to
   [Palette](https://console.spectrocloud.com) and find the Edge host ID in the
   [Edge host grid view](../../site-deployment/edge-host-view.md) page in the **Machine ID** column.

   :::

6. In the manifest for your application, mount the volume containing the secret to the location specified in your
   application. For example, if your application is trying to access `/app/keys/server.pem`, you should mount the volume
   to `/app/keys/`.

7. Create an add-on profile and use the manifest you created in the add-on profile. For more information, refer to
   [Add a Manifest](../../../../profiles/cluster-profiles/).

8. Deploy your cluster using your cluster profile. For more information, refer to
   [Create Cluster Definition](../../site-deployment/cluster-deployment.md).

   During the deployment, you may see error messages that suggest the volume mount has failed to be created. This is
   because the secret may not exist the namespace where your application is deployed. The secret resides in the
   `spectro-system` namespace. This is expected and you can fix this in the next step.

9. Issue the following command to copy the secret to the namespace where your application is deployed. Replace
   `<app-namespace>` with the namespace where your application is deployed. Replace `<edge-host-ID>` with the ID of your
   Edge host.

   ```bash
   kubectl get secret <edge-host-ID>-public-key --namespace spectro-system -o json | jq '.metadata.namespace = <app-namespace> | del(.metadata.resourceVersion, .metadata.creationTimestamp, .metadata.uid)' | kubectl apply -f -
   ```

   This will create secret in a new namespace and will resolve the error.

   :::info

   Alternatively, you can create the cluster without the application layer first. Issue the command to copy the secret
   to a new namespace where you expect to deploy the application, and then add the add-on layer to the profile of the
   active cluster.

   :::

## Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. After logging in, attempt to visit your web application at a URL that requires authentication.

3. Confirm that you are automatically logged in.
