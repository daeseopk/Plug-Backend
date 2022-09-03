const express = require("express");
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 8000;
const User = require("./models/User");

mongoose
   .connect(
      "mongodb+srv://eotjqdl22:0936tjqtjq@cluster0.q0kgjcc.mongodb.net/?retryWrites=true&w=majority",
      {
         // useNewUrlPaser: true,
         // useUnifiedTofology: true,
         // useCreateIndex: true,
         // useFindAndModify: false,
      }
   )
   .then(() => console.log("MongoDB connected"))
   .catch((error) => console.log(error));

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(cors());

const server = require("http").createServer(app);

server.listen(PORT, () => {
   console.log(`server is ruinnig on ${PORT}`);
});

//  api 분리해야됨
app.post("/account/new", (req, res) => {
   const user = new User();

   user.id = req.body.id;
   user.email = req.body.email;
   user.nickname = req.body.nickname;
   user.password = req.body.password;
   user.career = req.body.career;
   user.techStack = req.body.techStack;

   user.save((err) => {
      if (err) {
         console.error(err);
         res.json({ result: 0 });
         return;
      }
      res.json({ result: 1 });
   });
});

app.post("/account/isDuplicate", (req, res) => {
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
      // users.map((user) => {
      // });
      // if (tmp.includes(req.body)) return res.send(true);
      // else return res.send(false);
   });
});
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./uploads");
   },
   filename: function (req, file, cb) {
      cb(
         null,
         `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`
      );
   },
});

var upload = multer({ storage: storage });
app.post("/img", upload.single("image"), function (req, res, next) {
   res.json({ urlPath: `http://localhost:8000/${req.file.path}` });
});
