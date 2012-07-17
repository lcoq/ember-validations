/**
   @class

   This mixin is used to handle validations on ember objects.
   If you are implementing an object and want to support validations, just include
   this mixin in your object and set the `validations` property.

   Here is an example of an object using validations :

     Ember.Object.create(Ember.Validations, {
       validations: {
         name: {presence: true}
       }
     })

   When calling `validate` method on the object above, the method `Ember.Validators.PresenceValidator.validate`
   is called, and add error messages if the `name` of the object is not present.

   Its possible to pass options to the validator, as shown in this example :

     validations: {
     name: {
       length: {
         moreThan: 3,
         lessThan: 10
       }
     }


   You could also set custom validations and pass options, like in this example :

     validations: {
       amount: {
         validator: MyApp.CustomValidator,
         options: {
           isNumber: true,
           otherOption: 12
         }
       }
     }

   Or even directly set the validation function :

     validations: {
       amount: {
         validator: function(obj, attr, value) {
           var moreThan = this.getPath('options.moreThan');
           if (value <= moreThan) {
             obj.get('errors').add(attr, "should not be falsy");
           }
         },
         options: {
           moreThan: 5
         }
       }
     }

 */
Ember.Validations = Ember.Mixin.create({
    init: function() {
        this._super();
        if (this.get('errors') === undefined) {
            this.set('errors', Ember.ValidationErrors.create());
        }
    },

    validate: function() {
        var validations = this.get('validations');
        var isValid = true;
        for (var attribute in validations) {
            if (!validations.hasOwnProperty(attribute)) continue;

            var attributeValidations = validations[attribute];
            for (var validationName in attributeValidations) {
                if (!attributeValidations.hasOwnProperty(validationName)) continue;

                var options = attributeValidations[validationName];
                var validator = Ember.Validators.getValidator(validationName, options);
                validator.validate(this, attribute, this.get(attribute));
            }
            var attributeMessages = this.getPath('errors.messages.' + attribute);
            if (attributeMessages && attributeMessages.length > 0) {
                isValid = false;
            }
        }
        this.set('isValid', isValid);
    }
});