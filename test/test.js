
describe('AppEngineModel', function() {
    it('should define AppEngineRestModel and Todo ', function() {
        var model = new AppEngineRestModel;
        model.should.be.an.instanceof(Backbone.Model);

        var todo = new Todo;
        todo.should.be.an.instanceof(AppEngineRestModel);
    });
});
    
