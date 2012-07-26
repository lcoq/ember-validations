var model, validator, moduleOpts = {
  setup: function() {
    model = Ember.Object.create({errors: Ember.ValidationErrors.create()});
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
    model.set('errors', Ember.ValidationErrors.create());
    validator.validate(model, 'name', val);

    var errors = model.getPath('errors.name');

    var errorKeys = errors.get('keys');
    equal(errorKeys.length, 1, "has one error");
    equal(errorKeys[0], "cantBeBlank", "has right key");

    var errorMessage = errors.get('messages');
    equal(errorMessage[0], "can't be blank", "has right message");
  });
});

test("should not add error when the attribute is present", function() {
  validator.validate(model, 'name', "my name");
  equal(model.getPath('errors.name.keys'), undefined, "should not set 'name' error");
});