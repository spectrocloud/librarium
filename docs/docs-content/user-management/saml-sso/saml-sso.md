---
sidebar_label: "SAML and OIDC SSO"
title: "SAML and OIDC SSO"
description: "Learn how to enable Single Sign-On (SSO) in Palette with SAML and OIDC."
icon: ""
hide_table_of_contents: false
tags: ["user-management", "saml-sso", "oidc", "saml", "sso"]
---

Palette supports Single Sign-On (SSO) with a variety of Identity Providers (IDP). You can enable SSO in Palette by using
the following protocols for authentication and authorization.

- Security Assertion Markup Language (SAML) - SAML is a standalone protocol that requires a centralized identity
  provider (IDP) to manage user identities and credentials. SAML supports SSO and is commonly used for enterprise
  applications.

- OpenID Connect (OIDC) - OIDC more modern protocol designed for web and mobile applications. OIDC is built on top of
  [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749), a widely used authorization framework. OIDC supports distributed
  identity providers and supports social login providers such as Google or GitHub.

## Palette OIDC and PXK

<!-- prettier-ignore -->
Palette can act as an Identity Provider (IDP) when <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> is used as the Kubernetes distribution in a cluster profile. Palette eXtended Kubernetes (PXK) is a recompiled version of the open source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette. To learn more about PXK, refer to the <VersionedLink text="PXK" url="/integrations/packs/?pack=kubernetes" /> page.

## OIDC Limitations

:::warning

Palette enforces a strict one-to-one mapping between an SSO domain and a tenant. We recommend planning tenant boundaries
around identity domains and using distinct SSO domains to enforce tenant separation.

:::

Palette [API keys](../authentication/api-key/api-key.md) that belong to Palette users removed from the organization
through OIDC/SAML are not automatically removed. We recommend that you remove these keys to ensure that they are no
longer used. You can programmatically remove the API keys using the REST API or the Palette SDK. Check out the
[Delete API Key](../authentication/api-key/delete-api-key.md) page for more information on how to delete an API key
programmatically.

:::tip

Tenant administrators can view all API keys created for the tenant. Users are limited to actions for their own API keys.
To learn more about the API key management tasks you can perform as a tenant administrator, refer to the
[Tenant API Key Management](../../tenant-settings/api-key-management.md) page.

:::

Check out the following resources to enable SSO in Palette with the supported Identity Providers (IDP).

## Encrypted SAML Assertions

Palette supports encrypted Security Assertion Markup Language (SAML) assertions by advertising an encryption key in its
Service Provider (SP) metadata (`<KeyDescriptor use="encryption">`). When configured with the SP’s public key, the
Identity Provider (IdP) can encrypt the entire SAML assertion (`<EncryptedAssertion>`), ensuring user attributes and
identity data are protected in transit.

### Prerequisites

- Access to Palette to view the SSO configuration and obtain the SP encryption certificate and public key.
- Access to the IdP configuration to set up SAML SSO and upload the SP encryption certificate.

### Configure Identity Provider for Encrypted Assertions

The following example demonstrates how to configure Auth0 to encrypt SAML assertions for Palette SSO. The general steps
should be similar for other IdPs that support encrypted SAML assertions.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Tenant Setting** and then select **SSO** under the **Security** section.

3. Ensure the **Configure** tab is selected and the **SSO Auth type** is set to **SAML**.

4. Scroll down to the **Service Provider Metadata** section and copy the encryption certificate that is located under
   the `<KeyDescriptor use="encryption">` tag. Save this certificate as a file named `sc_cert.pem`.

   ```xml hideClipboard title="Example SP Metadata with encryption certificate" {4-6}
     <KeyDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" use="encryption">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
       <X509Data xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Certificate xmlns="http://www.w3.org/2000/09/xmldsig#">"-----BEGIN CERTIFICATE-----
    ... your SP encryption cert ...
   -----END CERTIFICATE-----
   "</X509Certificate>
   ```

5. Use the following command to extract the public key from the certificate.

   ```bash
   openssl x509 -in sc_cert.pem -pubkey -noout
   ```

   ```shell hideClipboard title="Example output"
   -----BEGIN PUBLIC KEY-----
    ... your SP public key ...
   -----END PUBLIC KEY-----
   ```

6. In the **Service Provider Metadata** section in Palette, copy the SP Entity ID and the Assertion Consumer Service
   (ACS) URL. You will need these values to configure your IdP.

   - The SP Entity ID is typically found in the `<EntityDescriptor>` tag in the SP metadata.

     ```xml hideClipboard title="Example SP Metadata snippet showing SP Entity ID"
     <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" validUntil="" entityID="<your-palette-sp-entity-id>">
     ```

   - The ACS URL is typically found in the `<AssertionConsumerService>` tag in the SP metadata.

     ```xml hideClipboard title="Example SP Metadata snippet showing ACS URL"
       <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="<your-palette-acs-url>" index="1"></AssertionConsumerService>
     ```

     It will be in the format `https://<your-palette-domain>/v1/auth/org/<your-org-name>/saml/callback`.

