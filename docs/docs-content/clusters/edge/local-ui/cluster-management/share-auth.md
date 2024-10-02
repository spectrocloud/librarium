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

## Prerequisites

- The application whose authentication you want to integrate with Local UI must support HTTPS.

## Procedure

1. In your cluster profile, in the application layer, include the following lines to define a volume that includes the
   secret. The naming of the secret must follow the convention. The content of the secret is a public key file that your
   application can use to verify the signature of the JWT.

2. Identify the location of the public key file relative to your containerized application. For example, if you mount
   the secret volume to `/app/keys`, then the location of the key file will be `/app/keys/wt.public.key`. You can use an
   environment variable in your application manifest to define this variable dynamically.

3. In your containerized application, implement a mechanism that can verify the validity of the JWT using the public
   key. The JWT is stored in the browser as an authorization cookie. For example, the following is an implementation of
   an [Express.js](https://expressjs.com/) middleware that can be used to verify the JWT before your server responds to
   an incoming HTTP request.

   ```javascript
   function checkAuth(req, res, next) {
     const token = req.cookies["Authorization"];
     if (!token) {
       return res.redirect(getAuthURL(req));
     }

     jwt.verify(token, secretKey, (err, decoded) => {
       if (err) {
         console.log("Error verifying token", err);
         return res.redirect(getAuthURL(req));
       }
       req.user = decoded;
       next();
     });
   }
   ```

   The middleware verifies and the JWT. If it is valid, it decodes the JWT and return the user information contained in
   the JWT. If the JWT doesn't exist or is not valid, it will redirect the user to.

4. Build the image containing your application and push it to a registry that your host has access to.

5. Deploy your cluster using your cluster profile. For more information, refer to
   [Create Cluster Definition](../../site-deployment/cluster-deployment.md).

## Validate

1. Log in to Local UI.

2. After logging in, attempt to visit your web application at a URL that requires authentication.

3. Confirm that you are automatically logged in.
