// The main difference between appengine-rest-server and Backbone's
// expectations for a rest server are that the objects are wrapped.
// So we need to change Model.parse() and Model.toJSON() as well as
// Collection.parse()


// appengine-rest-server module
;(function () {
    var root = this;
    
    root.AppEngineRestModel = Backbone.Model.extend({
    
    });
    
    
    root.AppEngineRestCollection = Backbone.Collection.extend({
    
    });

    
})();
