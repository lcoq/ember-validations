module("Ember.ValidationErrors", {
    setup: function() {
        errors = Ember.ValidationErrors.create();
    },
    teardown: function() {
        delete errors;
    }
});

test("should be initialized with 'messages' property", function() {
    deepEqual(errors.get('messages'), Ember.Object.create(), "should initialize 'messages' property");
});

test("#add should add the first message", function() {
    errors.add('name', "Invalid name");
    deepEqual(errors.getPath('messages.name'), ["Invalid name"]);
});

test("#add should push new message", function() {
    errors.add('name', "can't be blank");
    errors.add('name', "should have 3 characters");
    deepEqual(errors.getPath('messages.name'), ["can't be blank", "should have 3 characters"]);
});

test("#clear should clear all messages", function() {
    errors.set('messages', Ember.Object.create({
        name: ["can't be blank"],
        foo: ["can't exist", "can't be", "bar"]
    }));
    errors.clear();
    equal(errors.getPath('messages.name'), undefined);
    equal(errors.getPath('messages.foo'), undefined);
})