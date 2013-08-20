var get = Ember.get;

Ember.ValidationError.addMessages({
  'match': "fields do not match"
});

/**
   @class

   Validates whether the attribute matches the other specified attribute.

   Options:

    - `property` - The other property to validate against

    When passing a property as option to the validation, it will use it as the `property` option:

        validations: {
          password: {
            property: 'confirmPassword'
          }
        }

   @extends Ember.Validator
 */
Ember.Validators.MatchValidator = Ember.Validator.extend({
    /** @private */
    _validate: function( obj, attr, value ) {
      var options = get(this, 'options' ) || {};

      if( options.property ) {
        if( obj.get( options.property ) !==  value ) {
          obj.get( 'validationErrors' ).add( attr, 'match' );
        }
      }
    }

});
