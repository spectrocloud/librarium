---
title: "What is spectrocloud"
metaTitle: "This is the title tag of this page"
metaDescription: "This is the meta description"
---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### npm start

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm test

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### npm run build

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### npm run i18n:scan

This will scan the `src` code and generate files based on the namespace for each page,
an `all.json` file and a `common.json` for components.
The `all.json` file is required for the `i18n:prepare` step

### npm run i18n:prepare

This will create a `missing.json` file for each language that will be sent to the translation team.
Once translated this file will be used in the next step

### npm run i18n:consume

This will take the translated `missing.json` files and populate the rest of the files with the translations provided.
Next we need to force add the updated json files.
