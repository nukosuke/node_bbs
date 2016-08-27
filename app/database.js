var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  name: String,
  body: String
});


var ThreadSchema = new Schema({
  title: String,
  responses: [ResponseSchema]
});


var Response = mongoose.model('Response', ResponseSchema);
var Thread   = mongoose.model('Thread', ThreadSchema);


module.exports = { Response, Thread };
