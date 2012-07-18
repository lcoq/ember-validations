/**
   @class

   This class is used by `Ember.Validations` to validate attributes of an object.

   Subclasses should implement `validate` method, and add an error when the object is not valid.
   It could be done with `add` method of `Ember.ValidationErrors` class, as shown in this example:


       App.TruthyValidator = Ember.Validator.extend({
         validate: function(obj, attr, value) {
           if (!value) {
             obj.get('errors').add(attr, "should be truthy");
           }
         }
       });


 */
Ember.Validator = Ember.Object.extend(/**@scope Ember.Validator.prototype */{

  /** @private */
  init: function() {
    this._super();
    if (this.checkValidity) {
      this.checkValidity();
    }
  },

  /**
     Abstract method used to validate the attribute of an object.

     @param {Object} The object which contains the attribute that has to be validated
     @param {String} The attribute path on which the validation should be done
     @param {Object} The value of the attribute

  */
  validate: function(obj, attr, value) {
    throw new Error("Ember.Validator subclasses should implement validate() method.");
  }
});