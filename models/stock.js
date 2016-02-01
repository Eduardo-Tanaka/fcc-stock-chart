var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
var schema = mongoose.Schema({
    code: String,
    description: String
});
schema.plugin(findOrCreate);
var Stock = mongoose.model('Stock', schema);

module.exports = Stock;