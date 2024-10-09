---
sidebar_label: "Share Local UI Authentication"
title: "Share Local UI Authentication"
description:
  "Learn how to integration your application and have your application share Local UI's authentication token."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

In order to access Local UI, you need to authenticate yourself. Local UI will store a JSON Web Token (JWT) as a cookie
in your browser once authentication is successful, and you won't need to log in again as long as the token exists and
remains valid. If you have applications in your cluster that also require authentication, you can have your application
consume the same token for to streamline the authentication process for your users.

When you develop your application, you need to be aware that your application needs access to two items when the cluster
becomes operational:

- The JWT itself. This token will be stored in the browser if your user has previously logged in to Local UI.
- The public key that is used to validate the JWT token. This token is exposed as a secret in the `spectro-system`
  namespace when you provision your Kubernetes cluster. If your cluster have multiple nodes, each node will have its own
  public key.

## Prerequisites

- The application whose authentication you want to integrate with Local UI must support HTTPS.

## Procedure

1. Determine the location where the public key file will be relative to your containerized application. At this time,
   the public key file does not exist yet because you do not yet have a cluster. Therefore, you need to remember this
   location and mount secret volume to the corresponding location in a subsequent step.

   For example, if you decide location of the key file will be `/app/keys/jwt.public.key`, then you'll need to mount the
   secret volume to this location later.

2. In your containerized application, implement a mechanism that can verify the validity of the JWT using the public
   key. The JWT is stored as a cookie named `Authorization`. The implementation of this mechanism will vary greatly
   depending on your application. For example, the following is an implementation of an
   [Express.js](https://expressjs.com/) middleware that can be used to verify the JWT before your server responds to an
   incoming HTTP request.

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

3. Build the image containing your application and push it to a registry that your host has access to. Then create a
   Kubernetes manifest that you can use to deploy the application.

4. In your cluster profile, add the manifest as an application. For more information, refer to

5. Deploy your cluster using your cluster profile. For more information, refer to
   [Create Cluster Definition](../../site-deployment/cluster-deployment.md).

6. In your cluster profile, in the application layer, include the following lines to define a volume that includes the
   secret. The naming of the secret must follow the convention. The content of the secret is a public key file that your
   application can use to verify the signature of the JWT.

## Validate

1. Log in to Local UI.

2. After logging in, attempt to visit your web application at a URL that requires authentication.

3. Confirm that you are automatically logged in.
