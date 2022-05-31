# Prerequisites

- an text editor (I recommend [vscode](https://code.visualstudio.com/))
- git configured and access to github repository

```sh
git config --global user.name "Sam Smith"
git config --global user.email sam@example.com
```

- node and npm
  - install https://brew.sh/
  - `brew install node`

# Setup (one time)

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

To avoid adding extra space in the box:

- If you have bullet points, the content will have at the beginning and at the end, a new line ;

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

- If you only have text, then there is no need for new lines;

Example:

```js
  <InfoBox>
    *TEXT content that you write without new lines*
  </InfoBox>

  <WarningBox>
    *TEXT content that you write without new lines*
  </WarningBox>
```
