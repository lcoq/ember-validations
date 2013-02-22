# Ember Validations [![Build Status](https://secure.travis-ci.org/lcoq/ember-validations.png?branch=master)](http://travis-ci.org/lcoq/ember-validations)

Ember-validations is a Ember.js library that can handle object validations. If you have to check the validity of object properties, 
this library does it for you. You just have to declare which property you want to validate, and which kind of validation you want for this property.

This library is inspired by the validations of the Ruby gem `ActiveRecord`.

#### Getting ember-validations

Currently you must build ember-validations yourself. Clone the repository, run `bundle` then `rake dist`. You'll find `ember-validations.js` in the `dist` directory.

## Example

```js
App.User = Ember.Object.extend( Ember.Validations, {
  country: null,
  
  validations: {
    name: {
      presence: true
    },
    age: {
      numericality: true,
      length: {
          moreThan: 21,
          lessThan: 99
      },
    },
    email: {
      format: /.+@.+\..{2,4}/
    }
  }
});
```

## Usage

* Extend `Ember.Validations` mixin:

```js
App.User = Ember.Object.extend( Ember.Validations );
```

* Define its validations by settings them in its `validation` property.
The following example is a `presence` validation that ensures the `name` of the `User` is set:

```js
App.User = Ember.Object.extend( Ember.Validations, {
  validations: {
    name: {
      presence: true
    }
  }
});
```

* Launch validations on an object using the `validate` method.

```js
var user = App.User.create();
user.validate();
```

* The `isValid` property is now set as `true`, or `false` depending on the validations result:

```js
user.get('isValid'); // => false
```

## Errors

Once the `validate` method is called, if some properties are invalid, the `validationErrors` property is updated.

For the example below, we assume we have a `User` defined like this:

```js
App.User = Ember.Object.extend( Ember.Validations, {
  validations: {
    name: {
      presence: true
    },
    age: {
      numericality: {
        moreThanOrEqualTo: 21,
        lessThan: 99
      }
    },
    'address.zipCode': {
      numericality: true
    }
  }
});
```

An error is defined by a `key`, a `message`, and a `path`.
There are three types of error messages:

* `allMessages`: It returns all errors. Each of them is an array that contains the `path` and the `message` error, as follows:

```js
user.get('validationErrors.allMessages');
```

Will return this array:

```js
[
  [ "name", "can't be blank" ],
  [ "age", "is not greater than or equal to 21" ],
  [ "age", "is not less than 99" ],
  [ "address.zipCode", "is not a number" ]
]
```

* `fullMessages`: It has the same behaviour as `allMessages`, except that errors are the `path` and the `message` concatenated:

```js
[
  "name can't be blank", 
  "age is not greater than or equal to 21",
  "age is not less than 99",
  "address.zipCode is not a number"
]
```

* `messages`: It returns only errors messages corresponding the path specified (`age` here):

```js
user.get('validationErrors.age.messages');
```

Will return this array:

```js
[
  "is not greater than or equal to 21",
  "is not less than 99"
]
```

*Remark: There are also `keys` and `allKeys` properties that works like messages, but for error keys.*

## Validators

### Presence

It ensures the attribute is not blank.
You can define it as follow, in the `validation` property:

```js
name: {
  presence: true
}
```

### Length

The `length` validation is used to check the `length` of the property.
Three options can be passed:

* `minimum`
* `is`
* `maximum`

Example:

```js
password: {
  length: {
    minimum: 6,
    maximum: 12
  }
}
```

When no option is specified, the `is` option is set by default:

```js
phone: {
  length: 10
}
```

Is equivalent to:

```js
phone: {
  length: {
    is: 10
  }
}
```

### Numericality

The `numericality` validation can have multiple usage, defined by its option:

* `onlyInteger`
* `greaterThan`
* `greaterThanOrEqualTo`
* `lessThan`
* `lessThanOrEqualTo`
* `equalTo`

Example:

```js
amount: {
  numericality: {
    moreThanOrEqualTo: 1,
    lessThan: 100
  }
}
```

When no option is passed, it just add an error if the value can not be parsed as a number (e.g. when the value contains letter):

```js
amount: {
  numericality: true
}
```

### Format

It validates whether the attribute has (or not, depending on the option specified) the supplied regexp.

The simplest way to use it is as follow:

```js
email: {
  format: /.+@.+\..{2,4}/
}
```

But you can specify options `with` and/or `without`:

```js
password: {
  format: {
    with: /[a-zA-Z]+/,
    without: /[0-9]+/
  }
}
```

## Single property validation

Sometime you could want to validate only one property.
You can do this by calling `validateProperty('attributeName')` instead of `validate()`.
It will also update the `isValid` property if the validity of the object changes.

## Runtime validations

A function can be passed to the validations options for runtime validations.
An example could be:

```js
age: {
  length: {
    moreThan: function() {
      return this.get('country') === 'France' ? 18 : 21;
    }
  }
}
```

## Skipping validations

Validators will, by default, skip validations on blank values. 
The `presence` validation ignores this option for obvious reasons.

You can disable this behaviour by setting the `allowBlank` option to `false`.

## Custom validations

### On-the-fly

You can define custom validation function, like this:

```js
password: {
  myCustomValidator: function(object, attribute, value) {
    if (!value.match(/[A-Z]/)) {
      object.get('validationErrors').add(attribute, 'invalid');
    }
  }
}
```

### Write your own validator

You can write your own validator easily.

* Define your validator in the `Ember.Validators` namespace. It allows to use via its name.
For example, writing an `Ember.Validators.FooValidator` allows you to use it using:

```js
validations: {
  name: {
    foo: true
  }
}
```

* Extend `Ember.Validator` and implement the `_validate` method. 
Just take a look at the existing validators to see how to write it.

* That's all folks!


## Building Ember-Validations

1. Run `rake dist` task to build Ember-validations.js. Two builds will be placed in the `dist/` directory.
  * `ember-validations.js` is a unminified version (generally used for development)
  * `ember-validations.min.js` is the minified version, production ready

If you are building under Linux, you will need a JavaScript runtime for
minification. You can either install nodejs or `gem install
therubyracer`.

## Build API Docs

NOTE: Require `node.js` to generate it.

### Preview API documentation

Run `rake docs:preview`.

The `docs:preview` task will build the documentation and make it available at <http://localhost:9292/index.html>

### Build API documentation

Run `rake docs:build`

The  HTML documentation is built in the `docs` directory

## How to run Unit Tests

### Setup

1. Install Ruby 1.9.2+. There are many resources on the web can help; one of the best is [rvm](https://rvm.io/).

2. Install Bundler: `gem install bundler`

3. Run `bundle` inside the project root to install the gem dependencies.

### In Your Browser

1. To start the development server, run `rackup`.

2. Then visit: `http://localhost:9292/tests/index.html

### From the CLI

1. Install phantomjs from http://phantomjs.org

2. Run `rake test` to run a basic test suite or run `rake test[all]` to
   run a more comprehensive suite.
