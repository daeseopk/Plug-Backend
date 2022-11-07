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
router.get("/getCurrentChat/:chatId/:currentUserUid", (req, res) => {
   var { chatId, currentUserUid } = req.params;
   console.log("chatID : ", chatId, "currentUserUid : ", currentUserUid);
   Chat.find(async (err, chats) => {
      if (err) return res.status(500).send({ error: "database failure" });
      var patnerUser;
      chats.map(async (chat) => {
         if (chat.chatId === chatId) {
            await chat.users.map((user) => {
               if (user !== currentUserUid) {
                  patnerUser = user;
               }
            });
            var data = {
               chat: chat.chat,
               currentUser: currentUserUid,
               patnerUser: patnerUser,
               chatId: chatId,
            };

            if (data) {
               res.json(data);
            }
         }
      });
   });
});
module.exports = router;
