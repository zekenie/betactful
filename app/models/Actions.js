var mongoose = require('mongoose')
var Schema = mongoose.Schema

module.exports = function (dal) {
    var ActionSchema = new mongoose.Schema({
        group:{type:Schema.ObjectId,ref:"groups"},
        sug:String,
        text:String,
        ups:Number,
        downs:Number,
        relationships:[String]
    });

    ActionSchema.pre('remove',function(next) {
    	var self = this;
    	mongoose.model('groups').findById(this.group,function(err,group) {
    		if(err) return console.log(err);
    		group.actions = _.filter(group.actions,function(_action) {
    			return _action.toString() !== self.id.toString();
    		});
    		group.save(function(err) {
    			if(err) return console.log(err);
    			next();
    		});
    	});
    });

    ActionSchema.post('save',function() {
    	var self = this;
    	mongoose.model('groups').findById(this.group,function(err,group) {
    		if(group.actions.indexOf(self.id) === -1) {
	    		group.actions.push(self.id);
	    		group.save(function(err) {
	    		});
	    	}
    	});
    });

    return mongoose.model('actions', ActionSchema);
}