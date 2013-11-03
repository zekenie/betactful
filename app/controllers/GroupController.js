var validator = require('validator');
var _ = require('lodash');

module.exports = function (app,Groups) {
    var controller = {};

    controller.load = function(req,res,next,id) {
        Groups.findOne({urlName:id}).populate('actions').exec(function(err,group) {
            if(err) return next(err);
            if(!group) return res.send(404);
            req.group = group;
            next();
        });
    };

    controller.index = [
        //list many groups
        function(req,res,next) {
            res.render('group/index');
        }
    ];

    var filterFn = function(item,which) {
        return item.sug === which && (item.ups - item.downs) > -5;
    };

    controller.view = [
        function(req,res,next) {
            req.group = req.group.toObject();
            req.group.dos = _.filter(req.group.actions,function(item) {
                return filterFn(item,"Do");
            });
            req.group.donts = _.filter(req.group.actions,function(item) {
                return filterFn(item,"Don't");
            });
            console.log(req.group);
            res.render('group/view',req.group);
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
            req.body.urlName = req.body.name.replace(/[\s+\/+\&+]/g, '_');
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