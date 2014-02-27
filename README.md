angular-mask
============

Personalized and localized input masks for AngularJS

Installation
------------

With Bower:

```
bower install --save angular-input-masks
```

How to use
----------

1. Include the module ```ui.utils.masks``` in your angular app.

2. Include the directive ```ui-number-mask``` in your form:

```html
<input type="text" name="field" ng-model="field" ui-number-mask>
```

3. You can set the number of decimals (the default is 2):

```html
<input type="text" name="field" ng-model="field" ui-number-mask="3">
```
