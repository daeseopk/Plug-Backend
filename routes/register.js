const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
// const authMiddleware = require("../modules/authMiddleware");
require("dotenv").config();

router.post("/new", (req, res) => {
   const post = new Post();

   post.postId = req.body.postId;
   post.uid = req.body.uid;
   post.title = req.body.title;
   post.isProject = req.body.isProject;
   post.desc = req.body.desc;
   post.uploadDate = req.body.uploadDate;
   post.category = req.body.category;
   post.numOfPerson = req.body.numOfPerson;
   post.period = req.body.period;
   post.stack = req.body.stack;
   post.date = req.body.date;
   post.career = req.body.career;
   post.likeList = [];
   post.commentList = [];
   post.recruiting = true;

   post.save((err) => {
      if (err) {
         console.error(err);
         res.json({ result: 0, errMsg: err });
         return;
      } else res.json({ result: 1 });
   });
});

module.exports = router;
