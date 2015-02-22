# angular-input-masks [![Build Status](https://travis-ci.org/assisrafael/angular-input-masks.svg?branch=master)](https://travis-ci.org/assisrafael/angular-input-masks) [![Coverage Status](https://coveralls.io/repos/assisrafael/angular-input-masks/badge.svg?branch=master)](https://coveralls.io/r/assisrafael/angular-input-masks?branch=master) 

[![Join the chat at https://gitter.im/assisrafael/angular-input-masks](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/assisrafael/angular-input-masks?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Bountysource](https://www.bountysource.com/badge/team?team_id=60791&style=bounties_posted)](https://www.bountysource.com/teams/angular-input-masks/bounties?utm_source=angular-input-masks&utm_medium=shield&utm_campaign=bounties_posted)

Personalized and localized input masks for AngularJS

##  Installation

With Bower:

```
bower install --save angular-input-masks
```

## How to use

1. Import the ```masks.min.js``` script in your page.

2. Include the module ```ui.utils.masks``` in your angular app.

3. Include the ui-mask directive in a text field like the examples abouve:

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

- Support to the ```min```, ```max``` and ```ui-hide-group-sep``` attributes.

- Internationalized: Used the decimal separator and thousands separator defined in the client browser configuration.

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

### More examples ###

_See more usage examples in the [Demo page](http://assisrafael.github.io/angular-input-masks/)_

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
 - Files: src/**/*.test.js


```
gulp test:e2e
```

- To run both tests:

```
gulp test
```
