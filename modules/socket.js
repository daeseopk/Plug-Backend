module.exports = function socket(io) {
   const Chat = require("../models/Chat");

   io.on("connection", (socket) => {
      socket.on("sendMsg", async (data) => {
         var { msg, chatId, patnerUser, currentUser } = data;
         var date = new Date();
         var time = `${date.getFullYear()}-${
            date.getMonth() + 1
         }-${date.getDate()}/${date.getHours()}:${date.getMinutes()}`;

         var insertData = {
            uid: currentUser,
            desc: msg,
            date: time,
         };

         await Chat.findOneAndUpdate(
            { chatId: chatId },
            { $push: { chat: insertData } }
         );
         io.emit(patnerUser);
         io.emit(currentUser);
      });
   });
};
