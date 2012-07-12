module("Ember.Validator", {
    setup: function() {
        validator = Ember.Validator.create();
    },
    teardown: function() {
        delete validator;
    }
});

test("Direct instances should raise an error on validate", function() {
    raises(function() { validator.validate(); },  /Ember.Validator subclasses should implement validate\(\) method./);
});

test("checkValidity should be called on #init if set", function() {
    validator = Ember.Validator.create({
        checkValidity: function() {
            ok(true, "checkValidity should be called");
        }
    });
})