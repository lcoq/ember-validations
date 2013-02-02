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
  raises(function() { validator.validate(); },  /Ember.Validator subclasses should implement _validate\(\) method./);
});

test("checkValidity should be called on #init if set", function() {
  validator = Ember.Validator.create({
    checkValidity: function() {
      ok(true, "checkValidity should be called");
    }
  });
});

test("optionValue without type return the value", function() {
  validator.set('options', {foo: 'bar'});
  equal(validator.optionValue(null, 'foo'), 'bar', "should return the value");
});

test("optionValue for function apply it to the object", function() {
  var obj = Ember.Object.create();

  validator.set('options', {
    foo: function() {
      equal(this, obj, "should be applied to the object passed as argument");
      return 'bar';
    }
  });
  equal(validator.optionValue(obj, 'foo'), 'bar', "should return the value returned by the function");
  expect(2);
});

test("optionValue with type does not return the value when they don't match", function() {
  validator.set('options', {foo: 'bar'});
  equal(validator.optionValue(null, 'foo', 'number'), null, "should return null when the value don't match the type");
});

test("optionValue with type return the value when they match", function() {
  validator.set('options', {foo: 'bar'});
  equal(validator.optionValue(null, 'foo', 'string'), 'bar', "should return the value");
});
