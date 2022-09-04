const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/new", (req, res) => {
   const user = new User();

   user.uid = req.body.uid;
   user.id = req.body.id;
   user.email = req.body.email;
   user.nickname = req.body.nickname;
   user.password = req.body.password;
   user.career = req.body.career;
   user.techStack = req.body.techStack;
   user.profile = null;

   user.save((err) => {
      if (err) {
         console.error(err);
         res.json({ result: 0 });
         return;
      }
      res.json({ result: 1 });
   });
});

//중복 확인
router.post("/isDuplicate", (req, res) => {
   var tmp = [];
   User.find((err, users) => {
      if (err) return res.status(500).send({ error: "database failure" });
      if (String(Object.keys(req.body)) === "nickname") {
         users.map((user) => {
            tmp.push(user.nickname);
         });
      } else if (String(Object.keys(req.body)) === "id") {
         users.map((user) => {
            tmp.push(user.id);
         });
      } else {
         users.map((user) => {
            tmp.push(user.email);
         });
      }
      if (tmp.includes(req.body[Object.keys(req.body)])) {
         res.send(true);
      } else res.send(false);
   });
});

router.post("/login", (req, res) => {
   User.find((err, users) => {
      if (err) return res.status(500).send({ error: "database failure" });
      users.map((user) => {
         if (user.id === req.body.id && user.password === req.body.password) {
            const data = {
               uid: user.uid,
               id: user.id,
               email: user.email,
               nickname: user.nickname,
               techStack: user.techStack,
            };
            res.json(data);
         } else {
            res.send(false);
         }
      });
   });
});

module.exports = router;
