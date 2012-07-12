module("Ember.Validations",{
    setup: function() {
        modelClass = Ember.Object.extend(Ember.Validations);
        model = modelClass.create({
            validations: {
                name: {
                    customPresence: {
                        validator: function(obj, attr, val) {
                            if (!val) {
                                obj.get('errors').add(attr, "is empty");
                            }
                        }
                    }
                }
            }
        })
    },
    teardown: function() {
        delete modelClass;
        delete model;
    }
});

test("should set 'error' property", function() {
    ok(Ember.ValidationErrors.detectInstance(model.get('errors')), "'error' property should be an Ember.ValidationErrors");
});

test("#validate should call #validate validator method", function() {
    model.validate();
    var nameErrors = model.getPath('errors.messages.name');
    deepEqual(nameErrors, ["is empty"], "should call #validate validator method");
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