Ember.Validator = Ember.Object.extend({
    init: function() {
        this._super();
        if (!this.get('options')) {
            this.set('options', {});
        }
    },

    validate: function() {
        throw new Error("Ember.Validator subclasses should implement validate() method.");
    }
});