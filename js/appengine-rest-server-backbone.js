// The main difference between appengine-rest-server and Backbone's
// expectations for a rest server are that the objects are wrapped.
// So we need to change Model.parse() and Model.toJSON() as well as
// Collection.parse()


// appengine-rest-server module
;(function () {
    var root = this;
    // Everything comes back as a string from the rest-server.
    // For example {"done": false} returned as {"done": "false"}
    // So we need to explicitly convert them.
    // We check for booleans and numbers in this helper function.  
    // (You must supply the map yourself in model.attrMap)
    var convertStringToTypes = function (obj, map) {
        var type, key;
        for (key in map) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] !== undefined) {
                    type = map[key];
                    if (type === 'boolean') {
                        if (obj[key] === 'true') {
                            obj[key] = true;
                        } else {
                            obj[key] = false;
                        }
                    } else if (type === 'number') {
                        obj[key] = parseFloat(obj[key]);
                    }
                }
            }
        }
    };

    root.AppEngineRestModel = Backbone.Model.extend({
        modelName: '',                //set this attribute when you subclass

        idAttribute: "key",           //appengine-rest-server uses 'key' instead of 'id'
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
        // -------------------
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
        // ---------------------
        parse: function (resp) {
            var bareModel;
            bareModel = resp[this.modelName];
            // uncomment to observe the differences
            // console.log('object directly from server');
            // console.log(_.clone(resp));

            // convert booleans and numbers
            convertStringToTypes(bareModel, this.attrTypes); 
            // uncomment to observe the differences
            // console.log('object ready for backbone');
            // console.log(_.clone(bareModel));
            
            return bareModel;
        }

        
    
    });
    
    
    root.AppEngineRestCollection = Backbone.Collection.extend({
        // We need to remember to set modelName in 
        // each instnce of the model
        // modelName: the name of the Model on appEngine-rest-server


        
        // Unwrap the list from the server
        // then re-wrap it for our model.toJSON()
        //
        // the server gives us an object like this:
        // {
        //   
        //    list: {
        //      Todos: [
        //        {content: 'Buy milk', done: 'false'},
        //        {content: 'Buy eggs', done: 'true'}
        //      ]
        //    }
        // }
        // We need to parse it to look like:
        //
        // [
        //   {Todos: {content: 'Buy milk', done: 'false'},
        //   {Todos: {content: 'Buy eggs', done: 'true'},
        // ]
        // 

        //
        // -------------
        parse:  function (resp) {
            var models, i, len, model_name, wrapped_model, model_list;
            model_name = this.modelName;                    
            models = [];
            
            // Here we unwrap the object (ie: modelList = resp.list["Todos"])
            if(_.isArray(resp.list[model_name])) {
                model_list = resp.list[model_name];
            }
            // When there is only one item returned, 
            // appengine-rest-server returns a single object
            // rather than an array with one element.  
            // So we need to check for this and we will 
            // put it into an array for our loop.
            else if (_.isObject(resp.list[model_name])) { 
                model_list = [];
                model_list.push(resp.list[model_name]);
            }
            else{ // otherwise, we have nothing.
                model_list = [];
            }
            len = model_list.length || 0;
            for (i = 0; i < len; i++) {
                // Here we re-wrap the model for model.parse() 
                // ie: wrappedModel = {Todos: {...}}
                wrapped_model = {};
                wrapped_model[model_name] = model_list[i]; 
                models.push(wrapped_model);
            }
            return models;
        }
    
    });

    // We need to add ?type=full to the end of the url.
    // Otherwise the server will only return the key
    // on POST and UPDATE
    var old_sync = Backbone.sync;
    Backbone.sync = function (method, model, options) {
        var url, new_options = options || {};
        if (model.isGAERestModel) {
            if (method === 'create') {
                url = getValue(model, 'url') || urlError();;
                new_options.url = url + '?type=full';
            } else if (method === 'update') {
                url = getValue(model, 'url') || urlError();;
                new_options.url = url + "/" + model.id + '?type=full';
            } else if (method === 'delete') {
                url = getValue(model, 'url') || urlError();;
                new_options.url = url + '/' + model.id;
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
