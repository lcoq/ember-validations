
var get = Ember.get,
set = Ember.set,
Person,
person,
adapter,
store;

module("Ember-data support", {
  setup: function() {
    Ember.testing = true;

    Person = DS.Model.extend( Ember.Validations, {
      name: DS.attr('string'),
      tel: DS.attr('string'),

      validations: {
        name: {
          presence: true
        },
        tel: {
          normalize: {
            validator: function(obj, attr, val) {
              if (!val){
                obj.get('validationErrors').add(attr, "is empty");
              } else if (!val.match(/^(?:0|\+?254)7\d{8}$/)) {
                obj.get('validationErrors').add(attr, "is invalid");
              }
            }
          }
        }
      }
    });

    adapter = DS.Adapter.create({
      find: function(store, type, id) {
        store.load(Person, 1, { id: 1 });
      },
      updateRecord: function(store, type, record) {
        equal(get(record, 'isSaving'), true, "record should be saving");
        equal(get(record, 'isDirty'), true, "record should be dirty");
      }
    });

    store = DS.Store.create({
      adapter: adapter
    });

    Ember.run(function() {
      person = store.find(Person, 1);
    });
  },

  teardown: function() {
    Person = null;
    store = null;
  }
});

test("ember-data records can be validated", function() {
  person.validate();
  equal(person.get('isValid'), false, "should set 'isValid' to false");

  Ember.run(function() {
    person.set('name', 'ember');
    person.set('tel', '254700111222');
  });
  person.validate();
  equal(person.get('isValid'), true, "should set 'isValid' to true");

  person.get('transaction').commit();
  equal(person.get('isSaving'), true, "should be saving");
});
