const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

require("dotenv").config();

router.get("/getAllPost", (req, res) => {
   Post.find((err, posts) => {
      if (err) return res.status(500).send({ error: "database failure" });
      res.json({
         success: true,
         postList: posts,
      });
   });
});

router.get("/getFilteredPost", (req, res) => {
   var { category, numOfPerson, date, period, stack } = req.query;

   console.log(category, numOfPerson, date, period, stack);
});
module.exports = router;
