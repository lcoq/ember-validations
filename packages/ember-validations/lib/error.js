var get = Ember.get, set = Ember.set;

/**
   @class

   This class corresponds to an error due to an invalid state.
   Its basically a key and a message.

   Class methods give the ability to map the key to a message, and override
   default messages easily by using `addMessage`, or by overriding `getMessage`.

 */
Ember.ValidationError = Ember.Object.extend(/** @scope Ember.ValidationError.prototype */{
  /**
      The message key
   */
  key: null,

  /**
     A custom message which has priority over `key`
  */
  customMessage: null,

  /**
     Message format options.

     When getting `message` property, message will be formatted by replacing {option} with
     the associated `messageFormat` property.

     For example:

         error = Ember.ValidationError.create({
           customMessage: 'should have at least #{length} characters',
           messageFormat: { 'length': '8' }
         });
         error.get('message') // 'should have at least 8 characters'

   */
  messageFormat: null,

  /**
     A property that returns the custom message if set, or the message corresponding to the key else.

     @property {String}
   */
  message: Ember.computed(function() {
    var message = get(this, 'customMessage') || Ember.ValidationError.getMessage(get(this, 'key')),
        messageFormat = get(this, 'messageFormat');

    if (messageFormat) {
      for (var key in messageFormat) {
        if (!messageFormat.hasOwnProperty(key)) continue;
        var keyRegex = new RegExp('@{' + key + '}');
        if (message.match(keyRegex)) {
          message = message.replace(keyRegex, messageFormat[key]);
        }
      }
    }

    return message;
  }).property('key', 'customMessage').cacheable()
});

Ember.ValidationError.reopenClass(/** @scope Ember.ValidationError */{

  /**
      The object used to map message keys and values.
   */
  messages: {},

  /**
     Add or override a message defined by the key passed as argument.

     @param {String} key
     @param {String} message
   */
  addMessage: function(key, message) {
    this.messages[key] = message;
  },

  /**
     Return the message associated to the key passed as argument.

     Override this method for a custom behaviour (i.e. for internationalization).

     @param {String} key
     @returns {String}
      The message associated to the key, or undefined
   */
  getMessage: function(key) {
    return this.messages[key];
  }
});