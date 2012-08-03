var get = Ember.get;

Ember.ValidationError.addMessages({
  'invalid': "is invalid"
});

Ember.Validators.FormatValidator = Ember.Validator.extend({
  validate: function(obj, attr, value) {
    var options = get(this, 'options'),
        errors = get(obj, 'errors');
    if ((typeof options['with'] === 'string' || options['with'] instanceof RegExp) && !value.match(options['with'])) {
      errors.add(attr, 'invalid');
    }
    if ((typeof options['without'] === 'string' || options['without'] instanceof RegExp) && value.match(options['without'])) {
      errors.add(attr, 'invalid');
    }
  }
});