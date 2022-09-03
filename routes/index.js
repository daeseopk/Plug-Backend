module.exports = function (app, User) {
   // 회원 정보 post
   app.post("/account/new", (req, res) => {
      const user = new User();
      user.id = req.body.id;
      user.email = req.body.email;
      user.nickname = req.body.nickname;
      user.password = req.body.password;
      user.career = req.body.career;
      user.techStack = req.body.techStack;

      //   user.save((err) => {
      //     if (err) {
      //        console.error(err);
      //        res.json({ result: 0 });
      //        return;
      //     }
      //     res.json({ result: 1 });
      //  });
   });
};
