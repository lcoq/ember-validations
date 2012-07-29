var get = Ember.get, getPath = Ember.getPath, set = Ember.set;

var hasOneError = function(model, attr, key, msg) {
  var errorsPath = 'errors.' + attr;
  var errors = getPath(model, errorsPath);
  ok(errors, "has an " + errorsPath + " object");

  var errorKeys = getPath(model, errorsPath + '.keys');
  equal(errorKeys.length, 1, "has one error");
  equal(errorKeys[0], key, "has right key");

  var errorMsgs = getPath(model, errorsPath + '.messages');
  equal(errorMsgs[0], msg, "has right message");
};

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
  hasOneError(model, 'amount', 'notNumber', "is not a number");
});

test("attribute is a valid number", function() {
  validator.validate(model, 'amount', "54.321");
  ok(!getPath(model, 'errors.amount'), "has no amount errors");
});

test("onlyInteger option with float number", function() {
  set(validator, 'options', {onlyInteger: true});
  validator.validate(model, 'amount', "54.321");
  hasOneError(model, 'amount', 'notInteger', "is not an integer");
});

test("greaterThan option", function() {
  set(validator, 'options', {greaterThan: 12});
  validator.validate(model, 'amount', "12");
  hasOneError(model, 'amount', 'notGreaterThan', "is not greater than 12");
});

test("greaterThanOrEqualTo option with less", function() {
  set(validator, 'options', {greaterThanOrEqualTo: 12});
  validator.validate(model, 'amount', "4");
  hasOneError(model, 'amount', 'notGreaterThanOrEqualTo', "is not greater than or equal to 12");
});

test("greaterThanOrEqualTo option with equal", function() {
  set(validator, 'options', {greaterThanOrEqualTo: 12});
  validator.validate(model, 'amount', "12");
  ok(!getPath(model, 'errors.amount'), "has no amount errors");
});

test("lessThan option", function() {
  set(validator, 'options', {lessThan: 12});
  validator.validate(model, 'amount', "12");
  hasOneError(model, 'amount', 'notLessThan', "is not less than 12");
});

test("lessThanOrEqualTo option with more", function() {
  set(validator, 'options', {lessThanOrEqualTo: 12});
  validator.validate(model, 'amount', "13");
  hasOneError(model, 'amount', 'notLessThanOrEqualTo', "is not less than or equal to 12");
});