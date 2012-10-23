/**
   @class

   This class is used by `Ember.Validations` to validate attributes of an object.

   Subclasses should implement `validate` method, and add an error when the object is not valid.
   It could be done with `add` method of `Ember.ValidationErrors` class, as shown in this example:


       App.TruthyValidator = Ember.Validator.extend({
         validate: function(obj, attr, value) {
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
     Abstract method used to validate the attribute of an object.

     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  validate: function(obj, attr, value) {
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