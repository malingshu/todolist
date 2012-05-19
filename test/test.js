
describe('AppEngineModel', function() {
    it('should define AppEngineRestModel and Todo ', function() {
        var model = new AppEngineRestModel;
        model.should.be.an.instanceof(Backbone.Model);

        var todo = new Todo;
        todo.should.be.an.instanceof(AppEngineRestModel);
    });

    var todo_id;
    it('should save to server ', function(done) {
        var todo_list = new TodoList;
        var todo = new Todo(
            {
                'content': 'buy milk', 
                'done':    false,
                'order':   1
            });
        todo_list.add(todo);

        todo.save(null, {
            success: function(model, resp) { 
                         model.get('content').should.equal('buy milk');
                         todo_id = model.id;
                         done(); 
                     },
            error:   function(model, resp) { 
                done(new Error('failed to save todo')); 
            }
        });
    });
    it('should fetch from the server ', function(done) {
        var todo_list = new TodoList;
        var todo = new Todo;
        todo_list.add(todo);
        todo.id = todo_id;
        todo.fetch({
            success: function(model, resp) { 
                         console.log(model.toJSON());
                         model.get('content').should.equal('buy milk');
                         model.get('done').should.equal(false);
                         model.get('order').should.equal(1);

                         done(); 
                     },
            error:   function(model, resp) { 
                done(new Error('failed to fetch todo')); 
                     }
        });
    });
});
    
