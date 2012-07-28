var get = Ember.get;

Ember.ValidationError.addMessage('notANumber', "is not a number");
Ember.ValidationError.addMessage('notAnInteger', "is not an integer");

Ember.Validators.NumericalityValidator = Ember.Validator.extend({

  validate: function(obj, attr, value) {
    var parsedFloat = parseFloat(value),
        parsedInt = parseInt(value, 10),
        errors = get(obj, 'errors');

    if (isNaN(value) || isNaN(parsedFloat)) {
      errors.add(attr, 'notANumber');
    } else {
      var options = get(this, 'options');
      if (options.onlyInteger === true && (parsedFloat !== parsedInt)) {
        errors.add(attr, 'notAnInteger');
      }
    }
  }
});