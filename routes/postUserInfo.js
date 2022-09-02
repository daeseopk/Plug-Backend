const express = require("express");
const router = express.Router();
module.exports = function (User) {
   router.post("/account/new", (req, res) => {
      const user = new User();

      user.id = req.body.id;
      user.email = req.body.email;
      user.nickname = req.body.nickname;
      user.password = req.body.password;
      user.career = req.body.career;
      user.techStack = req.body.techStack;
   });
};
