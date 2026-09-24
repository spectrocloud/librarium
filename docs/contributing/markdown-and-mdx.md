<!-- vale off -->

# Markdown and MDX

## Markdown Links and URLs

Markdown links use path references to link to other documentation pages. The markdown link contains the path to the page
in context from the current file. All references to another documentation page must end with the `.md` extension.

The build process automatically removes the `.md` extension from the URL during the compile. The path helps generate the
correct URL for the page when versioning is enabled.

The following example shows how to reference a page in common scenarios. Assume you have the following folder structure
when reviewing the examples.

```shell
.
└── docs
    └── docs-content
        ├── architecture
        │   ├── grpc.md
        │   └── ip-addresses.md
        ├── aws
        │   └── iam-permissions.md
        ├── clusters
        └── security.md
```

### Same Folder

To link to a file in the same folder, use the following syntax.

```md
![Insert a description here](name_of_file.md)
```

Because the file is in the same folder, you don't need to specify the path to the file.

The build process automatically searches the current folder for the file when compiling the markdown content.

For example, to reference `ip-addresses.md` from `grpc.md`, use the following syntax.

```md
![A list of all Palette public IP addresses](ip-addresses.md)
```

### Different Folder

To link to a file in a different folder, use either a relative path from the current file or an absolute path from the
`docs-content` root.

For example, to reference `iam-permissions.md` from `security.md`, use one of the following paths.

```md title="Relative path"
![A list of all required IAM permissions for Palette](aws/iam-permissions.md)
```

```md title="Absolute path"
![A list of all required IAM permissions for Palette](/aws/iam-permissions.md)
```

To reference `iam-permissions.md` from `grpc.md`, use one of the following paths.

```md title="Relative path"
![A list of all required IAM permissions for Palette](../aws/iam-permissions.md)
```

```md title="Absolute path"
![A list of all required IAM permissions for Palette](/aws/iam-permissions.md)
```

### A Heading in the Same File

To link to a heading in the same file, use the following syntax.

```md
[Link to a heading in the same file](#heading-name)
```

The `#` symbol references a heading in the same file. Use lowercase characters for the heading name, and replace spaces
with a `-` symbol. The default behavior uses dashes to separate words in the URL.

### A Heading in a Different File

To link to a heading in a different file, use the following syntax.

```md
[Link to a heading in a different file](name_of_file.md#heading-name)
```

For example, to reference the `Palette gRPC API` heading in `security.md` from `grpc.md`, use the following syntax.

```md
[Link to a heading in a different file](../security.md#palette-grpc-api)
```

The important thing to remember is that the `#` comes after the file name and before the heading name.

### Linking to and from API Docs

In Docusaurus, a **plugin** is a separate content system that owns its own source files, routes, and sidebar. Each
plugin processes Markdown independently and maintains its own file-path-to-URL mapping.

This repository configures two docs plugins in `docusaurus.config.js`.

| Plugin                 | Source folder                | URL base | Content               |
| ---------------------- | ---------------------------- | -------- | --------------------- |
| Main docs (default)    | `docs/docs-content/`         | `/`      | Product documentation |
| API docs (`id: "api"`) | `docs/api-content/api-docs/` | `/api`   | API reference         |

> [!NOTE] Tutorials and Downloads have their own sidebars in the navbar, but they use the same plugin as the rest of the
> product docs. Their folders live within `docs/docs-content/` and use the same URL base (`/`). The site shows a
> different sidebar depending on which navbar item you select (configured in `sidebars.js` and `docusaurus.config.js`),
> but Docusaurus still processes all of those pages as one plugin. That is why a tutorial can link to a product doc with
> a path such as `../../profiles/profiles.md`, while a link to the API reference must use a URL path such as
> `/api/introduction`.

Path links with a `.md` extension only work **within the same plugin**. You can link from one product doc to another
using the path syntax described above because the main docs plugin processes both files under `docs/docs-content/`.

Docusaurus cannot resolve a `.md` path across plugins. For example, a link from `docs/docs-content/` to
`docs/api-content/api-docs/1-introduction.md` doesn't work, even though both folders live under `docs/`. To link between
plugins, use a **URL path** instead. Don't include a file extension in the link.

```md
<!-- From a page in docs/docs-content/ -->

[Palette API introduction](/api/introduction)

[API Key section](/api/introduction#api-key)

[Palette API v1 endpoints](/api/category/palette-api-v1/)
```

