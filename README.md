# Address Identity Resolver For TradeTrust

## Install

```sh
npm i --save @tradetrust-tt/address-identity-resolver
```

## Hooks

### useAddressBook

```tsx
const { addressBook ,setAddressBook, handleLocalAddressBookCsv, getIdentifier } = useAddressBook();
```

### useThirdPartyAPIEndpoints

```tsx
const {
  thirdPartyAPIEndpoints, 
  setThirdPartyAPIEndpoints, 
  addThirdPartyAPIEndpoint, 
  removeThirdPartyAPIEndpoint 
  } = useThirdPartyAPIEndpoints();
```

### useIdentifierResolver

```tsx
const { resolvedIdentifier, identifierSource } = useIdentifierResolver();
```

## Sample usage

- [**useAddressBook**](https://github.com/TradeTrust/tradetrust-website/blob/master/src/components/UI/Overlay/OverlayContent/AddressBookLocal.tsx)
- [**useThirdPartyAPIEndpoints**](https://github.com/TradeTrust/tradetrust-website/blob/master/src/components/AddressResolver/AddressesTable.tsx)
- [**useIdentifierResolver**](https://github.com/TradeTrust/tradetrust-website/blob/master/src/components/AssetManagementPanel/AssetTitle/index.tsx)

## Features

- [**React**](http://reactjs.org/) - A JavaScript library for building user interfaces.
- [**Webpack**](https://webpack.js.org/) - Component bundler.
- [**React testing library**](https://testing-library.com/) - Simple and complete testing utilities that encourage good testing practices.
- [**Jest**](https://facebook.github.io/jest) - JavaScript testing framework used by Facebook.
- [**ESLint**](http://eslint.org/) - Make sure you are writing a quality code.
- [**Prettier**](https://prettier.io/) - Enforces a consistent style by parsing your code and re-printing it.
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript superset, providing optional static typing
- [**Github Actions**](https://github.com/features/actions) - Automate tests and linting for every push or pull request.
- [**Semantic Release**](https://semantic-release.gitbook.io/semantic-release/) - Fully automated version management and package publishing.
- [**Debug**](https://github.com/visionmedia/debug) - JS debugging utility that works both in node.js and browsers.

## Development

- `npm run test`: to run tests
- `npm run lint`: to run lint
- `npm run build`: to build package
- `npm run semantic-release`: to release new version of package

