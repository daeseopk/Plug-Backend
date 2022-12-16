const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

require("dotenv").config();

router.get("/getAllPost", (req, res) => {
   var i = 0;
   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      res.json({
         success: true,
         postList: posts,
      });
   });
});

module.exports = router;
