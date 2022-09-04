const express = require("express");
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 8000;
// const User = require("./models/User");
const accountRouter = require("./routes/account");

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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/account", accountRouter);

const server = require("http").createServer(app);

server.listen(PORT, () => {
   console.log(`server is ruinnig on ${PORT}`);
});

// var upload = multer({ storage: storage });
// app.post("/img", upload.single("image"), function (req, res, next) {
//    res.json({ urlPath: `http://localhost:8000/${req.file.path}` });
// });
