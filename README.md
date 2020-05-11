## Prerequisites

- an text editor (I recommend [vscode](https://code.visualstudio.com/))
- git configured and access to github repository

```sh
git config --global user.name "Sam Smith"
git config --global user.email sam@example.com
```

- node and npm
  - install https://brew.sh/
  - `brew install node`

## Setup (one time)

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

## Documentation Content

Create a branch if needed. This will keep your work separated from the rest of your changes.

```sh
git branch -b <branch_name>
```

To preview your changes use the following.

```sh
make start
```

This will open your browser to this address: http://localhost:8000

Open `~/Work/librarium/packages/docs/content` in your editor and make changes. They should be synced up in the browser window.

When you are done with some changes you can create a commit

```sh
make commit "<your message here>"
```

This will open your browser with the commit. Once the pull request is created a link will be added in the comments to preview the change in a staging environment.
