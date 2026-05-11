# Branding

VMO Manager supports full branding customization so you can tailor the platform's appearance to your organization. Branding settings are managed under **Settings > Branding** and stored in a Kubernetes ConfigMap.

## Product Name

The product name appears in:

- The header (top of the sidebar)
- The browser tab title (with optional suffix)
- Page titles and navigation labels

Set `branding.productName` via the Configuration page or the Branding settings UI. The default is "VMO Manager".

## Logo and Favicon

### Logo

Upload a custom logo to replace the default Spectro Cloud logo. The logo appears in the sidebar header and on the login page.

- Supported formats: PNG, JPEG, GIF
- Recommended size: 200x40 pixels or similar aspect ratio
- The logo is stored in a ConfigMap and served from `/api/v1/branding/assets/`

### Favicon

The favicon is the small icon shown in the browser tab. You can:

- Upload a custom favicon (PNG, JPEG, GIF, ICO)
- Generate a favicon from your logo (Settings > Branding provides a generate option)

The favicon is stored alongside the logo in the branding ConfigMap.

## Color Overrides

Branding colors control the visual theme of the application. All colors use hex format (e.g., `#1F7A78`).

| Setting | Description | Default |
|---------|-------------|---------|
| Primary Color | Buttons, links, active states | `#1F7A78` |
| Accent Color | Sidebar highlights, secondary elements | `#9EB277` |
| Sidebar Color | Sidebar background | `#043736` |
| Sidebar Hover Color | Sidebar item hover/active background | `#0a4c48` |
| Sidebar Border Color | Sidebar divider line | `#0a4c48` |
| Heading Color | Product name in header | `#1F7A78` |
| Page Background | Main content area (empty = theme default) | — |

Colors can be set via the Configuration page under the `branding` section or through the Branding settings UI.

## Copyright Text

The copyright text appears in the sidebar footer. Set `branding.copyrightText` to display your organization's copyright notice (e.g., "© Your Company 2026").

## STIG Consent Banner

For environments requiring STIG compliance, you can enable a consent banner that appears before the login page. Users must acknowledge the banner before proceeding to authenticate.

| Setting | Description |
|---------|-------------|
| Login Banner Enabled | Turn the consent banner on or off |
| Login Banner Title | Title text (default: "Privacy and Consent Notice") |
| Login Banner Text | Body text explaining the consent terms (plain text) |
| Login Banner Button Text | Button label (default: "Acknowledge") |

Configure these via the Configuration page (`branding.loginBannerEnabled`, `branding.loginBannerTitle`, `branding.loginBannerText`, `branding.loginBannerButtonText`) or the Branding settings UI.

> **Note:** The consent banner is shown before the user reaches the OIDC or local login page. It is intended for compliance with security policies that require explicit user acknowledgment of monitoring or usage terms.

## Branding Assets Storage

Logo, favicon, and other uploaded assets are stored in a Kubernetes ConfigMap in the VMO Manager namespace. The ConfigMap is created or updated when you upload assets via Settings > Branding. Assets are served by the VMO Manager API and are available without authentication for the login page.

> **Tip:** In air-gapped deployments, ensure all branding assets are uploaded through the UI or included in your deployment bundle. No external CDN or font URLs are used at runtime.
