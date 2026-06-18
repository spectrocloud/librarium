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
