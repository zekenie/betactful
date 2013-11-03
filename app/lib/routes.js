//var resource = require('express-resource');

module.exports = function (app, GroupController, Groups, ActionController, models) {

    app.get("*",function(req,res,next) {
        Groups.find({},function(err,groups) {
            res.locals.groups = groups;
            next();
        });
    });

    app.get('/about',function(req,res) {
        res.render("about");
    });

    app.get('/',GroupController.index);
    app.post('/create',GroupController.create);   // making a new group
    app.get('/new',GroupController.new); //a form for making a new group
    app.get('/:group',GroupController.view); //list all sugs for specific group


    app.post('/:group',ActionController.create); //add action for group
    app.put('/:group/:actionId'); //update action for group
    app.del('/:group/:actionId'); //delete action for group

    app.post('/:group/:actionId/vote',ActionController.vote); //cating upvote or downvote

    app.param('group',GroupController.load);


};