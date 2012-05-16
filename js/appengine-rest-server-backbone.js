// The main difference between appengine-rest-server and Backbone's
// expectations for a rest server are that the objects are wrapped.
// So we need to change Model.parse() and Model.toJSON() as well as
// Collection.parse()


// appengine-rest-server module
;(function () {
    var root = this;
    root.AppEngineRestModel = Backbone.Model.extend({
        modelName: '',                           //set this attribute when you subclass
        isGAERestModel: true,
        // We must wrap the attributes in the modelName
        // before sending it back to the server
        //
        // For example, appengine-rest-server expects an object like this:
        // {Todos:
        //   {
        //     content: 'Buy milk.',
        //     done:    'false',
        //     order:   1
        //   }
        // }
        toJSON:  function () {
            var attrs, json_obj;
            attrs = _.clone(this.attributes);
            json_obj = {};
            json_obj[this.modelName] = attrs;    // i.e. json_obj['Todos'] = attrs

            // uncomment to observe the differences
            // console.log(_.clone(attrs));    
            // console.log(_.clone(json_obj));
            return json_obj;
        },

        // What we must do is remove the wrapper object (i.e. 'Todos')
        // and convert strings to booleans and numbers where appropriate.
        //
        // --------------
        parse: function (resp) {
            var bareModel;
            bareModel = resp[this.modelName];
            // uncomment to observe the differences
            // console.log('object directly from server');
            // console.log(_.clone(resp));
            
            return bareModel;
        }

        
    
    });
    
    
    root.AppEngineRestCollection = Backbone.Collection.extend({
    
    });

    // We need to add ?type=full to the end of the url.
    // Otherwise the server will only return the key
    // on POST and UPDATE
    var old_sync = Backbone.sync;
    Backbone.sync = function (method, model, options) {
        var url, new_options = options || {};
        if (model.isGAERestModel) {
            if (method === 'create' || method === 'update'){
                url = getValue(model, 'url') || urlError();;
                new_options.url = url + '?type=full';
            }
        }
        return old_sync(method, model, new_options);
    };
    
    // Helper functions from Backbone source code.
    var getValue = function(object, prop) {
        if (!(object && object[prop])) return null;
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
    
    
})();
