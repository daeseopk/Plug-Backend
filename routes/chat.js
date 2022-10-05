const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

require("dotenv").config();

router.get("/chatlist/:uid", (req, res) => {
   var uid = req.params;
   var chatList = [];
   Chat.find((err, chats) => {
      if (err) return res.status(500).send({ error: "database failure" });
      chats.map((chat) => {
         if (chat.users.includes(uid.uid)) {
            // res.json({success:true, chat:chat.chat})
            chatList.push(chat.chat);
            console.log(chatList);
         }
      });
   });
});
module.exports = router;
