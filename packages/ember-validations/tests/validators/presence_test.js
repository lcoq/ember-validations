var get = Ember.get, set = Ember.set;

var model, validator, moduleOpts = {
  setup: function() {
    model = Ember.Object.create({validationErrors: Ember.ValidationErrors.create()});
    validator = Ember.Validators.PresenceValidator.create();
  },
  teardown: function() {
    model = null;
    validator = null;
  }
};
module("Ember.Validators.PresenceValidator", moduleOpts);

test("should add error when the attribute is not present", function() {
  var invalidValues = [undefined, null, '', ' ', '  '];
  invalidValues.forEach(function(val, index) {
    set(model, 'validationErrors', Ember.ValidationErrors.create());
    validator.validate(model, 'name', val);

    var errors = get(model, 'validationErrors.name');
    ok(errors, "has a errors.name object");

    var errorKeys = get(errors, 'keys');
    equal(errorKeys.length, 1, "has one error");
    equal(errorKeys[0], 'blank', "has right key");

    var errorMessage = get(errors, 'messages');
    equal(errorMessage[0], "can't be blank", "has right message");
  });
});

test("should not add error when the attribute is present", function() {
  validator.validate(model, 'name', "my name");
  equal(get(model, 'validationErrors.name.keys'), undefined, "should not set 'name' error for string value");

  validator.validate(model, 'name', 0);
  equal(get(model, 'validationErrors.name.keys'), undefined, "should not set 'name' error for value 0");
});

test("should add error when attribute is present, even if allowBlank option is set to true", function() {
  var invalidValues = [undefined, null, '', ' ', '  '];
  invalidValues.forEach(function(val, index) {
    set(model, 'validationErrors', Ember.ValidationErrors.create());
    set(validator, 'options', {allowBlank: true});
    validator.validate(model, 'name', val);

    var errors = get(model, 'validationErrors.name');
    ok(errors, "has a errors.name object");

    var errorKeys = get(errors, 'keys');
    equal(errorKeys.length, 1, "has one error");
    equal(errorKeys[0], 'blank', "has right key");

    var errorMessage = get(errors, 'messages');
    equal(errorMessage[0], "can't be blank", "has right message");
  });
});
