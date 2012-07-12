Ember.Validator = Ember.Object.extend({

    init: function() {
        this._super();
        if (this.checkValidity) {
            this.checkValidity();
        }
    },

    validate: function() {
        throw new Error("Ember.Validator subclasses should implement validate() method.");
    }
});