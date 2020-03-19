# CoronavirusHelpRequest

## Services used

This app uses:

- [Firebase](https://firebase.google.com/)
  - Auth
  - Analytics
  - Firestore (database)
  - Hosting
- [Google Maps API](https://cloud.google.com/maps-platform/)
  - Places
  - Maps Javascript API
  - Geocoding
- [Facebook API](https://developers.facebook.com/)
  - Login

Once you've set up accounts on each of those services, you'll need to update the
configurations for each of these services.

The Firebase config and Google Maps API key can be found in `//src/config.ts`.

That file includes instructions for how to get the Firebase config from the
Firebase console, and you just need to copy your Google Maps API key there.

Once you've set up your Facebook app (takes < 5 min) to do logins, finish the setup
by copying the values Firebase requests at Firebase console -> auth -> Sign in method.

## Getting started

1. Have yarn installed (`brew install yarn`)
1. Install npm dependencies (essentially firebase) (`yarn install`).
   - Now you can run Firebase cli commands via `yarn run firebase <command>`.
   - Or just add an alias - `alias firebase='yarn run firebase'`
1. Login to Firebase (`firebase login`)
1. Deploy to Firebase to ensure that the proper Firestore indexes are set up (see below section).
1. Run the React app by going into the web_app directory, running `yarn install`, and then `yarn start`.

## Deploy

Run: `yarn deploy`

- This will build the React app and then deploy to Firebase.

## Material design

We're using the Material Design Web components documented
[here](https://github.com/material-components/material-components-web).

[Example](https://material-components.github.io/material-components-web-catalog/#/component/button)
