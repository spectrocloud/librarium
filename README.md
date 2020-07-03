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
git branch -b <branch_name>
```

To preview your changes use the following.

```sh
make start
```

This will open your browser to this address: http://localhost:8010
For the glossary documentations use http://localhost:8020
For the API documentations use http://localhost:8030

Open `~/Work/librarium/packages/docs/content` in your editor and make changes. They should be synced up in the browser window.

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
The number will be the position of the item in the menu. Each of the main pages can be configured by sending attributes at the start of the file's content.

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

**Example** docs/content/1-introduction/1-what-is.md will have http://localhost:8000/introduction/what-is as the url

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
![alt text](/introduction/clusterprofiles.png "cluster profiles example")
```
#### Tabs component

To use the tabs component you have to import it from the *shared* folder
```js
import Tabs from '@librarium/shared/src/components/styles/Tabs';
```

After that, you can use it like this

```js
<Tabs>
  <Tabs.TabPane tab="AWS" key="aws">

# AWS cluster

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

  </Tabs.TabPane>
  <Tabs.TabPane tab="VMware" key="vmware">

# VMware cluster

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

  </Tabs.TabPane>
</Tabs>
```
