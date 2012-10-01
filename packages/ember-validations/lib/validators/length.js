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
  validate: function(obj, attr, value) {
    var options = get(this, 'options'),
        errors = get(obj, 'errors'),
        length = value ? Ember.get(value, 'length') : 0;

    if (typeof options.is === 'number') {
      if (length !== options.is) {
        errors.add(attr, 'wrongLength', {value: options.is});
      }
    } else {
      if (typeof options.minimum === 'number' && length < options.minimum) {
        errors.add(attr, 'tooShortLength', {value: options.minimum});
      }
      if (typeof options.maximum === 'number' && length > options.maximum) {
        errors.add(attr, 'tooLongLength', {value: options.maximum});
      }
    }
  }
});