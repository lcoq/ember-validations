
var get = Ember.get,
set = Ember.set,
Person,
person,
adapter,
store;

module("Ember-data support", {
  setup: function() {

      Person = DS.Model.extend(Ember.Validations,{
        bar: DS.attr('string'),

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

      adapter = DS.Adapter.create({
        find: function(store, type, id) {
          store.load(Person, 1, { id: 1, name: "Foo" });
        },
        updateRecord: function(store, type, record) {
          equal(get(record, 'isSaving'), true, "record should be saving");
          equal(get(record, 'isDirty'), false, "record should be dirty");
        }
      });

      store = DS.Store.create({
        adapter: adapter
      });

      person = store.find(Person, 1);
  },

  teardown: function() {
    Person = null;
    store = null;
  }
});

test("ember-data records can be validated", function() {
  person.validate();
  //equal(model.get('isValid'), false, "should set 'isValid' to false");
  //model.set('name', 'ember');
  //model.validate();
  //equal(model.get('isValid'), true, "should set 'isValid' to true");
  //store.commit();
});