# CRD Catalog

The CRD Catalog allows administrators to discover, enable, and manage arbitrary Kubernetes Custom Resource Definitions (CRDs) through the VMO Manager UI. CRDs registered in the catalog gain schema-driven forms and generic CRUD APIs.

## Dynamic CRD Discovery

VMO Manager discovers CRDs installed in the cluster at runtime. The catalog lists all discovered CRDs and allows you to:

- **Enable** — Make the CRD visible in the UI and expose it via the generic API
- **Disable** — Hide the CRD from the UI (it remains installed in the cluster)
- **Configure** — Set display name, description, sidebar placement, and form options

Discovery is driven by the cluster's API server. When new CRDs are installed (e.g., via Helm), they appear in the catalog after the next sync.

## Enabling and Disabling CRDs

1. Go to **Settings > CRD Catalog** (requires the `crd-catalog` feature flag to be enabled).
2. Browse the list of discovered CRDs.
3. Toggle **Enable** for each CRD you want to expose in the UI.
4. Disabled CRDs remain in the cluster but are not shown in navigation or API responses.

> **Note:** The CRD Catalog feature is experimental and disabled by default. Enable the `crd-catalog` feature flag in Settings > Feature Flags to access it.

## Schema-Driven Forms (RJSF)

For CRDs with an OpenAPI v3 schema, VMO Manager generates forms automatically using React JSON Schema Form (RJSF). The form fields are derived from the CRD's `spec` schema, including:

- Field types (string, number, boolean, array, object)
- Required fields and validation
- Enums and allowed values
- Nested objects and arrays

Admins can customize form behavior via the catalog entry's `FieldConfig`, which supports field-level overrides for labels, descriptions, and visibility.

## Custom Sidebar Menu Items

You can add custom sidebar menu items that link to CRD resource lists or other pages. This allows CRDs to appear in the main navigation alongside built-in sections (Workloads, Image Catalog, Infrastructure, etc.).

Configure custom menu items in the CRD Catalog for each enabled CRD, specifying:

- Display label
- Icon (from Phosphor Icons)
- Route path
- Required permissions (optional)

## Generic CRUD API

Enabled CRDs are served through a generic REST API:

```
GET    /api/v1/resources/{group}/{version}/{resource}        — List resources
POST   /api/v1/resources/{group}/{version}/{resource}       — Create resource
GET    /api/v1/resources/{group}/{version}/{resource}/{name} — Get resource
PUT    /api/v1/resources/{group}/{version}/{resource}/{name} — Update resource
DELETE /api/v1/resources/{group}/{version}/{resource}/{name} — Delete resource
```

Example: For a CRD with group `example.com`, version `v1`, and resource `myresources`:

- List: `GET /api/v1/resources/example.com/v1/myresources`
- Create: `POST /api/v1/resources/example.com/v1/myresources` with JSON body

The generic handler enforces IAM permissions and validates requests against the CRD schema. All resources created through VMO Manager are labeled with `app.kubernetes.io/managed-by: vmo-manager`.
