
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

    controller.up = [
    	function(req,res,next) {
    		if(!req.action.ups)
    			req.action.ups = 0;
    		console.log(req.action);
    		++req.action.ups;
    		console.log(req.action)
    		req.action.save(function(err) {
    			if(err) return next(err);
    			res.send(200);
    		});
    	}
    ];

    controller.down = [
    	function(req,res,next) {
    		if(!req.action.downs)
    			req.action.downs = 0;
    		req.action.downs++;
    		req.action.save(function(err) {
    			if(err) return next(err);
    			res.send(200);
    		});
    	}
    ];

    return controller;
}