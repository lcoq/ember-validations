var get = Ember.get;

Ember.ValidationError.addMessages({
  'match': "fields do not match"
});

/**
   @class

   Validates whether the attribute matches the other specified attribute.

   Options:

    - `field` - The other field to validate against

    When passing a field as option to the validation, it will use it as the `field` option:

        validations: {
          password: {
            field: confirmPassword
          }
        }

   @extends Ember.Validator
 */
Ember.Validators.MatchValidator = Ember.Validator.extend({

  /**
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
    shouldSkipValidations: function() {
      return false;
    },

    /** @private */
    _validate: function( obj, attr, value ) {
      var options = get(this, 'options' ) || {};

      if( options.field ) {
        if( obj.get( options.field ) !==  value ) {
          obj.get( 'validationErrors' ).add( attr, 'match' );
        }
      }
    }

});
