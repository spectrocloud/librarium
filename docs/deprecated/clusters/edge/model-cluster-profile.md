## Without Custom OS

:::warning

This workflow is unavailable for new Edge clusters. Use the **Custom OS** tab to learn how to use a custom OS with your
cluster profile.

:::

### Prerequisites

No prerequisites.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired scope, project or **Tenant Admin**.

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Click the **Add New Profile** button.

5. Provide the profile with a name, description, version, and tags. Select **Full** for the profile type. Click on
   **Next**.

6. Select **Edge Native** as the cloud type and click on **Next**.

7. In the profile layers screen, for the OS layer, choose the desired OS type and OS version. Click on **Next layer**.

:::info

You can select **Bring Your Own OS (BYOOS)** if you build your enterprise Edge artifacts. Specify the registry that
hosts your provider images as the system URI. You can also provide additional cloud-init configurations in the OS pack
YAML file to set up Edge host users, install other OS packages, install certificates, and more. Refer to the
[Cloud-Init Stages](../edge-configuration/cloud-init.md) resource to learn more about the cloud-init stages.

:::

8. Choose the desired Kubernetes distribution and version. Click on **Next layer**.

9. Choose the desired CNI type and version. Click on **Next layer**.

10. Review and save your cluster profile.

You now have a cluster profile you can use for deploying Edge hosts.

<!-- prettier-ignore -->
Consider creating additional profiles with out-of-the-box packs for monitoring, security, authentication, or other
capabilities. If you need remote access to the cluster, consider adding the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack to one of the add-on profiles.

Optionally, add additional Helm or OCI registries and include applications hosted in those registries in add-on
profiles. Check out the guide for adding a [Helm](../../../registries-and-packs/registries/helm-charts.md) or
[OCI](../../../registries-and-packs/registries/oci-registry/oci-registry.md) registry to learn more.

### Validate

Verify you created a cluster profile for Edge hosts by using the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired scope, project or **Tenant Admin**.

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Select **Edge Native** as the cloud type.

You can view your newly created cluster profile on the **Cluster Profiles** page.
