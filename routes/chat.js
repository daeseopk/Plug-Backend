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

   Chat.find(async (err, chats) => {
      if (err) return res.status(500).send({ error: "database failure" });
      var patnerUser;
      chats.map((chat) => {
         if (chat.chatId === chatId) {
            chat.users.map((user) => {
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

            try {
               if (data) {
                  res.send(data);
               }
            } catch (err) {
               console.log(err);
            }
         }
      });
   });
});
router.post("/newChat", (req, res) => {
   var { currentUser, writerUser, desc } = req.body;
   var chatIdList = [];
   Chat.find((err, chats) => {
      if (err) return res.status(500).send({ error: "database failure" });

      chats.map((chat) => {
         chatIdList.push(chat.chatId);
      });
      if (
         chatIdList.includes(`${currentUser}${writerUser}`) ||
         chatIdList.includes(`${writerUser}${currentUser}`)
      ) {
         return res.json({ success: true, reason: "AlreadyExistChat" });
      } else {
         var date = new Date();
         const chat = new Chat();

         var chatId = `${date.getFullYear()}${
            date.getMonth() + 1
         }${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

         var date = `${date.getFullYear()}-${
            date.getMonth() + 1
         }-${date.getDay()}/${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

         chat.chatId = chatId;
         chat.users = [currentUser, writerUser];
         chat.chat = [{ uid: currentUser, desc: desc, date: date }];

         try {
            chat.save();
         } catch (err) {
            console.log(err);
            return res.json({ success: false, reason: err });
         }
         return res.json({ success: true, reason: "SuccessSendMsg" });
      }
   });
});
module.exports = router;
