# angular-input-masks [![Build Status](https://travis-ci.org/assisrafael/angular-input-masks.svg?branch=master)](https://travis-ci.org/assisrafael/angular-input-masks) [![Coverage Status](https://coveralls.io/repos/assisrafael/angular-input-masks/badge.svg?branch=master)](https://coveralls.io/r/assisrafael/angular-input-masks?branch=master)

[![NPM](https://nodei.co/npm/angular-input-masks.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angular-input-masks/)

[![Join the chat at https://gitter.im/assisrafael/angular-input-masks](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/assisrafael/angular-input-masks?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Bountysource](https://www.bountysource.com/badge/team?team_id=60791&style=bounties_posted)](https://www.bountysource.com/teams/angular-input-masks/bounties?utm_source=angular-input-masks&utm_medium=shield&utm_campaign=bounties_posted)

Opinionated angular input masks. Provides ready to use masks with little (br/inscricao-estadual) to no configuration (number, cnpj, etc).

### Compatibility

- angular-input-masks@~2: angular@~1.3 and [ECMAScript 5 compliant browsers](http://kangax.github.io/compat-table/es5/) (however CI only tests chrome and firefox).
- angular-input-masks@~1: angular@~1.2

The lib may be compatible with angular@~1.4, however it is not tested against that version.

## Installation

With Bower:

```
bower install --save angular-input-masks
```

With npm:

```
npm install --save angular-input-masks
```

## Configuration

### With bower or npm (without browserify):

1. Import the ```angular-input-masks-standalone.min.js``` script in your page. For example:

```
<script src="angular-input-masks-standalone.min.js"></script>
```

Obs: for npm the build scripts are available inside ```releases``` folder.

2. Include the module name ```ui.utils.masks``` in your angular app. For example:

```
angular.module('app', ['ui.utils.masks']);
```

### With npm and browserify:

```
angular.module('demo', [require('angular-input-masks')]);
```

## Internationalization

Some masks are internationalized, so you need to include the proper angular-locale in your app(see: https://docs.angularjs.org/guide/i18n).

## How to use

### ui-number-mask ###

 - Example:

```html
<input type="text" name="field" ng-model="number" ui-number-mask>
```

- Define the number of decimals (default is 2):

```html
<input type="text" name="field" ng-model="number" ui-number-mask="3">
```

- Allow negative numbers using the ```ui-negative-number``` attribute:

```html
<input type="text" name="field" ng-model="number" ui-number-mask="4" ui-negative-number>
```

- Support to the ```min```, ```max``` and ```ui-hide-group-sep``` attributes.

```html
<input type="text" name="field" ng-model="number" ui-number-mask min="10.1" max="100.9">
```

```html
<!-- Use 'ui-hide-group-sep' attribute if you don't want show the thousands separators-->
<input type="text" name="field" ng-model="number" ui-number-mask ui-hide-group-sep>
```

- Internationalized: Used the decimal separator and the thousands separator defined in the client browser configuration.

### ui-percentage-mask ###

 - Example:

```html
<input type="text" name="field" ng-model="percentage" ui-percentage-mask>
```

- You can set the number of decimals (default is 2):

```html
<input type="text" name="field" ng-model="percentage" ui-percentage-mask="4">
```

- The $modelValue is the $viewValue / 100, so $viewValue - 100% = $modelValue - 1

- You can use the same value in $modelValue and $viewValue using ```ui-percentage-value```:

```html
<input type="text" name="field" ng-model="percentage" ui-percentage-mask ui-percentage-value>
```

- Support to the ```min```, ```max``` and ```ui-hide-group-sep``` attributes.

- Internationalized: Used the decimal separator and thousands separator defined in the client browser configuration.

- The $modelValue is the $viewValue / 100, so $viewValue - 100% = $modelValue - 1

### ui-money-mask ###

 - Example:

```html
<input type="text" name="field" ng-model="money" ui-money-mask>
```

- Define the number of decimals (default is 2):

```html
<input type="text" name="field" ng-model="money" ui-money-mask="3">
```

- Support to the ```min```, ```max``` and ```ui-hide-group-sep``` attributes.

- Internationalized: Used the currency symbol, decimal separator and thousands separator defined in the client browser configuration.

### ui-br-phone-number ###
```html
<input type="text" name="field" ng-model="phoneNumber" ui-br-phone-number>
```

### ui-br-cep-mask ###
```html
<input type="text" name="field" ng-model="cep" ui-br-cep-mask>
```

### ui-br-cpf-mask ###

 - Example:

```html
<input type="text" name="field" ng-model="initializedCpf" ui-br-cpf-mask>
```

### ui-br-cnpj-mask ###

 - Example:

```html
<input type="text" name="field" ng-model="initializedCnpj" ui-br-cnpj-mask>
```

### ui-br-cpfcnpj-mask ###

 - Example:

```html
<input type="text" name="field" ng-model="initializedCpfCnpj1" ui-br-cpfcnpj-mask>
```

### ui-br-ie-mask ###
```html
<select ng-init="ufs=['AC','AL','AM','TO']" ng-model="selectedUF" ng-options="uf for uf in ufs"></select>
<input type="text" name="field19" ng-model="ieField" ui-br-ie-mask='selectedUF'>
```
- Support masks for all the 27 brazillian states.

- Validations according to the [Sintegra especification](http://www.sintegra.gov.br/insc_est.html).

### ui-time-mask ###
-Example:

```html
<input type="text" name="field" ng-model="initializeTime" ui-time-mask>
```
- Support to the ```short``` attributes.
```html
<input type="text" name="field" ng-model="initializeTime" ui-time-mask="short">
```
### More examples ###

_See more usage examples in the [Demo page](http://assisrafael.github.io/angular-input-masks/)_


### Masks without documentation (help wanted!)

- ui-nfe-acces-key-mask
- ui-time-mask
- ui-date-mask
- ui-br-boleto-bancario-mask
- ui-scientific-notation-mask
- ui-us-phone-number

## Another build options

If you are using bower or npm (without browserify):

- angular-input-masks-dependencies.js: provides all external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks-br.js: provides only global and BR directives, and does not include external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks-us.js: provides only global and US directives, and does not include external dependencies (string-mask, br-validations, momentjs)
- angular-input-masks.js: provides all directives, and does not include external dependencies (string-mask, br-validations, momentjs)

If you are using npm with browserify:

- ```require('angular-input-masks')```: provides all directives
- ```require('angular-input-masks/br')```: only global and BR directives
- ```require('angular-input-masks/us')```: only global and US directives

## Filters

Looking for related filters? Take a look at [angular-br-filters](https://github.com/the-darc/angular-br-filters)

## Build

```
npm install
gulp build
```

### Tests

- Unit:
 - Uses [Karma](http://karma-runner.github.io) + [Jasmine](http://jasmine.github.io/)
 - Files: src/**/*.test.js

```
gulp test:unit
```

- e2e:
 - Uses [Protractor](https://github.com/angular/protractor) + Jasmine
 - Files: src/**/*.spec.js


```
gulp test:e2e
```

- To run both tests:

```
gulp test
```
