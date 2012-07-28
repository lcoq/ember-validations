Ember.ValidationError.addMessage('blank', "can't be blank");

/**
   @class

   This validator validates that the attribute is not blank (`undefined`, `null`, empty string
   or string which contains only spaces).

   It can add the error key 'blank'.

   @extends Ember.Validator
*/
Ember.Validators.PresenceValidator = Ember.Validator.extend({
  validate: function(obj, attr, value) {
    var invalidValues = Ember.A([undefined, null]);
    if (invalidValues.contains(value) || value.match(/^\s*$/)) {
      obj.get('errors').add(attr, "blank");
    }
  }
});