## Mobile App Code

This folder contains the code for the mobile apps (both iOS and Android).

### How to use this repository

Run `npm install` after pulling this repository for the first time or after additional dependencies/packages have been added to the project i.e. the `package.json`.

#### Developing

To start developing run `npm start`. The metro bundler will open in the browser, scan the QR code and the app should be bundled and displayed on your phone.

#### Publishing the App

To publish the newest version of the app run `npm publish`. Note: This will only publish the app to [expo.io](https://expo.io).

#### Generating binaries (i.e., Android/iOS installers)

To build the binaries and publish them run `npm build` and it will build for both Android and iOS. If you only want to build for Android use `expo build:android` and for iOS use `expo build:android`.
