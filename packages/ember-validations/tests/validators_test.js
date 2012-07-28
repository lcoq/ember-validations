var get = Ember.get, getPath = Ember.getPath, set = Ember.set;

var validatorClass, validator, originalExistentValidator, moduleOpts = {
  setup: function() {
    originalExistentValidator = Ember.Validators.ExistentValidator;
    Ember.Validators.ExistentValidator = Ember.Validator.extend();

    validatorClass = Ember.Validator.extend();
  },
  teardown: function() {
    validatorClass = null;
    validator = null;
    Ember.Validators.ExistentValidator = originalExistentValidator;
    originalExistentValidator = null;
  }
};
module("Ember.Validators.getValidator", moduleOpts);

// validator errors

test("should raise an exception if there is no options and no matching validator", function() {
  raises(function() { Ember.Validators.getValidator('inexistent'); }, /Validator not found for name \'inexistent\'./);
});

test("should raise an exception if options are empty and there is no matching validator", function() {
  raises(function() { Ember.Validators.getValidator('inexistent', {validator: null}); }, /Validator not found for name \'inexistent\'./);
});

// custom validator class

test("should instantiate validator from options when set", function() {
  var validator = Ember.Validators.getValidator('foo', {validator: validatorClass, options: {opt: 'yes'}});

  ok(validatorClass.detectInstance(validator), "return instance of validator class passed as parameters");
  equal(getPath(validator, 'options.opt'), 'yes', "should set validator options");
});

test("should instantiate validator from options, and set 'options.value' property when set", function() {
  var validator = Ember.Validators.getValidator('foo', {validator: validatorClass, options: 'foo'});
  equal(getPath(validator, 'options.value'), 'foo', "should set validator 'options.value' property");
});

// custom validate function

test("should create validator with validate method from options when set", function() {
  var validate = function() {};
  var validator = Ember.Validators.getValidator('foo', {validator: validate, options: {opt: 'yes'}});

  ok(Ember.Validator.detectInstance(validator), "should be an instance of Validator");
  equal(get(validator, 'validate'), validate, "should set validate method from options");
  equal(getPath(validator, 'options.opt'), 'yes', "should set validator options");
});

// existent validator

test("should find the validator whose name matches", function() {
  var validator = Ember.Validators.getValidator('existent', {opt: 'foo'});

  ok(Ember.Validators.ExistentValidator.detectInstance(validator), "should be an instance of ExistentValidator");
  equal(getPath(validator, 'options.opt'), 'foo', "should set validator options");
});

test("should set 'option.value' validator property when options is not a hash", function() {
  var validator = Ember.Validators.getValidator('existent', 12);

  equal(getPath(validator, 'options.value'), 12, "should set 'option' property to the argument value");
});