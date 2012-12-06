/**
   @class

   This class is used by `Ember.Validations` to validate attributes of an object.

   Subclasses should implement the private `_validate` method, and add an error when the object is not valid.
   It could be done with `add` method of `Ember.ValidationErrors` class, as shown in this example:


       App.TruthyValidator = Ember.Validator.extend({
         _validate: function(obj, attr, value) {
           if (!value) {
             obj.get('validationErrors').add(attr, "should be truthy");
           }
         }
       });


 */
Ember.Validator = Ember.Object.extend(/**@scope Ember.Validator.prototype */{

  /** @private */
  init: function() {
    this._super();
    if (!this.hasOwnProperty('options')) {
      this.set('options', {});
    }
    if (this.checkValidity) {
      this.checkValidity();
    }
  },

  /**
    This public method simply calls the `shouldSkipValidations` method and, if it returns true, then calls the private `_validate` function.
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  validate: function(obj, attr, value) {
    if (this.shouldSkipValidations(obj, attr, value)) {
      return false;
    } else {
      this._validate(obj, attr, value);
    }
  },


  /**
    Method used to determine whether subclass of `Ember.Validator` should call private method `_validate`. Returns true if the allowBlank option is set to true, so it is not necessary to implement it in sub-classes you would like to implement a different logic for the skipping of the validation.
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  shouldSkipValidations: function(obj, attr, value) {
    var options = Ember.get(this, 'options');
    if (options.allowBlank === true) {
      return value ==="" || value === null || value === undefined;
    }
    return false;
  },

  /** @private
     Abstract method used to validate the attribute of an object.

     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  _validate: function(obj, attr, value) {
    throw new Error("Ember.Validator subclasses should implement validate() method.");
  },

  /**
     Return the value of the option, or null is the type does not match
     the expected.
     When type is not specified, it always return the value

     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} option
      The option you want its value
     @param {String} type
      Optional. When renseigned, return null if the value does not match the type
   */
  optionValue: function(obj, option, type) {
    var val = this.get('options.' + option);
    if (typeof val === 'function') {
      val = val.apply(obj);
    }

    if (!type || (typeof type === 'string' && typeof val === type)) {
      return val;
    } else if (type === undefined) {
      return val;
    }
    return null;
  }
});
