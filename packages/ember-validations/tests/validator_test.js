var validator, moduleOpts = {
  setup: function() {
    validator = Ember.Validator.create();
  },
  teardown: function() {
    validator = null;
  }
};
module("Ember.Validator", moduleOpts);

test("Should set 'options' property after create", function() {
  deepEqual(validator.get('options'), {}, "'options' property should be an empty object");
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
});