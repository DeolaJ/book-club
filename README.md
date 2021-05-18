# Book Club

## Instructions

The entry files:

- HTML: `index.html`
- CSS: `css/index.scss`
- JS: `scripts/index.js`

Parcel was used as the bundler for this project

### Getting Started

    git clone https://github.com/deolaj/book-club.git
    cd book-club
    yarn install

### Development

To run the local server,

    yarn start

The `prettier` and `eslint` libraries are used for formating and error checking. Install their corresponding vscode extensions to use with VSCode.

### Production

To generate build files for production,

    yarn build

### Test

Tests were written using Cypress. Test files are in `cypress/integration/`.
To run tests

    yarn test

Then select the test to run in the Cypress test runner.
