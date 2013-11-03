
module.exports = function (app,Actions,Groups) {
    var controller = {};

    controller.load = function(req,res,next,id) {
		Actions.findById(id).populate('group').exec(function(err,action) {
            if(err) return next(err);
            if(!action) return res.send(404);
            req.action = action;
            next();
        });
    };

    controller.create = [
    	function(req,res,next) {
    		req.body.group = req.group.id;
    		Actions.create(req.body,function(err,action) {
    			res.redirect('/' + req.group.urlName);
    		});
    	}
    ];

    controller.vote = [
    	function(req,res,next) {
    		req.action += parseInt(req.body.vote);
    		req.action.save(function(err) {
    			if(err) return next(err);
    			res.send(200);
    		});
    	}
    ];

    return controller;
}