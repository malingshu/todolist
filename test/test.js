
describe('AppEngineModel', function() {
    it('should define AppEngineRestModel and Todo ', function() {
        var model = new AppEngineRestModel;
        model.should.be.an.instanceof(Backbone.Model);

        var todo = new Todo;
        todo.should.be.an.instanceof(AppEngineRestModel);
    });
    it('should save to server ', function(done) {
        var todo = new Todo(
            {
                'content': 'buy milk', 
                'done':    false,
                'order':   1
            });
        todo.save(null, {
            success: function(model, resp) { 
                         model.get('content').should.equal('buy milk');
                         done(); 
                     },
            error:   function(model, resp) { 
                done(new Error('failed to save todo')); 
            }
        });
    });
});
    
