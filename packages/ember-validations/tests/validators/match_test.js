var get = Ember.get, set = Ember.set;

var model, validator, moduleOpts = {
  setup: function() {
    model = Ember.Object.create({validationErrors: Ember.ValidationErrors.create()});
    validator = Ember.Validators.MatchValidator.create();
  },
  teardown: function() {
    model = null;
    validator = null;
  }
};
module("Ember.Validators.MatchValidator", moduleOpts);


test("should not add error when the both fields are the same", function() {
  model.set( 'field2', 'test' );
  set(validator, 'options', { field: 'field2' });
  validator.validate(model, 'match', 'test');
  equal(get(model, 'validationErrors.match.keys'), undefined, "should not set 'match' error for string value");
});

test("should add error when the both fields are not the same", function() {
  model.set( 'field2', 'not_the_same_value' );
  set(validator, 'options', { field: 'field2' });
  validator.validate(model, 'match', "test");

  var errors = get(model, 'validationErrors.match');
    ok(errors, "has a errors.match object");

    var errorKeys = get(errors, 'keys');
    equal(errorKeys.length, 1, "has one error");
    equal(errorKeys[0], 'match', "has right key");

    var errorMessage = get(errors, 'messages');
    equal(errorMessage[0], "fields do not match", "has right message");
});

test("should add error when the matching field doesn't exist", function() {
  set(validator, 'options', { field: 'field2' });
  validator.validate(model, 'match', "test");

  var errors = get(model, 'validationErrors.match');
    ok(errors, "has a errors.match object");

    var errorKeys = get(errors, 'keys');
    equal(errorKeys.length, 1, "has one error");
    equal(errorKeys[0], 'match', "has right key");

    var errorMessage = get(errors, 'messages');
    equal(errorMessage[0], "fields do not match", "has right message");
});
