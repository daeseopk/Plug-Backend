const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const User = require("../models/User");

require("dotenv").config();

router.get("/chatlist/:uid", (req, res) => {
   var uid = req.params;
   var chatList = [];
   var num = 0;
   Chat.find((err, chats) => {
      if (err) return res.status(500).send({ error: "database failure" });
      chats.map((chat) => {
         if (chat.users.includes(uid.uid)) {
            chatList[num] = {
               chatList: chat.chat,
               users: chat.users,
               chatId: chat.chatId,
            };
            num += 1;
         }
      });
      if (chatList) {
         return res.json({
            success: true,
            chatList: chatList,
         });
      }
   });
});

module.exports = router;
