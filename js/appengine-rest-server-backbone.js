// The main difference between appengine-rest-server and Backbone's
// expectations for a rest server are that the objects are wrapped.
// So we need to change Model.parse() and Model.toJSON() as well as
// Collection.parse()


// appengine-rest-server module
;(function () {
    var root = this;
    root.AppEngineRestModel = Backbone.Model.extend({
        modelName: '',                           //set this attribute when you subclass
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
        }
        
    
    });
    
    
    root.AppEngineRestCollection = Backbone.Collection.extend({
    
    });

    
})();
