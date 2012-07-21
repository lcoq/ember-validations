
# Ember Validations

Ember-validations is a Ember.js library that can handle object validations. If you have to check the validity of the properties of an object, 
this library does it for you. You just have to declare which property you want to validate, and which kind of validation are needed for this property.

This library is inspired by the validations of the Ruby gem `ActiveRecord`.

## Validations

Use validations to check the properties validity on an object.

Here's how you define validations on an object:

``` javascript
// the object should extend Ember.Validations mixin
MyApp.User = Ember.Object.extend(Ember.Validations, {

  // all property validations are set in an object 'validations'
  validations: {

    // the next validation is used to check the presence of the 'name' property
    name: {
      presence: true
    },

    // this validation is used to check the numericality of the 'zipCode' property,
    // and check that the length of this property is between 3 and 10.
    zipCode: {
      numericality: true,
      length: {
        moreThan: 3,
        lessThan: 10
      }
    }
  }
});

// Later, you can call the 'validate' method to launch all properties validations.
// It will add errors to the object if there are invalid properties.
MyApp.oneUserInstance.validate();
```