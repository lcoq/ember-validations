Ember.Validators = Ember.Namespace.create({


    /**
       Return validator depending on name and options passed as arguments.
    */
    getValidator: function(name, options) {
        var validator = null;
        var validatorOptions = options;

        if (typeof options === 'object') {
            /* Check if a custom validator is specified in options */
            if (options['validator']) {
                if (Ember.Validator.detect(options['validator'])) {
                    validator = options.validator.create();
                } else if (typeof options['validator'] === 'function') {
                    validator = Ember.Validator.create();
                    validator.set('validate', options['validator']);
                }

                if (validator && options['options']) {
                    validatorOptions = options['options'];
                }
            }
        }

        if (!validator) {
            /* Check if the validator exist in the namespace */
            var validatorName = name.charAt(0).toUpperCase() + name.substring(1) + 'Validator';
            if (Ember.Validator.detect(this[validatorName])) {
                validator = this[validatorName].create();
            }
        }

        if (!validator) {
            throw new Error("Validator not found for name '" + name + "'.");
        }

        validator.set('options', validatorOptions);
        return validator;
    }
});