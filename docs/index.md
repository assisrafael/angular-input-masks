# How to use

## ui-number-mask ##

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


## ui-percentage-mask ##

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

- You can add ```ui-hide-space``` attribute to hide space between [NUMBER] and %


## ui-money-mask ##

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

- You can add ```ui-hide-space``` attribute to hide space between [Currency symbol] and [NUMBER]


## ui-br-phone-number ##
```html
<input type="text" name="field" ng-model="phoneNumber" ui-br-phone-number-mask>
```
* Suports only *simple* phone number format: `1234-5678` || `12345-6789`
```html
<input type="text" name="field" ng-model="phoneNumber" ui-br-phone-number-mask="simple">
```
* Suports only *area code* phone number format: `(12) 3456-7890` || `(12) 34567-8901`
```html
<input type="text" name="field" ng-model="phoneNumber" ui-br-phone-number-mask="areaCode">
```
* Suports only *country code* phone number format: `+12 (34) 5678-9012` || `+12 (34) 56789-0123`
```html
<input type="text" name="field" ng-model="phoneNumber" ui-br-phone-number-mask="countryCode">
```

## ui-us-phone-number ##

* Example:

```html
  <input type="tel" name="field" ng-model="phoneNumber" ui-us-phone-number-mask>
```

* Outputs phone number in the following format: (123) 456-7890

## ui-br-cep-mask ##
```html
<input type="text" name="field" ng-model="cep" ui-br-cep-mask>
```


## ui-br-cpf-mask ##

 - Example:

```html
<input type="text" name="field" ng-model="initializedCpf" ui-br-cpf-mask>
```


## ui-br-cnpj-mask ##

 - Example:

```html
<input type="text" name="field" ng-model="initializedCnpj" ui-br-cnpj-mask>
```


## ui-br-cpfcnpj-mask ##

 - Example:

```html
<input type="text" name="field" ng-model="initializedCpfCnpj1" ui-br-cpfcnpj-mask>
```

## ui-br-numero-beneficio-mask ##

 - Example:

```html
<input type="text" name="field" ng-model="initializedNumeroBeneficio" ui-br-numero-beneficio-mask>
```

 - Máscara o número do benefício do INSS que segue o formato 999.999.999-9. 


## ui-br-ie-mask ##
```html
<select ng-init="ufs=['AC','AL','AM','TO']" ng-model="selectedUF" ng-options="uf for uf in ufs"></select>
<input type="text" name="field19" ng-model="ieField" ui-br-ie-mask='selectedUF'>
```
- Support masks for all the 27 brazillian states.

- Validations according to the [Sintegra especification](http://www.sintegra.gov.br/insc_est.html).


## ui-time-mask ##
-Example:

```html
<input type="text" name="field" ng-model="initializeTime" ui-time-mask>
```
- Support to the ```short``` attributes.
```html
<input type="text" name="field" ng-model="initializeTime" ui-time-mask="short">
```


## ui-date-mask ##
-Example:

```html
<input type="text" name="field" ng-model="birthDate" ui-date-mask>
```
- Support to the custom date masks (See moment.js date formats).
```html
<input type="text" name="field" ng-model="birthDate" ui-date-mask="DD-MM-YYYY">
```
- Support to ```parse``` attribute. When the attribute is set to ```false```, the inputed value will be passed to the model as a string. Default value of the attribute is ```true```.
```html
<input type="text" name="field" ng-model="birthDate" ui-date-mask parse="false">
```

## time-mask ##
-Example:

```html
<input type="text" name="time" ng-model="time" ui-time-mask>
```
```html
<input type="text" name="initializedShortTimeMask" ng-model="initializedShortTimeMask" ui-time-mask="short">
```

## Masks to be documentated (help wanted!)

- ui-nfe-access-key-mask
- ui-time-mask
- ui-date-mask
- ui-br-boleto-bancario-mask
- ui-br-car-plate-mask
- ui-scientific-notation-mask
- ui-fr-phone-number