7. In your IdP, configure the SAML application with the Palette SP Entity ID, ACS URL, and signing options.

   - Set the **Audience** or **SP Entity ID** field to the `entityID` value from your Palette SP metadata.

   - Set the **ACS URL**, **Recipient**, and **Destination** field to the `Location` value from your SP metadata.

   - Enable both response and assertion signing. Palette validates signatures on the response, the assertion, or both
     depending on your SP settings.

   <details>

   <summary> Example - Configuring SAML settings in Auth0 </summary>

   The following example shows how to configure these settings in Auth0. In Auth0, navigate to **Applications >
   Applications** and select the application you use for Palette SSO. Select the **Addons** tab, and click the toggle to
   enable the **SAML2 Web App** add-on.

   On the **Settings** tab, use the following configuration as a base. Replace the `audience`, `recipient`, and
   `destination` values with the appropriate values from your Palette SP metadata. The **Application Callback URL**
   field in Auth0 should be set to the same value as `<your-palette-acs-url>`.

   ```json title="Template SAML settings for Auth0 configuration"
   {
     "audience": "<your-palette-sp-entity-id>",
     "recipient": "<your-palette-acs-url>",
     "destination": "<your-palette-acs-url>",
     "nameIdentifierFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
     "nameIdentifierProbes": ["Email"],
     "mappings": {
       "FirstName": "user_metadata.given_name",
       "LastName": "user_metadata.family_name",
       "Email": "email"
     },
     "createUpnClaim": false,
     "passthroughClaimsWithNoMapping": false,
     "mapUnknownClaimsAsIs": false,
     "signResponse": true,
     "signAssertion": true
   }
   ```

   Click **Enable** to save the SAML settings.

   </details>

8. Configure your IdP to emit the SAML attributes Palette requires and to encrypt assertions using the SP certificate
   and public key from the previous steps. Palette expects the following attributes in the SAML response:

   - `Email` — the user's email address, used as the SAML NameID.
   - `FirstName` — the user's first name.
   - `LastName` — the user's last name.

   <details>

   <summary> Example - Setting attributes and encryption in Auth0 with a Post-Login Action </summary>

   The following example shows how to configure attribute mapping and assertion encryption in Auth0 using a Post-Login
   Action. In Auth0, navigate to **Actions** > **Library** > **Create Action** and select **Create Custom Action**.
   **Create** the action by providing the action details as desired and select **Login / Post Login** as the trigger.

   Use the following template code to set the SAML attributes and encryption settings in the action. Replace
   `<your-auth0-client-id>` with the Client ID of the Auth0 application you are using for Palette SSO. Replace the
   `encryptionCert` and `encryptionPublicKey` values with the SP encryption certificate and public key you obtained from
   the Palette SP metadata in steps 4 and 5.

   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     // Only apply to the Palette Auth0 application
     if (event.client.client_id !== "<your-auth0-client-id>") {
       return;
     }

     const um = event.user.user_metadata || {};

     // Prefer standard profile fields, then user_metadata fallbacks
     const email = event.user.email || um.email || event.user.username || event.user.name || event.user.user_id;

     const first = event.user.given_name || um.given_name || "User";

     const last = event.user.family_name || um.family_name || "User";

     // Emit EXACT attributes Palette expects
     api.samlResponse.setAttribute("Email", email);
     api.samlResponse.setAttribute("FirstName", first);
     api.samlResponse.setAttribute("LastName", last);

     // Make NameID come from Email
     api.samlResponse.setNameIdentifierProbes(["Email"]);

     // ----- ENCRYPTION CONFIGURATION -----
     const encryptionCert = `-----BEGIN CERTIFICATE-----
   ... your SP encryption cert ...
   -----END CERTIFICATE-----`;

     const encryptionPublicKey = `-----BEGIN PUBLIC KEY-----
   ... your SP public key ...
   -----END PUBLIC KEY-----`;

     api.samlResponse.setEncryptionCert(encryptionCert);
     api.samlResponse.setEncryptionPublicKey(encryptionPublicKey);
   };
   ```

   After saving the action, attach it to the **Login** flow by navigating to **Actions** > **Triggers** and selecting
   the `post-login` option under **Sign Up & Login**. Using the visual editor, drag the action you created from the
   right sidebar to between the **Start** and **Complete** steps and click **Apply** to save the flow.

   </details>

9. Ensure user profiles in your IdP include the first and last name attributes that Palette requires. If your IdP does
   not populate these automatically, add them manually to each user's profile.

   <details>

   <summary> Example - Adding user attributes in Auth0 </summary>

   The following example shows how to add these attributes in Auth0. In the Auth0 dashboard, navigate to **User
   Management** > **Users**, select the user you want to configure, and add the following fields to the user's
   **user_metadata**.

   Replace the values for `<user-given-name>`, `<user-family-name>`, and `<user-email>` with the appropriate values for
   the user.

   ```json
   {
     "given_name": "<user-given-name>",
     "family_name": "<user-family-name>",
     "email": "<user-email>"
   }
   ```

   Click **Save** to save the user profile. Repeat this process for each user that will authenticate to Palette through
   this IdP.

   </details>

### Validate SAML Response

After completing the configuration, test the SSO login flow and inspect the SAML response to confirm it is correctly
structured and encrypted.

1. Open your browser's Developer Tools by pressing **F12** and select the **Network** tab.

2. Initiate an SSO login from Palette by navigating to your Palette login page and selecting the SSO option.

3. In the Network tab, find the `POST` request to your Palette ACS URL. The URL will match the format
   `https://<your-palette-domain>/v1/auth/org/<your-org-name>/saml/callback`.

