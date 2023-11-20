# Palette Keycloak integration

This document permits to integrate Palette with Keycloak and log in to Palette with credentials stored in Keycloak

## Prerequisites:

1. Access to Palette
2. Keycloak exposed on an external IP address, preferably with DNS name
3. Kubernetes cluster with LoadBalancer resources and a couple of available IPs

    (You can use Palette to install any type of Kubernetes cluster on public cloud, where LoadBalancer will be available right away or install MetalLB from Spectro Cloud pack if installing on-premises or on the edge)

## Installation

1. Provision a Kubernetes cluster from Palette and download its kubeconfig 
2. Install keycloak on our Kubernetes cluster with CLI:
```bash
$ kubectl create -f https://raw.githubusercontent.com/keycloak/keycloak-quickstarts/latest/kubernetes-examples/keycloak.yaml
```

3. After a couple of minutes, verify which address Keycloak got:
```bash
$ kubectl describe service keycloak  | grep "LoadBalancer Ingress" | awk '{print $3}'
```

for EKS, the result is going to be somewhat similar to: _a5f3a06f0063143fea26b6a086cb2c89-1900572074.eu-west-3.elb.amazonaws.com_

4. Create an Ingress from an official doc, replacing KEYCLOAK_HOST with your hostname for LoadBalancer:

```bash
wget -q -O - https://raw.githubusercontent.com/keycloak/keycloak-quickstarts/latest/kubernetes-examples/keycloak-ingress.yaml | sed "s/KEYCLOAK_HOST/a5f3a06f0063143fea26b6a086cb2c89-1900572074.eu-west-3.elb.amazonaws.com/" | kubectl create -f -
```

This creates an ingress and Palette should now show Keycloak service:

![alt_text](/user-management_saml-sso_keycloak-01-keycloak-service.png "Keycloak Service")

5. Create a convenient CNAME, for example  _keycloak.dmitry.sa.spectrodemos.com_ pointing to _a5f3a06f0063143fea26b6a086cb2c89-1900572074.eu-west-3.elb.amazonaws.com_ so that it is easier to type and to get access to the installed Keycloak

6. Login to Keycloak with default _admin:admin_ credentials at _[http://keycloak.dmitry.sa.spectrodemos.com:8080/admin](http://keycloak.dmitry.sa.spectrodemos.com:8080/admin)_, First thing is to change the admin password to something sensible!

7. Login to Palette, choose “Tenant Admin” at the top, click on “Tenant Settings” on the left hand side, then click on “SSO” in the center and “OIDC” on the right hand side. Note and copy “Callback URL” and “Logout URL” 

![alt_text](/user-management_saml-sso_keycloak-02-callback-url.png "Callback URL")

8. Login to Keycloak and create a client for Palette: click on “Create client” 

![alt_text](/user-management_saml-sso_keycloak-03-create-client.png "Create Client")

9. Fill in both “Client ID” and “Name” as “palette” and click “Next”

![alt_text](/user-management_saml-sso_keycloak-04-palette-username.png "Palette username")

10. In the following screen, activate “Client authentication” for increased security

![alt_text](/user-management_saml-sso_keycloak-05-client-authentication.png "Client Authentication")

11. In the last screen in this section paste Root URL from your Palette URL, it will probably be something similar to “_[https://$YOURNAME-$YOURCOMPANY.spectrocloud.com](https://$YOURNAME-$YOURCOMPANY.spectrocloud.com)_” 

   Paste “Callback URL” from Step 7 as “Valid redirect URLs” and “Logout URL” from the same step as “Valid post logout redirect URIs”, then click on “Save” to create the client.

12. 

![alt_text](/user-management_saml-sso_keycloak-06-keycloak-callback.png "Keycloak callback")

13. Click on “Clients” choose my “palette” client and click on “Credentials” tab in order to retrieve and copy to buffer the secret

![alt_text](/user-management_saml-sso_keycloak-07-keycloak-credentials.png "Keycloak Credentials")


14. Get back to Palette interface (OIDC tab) and paste newly obtained parameters from Keycloak:
* Issuer URL is going to be your Keycloak address with **/realms/master** added at the end, such as: _[http://keycloak.dmitry.sa.spectrodemos.com:8080/realms/master](http://keycloak.dmitry.sa.spectrodemos.com:8080/realms/master)_
* Client ID is going to be “palette”
* Client Secret is copied from the previous step

15. 

![alt_text](/user-management_saml-sso_keycloak-08-palette-callback.png "Palette Callback")

16. Press the “Enable button” at the bottom, you should see the green message “OIDC configured successfully” at the top right corner. 

![alt_text](/user-management_saml-sso_keycloak-09-palette-oidc-enabled.png "Palette OIDC Enabled")

17. Fill in first name, second name & email to the admin user.

![alt_text](/user-management_saml-sso_keycloak-10-keycloak-admin.png "Keycloak Admin")

18. SSO configuration is now over, in order to verify it, open an incognito browser window and go to the Palette URL. 

![alt_text](/user-management_saml-sso_keycloak-11-palette-sso.png "Palette SSO")

19. When clicking on “Sign In” you should be redirected to Keycloak where you can log in with “admin” credentials

20. 

![alt_text](/user-management_saml-sso_keycloak-12-keycloak-sso.png "Keycloak SSO")

21. If you type the correct Keycloak password, you are going to be authenticated and forwarded back to Palette. That completes the initial goal.

![alt_text](/user-management_saml-sso_keycloak-13-palette-logged-in.png "Palette logged in")

## OPTIONAL: Create a Team in Palette and add one more user in Keycloak

22. Get back to Palette setup, click on “Users & Teams” on the left and create a new Team using button on the top right “Create Team”

![alt_text](/user-management_saml-sso_keycloak-14-palette-groups.png "Palette groups")

23. Add a team “admins” and add “Project Admin” role to the “Default” project

24. 

![alt_text](/user-management_saml-sso_keycloak-15-palette-project.png "Palette Project")

25. Then switch back to SSO parameters and make sure it’s the default Team for SSO users

![alt_text](/user-management_saml-sso_keycloak-16-palette-sso-admins.png "Palette SSO Admins")

26. Go back to Keycloak, click on “Users” on the left hand side and create a user, making sure “Username”, “Email”, “First Name” and “Last Name” are all filled in.

![alt_text](/user-management_saml-sso_keycloak-17-keycloak-user.png "Keycloak user")

27. Then click on “Credentials” and set up some password

![alt_text](/user-management_saml-sso_keycloak-18-keycloak-password.png "Keycloak password")

28. Open another incognito window, go to Palette and log in with the newly created user in Keycloak. You should be automatically logged in Palette as admin!

![alt_text](/user-management_saml-sso_keycloak-19-keycloak-incognito.png "Keycloak incognito")

29. Voilà, the example is done, you should be logged in with the user from Keycloak without touching anything in Palette!

![alt_text](/user-management_saml-sso_keycloak-20-palette-user-logged-in.png "Palette user logged in")

Please contact us if you have any further questions on how to set up proper RBAC!
