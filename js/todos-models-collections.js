// This file contains the model and collection for 
// the Todos application.


(function (){
    var root = this;
    
    root.Todo = AppEngineRestModel.extend({
        modelName: 'Todos',
        attrTypes: {
            'done':  'boolean',
            'order': 'number'
        },
        urlRoot: '/rest/Todos'
    });
    
    
    
    root.TodoList = AppEngineRestCollection.extend({
        model: root.Todo,
        modelName: 'Todos'
        
    });
    
})();