4. Select that request and open the **Payload** tab. Copy the value of the `SAMLResponse` field. This value is
   Base64-encoded XML.

5. Decode the value using the following command. Replace `<SAMLResponse-value>` with the copied value.

   ```bash
   echo "<SAMLResponse-value>" | base64 --decode
   ```

6. Review the decoded XML and confirm the following directly from the raw response:

   - The response contains a `<saml:EncryptedAssertion>` element wrapping `<xenc:EncryptedData>`. If you see a plaintext
     `<saml:Assertion>` element instead, encryption is not configured correctly.

   - A `<Signature>` element is present at the response level. If no `<Signature>` is present, check your IdP signing
     settings.

   The `<NameID>` and `<AttributeStatement>` elements (containing `Email`, `FirstName`, and `LastName`) are inside the
   encrypted assertion. They are not visible in plain text when encryption is active. You can confirm these are
   correctly configured by completing a full test login to Palette. A successful login means Palette was able to decrypt
   the assertion and parse the required attributes.

   <details>

   <summary> Example - Sample structure of an encrypted SAML response </summary>

   ```xml hideClipboard
   <?xml version="1.0"?>
   <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="<response-id>" InResponseTo="<request-id>" Version="2.0" IssueInstant="<timestamp>" Destination="https://<your-palette-domain>/v1/auth/org/<your-org-name>/saml/callback">
     <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">urn:<your-idp-domain></saml:Issuer>
     <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
       <SignedInfo>
         <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
         <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
         <Reference URI="#<response-id>">
           <Transforms>
             <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
             <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
           </Transforms>
           <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
           <DigestValue><!-- digest value --></DigestValue>
         </Reference>
       </SignedInfo>
       <SignatureValue><!-- signature value --></SignatureValue>
       <KeyInfo>
         <X509Data>
           <X509Certificate><!-- IdP signing certificate (base64-encoded) --></X509Certificate>
         </X509Data>
       </KeyInfo>
     </Signature>
     <samlp:Status>
       <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
     </samlp:Status>
     <saml:EncryptedAssertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
       <xenc:EncryptedData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" Type="http://www.w3.org/2001/04/xmlenc#Element">
         <xenc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"/>
         <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
           <e:EncryptedKey xmlns:e="http://www.w3.org/2001/04/xmlenc#">
             <e:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p">
               <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
             </e:EncryptionMethod>
             <KeyInfo>
               <X509Data>
                 <X509Certificate><!-- SP encryption certificate (base64-encoded) --></X509Certificate>
               </X509Data>
             </KeyInfo>
             <e:CipherData>
               <e:CipherValue><!-- encrypted session key --></e:CipherValue>
             </e:CipherData>
           </e:EncryptedKey>
         </KeyInfo>
         <xenc:CipherData>
           <xenc:CipherValue><!-- encrypted assertion data --></xenc:CipherValue>
         </xenc:CipherData>
       </xenc:EncryptedData>
     </saml:EncryptedAssertion>
   </samlp:Response>
   ```

   </details>

## Resources

- [Enable SSO with Microsoft Active Directory Federation Service (AD FS)](palette-sso-with-adfs.md)

- [Palette SSO with Okta OIDC](palette-sso-with-okta.md)

- [Palette SSO with Okta SAML](palette-sso-with-okta-saml.md)

- [Palette SSO with OneLogin](palette-sso-with-onelogin.md)

- [Palette SSO with Keycloak](palette-sso-with-keycloak.md)

- [Palette SSO with Microsoft Entra ID](palette-sso-with-entra-id.md)

- [Palette SSO with Custom CA](palette-sso-with-custom-ca.md)
