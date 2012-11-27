var get = Ember.get;

Ember.ValidationError.addMessages({
  'tooShortLength': "is too short (minimum @{value} characters)",
  'tooLongLength': "is too long (maximum @{value} characters)",
  'wrongLength': "is the wrong length (should be @{value} characters)"
});

/**
   @class

   Validates whether the attribute has the supplied length.

   Options:

    - `minimum` - The value must have at least this length
    - `maximum` - The value must have at most this length

   @extends Ember.Validator
 */
Ember.Validators.LengthValidator = Ember.Validator.extend(/** @scope Ember.Validators.LengthValidator */{

  /** @private */
  _validate: function(obj, attr, value) {
    var options = get(this, 'options'),
        errors = get(obj, 'validationErrors'),
        length = value ? Ember.get(value, 'length') : 0,
        optionValue;

    optionValue = this.optionValue(obj, 'is', 'number');
    if (optionValue !== null) {
      if (length !== optionValue) {
        errors.add(attr, 'wrongLength', {value: optionValue});
      }
    } else {

      optionValue = this.optionValue(obj, 'minimum', 'number');
      if (optionValue !== null && length < optionValue) {
        errors.add(attr, 'tooShortLength', {value: optionValue});
      }

      optionValue = this.optionValue(obj, 'maximum', 'number');
      if (optionValue !== null && length > optionValue) {
        errors.add(attr, 'tooLongLength', {value: optionValue});
      }
    }
  },

  shouldSkipValidations: function(obj, attr, value) {
    var options = get(this, 'options');
    if (!((options.allowBlank === true) && ((value ==="") || (value === null) || (value === undefined)))) {
      return false;
    } else {
      return true;
    }
  }
});
