Ember.Validators.PresenceValidator = Ember.Validator.extend({
    validate: function(obj, attr, value) {
        var invalidValues = Ember.A([undefined, null, '', ' ']);
        if (invalidValues.contains(value)) {
            obj.get('errors').add(attr, "can't be blank");
        }
    }
});