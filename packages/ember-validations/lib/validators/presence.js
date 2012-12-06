Ember.ValidationError.addMessage('blank', "can't be blank");

/**
   @class

   This validator validates that the attribute is not blank (`undefined`, `null`, empty string
   or string which contains only spaces).

   It can add the error key 'blank'.

   @extends Ember.Validator
*/
Ember.Validators.PresenceValidator = Ember.Validator.extend({
  /**
    The presence validators `shouldSkipValidations` method should return false regardless of whether the `allowBlank` option is set to `true` since it would be contradictory for a PresenceValidator to allow blank values.
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  shouldSkipValidations: function(obj, attr, value) {
    return false;
  },

  _validate: function(obj, attr, value) {
    var invalidValues = Ember.A([undefined, null]);
    if (invalidValues.contains(value) || (value.match && value.match(/^\s*$/))) {
      obj.get('validationErrors').add(attr, "blank");
    }
  }
});
