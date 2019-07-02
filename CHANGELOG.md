# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.4.1](https://github.com/assisrafael/angular-input-masks/compare/v4.4.0...v4.4.1) (2019-05-29)



<a name="4.4.0"></a>
# [4.4.0](https://github.com/assisrafael/angular-input-masks/compare/v4.3.0...v4.4.0) (2019-05-29)


### Features

* **uiBrNumeroBeneficioMask:** mask for BR social security benefit number. ([#351](https://github.com/assisrafael/angular-input-masks/issues/351)) ([0648cd5](https://github.com/assisrafael/angular-input-masks/commit/0648cd5))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/assisrafael/angular-input-masks/compare/v4.2.1...v4.3.0) (2019-01-25)


### Features

* **brPhoneMask:** allow mode (simple, areaCode, countryCode) configuration ([#336](https://github.com/assisrafael/angular-input-masks/issues/336)) ([cad705a](https://github.com/assisrafael/angular-input-masks/commit/cad705a))
* **uiBrBoletoBancarioMask:** allow 48 characters length format ([eed6383](https://github.com/assisrafael/angular-input-masks/commit/eed6383))



<a name="4.2.1"></a>
## [4.2.1](https://github.com/assisrafael/angular-input-masks/compare/v4.2.0...v4.2.1) (2018-06-18)


### Bug Fixes

* **uiDateMask:** lock date-fns version (2.0.0-alpha.7) and fix date mask tests ([a785dc9](https://github.com/assisrafael/angular-input-masks/commit/a785dc9))
* **uiMoneyMask:** fix money masking result when field is empty ([dbfe5ff](https://github.com/assisrafael/angular-input-masks/commit/dbfe5ff))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/assisrafael/angular-input-masks/compare/v4.1.0...v4.2.0) (2018-05-24)


### Features

* support more locales for date mask ([#323](https://github.com/assisrafael/angular-input-masks/issues/323)) ([8951f3b](https://github.com/assisrafael/angular-input-masks/commit/8951f3b))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/assisrafael/angular-input-masks/compare/v4.0.1...v4.1.0) (2017-10-27)


### Bug Fixes

* **uiPercentageMask:** fix value update when using dynamic decimals ([4543e0e](https://github.com/assisrafael/angular-input-masks/commit/4543e0e))


### Features

* **uiMoneyMask:** format and parse integer models ([6609f19](https://github.com/assisrafael/angular-input-masks/commit/6609f19))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/assisrafael/angular-input-masks/compare/v4.0.0...v4.0.1) (2017-10-23)


### Bug Fixes

* stop running webdriver update on npm postinstall ([9c36d17](https://github.com/assisrafael/angular-input-masks/commit/9c36d17)), closes [#304](https://github.com/assisrafael/angular-input-masks/issues/304) [#303](https://github.com/assisrafael/angular-input-masks/issues/303)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/assisrafael/angular-input-masks/compare/v3.2.0...v4.0.0) (2017-09-24)


### Bug Fixes

* convert input value to string before replacing invalid characters ([42fe06c](https://github.com/assisrafael/angular-input-masks/commit/42fe06c)), closes [#273](https://github.com/assisrafael/angular-input-masks/issues/273)
* **maskFactory:** convert input values to string before running the clearValue function ([191a73f](https://github.com/assisrafael/angular-input-masks/commit/191a73f)), closes [#264](https://github.com/assisrafael/angular-input-masks/issues/264)
* **uiBrPhoneNumberMask:** rename directive to "ui-br-phone-number-mask" ([4bac387](https://github.com/assisrafael/angular-input-masks/commit/4bac387))
* **uiChPhoneNumber:** rename directive to "ui-ch-phone-number-mask" ([7095c3d](https://github.com/assisrafael/angular-input-masks/commit/7095c3d))
* **uiCreditCardMask:** rename "uiCreditCard" to "uiCreditCardMask" ([48ca80d](https://github.com/assisrafael/angular-input-masks/commit/48ca80d))
* **uiDateMask:** return null should handle corner cases ([#295](https://github.com/assisrafael/angular-input-masks/issues/295)) ([a8a0e04](https://github.com/assisrafael/angular-input-masks/commit/a8a0e04))
* **uiFrPhoneNumberMask:** rename directive to "ui-fr-phone-number-mask" ([43230ff](https://github.com/assisrafael/angular-input-masks/commit/43230ff))
* **uiMoneyMask:** return null should handle corner cases ([#293](https://github.com/assisrafael/angular-input-masks/issues/293)) ([6cfc724](https://github.com/assisrafael/angular-input-masks/commit/6cfc724))
* **uiUsPhoneNumberMask:** rename directive to "ui-us-phone-number-mask" ([0ed0116](https://github.com/assisrafael/angular-input-masks/commit/0ed0116))


### Features

* **uiDateMaks:** add en-us date format ([2612693](https://github.com/assisrafael/angular-input-masks/commit/2612693)), closes [#134](https://github.com/assisrafael/angular-input-masks/issues/134)
* **uiScientificNotationMask:** allow negative exponents ([dd779c3](https://github.com/assisrafael/angular-input-masks/commit/dd779c3))
* **uiScientificNotationMask:** allow negative numbers with ui-negative-number attribute ([1b94318](https://github.com/assisrafael/angular-input-masks/commit/1b94318))


### BREAKING CHANGES

* **uiUsPhoneNumberMask:** "ui-us-phone-number" was renamed to "ui-us-phone-number-mask"
* **uiFrPhoneNumberMask:** "ui-fr-phone-number" was renamed to "ui-fr-phone-number-mask"
* **uiChPhoneNumber:** "ui-ch-phone-number" was renamed to "ui-ch-phone-number-mask"
* **uiBrPhoneNumberMask:** "ui-br-phone-number" was renamed to "ui-br-phone-number-mask"
* **uiCreditCardMask:** the "ui-credit-card" mask was renamed to "ui-credit-card-mask"
* **uiMoneyMask:** uiMoneyMask used to return the input value when empty now it will return null
* **uiDateMask:** uiDateMask used to return the input value when empty now it will return null



<a name="3.2.0"></a>
# [3.2.0](https://github.com/assisrafael/angular-input-masks/compare/v3.1.0...v3.2.0) (2017-09-22)


### Features

* **uiFrPhoneMask:** implement french phone number format ([6c1b450](https://github.com/assisrafael/angular-input-masks/commit/6c1b450))
* **uiMoneyMask:** add the option to set the currency prefix. ([14b38cc](https://github.com/assisrafael/angular-input-masks/commit/14b38cc)), closes [#175](https://github.com/assisrafael/angular-input-masks/issues/175)
* **uiPercentageMask:** allow negative numbers with ui-negative-number attribute ([#300](https://github.com/assisrafael/angular-input-masks/issues/300)) ([1762cf1](https://github.com/assisrafael/angular-input-masks/commit/1762cf1))
* **uiPercentageMask:** hide percentage symbol if "ui-hide-percentage-sign" attribute is present ([9d9cf3d](https://github.com/assisrafael/angular-input-masks/commit/9d9cf3d)), closes [#192](https://github.com/assisrafael/angular-input-masks/issues/192)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/assisrafael/angular-input-masks/compare/v3.0.1...v3.1.0) (2017-09-22)


### Features

* **uiBrPhoneNumber:** include support for country code ([#299](https://github.com/assisrafael/angular-input-masks/issues/299)) ([2560af9](https://github.com/assisrafael/angular-input-masks/commit/2560af9))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/assisrafael/angular-input-masks/compare/v3.0.0...v3.0.1) (2017-09-15)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/assisrafael/angular-input-masks/compare/v2.6.0...v3.0.0) (2017-09-15)


### Bug Fixes

* **uiBrCepMask:** fix validation when handling numbers ([#282](https://github.com/assisrafael/angular-input-masks/issues/282)) ([3854362](https://github.com/assisrafael/angular-input-masks/commit/3854362))


### Chores

* remove bower build ([5f71048](https://github.com/assisrafael/angular-input-masks/commit/5f71048))


### BREAKING CHANGES

* bower builds will not be published anymore



<a name="2.6.0"></a>
# [2.6.0](https://github.com/assisrafael/angular-input-masks/compare/v2.5.0...v2.6.0) (2017-05-30)


### Bug Fixes

* **uiNumberMask:** fix numberWithoutGrupoSep spelling ([1a9dacb](https://github.com/assisrafael/angular-input-masks/commit/1a9dacb))
* **uiPercentageMask:** honor ui-hide-space when view value change to model update from controller ([#260](https://github.com/assisrafael/angular-input-masks/issues/260)) ([3f51cad](https://github.com/assisrafael/angular-input-masks/commit/3f51cad))


### Features

* **br-phone-number:** allow numbers without DDD ([8a5c5cd](https://github.com/assisrafael/angular-input-masks/commit/8a5c5cd))
* **uiDateMask:** add ru locale to date mask ([4b05575](https://github.com/assisrafael/angular-input-masks/commit/4b05575))
* **uiDateMask:** enable custom date masks and support for non-Date models ([#244](https://github.com/assisrafael/angular-input-masks/issues/244)) ([1996e11](https://github.com/assisrafael/angular-input-masks/commit/1996e11))
* **uiMoneyMask:** add support for custom decimal and thousands delimiters ([#272](https://github.com/assisrafael/angular-input-masks/issues/272)) ([7fdcd8e](https://github.com/assisrafael/angular-input-masks/commit/7fdcd8e))
* **uiMoneyMask:** allow currency simble after value ([#275](https://github.com/assisrafael/angular-input-masks/issues/275)) ([4f5c2de](https://github.com/assisrafael/angular-input-masks/commit/4f5c2de))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/assisrafael/angular-input-masks/compare/v2.4.0...v2.5.0) (2016-10-11)


### Bug Fixes

* **usPhoneNumber:** fix validation issues on us phone number ([2ea6056](https://github.com/assisrafael/angular-input-masks/commit/2ea6056))


### Features

* allow the removal of spaces after currency symbol or before % symbol ([f476dee](https://github.com/assisrafael/angular-input-masks/commit/f476dee))
* update dependency string-mask@^0.3.0 ([8204c83](https://github.com/assisrafael/angular-input-masks/commit/8204c83))
* **ui-money-mask:** add currency symbol attribute ([#203](https://github.com/assisrafael/angular-input-masks/issues/203)) ([65c7f2b](https://github.com/assisrafael/angular-input-masks/commit/65c7f2b))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/assisrafael/angular-input-masks/compare/v2.3.0...v2.4.0) (2016-06-26)


### Bug Fixes

* **uiMoneyMask:** invalid values should be converted to zero ([ec007c4](https://github.com/assisrafael/angular-input-masks/commit/ec007c4)), closes [#146](https://github.com/assisrafael/angular-input-masks/issues/146)


### Features

* **uiCreditCard:** add credit card mask ([03da0a4](https://github.com/assisrafael/angular-input-masks/commit/03da0a4))
* **uiNumberMask:** allow minus sign as first character for negative numbers ([ef449d8](https://github.com/assisrafael/angular-input-masks/commit/ef449d8)), closes [#147](https://github.com/assisrafael/angular-input-masks/issues/147)



<a name="2.3.0"></a>
# [2.3.0](https://github.com/assisrafael/angular-input-masks/compare/v2.2.0...v2.3.0) (2016-04-28)


### Bug Fixes

* **uiPercentageMask:** detect and handle backspace keypresses ([23dc640d](http://github.com/assisrafael/angular-input-masks/commit/23dc640d))


### Features

* **ui-date-mask:** include timezone offset in matching regex ([95949c86](http://github.com/assisrafael/angular-input-masks/commit/95949c86))
* **ui-money-mask:** allow decimals as strings ([34fea60d](http://github.com/assisrafael/angular-input-masks/commit/34fea60d))
* **uiChPhoneNumber:** add ch (Switzerland) phone mask ([f3723c88](http://github.com/assisrafael/angular-input-masks/commit/f3723c88))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/assisrafael/angular-input-masks/compare/v2.1.1...v2.2.0) (2016-03-28)


### Bug Fixes

* **br-cep:** force cep input to string ([65d64b14](http://github.com/assisrafael/angular-input-masks/commit/65d64b14))
* **ui-date-mask:** fix initialization of ISO date strings ([b220ae0d](http://github.com/assisrafael/angular-input-masks/commit/b220ae0d))


### Features

* **ui-br-car-plate-mask:** input mask for brazilian car plate ([03d971bf](http://github.com/assisrafael/angular-input-masks/commit/03d971bf))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/assisrafael/angular-input-masks/compare/v2.1.0...v2.1.1) (2015-11-26)


### Bug Fixes

* return null for empty number and percent fields ([510584e0](http://github.com/assisrafael/angular-input-masks/commit/510584e0))
* **ui-number-mask:** show "0" if model is 0 ([1bae78c2](http://github.com/assisrafael/angular-input-masks/commit/1bae78c2))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/assisrafael/angular-input-masks/compare/v2.0.0...v2.1.0) (2015-08-16)


### Features

* **ui-money-mask:** accept negative values ([50bf751c](http://github.com/assisrafael/angular-input-masks/commit/50bf751c))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/assisrafael/angular-input-masks/compare/v1.5.1...v2.0.0) (2015-06-29)


This release migrates all directives to angular 1.3.x.

### BREAKING CHANGES

Angular 1.2.x is no longer supported by angular-input-masks@^2.0.0, however angular-input-masks@^1.0.0 will continue to receive bug fixes.

* The following deprecated directives were removed:
* uiCpfMask: replaced by *uiBrCpfMask*
* uiCnpjMask: replaced by *uiBrCnpjMask*
* uiCpfcnpjMask:	replaced by *uiBrCpfCnpjMask*



<a name="1.5.1"></a>
## [1.5.1](https://github.com/assisrafael/angular-input-masks/compare/v1.5.0...v1.5.1) (2015-06-07)


* fix npm publish steps



<a name="1.5.0"></a>
# [1.5.0](https://github.com/assisrafael/angular-input-masks/compare/v1.4.2...v1.5.0) (2015-06-07)


### Features

* **mask-factory:** implement a module to help write new masks ([757e3204](http://github.com/assisrafael/angular-input-masks/commit/757e3204))
* **ui-br-boleto-bancario:** define a component to parse and format brazilian "boleto bancário" ([b6582452](http://github.com/assisrafael/angular-input-masks/commit/b6582452))
* **ui-br-phone-number:** preserve the original model type ([340ee6d7](http://github.com/assisrafael/angular-input-masks/commit/340ee6d7))
* **ui-percentage-value:** add attribute ui-percentage-value to use and as the same ([df8f9418](http://github.com/assisrafael/angular-input-masks/commit/df8f9418))



<a name="1.4.2"></a>
## [1.4.2](https://github.com/assisrafael/angular-input-masks/compare/v1.4.1...v1.4.2) (2015-04-07)


### Bug Fixes

* **ui-nfe-access-key-mask:** change validationErrorKey to camelCase (nfeAccessKey) ([db768beb](http://github.com/assisrafael/angular-input-masks/commit/db768beb))
* **ui-us-phone-number:** change validationErrorKey to camelCase (usPhoneNumber) ([71560d54](http://github.com/assisrafael/angular-input-masks/commit/71560d54))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/assisrafael/angular-input-masks/compare/v1.4.0...v1.4.1) (2015-04-07)


### Bug Fixes

* throw an error if a directive is used without ng-model ([31c7d518](http://github.com/assisrafael/angular-input-masks/commit/31c7d518))
* **number:** fix the result for 0 and other edge cases ([ba9bdf71](http://github.com/assisrafael/angular-input-masks/commit/ba9bdf71))
* **percentage:** fix the result for 0 and other edge cases ([5d0f456b](http://github.com/assisrafael/angular-input-masks/commit/5d0f456b))
* **ui-br-phone-number:** change validationErrorKey to camelCase (brPhoneNumber) ([406136a5](http://github.com/assisrafael/angular-input-masks/commit/406136a5))
* **ui-date-mask:** validate empty dates ([bfcb3c07](http://github.com/assisrafael/angular-input-masks/commit/bfcb3c07))
* **ui-money-mask:** fix the result for 0 and other edge cases ([9993ebc2](http://github.com/assisrafael/angular-input-masks/commit/9993ebc2))



<a name="1.4.0"></a>
# 1.4.0


### Features
- **ui-us-phone-number**


### Breaking changes

The build files are no longer available in the release folder.
They are now at a separated [repository](https://github.com/assisrafael/bower-angular-input-masks)

The instalation via bower remains the same. However all files are in root insted of the release folder.

Now we have 3 different build options:
- **angular-input-masks.js** that have all directives
- **angular-input-masks.br.js** that have only global and br directives
- **angular-input-masks.us.js** that have only global and us directives



<a name="1.3.0"></a>
# 1.3.0


### Features

- **ui-nfe-access-key-mask**
- **ui-scientific-notation-mask**
- **ui-time-mask**
- **ui-date-mask**
- **bowerFiles support**



<a name="1.2.0"></a>
# 1.2.X


### Features
- **ui-br-ie-mask**
- **ui-br-cep-mask**



<a name="1.1.0"></a>
# 1.1.X


### Features
- **ui-br-cpf-mask (ui-cpf-mask)**
- **ui-br-cnpj-mask (ui-cnpj-mask)**
- **ui-br-cpfcnpj-mask (ui-cpfcnpj-mask)**
- **ui-br-phone-number**
- **ui-percentage-mask**



<a name="1.0.X"></a>
# 1.0.X


### Features
- **ui-percentage-mask**
- **ui-number-mask**
