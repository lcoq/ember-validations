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


/**
   @class

   Validates whether the value is numeric.

   Options:

    - `onlyInteger` - The value has to be an integer
    - `greaterThan` - The value must be greater than the supplied value
    - `greaterThanOrEqualTo` - The value must be greater than or equal to the supplied value
    - `lessThan` - The value must be less than the supplied value
    - `lessThanOrEqualTo` - The value must be less than or equal to the supplied value
    - `equalTo` - The value must be equal to the supplied value

   The simple way to use the `NumericalityValidator` is to set the validation to `true`.
   The validator will add an error if the value can't be parsed as a number:

       validations: {
         amount: {
           numericality: true
         }
       }

   You can also supply custom options, as follow:

       validations: {
         amount: {
           numericality: {
             onlyInteger: true,
             greaterThanOrEqualTo: 1,
             lessThan: 100
           }
         }
       }

   @extends Ember.Validator
 */
Ember.Validators.NumericalityValidator = Ember.Validator.extend(/** @scope Ember.Validators.NumericalityValidator.prototype */{

  /** @private */
  _validate: function(obj, attr, value) {
    var parsedValue = parseFloat(value),
        parsedInt = parseInt(value, 10),
        errors = get(obj, 'validationErrors');

    var options = get(this, 'options');
    if (!((options.allowBlank === true) && ((value ==="") || (value === null) || (value === undefined)))) {

      if (isNaN(value) || isNaN(parsedValue)) {
        errors.add(attr, 'notNumber');
      } else {
        if (options.onlyInteger === true && (parsedValue !== parsedInt)) {
          errors.add(attr, 'notInteger');
        }

        var optionValue;

        optionValue = this.optionValue(obj, 'greaterThan', 'number');
        if (optionValue !== null && parsedValue <= optionValue) {
          errors.add(attr, 'notGreaterThan', {value: optionValue});
        }

        optionValue = this.optionValue(obj, 'greaterThanOrEqualTo', 'number');
        if (optionValue !== null && parsedValue < optionValue) {
          errors.add(attr, 'notGreaterThanOrEqualTo', {value: optionValue});
        }

        optionValue = this.optionValue(obj, 'lessThan', 'number');
        if (optionValue !== null && parsedValue >= optionValue) {
          errors.add(attr, 'notLessThan', {value: optionValue});
        }

        optionValue = this.optionValue(obj, 'lessThanOrEqualTo', 'number');
        if (optionValue !== null && parsedValue > optionValue) {
          errors.add(attr, 'notLessThanOrEqualTo', {value: optionValue});
        }

        optionValue = this.optionValue(obj, 'equalTo', 'number');
        if (optionValue !== null && parsedValue !== optionValue) {
          errors.add(attr, 'notEqual', {value: optionValue});
        }
      }
    }
  },

  isValidForOption: function(obj, option, condition) {
    var optionValue = this.optionValue(option);
    return optionValue !== null && condition.apply(obj, optionValue);
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
