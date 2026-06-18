<!-- vale off -->

# Authoring Content

## Documentation Content

Create a branch to keep track of all your changes.

```sh
git checkout -b <branch_name>
```

Make changes to any markdown files in the [`docs/docs-content`](../docs-content/) folder.

Start the local development server and preview your changes by navigating to the documentation page you modified. You
can start the local development server by issuing the following command:

```sh
make start
```

When you are done with your changes, stage your changes and create a commit

```sh
git add -A && git commit -m "docs: your commit message here"
```

## Creating Pages

The documentation website is structured in a sidebar with main pages and sub-pages. Main pages will contain an overview
of the its sub pages.

### Anatomy of a documentation page

The **navigation** sidebar will be something across all pages.

The **header** will include a search bar and links to different sections of the documentation (API).

The page **content** will be displayed under the header and next to the sidebar. On the right, there will be a **table
of contents** menu that will extract all of the headers inside the content and display them in a list. This will follow
the user as they scroll the page. On top of the table of contents, there will be a **GitHub link** to the content of the
file. This can be used by users to submit changes to different sections of our documentation.

### Main Pages

Create a page with the filename `<url-using-dashes>.md` in the `docs-content` folder of the `content` directory. For
positioning the document in the sidebar, you can use `sidebar_position: 1` in the front matter. To manage folders,
create a `_category_.json` file with `{position: 1}` inside the desired directory.

**Example of attributes**

```markdown
---
title: "Introduction"
sidebar_label: "Introduction"
description: "Palette API Introduction"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "graph"
---
```

#### Front Matter Attributes

An exhaustive list of front matter attributes is available in the
[Docusaurus documentation](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter).

| attribute                                   | type    | description                                                                                             |
| ------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `sidebar_label`                             | string  | used as the label for navigation                                                                        |
| `title`                                     | string  | will appear on the browser window / tab as the title                                                    |
| `description`                               | string  | the text to display when a page is shared in social media platforms                                     |
| `sidebar_custom_props:`<br>` icon: "graph"` | string  | one of icons from https://fontawesome.com/icons?d=gallery                                               |
| `hide_table_of_contents`                    | boolean | setting this to `false` will hide the page from the navigation                                          |
| `sidebar_position`                          | number  | the position of the page in the navigation sidebar. The pages are sorted ascending by this value        |
| `toc_min_heading_level`                     | number  | the minimum heading level to show in the table of contents. The default value for all documents is `2`. |
| `toc_max_heading_level`                     | number  | the maximum heading level to show in the table of contents. The default value for all documents is `3`. |
| `tags`                                      | array   | A list of string that can be used for additonal categorization of content.                              |
| `keywords`                                  | array   | A list of strings that areused for SEO purposes.                                                        |

### Sub pages

Create a folder using the **same name** of the main page. Inside it, create a Markdown file with the same name
convention (`<url-using-dashes>.md`) to create subpages.

The index document for a folder follows the naming convention below. Here are some examples:

- Named as index (case-insensitive): `docs/Guides/index.md`
- Named as README (case-insensitive): `docs/Guides/README.mdx`
- Same name as the parent folder: `docs/Guides/Guides.md`

## Tutorials Sidebar

This section describes how to publish new tutorials and add new categories to the Tutorials sidebar.

### Add a New Category

To add a new sidebar category to Tutorials, create a new directory under `docs/docs-content/tutorials`. For example,
let's add a directory called `new-tutorials`.

> [!NOTE]  
> Each category directory must have at least one **.md** file to render in the sidebar. If you add an empty directory to
> `sidebars.js`, the build will break.

```shell
.
├── _category_.json
├── cluster-deployment
│   ├── _category_.json
│   ├── pcg
│   │   ├── _category_.json
│   └── └── deploy-app-pcg.md
└── new-tutorials
    ├── _category_.json
    └── new-tutorial
```

Then, add the following code to the `tutorialSidebar` array in the `sidebars.js` file.

```js
tutorialSidebar: [
  {
    type: "category",
    label: string,
    className: "category",
    collapsed: false,
    collapsible: false,
    items: [{ type: "autogenerated", dirName: "tutorials/new-tutorials" }],
    customProps: {
      icon: string,
    },
  },
  ...
];
```

Consider the following example for reference.

```js
tutorialSidebar: [
    {
      type: "category",
      label: "Edge",
      className: "category",
      collapsible: false,
      collapsed: false,
      items: [{ type: "autogenerated", dirName: "tutorials/edge" }],
      customProps: {
        icon: "microchip",
      },
    },
  ...
];
```

### Publish New Tutorials

To add tutorials to an existing category, create a new **.md** file in the respective directory under
`docs-content/tutorials` and follow the guidance outlined in [Creating Pages](#creating-pages).

## Approvers/Reviewers

The content in this repository requires approval from the documentation team. The approval rules can be found in the
[CODEOWNERS](../../CODEOWNERS) file. Only members of the documentation team may modify this file.
