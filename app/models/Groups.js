var mongoose = require('mongoose')
var Schema = mongoose.Schema

module.exports = function (dal) {
    var GroupSchema = new mongoose.Schema({
        name:{ type:String, required:true, unique:true },
        urlName:String,
        actions:[{type:Schema.ObjectId,ref:"actions"}]
    });

    GroupSchema.pre('remove',function(next) {
    	mongoose.model('actions').remove({group:this.id},function(err) {
    		if(err) return console.log(err);
    		next();
    	});
    });

    return mongoose.model('groups', GroupSchema);
}