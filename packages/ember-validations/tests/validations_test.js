var modelClass, model, moduleOpts = {
  setup: function() {
    modelClass = Ember.Object.extend(Ember.Validations);
    model = modelClass.create({

      validations: {

        name: {

          customPresence: {
            validator: function(obj, attr, val) {
              if (!val) {
                obj.get('errors').add(attr, "isEmpty");
              }
            }
          }

        }

      }

    });
  },
  teardown: function() {
    modelClass = null;
    model = null;
  }
};
module("Ember.Validations",moduleOpts);

test("should set 'error' property", function() {
  ok(Ember.ValidationErrors.detectInstance(model.get('errors')), "'error' property should be an Ember.ValidationErrors");
});

test("#validate should call #validate validator method", function() {
  model.validate();
  var nameErrorsKeys = model.getPath('errors.name.keys');
  deepEqual(nameErrorsKeys, ["isEmpty"], "should call #validate validator method");
});

test("#validate should set 'isValid' property to false when invalid", function() {
  model.validate();
  equal(model.get('isValid'), false, "should set 'isValid' to false");
});

test("#validate should set 'isValid' property to true when valid", function() {
  model.set('name', 'ember');
  model.validate();
  equal(model.get('isValid'), true, "should set 'isValid' to true");
});

test("#validate should return false when invalid", function() {
  equal(model.validate(), false, "should return false");
});

test("#validate should return true when valid", function() {
  model.set('name', 'ember');
  equal(model.validate(), true, "should return true");
});

test("#validate should remove previous errors", function() {
  model.get('errors').add('name', 'blank');
  model.set('name', 'ember');
  model.validate();
  equal(model.get('errors').get('length'), 0, "should have no error");
});