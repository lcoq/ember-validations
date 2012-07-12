module("Ember.Validators.PresenceValidator", {
    setup: function() {
        model = Ember.Object.create({errors: Ember.ValidationErrors.create()});
        validator = Ember.Validators.PresenceValidator.create();
    },
    teardown: function() {
        delete model;
        delete validator;
    }
});

test("should add error when the attribute is not present", function() {
    invalidValues = [undefined, null, '', ' '];
    invalidValues.forEach(function(val, index) {
        model.set('errors', Ember.ValidationErrors.create());
        validator.validate(model, 'name', val);

        var errorMessage = model.getPath('errors.messages.name');
        ok(errorMessage, "should set 'name' message for value: '" + val + "' (" + index + ")");
        equal(errorMessage.length, 1, "should set one 'name' error message for value: '" + val + "' (" + index + ")");
        equal(errorMessage[0], "can't be blank");
    });
});

test("should not add error when the attribute is present", function() {
    validator.validate(model, 'name', "my name");
    equal(model.getPath('errors.messages.name'), undefined, "should not set 'name' error");
});