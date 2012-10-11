var get = Ember.get, set = Ember.set;

/**
   @class

   This mixin is used to handle validations on ember objects.

   If you are implementing an object and want it to support validations, just include
   this mixin in your object and set the `validations` property.


   Here is an example of an object using validations :

       Ember.Object.create(Ember.Validations, {
         validations: {
           name: {presence: true}
         }
       });

   When calling the `validate` method on the object above, the method `validate` of the
   `Ember.Validators.PresenceValidator` is called, and add error messages if the `name`
   of the object is not present.

   Options can be passed to the validator, as shown in this example :

       Ember.Object.create(Ember.Validations, {
         validations: {
           name: {
             length: {
               moreThan: 3,
               lessThan: 10
             }
           }
         }
       });

   You could also set custom validations and pass options, like in this example :

       Ember.Object.create(Ember.Validations, {
         validations: {
           amount: {
             aCustomValidation: {
               validator: MyApp.CustomValidator,
               options: {
                 isNumber: true,
                 otherOption: 12
               }
             }
           }
         }
       });

   Or even directly set the validation function :

       Ember.Object.create(Ember.Validations, {
         validations: {
           amount: {
             aCustomValidation: {
               validator: function(obj, attr, value) {
                 var moreThan = this.get('options.moreThan');
                 if (value <= moreThan) {
                   obj.get('errors').add(attr, "should not be falsy");
                 }
               },
               options: {
                 moreThan: 5
               }
             }
           }
         }
       });

   @extends Ember.Mixin
 */
Ember.Validations = Ember.Mixin.create(/**@scope Ember.Validations.prototype */{

  /** @private */
  init: function() {
    this._super();
    if (get(this, 'errors') === undefined) {
      set(this, 'errors', Ember.ValidationErrors.create());
    }
  },

  /**
     Method used to verify that the object is valid, according to the `validations`
     hash.

     @returns {Boolean}
  */
  validate: function() {
    var validations = get(this, 'validations'),
        errors = get(this, 'errors');

    this.propertyWillChange('errors');

    errors.clear();

    for (var attribute in validations) {
      if (!validations.hasOwnProperty(attribute)) continue;

      var attributeValidations = validations[attribute];
      for (var validationName in attributeValidations) {
        if (!attributeValidations.hasOwnProperty(validationName)) continue;

        var options = attributeValidations[validationName];
        var validator = Ember.Validators.getValidator(validationName, options);
        validator.validate(this, attribute, this.get(attribute));
      }
    }

    var isValid = get(this, 'errors.length') === 0;
    set(this, 'isValid', isValid);

    this.propertyDidChange('errors');
    return isValid;
  }
});