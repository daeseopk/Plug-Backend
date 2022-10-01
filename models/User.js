var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
   uid: { type: String, required: true, unique: true },
   id: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   nickname: { type: String, required: true, unique: true },
   password: { type: String, required: false },
   career: { type: Number, required: true },
   techStack: { type: Array, require: true },
   profile: { type: String, require: false },
   accessToken: { type: String, require: false },
   // isSocial: { type: Boolean, require: true },
});

module.exports = mongoose.model("User", userSchema);
