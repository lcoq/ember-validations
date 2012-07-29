var get = Ember.get;

Ember.ValidationError.addMessages({
  'notNumber': "is not a number",
  'notInteger': "is not an integer",
  'notGreaterThan': "is not greater than @{value}",
  'notGreaterThanOrEqualTo': "is not greater than or equal to @{value}",
  'notLessThan': "is not less than @{value}",
  'notLessThanOrEqualTo': "is not less than or equal to @{value}",
  'notEqual': "is not equal to @{value}"
});

Ember.Validators.NumericalityValidator = Ember.Validator.extend({

  validate: function(obj, attr, value) {
    var parsedValue = parseFloat(value),
        parsedInt = parseInt(value, 10),
        errors = get(obj, 'errors');

    if (isNaN(value) || isNaN(parsedValue)) {
      errors.add(attr, 'notNumber');
    } else {
      var options = get(this, 'options');
      if (options.onlyInteger === true && (parsedValue !== parsedInt)) {
        errors.add(attr, 'notInteger');
      }
      if (typeof options.greaterThan === 'number' && parsedValue <= options.greaterThan) {
        errors.add(attr, 'notGreaterThan', {value: options.greaterThan});
      }
      if (typeof options.greaterThanOrEqualTo === 'number' && parsedValue < options.greaterThanOrEqualTo) {
        errors.add(attr, 'notGreaterThanOrEqualTo', {value: options.greaterThanOrEqualTo});
      }
      if (typeof options.lessThan === 'number' && parsedValue >= options.lessThan) {
        errors.add(attr, 'notLessThan', {value: options.lessThan});
      }
      if (typeof options.lessThanOrEqualTo === 'number' && parsedValue > options.lessThanOrEqualTo) {
        errors.add(attr, 'notLessThanOrEqualTo', {value: options.lessThanOrEqualTo});
      }
      if (typeof options.equalTo === 'number' && parsedValue !== options.equalTo) {
        errors.add(attr, 'notEqual', {value: options.equalTo});
      }
    }
  }
});