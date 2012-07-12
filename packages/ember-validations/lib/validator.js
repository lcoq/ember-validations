Ember.Validator = Ember.Object.extend({

    validate: function() {
        throw new Error("Ember.Validator subclasses should implement validate() method.");
    }
});