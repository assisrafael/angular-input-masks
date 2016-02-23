<a name"2.1.1"></a>
### 2.1.1 (2015-11-26)


#### Bug Fixes

* return null for empty number and percent fields ([510584e0](http://github.com/assisrafael/angular-input-masks/commit/510584e0))
* **ui-number-mask:** show "0" if model is 0 ([1bae78c2](http://github.com/assisrafael/angular-input-masks/commit/1bae78c2))


<a name"2.1.0"></a>
## 2.1.0 (2015-08-16)


#### Features

* **ui-money-mask:** accept negative values ([50bf751c](http://github.com/assisrafael/angular-input-masks/commit/50bf751c))


<a name"2.0.0"></a>
### 2.0.0 (2015-06-29)

This release migrates all directives to angular 1.3.x.

### BREAKING CHANGES

Angular 1.2.x is no longer supported by angular-input-masks@^2.0.0, however angular-input-masks@^1.0.0 will continue to receive bug fixes.

* The following deprecated directives were removed:
  * uiCpfMask: replaced by *uiBrCpfMask*
	* uiCnpjMask: replaced by *uiBrCnpjMask*
	* uiCpfcnpjMask:	replaced by *uiBrCpfCnpjMask*


<a name"1.5.1"></a>
### 1.5.1 (2015-06-07)

* fix npm publish steps

<a name"1.5.0"></a>
## 1.5.0 (2015-06-07)


#### Features

* **mask-factory:** implement a module to help write new masks ([757e3204](http://github.com/assisrafael/angular-input-masks/commit/757e3204))
* **ui-br-boleto-bancario:** define a component to parse and format brazilian "boleto bancário" ([b6582452](http://github.com/assisrafael/angular-input-masks/commit/b6582452))
* **ui-br-phone-number:** preserve the original model type ([340ee6d7](http://github.com/assisrafael/angular-input-masks/commit/340ee6d7))
* **ui-percentage-value:** add attribute ui-percentage-value to use and as the same ([df8f9418](http://github.com/assisrafael/angular-input-masks/commit/df8f9418))


<a name"1.4.2"></a>
### 1.4.2 (2015-04-07)


#### Bug Fixes

* **ui-nfe-access-key-mask:** change validationErrorKey to camelCase (nfeAccessKey) ([db768beb](http://github.com/assisrafael/angular-input-masks/commit/db768beb))
* **ui-us-phone-number:** change validationErrorKey to camelCase (usPhoneNumber) ([71560d54](http://github.com/assisrafael/angular-input-masks/commit/71560d54))


<a name"1.4.1"></a>
### 1.4.1 (2015-04-07)


#### Bug Fixes

* throw an error if a directive is used without ng-model ([31c7d518](http://github.com/assisrafael/angular-input-masks/commit/31c7d518))
* **number:** fix the result for 0 and other edge cases ([ba9bdf71](http://github.com/assisrafael/angular-input-masks/commit/ba9bdf71))
* **percentage:** fix the result for 0 and other edge cases ([5d0f456b](http://github.com/assisrafael/angular-input-masks/commit/5d0f456b))
* **ui-br-phone-number:** change validationErrorKey to camelCase (brPhoneNumber) ([406136a5](http://github.com/assisrafael/angular-input-masks/commit/406136a5))
* **ui-date-mask:** validate empty dates ([bfcb3c07](http://github.com/assisrafael/angular-input-masks/commit/bfcb3c07))
* **ui-money-mask:** fix the result for 0 and other edge cases ([9993ebc2](http://github.com/assisrafael/angular-input-masks/commit/9993ebc2))


<a name="1.4.0"></a>
# 1.4.0

## Features
- **ui-us-phone-number**

## Breaking changes

The build files are no longer available in the release folder.
They are now at a separated [repository](https://github.com/assisrafael/bower-angular-input-masks)

The instalation via bower remains the same. However all files are in root insted of the release folder.

Now we have 3 different build options:
- **angular-input-masks.js** that have all directives
- **angular-input-masks.br.js** that have only global and br directives
- **angular-input-masks.us.js** that have only global and us directives


<a name="1.3.0"></a>
# 1.3.0

## Features

- **ui-nfe-access-key-mask**
- **ui-scientific-notation-mask**
- **ui-time-mask**
- **ui-date-mask**
- **bowerFiles support**


<a name="1.2.0"></a>
# 1.2.X

## Features
- **ui-br-ie-mask**
- **ui-br-cep-mask**


<a name="1.1.0"></a>
# 1.1.X

## Features
- **ui-br-cpf-mask (ui-cpf-mask)**
- **ui-br-cnpj-mask (ui-cnpj-mask)**
- **ui-br-cpfcnpj-mask (ui-cpfcnpj-mask)**
- **ui-br-phone-number**
- **ui-percentage-mask**


<a name="1.0.X"></a>
# 1.0.X

## Features
- **ui-percentage-mask**
- **ui-number-mask**
