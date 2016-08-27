var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
mongoose.connect(process.env.MONGO_URL);

var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  name: String,
  body: String
});
ResponseSchema.plugin(paginate);


var ThreadSchema = new Schema({
  title: String,
  responses: [ResponseSchema]
});
ThreadSchema.plugin(paginate);


var Response = mongoose.model('Response', ResponseSchema);
var Thread   = mongoose.model('Thread', ThreadSchema);


module.exports = { Response, Thread };
