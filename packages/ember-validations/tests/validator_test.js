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

test("Options should be an empty hash by default", function() {
    deepEqual(validator.get('options'), {});
});