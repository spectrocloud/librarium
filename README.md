# Overview

![Spectro Cloud logo with docs inline](/assets/logo_landscape_for_white.png)

Welcome to the Spectro Cloud documentation repository. To get started with contributions, please review the entire README. 

For internal Spectro Cloud users, please review the [contributions](https://spectrocloud.atlassian.net/wiki/spaces/DE/pages/1765572627/Contribution) section of the Documentation & Education's teams home page. 

There are two local development paths available; Docker based, and non-Docker based. To reduce complexities, we recommended the Docker based development approach. 

## Prerequisites

To contribute, we recommende having the following software installed locally on your workstation.

- Text Editor
- [Docker](https://docs.docker.com/desktop/)
- git configured and access to github repository
- node and npm (optional)

## Local Development (Docker)

To get started with the Docker based local development approach ensure you are in the root context of this repository. 

Next, issue the following command to build the Docker image.

**Note**: The first time issuing the command may take several minutes.

```shell
make docker-image
```

To start the Dockererized local development server, issue the command:

```
make docker-start
```

The local development server is ready when the following output is displayed in your terminal.

```shell
You can now view root in the browser.
⠀
  Local:            http://localhost:9000/
  On Your Network:  http://172.17.0.2:9000/
⠀
View GraphiQL, an in-browser IDE, to explore your site's data and schema
⠀
  Local:            http://localhost:9000/___graphql
  On Your Network:  http://172.17.0.2:9000/___graphql
⠀
Note that the development build is not optimized.
To create a production build, use gatsby build
```

Visit [http://localhost:9000](http://localhost:9000) to view the local development documentation site.

To exit from the local development Docker container. Press `Ctrl + Z`.

## Local Development Setup (Non-Docker)

Make a folder somewhere you can easily find

```sh
mkdir ~/Work
```

Clone the repository and run the initialization script

```sh
cd Work
git clone https://github.com/spectrocloud/librarium.git
cd librarium
make initialize
```

# Documentation Content

Create a branch if needed. This will keep your work separated from the rest of your changes.

```sh
git checkout -b <branch_name>
```

To preview your changes use the following.

```sh
make start
```

This will open your browser to this address: http://localhost:9000

Open `~/Work/librarium/content/docs` in your editor and make changes. They should be synced up in the browser window.

When you are done with some changes you can create a commit

```sh
make commit MESSAGE="<your message here>"
```

This will open your browser with the commit. Once the pull request is created a link will be added in the comments to preview the change in a staging environment.

## Creating pages

The documentation website is structured in a sidebar with main pages and sub-pages. Main pages will contain an overview of the its sub pages.

### Anatomy of a documentation page

The **navigation** sidebar will be something across all pages.

The **header** will have a search bar and some links to different other sections of the documentation (api, glossary, integrations)

The page **content** will be displayed under the header and next to the sidebar.
On it's right there will be a **table of contents** menu that will extract all of the headers inside the content and display them in a list.
This will follow the user as he scroll the page.
On top of the table of contents there will be a **github link** to the content of the file. This can be used by users to submit changes to different sections of our documentation

### Main pages

You can create a main page by creating a `<number>-<url-using-dashes>.md` file in the root of the `content` directory.
The number will be the position of the item in the menu. Each of the main pages can be configured by sending attributes at the start of the file"s content.

**Example of attributes**

```markdown
---
title: "Home"
metaTitle: "spectrocloud docs"
metaDescription: "This is the meta description"
icon: "home"
hideToC: true
fullWidth: true
---
```

| attribute       | type    | description                                                                                                 |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| title           | string  | used as the label for navigation                                                                            |
| metaTitle       | string  | will appear on the browser window / tab as the title                                                        |
| metaDescription | string  | the text to display when a page is shared in social media platforms                                         |
| icon            | string  | one of icons from https://fontawesome.com/icons?d=gallery                                                   |
| hideToC         | boolean | setting this to `false` will hide the page from the navigation                                              |
| fullWidth       | boolean | setting this to `false` this can se set to use the full width of the page and there is no table of contents |

### Sub pages

Create a folder using the **same name** of the main page. Inside of it use the same name convention (`<number>-<url-using-dashes>.md`) to create subpages.
These pages will have the same attributes as for the main page.

#### Referencing a page

The url of a page will be composed from the path of the file relative to the `content` directory. The "number" used for ordering the menu will be stripped.

**Example** docs/content/1-introduction/1-what-is.md will have http://localhost:9000/introduction/what-is as the url

In markdown you can reference this page relatively to the root of the domain using this syntax:

```md
[Go to introduction](/introduction/what-is)
```

You can also reference pages that reside in the root `/docs` folder, such as index pages. An example is the Dev Engine index page `/docs/04.5-devx.md`. To reference the Dev Engine index page in a documentat page, referce the page by the title.

```md
[Go to Dev Enging](/devx)
```
### Redirects

To add a redirect to an existing documentation page you must add an entry to the [redirects.js](/src/shared/utils/redirects.js) file. Below is an example of what a redirect entry should look like.

```js
  {
    fromPath: `/clusters/nested-clusters/`,
    toPath: `/clusters/sandbox-clusters`,
    redirectInBrowser: true,
    isPermanent: true,
  },
```


#### Images or other assets

You can add documents in the same directory where they are used. Adding an image in the `introduction` directory can be referenced locally using:

```md
![alt text](clusterprofiles.png "cluster profiles example")
```

The same rules apply though. You can reference it from a different section using urls relative to the root directory

```md
![alt text](/introduction/clusterprofiles.png "#title=cluster profiles example")
```

**Image size**
Image size can be customized. You can provider either the width or the height. Units: '%', 'px' etc

```md
![alt text](/introduction/clusterprofiles.png "#width=120px")
```

#### Tabs component

To use the tabs component you have to import it from the _shared_ folder

```js
import Tabs from "shared/components/ui/Tabs";
```

After that, you can use it like this

```js
<Tabs>
  <Tabs.TabPane tab="AWS" key="aws">
    # AWS cluster Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Tabs.TabPane>
  <Tabs.TabPane tab="VMware" key="vmware">
    # VMware cluster Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Tabs.TabPane>
</Tabs>
```

**Note**: If you want to navigate from one page to another(which has tabs) and default tab to specific key then you must

- provide an identifier to the `Tabs` component `<Tabs identifier="clusterType">...</Tabs>`
- when creating the link to this page, include (in the query) the identifier provided and the **value** you want (eg: /clusters?clusterType=aws#section1)
- the values can be one of the tab panel keys
- additionally you may refer to different sections from the inner tab using the anchor points(using the #section-1)

### Points of interest component

To use this components you will have to import if from the _shared_ folder

```js
import PointsOfInterest from "shared/components/common/PointOfInterest";
```

After that you can use it like this

```js
<PointsOfInterest
  points={[
    {
      x: 20,
      y: 20,
      label: 1,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      tooltipPlacement: "rightTop",
    },
    {
      x: 80,
      y: 100,
      label: 2,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      x: 220,
      y: 230,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      tooltipPlacement: "rightTop",
    },
  ]}
>
  *Markdown content*
</PointsOfInterest>
```

**x** and **y** properties refer to the coordinates of the point starting from the **top-left corner** of the markdown container.

**Note**: **_x_**, **_y_**, **_description_** properties are **mandatory**. **_label_** and **_tooltipPlacement_** properties are optional.

If no label is specified, the default one is "+".

Possible placements are: _topLeft_, _top_, _topRight_, _rightTop_, _right_ (default), _rightBottom_, _bottomRight_, _bottom_, _bottomLeft_, _leftBottom_, _left_, _leftTop_.

### Tooltip

import Tooltip from "shared/components/ui/Tooltip";

```js
<Tooltip>tooltip content</Tooltip>
```

**Notes**

- The tooltip icon can be customized by sending a [font awesome](https://fontawesome.com/icons?d=gallery) icon

```js
<Tooltip icon="atom">tooltip content</Tooltip>
```

- If needed, the icon can be replace with text or other html tags using the trigger property:

```js
<Tooltip trigger={<button>This is a button</button>}>
  <h1>This is a h1 inside the tooltip</h1>
</Tooltip>
```

- If used inside a paragraph or other md elements the entire "block" needs to be on the same line

```js
Hello <Tooltip trigger="world">tooltip content</Tooltip>! It's me Mario
```

### Code lines highlighter

You can highlight specific lines in a block of code by adding **coloredLines** prop.

_Example_: ` ```js coloredLines=2-4|#fff,5-7|#fe1234 `.
This will color the lines from 2 to 4 and from 5 to 7 with the specified colors

_Components_:

- `2-4` - lines interval to be colored
- `|` - separator between lines interval and color
- `#fff` - hex color (colors can also be added as **rgb** format)
- `,` - separator for different colored lines intervals

### Using Warning Box compponent/Info Box component or any component that wraps content

To use these components you will have to import them from the shared folder:

```js
import WarningBox from "@librarium/shared/src/components/WarningBox";
import InfoBox from "@librarium/shared/src/components/InfoBox";
```

After that you can use them like this:

```js
<InfoBox>

  *Markdown cotent*

</InfoBox>

<WarningBox>

  *Markdown content*

</WarningBox>
```

The content must have a new line at the beginning and at the end of the tag like this:

Example:

```js
  <InfoBox>

  - Point 1
  - Point 2
  - ...

  </InfoBox>

  <WarningBox>

  - Point 1
  - Point 2
  - ...

  </WarningBox>
```

### Video

To add a video, use the following syntax:

```
`video: title: "<video title>": <path/to/video`
```

Example: 

```
`video: title: "aws-cluster-creation": ./cluster-creation-videos/aws.mp4`
```

## Check for Broken URLs

To check for broken URLs in production issue the following command but be aware this will take approximately two to three minutes.

```shell
make verify-url-links
```

If you want to check against your current local branch then use the following command. **Ensure the local server is stopped prior to issuing the command**. 

```shell
make verify-url-links-local
```

An auto generated spreedsheet is created with the name **link_report.csv**. To find broken URLs filter by the status code column. Anything with a status code not in the `200` range or with the state "broken" should be inspected.

## Approvers/Reviewers

The content in the `docs/` folder require approval from the documentation team. The list of approvers and reviewers can be found in the [OWNERS_ALIAS](./content/OWNER_ALIASES) file. Only members of the documentation team may modify this file.
