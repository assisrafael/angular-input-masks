# angular-input-masks [![Build Status](https://travis-ci.org/assisrafael/angular-input-masks.svg?branch=master)](https://travis-ci.org/assisrafael/angular-input-masks) [![Coverage Status](https://coveralls.io/repos/assisrafael/angular-input-masks/badge.svg?branch=master)](https://coveralls.io/r/assisrafael/angular-input-masks?branch=master) [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

[![NPM](https://nodei.co/npm/angular-input-masks.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angular-input-masks/)

[![Join the chat at https://gitter.im/assisrafael/angular-input-masks](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/assisrafael/angular-input-masks?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Bountysource](https://www.bountysource.com/badge/team?team_id=60791&style=bounties_posted)](https://www.bountysource.com/teams/angular-input-masks/bounties?utm_source=angular-input-masks&utm_medium=shield&utm_campaign=bounties_posted)

Opinionated angular input masks. Provides ready to use masks with little (br/inscricao-estadual) to no configuration (number, cnpj, etc).

### Compatibility

- angular-input-masks@~2: angular@^1.3 (however is only tested with lastest 1.x version) and [ECMAScript 5 compliant browsers](http://kangax.github.io/compat-table/es5/) (however CI only tests chrome and firefox).
- angular-input-masks@~1: angular@~1.2


## Installation

```
npm install --save angular-input-masks
```

## Configuration

### Without browserify:

1. Import the ```angular-input-masks-standalone.min.js``` script in your page. For example:

```
<script src="angular-input-masks-standalone.min.js"></script>
```

Obs: for npm the build scripts are available inside ```releases``` folder.

2. Include the module name ```ui.utils.masks``` in your angular app. For example:

```
angular.module('app', ['ui.utils.masks']);
```

### With browserify:

```
angular.module('demo', [require('angular-input-masks')]);
```

## Internationalization

Some masks are internationalized, so you need to include the proper angular-locale in your app(see: https://docs.angularjs.org/guide/i18n).

## How to use

 - Number mask Example :

```html
<input type="text" name="field" ng-model="number" ui-number-mask>
```

- Define the number of decimals (default is 2):

```html
<input type="text" name="field" ng-model="number" ui-number-mask="3">
```

### More examples ###

_See more usage examples in the [Demo page](http://assisrafael.github.io/angular-input-masks/)_


## Other build options

If you are using npm (without browserify):

- angular-input-masks-dependencies.js: provides all external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks-br.js: provides only global and BR directives, and does not include external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks-us.js: provides only global and US directives, and does not include external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks-fr.js: provides only global and FR directives, and does not include external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks.js: provides all directives, and does not include external dependencies (string-mask, br-validations, momentjs)

If you are using npm with browserify:

- ```require('angular-input-masks')```: provides all directives
- ```require('angular-input-masks/br')```: only global and BR directives
- ```require('angular-input-masks/us')```: only global and US directives
- ```require('angular-input-masks/fr')```: only global and FR directives

## Filters

Looking for related filters? Take a look at [angular-br-filters](https://github.com/the-darc/angular-br-filters)

## Build

```
npm install
npm run build
```

### Tests

- Unit:
 - Uses [Karma](http://karma-runner.github.io) + [Jasmine](http://jasmine.github.io/)
 - Files: `src/**/*.test.js`

```
npm run test:unit
```

- e2e:
 - Uses [Protractor](https://github.com/angular/protractor) + Jasmine
 - Files: `src/**/*.spec.js`


```
npm run test:e2e
```

- To run both tests:

```
npm test
```