The same rule applies in reverse. From a page under `docs/api-content/`, link back to product docs with a URL path.

```md
<!-- From a page in docs/api-content/ -->

[Create API Key](/user-management/authentication/api-key/create-api-key)
```

Use the route path the page appears at on the site, not the folder path in the repository. For example, use
`/api/introduction`, not `/api-content/api-docs/1-introduction.md` or `/api-content/authentication`.

> [!NOTE] Root-relative URL paths such as `/api/introduction` resolve against the current host. On a legacy deployment
> such as [v4.8.x](https://version-4-8.legacy.docs.spectrocloud.com/), that link stays on the versioned site. Avoid
> hard-coded links to `https://docs.spectrocloud.com/...` in content that must work on archived versions, because those
> always point to the latest production site.

## Redirects

If a file already exists and you need to move it elsewhere, add a redirect entry that points from the old path to the
new path using the [redirects.js](../../redirects.js) file. This ensures that anywhere old links are used, whether that
be links embedded in the product or pages saved by customers, continue to work. Below is an example of what a redirect
entry should look like.

```js
  {
    from: `/clusters/nested-clusters/`,
    to: `/clusters/sandbox-clusters`,
  },
```

## Images or other assets

All images must reside in the [`static/assets/docs/images`](../../static/assets/docs/images/) folder. All images must be
in webp format. If you save png, jpg, or jpeg to the directory, the commit hook will convert the images to webp format.
Alternately, issue the command `make format-images` to convert the images to webp format.

```md
![alt text](/clusterprofiles.png "cluster profiles example")
```

You can add a directory to the images folder.

```md
![alt text](/introduction/clusterprofiles.png "cluster profiles example")
```

**Image Loading** Image size loading can be customized. You can provide eager-load to images in the first fold of the
image with high priority so LCP (Largest Contentful Paint) for the page is not affected.

```md
![alt text eager-load](/clusterprofiles.png)
```

### Diagrams

Architecture diagrams follow their own conventions so that readers who move between pages recognize the same concept
without re-learning what shapes and colors mean. Every architecture diagram in the docs site is authored as
[Mermaid](https://mermaid.js.org/) source, pre-rendered to a webp image, and referenced from the page like any other
image asset. The Mermaid source is the source of truth; the webp is the rendered output that ships with the docs.

#### When to Add a Diagram

Add a diagram when a mental model is faster to grasp visually than in prose. Good candidates include sequence-of-events
flows, decision trees, entity relationships, and physical topologies. Do not inline a diagram inside a how-to guide.
How-to guides stay recipe-shaped and link to the diagram on its Explanation or Reference page.

#### Palette

Each diagram uses colors from the following palette. Pick the color that names the role of the component, not the color
that happens to look nice next to other components on the page.

| Role                           | Fill      | Stroke    | When to Use                                                                                   |
| ------------------------------ | --------- | --------- | --------------------------------------------------------------------------------------------- |
| Entry or actor                 | `#dbeafe` | `#2563eb` | The entry node of a flow, such as an incoming request or the actor that triggers the diagram. |
| Data plane (request path)      | `#eef6ff` | `#2563eb` | Any component that handles a live user request, such as the gateway, router, or proxy.        |
| Kubernetes control plane       | `#eef2ff` | `#4f46e5` | Custom resources, controllers, admission webhooks, or anything reconciled by Kubernetes.      |
| Local engines                  | `#dcfce7` | `#16a34a` | Inference engines that run on the appliance itself, such as vLLM, SGLang, or Ollama.          |
| Frontier or optional providers | `#ffedd5` | `#d97706` | Frontier providers, external inference endpoints, and any component that is off by default.   |
| Observability or fallback      | `#f0fdfa` | `#0f766e` | Metrics, logs, traces, and any local-fallback outcome that is not the happy path.             |
| Denial or refusal              | `#fee2e2` | `#b91c1c` | Any terminal state that refuses a request, such as HTTP 401, 403, or 429.                     |
| Neutral or generic             | `#f8fafc` | `#cbd5e1` | Actors and components that do not fit the roles above, such as an operator's browser session. |

Diagrams do _not_ need to render sensibly in a dark theme. Pick the color that makes the diagram clearest on its own
terms.

#### Shape Vocabulary

Mermaid's flowchart node shapes carry meaning in every architecture diagram.

| Mermaid shape          | Syntax    | Meaning                                                                                                 |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| Rectangle              | `[label]` | A component, service, or actor.                                                                         |
| Stadium (rounded ends) | `([...])` | The entry node of a flow.                                                                               |
| Diamond                | `{label}` | A decision node in a decision-tree or routing diagram.                                                  |
| Cylinder               | `[(...)]` | A store, such as a database, secret store, or model artifact repository.                                |
| Subgraph               | `subgraph` | A cluster of related components. Style the subgraph with the same `classDef` as the role of the group. |

Mark optional or off-by-default components with a dashed edge to their entry point rather than a dashed border.

#### Arrow Vocabulary

Mermaid's edge syntax expresses each of the following.

| Arrow          | Mermaid syntax | Meaning                                                                             |
| -------------- | -------------- | ----------------------------------------------------------------------------------- |
| Solid          | `-->`          | A request or a data-plane call.                                                     |
| Dashed         | `-.->`         | A Kubernetes reconcile loop, an egress hop, or an optional or telemetry connection. |
| Labeled        | `-- label -->` | Any of the above with a short protocol, verb, or condition label.                   |
| Bidirectional  | `<-->`         | A bidirectional state projection, such as the admin API authoring custom resources. |

Set the color of every edge with `linkStyle` so that the arrow signals what kind of interaction it is, not just where it
comes from. Use blue for a data-plane request, dashed indigo for a Kubernetes reconcile, dashed amber for egress to a
frontier provider or external endpoint, and dotted teal for a metrics or telemetry hop. Reserve solid arrows for the
request path.

Label an arrow only when the label adds information the reader cannot infer from the shapes. Prefer protocol or
transport tags such as `SSE`, `gRPC`, and `HTTPS`, or short verbs such as _reconcile_ or _classify_.

#### Label Style

Component labels are short noun phrases. Sub-labels below the component name carry the implementation detail, such as
_React and Vite behind nginx_ or _one static Go binary_. Never write a sentence inside a component; a sentence belongs
in the prose next to the diagram.

Component names in the diagram must match the names the product uses in the console, the CRDs, and the rest of the docs.
If the product's own terminology changes, the diagram changes with it.

#### Layout

Pick the flow direction that matches how the reader thinks about the system. Use `flowchart TD` for decision trees and
lifecycles, `flowchart LR` for request paths, and `flowchart TB` for topologies where control-plane and data-plane
layers stack vertically.

Keep the diagram to a single canvas. If a diagram feels too dense to fit, split it into two diagrams on separate anchors
rather than shrinking the type. Two clear pictures always beat one crowded one.

#### Tooling

The docs repo authors architecture diagrams in Mermaid, renders them to PNG with
[`@mermaid-js/mermaid-cli`](https://github.com/mermaid-js/mermaid-cli), and converts the PNG to webp with
[`cwebp`](https://developers.google.com/speed/webp/download). The webp is the artifact the docs site serves; the
Mermaid source is the authoring artifact that lives alongside it in the repo.

The Mermaid source for each diagram lives in a `mermaid/` subdirectory next to the page it belongs to, and the rendered
webp lands under `static/assets/docs/images/` per the standard image naming convention
(`<markdown-file-name>_<image-description>.webp`).

##### Prerequisites

- `npx` in `PATH` for `@mermaid-js/mermaid-cli`.
- `cwebp` on `PATH`. Install with `brew install webp` on macOS.
- A Chromium browser for the mermaid-cli renderer. If the renderer cannot find one, install it once with
  `npx --yes puppeteer browsers install chrome`.

##### Regenerating a Diagram

Render the Mermaid source to a temporary PNG, then convert the PNG to webp at its final path.

```sh
npx --yes @mermaid-js/mermaid-cli \
  -i docs/contributing/mermaid/diagramming-conventions-sample.mmd \
  -o /tmp/diagramming-conventions_sample.png \
  -b white -s 2

cwebp -q 90 /tmp/diagramming-conventions_sample.png \
  -o static/assets/docs/images/diagramming-conventions_sample.webp
```

The `-s 2` flag renders at two-times scale so that the rasterized image stays crisp on high-density displays. Commit
both the updated `.mmd` source and the regenerated `.webp` in the same change so that the source and the artifact stay
in sync.

Do not commit the intermediate PNG.

#### Sample

The following diagram uses every color role in the palette. Use it as a reference when you introduce a new component and
are unsure which role it belongs to.

![Conventions showcase: a neutral operator session driving a client app that reaches a blue gateway, which dispatches to a green local engine, on egress to an amber frontier provider, and to a red HTTP 401 denial branch, with an indigo control plane reconciling into the gateway and a teal observability stack collecting metrics from the engine.](../../static/assets/docs/images/diagramming-conventions_sample.webp)

The Mermaid source for this sample lives at
[`docs/contributing/mermaid/diagramming-conventions-sample.mmd`](./mermaid/diagramming-conventions-sample.mmd). Use it as
a starting point when you author a new diagram.

## Code Lines Highlighter

You can highlight specific lines in a block of code by using a
[metadata string](https://docusaurus.io/docs/markdown-features/code-blocks#highlighting-with-metadata-string) in the
header of the code block.

For example, the following code block declaration highlights lines 1 and 3.

````md
```text {1,3}
line one
line two
line three
```
````

### Hide Clipboard Button

The copy button is shown by default in all code blocks. You can disable the copy button by passing in the parameter
value `hideClipboard` in the markdown declaration of the code blocks. This is useful for example output where the user
doesn't need to copy or use the content.

Example ![Example](../../static/assets/docs/images/hide_copy_button_example.webp)

Result

![Result](/static/assets/docs/images/hide_copy_button.webp)

## Admonitions - Warning / Info / Tip / Danger / Tech Preview / Further Guidance / Deprecated

For guidance on using admonitions in the docs, refer to the
[Spectro Cloud Internal Style Guide: Admonitions](../../style-guide.md#admonitions).

To learn more about admonitions in Docusaurus, refer to the
[Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) guide.

The content must have a new line at the beginning and at the end of the tag.

### Warning

```mdx
:::warning

Some **content** with _Markdown_ `syntax`.

:::
```

### Info

```mdx
:::info

Some **content** with _Markdown_ `syntax`.

:::
```

### Tip

```mdx
:::tip

Some **content** with _Markdown_ `syntax`.

:::
```

### Danger

```mdx
:::danger

Some **content** with _Markdown_ `syntax`.

:::
```

### Tech Preview

The `:::preview` admonition is a custom admonition configured in `docusaurus.config.js` under `admonitions.keywords`.

Unlike other admonition types, you don't need to enter content in the admonition block. By default, the Tech Preview
admonition generates the message, "This is a Tech Preview feature and is subject to change. Don't use this feature in
production workloads." This message is hardcoded using `src/theme/Admonition/Type/TechPreview.js`. If you need to
deviate from the template text, you can provide a custom message.

```mdx
:::preview

Some **content** with _Markdown_ `syntax`.

:::
```

Files in `docs/docs-content` and `docs/api-content` are processed during the build phase. Partials in the `_partials`
directory are dynamically imported at runtime. Because of this, custom admonitions defined in `docusaurus.config.js`
that are used in partials are not rendered, and the custom admonition is ignored.

As a workaround, when using custom admonitions in partials, import and reference the admonition with JSX syntax.

```mdx
import AdmonitionTypeTechPreview from '@theme/Admonition/Type/TechPreview'; # Import below front matter

<AdmonitionTypeTechPreview /> # Use instead of :::
```

Note that when used in partials, the default message cannot be overridden.

### Further Guidance

```mdx
:::further

Some **content** with _Markdown_ `syntax`.

:::
```

Like Tech Preview, the Further Guidance admonition is a custom admonition. To use this admonition in partials, you must
import and reference it with JSX syntax.

```mdx
import AdmonitionTypeFurtherGuidance from '@theme/Admonition/Type/FurtherGuidance'; # Import below front matter

<AdmonitionTypeFurtherGuidance /> # Use instead of :::
```

### Deprecated

The `:::deprecated` admonition is a custom admonition configured in `docusaurus.config.js` under `admonitions.keywords`.

Unlike other admonition types, you do not need to enter content in the admonition block. By default, the Deprecated
admonition generates the message, "This feature is deprecated and will no longer receive new updates. Refer to the
Announcements page for additional information, as well as alternatives." This message is hardcoded using
`src/theme/Admonition/Type/Deprecated.js`. However, you can provide a custom message when you need different text.

```mdx
:::deprecated

Some **content** with _Markdown_ `syntax`.

:::
```

Like Tech Preview and Further Guidance, the Deprecated admonition is a custom admonition. To use this admonition in
partials, import and reference it with JSX syntax.

```mdx
import AdmonitionTypeDeprecated from '@theme/Admonition/Type/Deprecated'; # Import below front matter

<AdmonitionTypeDeprecated /> # Use instead of :::
```

When you use the Deprecated admonition in partials, you cannot override the default message.
