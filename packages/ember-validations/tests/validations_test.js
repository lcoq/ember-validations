var checkValidity = function(model, value) {
  equal(model.get('isValid'), value, "should set 'isValid' to " + value);
};

var modelClass, model, moduleOpts = {
  setup: function() {
    modelClass = Ember.Object.extend(Ember.Validations);

    var customPresenceValidator = {
      validator: function(obj, attr, val) {
        if (!val) {
          obj.get('validationErrors').add(attr, "isEmpty");
        }
      }
    };

    var validations = {
      name: { customPresence: customPresenceValidator },
      surname: { customPresence: customPresenceValidator }
    };

    model = modelClass.create({
      validations: validations,
      surname: 'foo'
    });
  },
  teardown: function() {
    modelClass = null;
    model = null;
  }
};
module("Ember.Validations",moduleOpts);

// validationErrors

test("should set 'validationErrors' property", function() {
  ok(Ember.ValidationErrors.detectInstance(model.get('validationErrors')), "'validationErrors' property should be an Ember.ValidationErrors");
});

// #validate method

test("#validate should call #validate validator method", function() {
  model.validate();
  var nameErrorsKeys = model.get('validationErrors.name.keys');
  deepEqual(nameErrorsKeys, ["isEmpty"], "should call #validate validator method");
});

test("#validate should set 'isValid' property to false when invalid", function() {
  model.validate();
  checkValidity(model, false);
});

test("#validate should set 'isValid' property to true when valid", function() {
  model.set('name', 'ember');
  model.validate();
  checkValidity(model, true);
});

test("#validate should return false when invalid", function() {
  equal(model.validate(), false, "should return false");
});

test("#validate should return true when valid", function() {
  model.set('name', 'ember');
  equal(model.validate(), true, "should return true");
});

test("#validate should remove previous errors", function() {
  model.get('validationErrors').add('name', 'blank');
  model.set('name', 'ember');
  model.validate();
  equal(model.get('validationErrors').get('length'), 0, "should have no error");
});

test("#validate should notify validationErrors property changed", function() {
  model.reopen({
    observer: Ember.observer(function() {
      ok(true, "errors has changed");
    }, 'validationErrors')
  });
  model.validate();
  expect(1);
});

// #validateProperty method

test("#validateProperty method should call #validate validator method", function() {
  model.set('surname', null);
  model.validateProperty('surname');
  var surnameErrorsKeys = model.get('validationErrors.surname.keys');
  deepEqual(surnameErrorsKeys, ["isEmpty"], "should call #validate validator method");
  equal(model.get('validationErrors.length'), 1, "has validated only the property passed as argument");
});

test("#validateProperty should set 'isValid' property to false when invalid", function() {
  model.validateProperty('name');
  model.validate();
  checkValidity(model, false);
});

test("#validateProperty should keep 'isValid' to false when there is other invalid property", function() {
  model.validate();
  model.validateProperty('surname');
  model.validate();
  checkValidity(model, false);
});

test("#validateProperty should set 'isValid' to true when the property checked was alone to be invalid", function() {
  model.validate();
  model.set('name', 'foo');
  model.validateProperty('name');
  checkValidity(model, true);
});

test("#validateProperty should notify validationErrors property changed", function() {
  model.reopen({
    observer: Ember.observer(function() {
      ok(true, "errors has changed");
    }, 'validationErrors')
  });
  model.validateProperty('surname');
  expect(1);
});