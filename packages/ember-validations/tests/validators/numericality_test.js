var get = Ember.get, getPath = Ember.getPath, set = Ember.set;

var model, validator, moduleOpts = {
  setup: function() {
    model = Ember.Object.create({errors: Ember.ValidationErrors.create()});
    validator = Ember.Validators.NumericalityValidator.create();
  },
  teardown: function() {
    model = null;
    validator = null;
  }
};
module("Ember.Validators.NumericalityValidator", moduleOpts);

test("attribute is not a valid number", function() {
  validator.validate(model, 'amount', "amount");

  // attribute is not a number
  var errors = getPath(model, 'errors.amount');
  ok(errors, "has an errors.amount object");

  var errorKeys = getPath(model, 'errors.amount.keys');
  equal(errorKeys.length, 1, "has one error");
  equal(errorKeys[0], 'notANumber', "has right key");
  equal(get(errors, 'messages')[0], "is not a number", "has right message");
});

test("attribute is a valid number", function() {
  validator.validate(model, 'amount', "54.321");
  ok(!getPath(model, 'errors.amount'), "has no amount errors");
});

test("onlyInteger option with float number", function() {
  set(validator, 'options', {onlyInteger: true});
  validator.validate(model, 'amount', "54.321");

  var errors = getPath(model, 'errors.amount');
  ok(errors, "has an errors.amount object");

  var errorKeys = getPath(model, 'errors.amount.keys');
  equal(errorKeys.length, 1, "has one error");
  equal(errorKeys[0], 'notAnInteger', "has right key");
  equal(get(errors, 'messages')[0], "is not an integer", "has right message");
});