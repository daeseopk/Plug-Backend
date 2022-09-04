var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const postSchema = new Schema({
   postId: { type: String, required: true, unique: true },
   uid: { type: String, required: true },
   title: { type: String, required: true },
   desc: { type: String, required: true },
   date: { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema);
