var validator = require('validator');


module.exports = function (app,Groups) {
    var controller = {};

    controller.load = function(req,res,next,id) {
        Groups.findOne({name:id}).populate('actions').exec(function(err,group) {
            if(err) return next(err);
            if(!group) return res.send(404);
            req.group = group;
            next();
        });
    };

    controller.index = [
        //list many groups
        function(req,res,next) {}
    ];

    controller.view = [
        function(req,res,next) {
            res.json(req.group);
        }
    ];

    controller.new = [
        function(req,res,next) {
            res.render('group/new');
        }
    ];

    controller.create = [
        //check and see if the group alrady exists
        //if not create it
        function(req,res,next) {
            //make
            req.body.urlName = req.body.urlName.replace(/[\s+\/+\&+]/g, '_');
            next();
        },
        function(req,res,next) {
            Groups.findOne({urlName:req.body.urlName},function(err,group) {
                if(group) return res.send(400,'already group');
                next();
            });
        },
        function(req,res,next) {
            var newGroup = Groups.create(req.body,function(err,group) {
                res.redirect('/' + group.urlName);
            });
        }
    ];

    return controller;
}