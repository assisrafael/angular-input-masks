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

4. You can allow negative numbers using the ```ui-negative-number``` attribute:

```html
<input type="text" name="field" ng-model="field" ui-number-mask="3" ui-negative-number>
```

5. See more examples and other masks in ```demo/index.html```

Tests
-----

Uses [Protractor](https://github.com/angular/protractor).

Run throug gulp:

```
gulp test
```
