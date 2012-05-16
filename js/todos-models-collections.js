// This file contains the model and collection for 
// the Todos application.


(function (){
    var root = this;
    
    root.Todo = AppEngineRestModel.extend({
        modelName: 'Todos',
        url: '/rest/Todos'
    
    
    });
    
    
    
    root.TodoList = AppEngineRestCollection.extend({});
    
})();
