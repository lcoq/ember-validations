/**
   @namespace

   This namespace is used to reference each available class which extends `Ember.Validator`.

   By defining a validator in this namespace allow validations to use it by its name.
   Each validator name should end with 'Validator', and has to be capitalized.

   For example, if you want to use the `App.Validators.PresenceValidator` in validations,
   you could only specify :

       Ember.Object.create(Ember.Validations, {
         validations: {
           presence: true
         }
       });

   The `PresenceValidator` will automatically be found if defined in this namespace.

 */
Ember.Validators = Ember.Namespace.create(/**@scope Ember.Validators */{


  /**
     Return validator depending on name and options passed as arguments.

     @param {String} name
     @param {Object} options
     @returns {Ember.Validator}
  */
  getValidator: function(name, options) {
    var validator = null;
    var validatorOptions = options;

    if (typeof options === 'object') {
      /* Check if a custom validator is specified in options */
      if (options['validator']) {
        if (Ember.Validator.detect(options['validator'])) {
          validator = options.validator.create();
        } else if (typeof options['validator'] === 'function') {
          validator = Ember.Validator.create();
          validator.set('validate', options['validator']);
        }

        if (validator && options['options']) {
          validatorOptions = options['options'];
        }
      }
    }

    if (!validator) {
      /* Check if the validator exist in the namespace */
      var validatorName = name.charAt(0).toUpperCase() + name.substring(1) + 'Validator';
      if (Ember.Validator.detect(this[validatorName])) {
        validator = this[validatorName].create();
      }
    }

    if (!validator) {
      throw new Error("Validator not found for name '" + name + "'.");
    }

    validator.set('options', validatorOptions);
    return validator;
  }
});