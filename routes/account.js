const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../modules/authMiddleware");

require("dotenv").config();

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
   user.accessToken = null;

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
            jwt.sign(
               { id: user.id, uid: user.uid },
               process.env.SECRET_KEY,
               { expiresIn: "1d" },
               async (err, token) => {
                  if (err) {
                     console.log(err);
                     res.status(401).json({
                        success: false,
                        errormessage: "token sign fail",
                     });
                  } else {
                     res.json({ success: true, accessToken: token });
                     await User.updateOne(
                        { uid: user.uid },
                        { $set: { accessToken: token } }
                     );
                  }
               }
            );
         } else {
            res.status(401).json({
               success: false,
               errormessage: "token sign fail",
            });
         }
      });
   });
});

router.get("/currentUser/:token", (req, res) => {
   // var uid = req.body.data;
   var { token } = req.params;
   if (token !== null) {
      User.find((err, users) => {
         if (err) return res.status(500).send({ error: "database failure" });
         users.map((user) => {
            if (user.accessToken === token) {
               res.send({
                  techStack: user.techStack,
                  id: user.id,
                  email: user.email,
                  nickname: user.nickname,
                  carrer: user.carrer,
                  profile: user.profile,
               });
            } else {
               res.status(401).json({
                  success: false,
               });
            }
         });
      });
   }
});
module.exports = router;
