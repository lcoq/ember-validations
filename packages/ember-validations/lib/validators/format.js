var get = Ember.get;

Ember.ValidationError.addMessages({
  'invalid': "is invalid"
});


/**
   @class

   Validates whether the attribute has (not) the supplied regexp.

   Options:

    - `with` - The value must match this pattern
    - `without` - The value must not match this pattern

    The simple way to use the `FormatValidator` is to set the validation to a `String`, or
    a `RegExp`:

        validations: {
          email: {
            format: /.+@.+\..{2,4}/
          }
        }


   @extends Ember.Validator
 */
Ember.Validators.FormatValidator = Ember.Validator.extend({
  _validate: function(obj, attr, value) {
    var options = get(this, 'options'),
        errors = get(obj, 'validationErrors'),
        optionValue;

    if (!value || typeof value.match !== 'function') {
      value = "";
    }

    optionValue = this.optionValue(obj, 'with') || this.optionValue(obj, 'value');
    if ((typeof optionValue === 'string' || optionValue instanceof RegExp) && !value.match(optionValue)) {
      errors.add(attr, 'invalid');
    }

    optionValue = this.optionValue(obj, 'without');
    if ((typeof optionValue === 'string' || optionValue instanceof RegExp) && value.match(optionValue)) {
      errors.add(attr, 'invalid');
    }
  }

});
