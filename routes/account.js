const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// const authMiddleware = require("../modules/authMiddleware");

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
   user.profile = req.body.profile ? req.body.profile : null;
   user.accessToken = null;

   try {
      user.save();
   } catch (err) {
      console.log(err);
      return res.json({ success: false, errMsg: err });
   }
   return res.json({ success: true });
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

      users.map((user, index) => {
         if (req.body.isSocial) {
            // 소셜로그인
            if (req.body.id === user.id) {
               jwt.sign(
                  { id: user.id, uid: user.uid },
                  process.env.SECRET_KEY,
                  { expiresIn: "1d" },
                  async (err, token) => {
                     if (err) {
                        console.log(err);
                        return res.status(401).json({
                           success: false,
                           errormessage: "token sign fail",
                        });
                     } else {
                        await User.updateOne(
                           { uid: user.uid },
                           { $set: { accessToken: token } }
                        );
                     }
                     return res.json({ success: true, accessToken: token });
                  }
               );
            }
         } else {
            // 아이디, 비밀번호 로그인
            if (user.id === req.body.id) {
               if (user.password === req.body.password) {
                  jwt.sign(
                     { id: user.id, uid: user.uid },
                     process.env.SECRET_KEY,
                     { expiresIn: "1d" },
                     async (err, token) => {
                        if (err) {
                           console.log(err);
                           return res.status(401).json({
                              success: false,
                              errormessage: "token sign fail",
                           });
                        } else {
                           await User.updateOne(
                              { uid: user.uid },
                              { $set: { accessToken: token } }
                           );
                        }
                        return res.json({ success: true, accessToken: token });
                     }
                  );
               } else {
                  // 비밀번호 불일치
                  return res.json({ success: false, reason: "passwordErr" });
               }
            } else if (users.length === index) {
               // 마지막까지 mapping 시 아이디 존재 x
               return res.json({ success: false, reason: "notExistId" });
            }
         }
      });
   });
});

router.get("/currentUser/:token", (req, res) => {
   var { token } = req.params;
   if (token !== null) {
      User.find((err, users) => {
         if (err) return res.status(500).send({ error: "database failure" });
         users.map((user, index) => {
            if (user.accessToken === token) {
               return res.json({
                  success: true,
                  currentUser: {
                     uid: user.uid,
                     techStack: user.techStack,
                     id: user.id,
                     email: user.email,
                     nickname: user.nickname,
                     career: user.career,
                     profile: user.profile,
                  },
               });
            }
            if (user.length === index) {
               return res.json({
                  success: false,
                  errorMsg: "doesn't exist same token",
               });
            }
         });
      });
   }
});

router.post("/changeNickname", (req, res) => {
   User.find((err, users) => {
      if (err) return res.status(500).send({ error: "database failure" });
      users.map(async (user) => {
         if (user.uid === req.body.uid) {
            await User.updateOne(
               { uid: req.body.uid },
               { $set: { nickname: req.body.nickname } }
            );
            res.json({ success: true });
         }
      });
   });
});

router.get("/getInfo/:uid", (req, res) => {
   var { uid } = req.params;
   var count = 0;
   var nickname = "";
   var postArray = [];

   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      posts.map((post) => {
         if (post.uid === uid) {
            postArray.push({
               count: count,
               isProject: post.isProject,
               postId: post.postId,
               title: post.title,
               desc: post.desc,
               uploadDate: post.uploadDate,
               likeList: post.likeList,
               commentList: post.commentList,
            });
            count += 1;
         }
      });
      User.find((err, users) => {
         if (err) return res.status(500).send({ error: "database failure" });
         users.map((user) => {
            if (user.uid === uid) {
               nickname = user.nickname;
            }
         });
         res.send({ postArray: postArray, nickname: nickname });
      });
   });

   var cpUpload = upload.fields([{ name: "image" }, { name: "uid" }]);
   router.post("/changeProfile", cpUpload, (req, res, next) => {
      const { image } = req.files;
      var uid = JSON.parse(req.body.uid);
      var filePath = image[0].path;

      User.find((err, users) => {
         if (err) return res.status(500).send({ error: "database failure" });
         users.map(async (user) => {
            console.log(user.uid === uid);
            if (user.uid === uid) {
               await User.updateOne(
                  { uid: uid },
                  { $set: { profile: filePath } }
               );
               res.json({ success: true });
            }
         });
      });
   });
});

router.get("/getUserInfo/:uid", (req, res) => {
   var { uid } = req.params;
   User.find((err, users) => {
      if (err) return res.status(500).send({ error: "database failure" });
      users.map((user) => {
         if (user.uid === uid) {
            res.json({
               success: true,
               userInfo: {
                  uid: user.uid,
                  id: user.id,
                  email: user.email,
                  nickname: user.nickname,
                  career: user.career,
                  techStack: user.techStack,
                  profile: user.profile,
               },
            });
         }
      });
   });
});

// app.post("/img", upload.single("image"), function (req, res, next) {
//    res.json({ urlPath: `http://localhost:8000/${req.file.path}` });
// });

module.exports = router;
