var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const chatSchema = new Schema({
   chatId: { type: String, required: true }, // chatid
   users: { type: Array, required: true }, // uid array
   chat: { type: Array, required: false },
});

// chat=[
//     {
//          uid:uid,
//          desc:desc,
//          date:date,
//     },
// ]

module.exports = mongoose.model("Chat", chatSchema);
