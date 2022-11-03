const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 8080;

const io = socketIo(server, {
   cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
   },
});

const accountRouter = require("./routes/account");
const registerRouter = require("./routes/register");
const chatRouter = require("./routes/chat");

require("dotenv").config();

mongoose
   .connect(process.env.MONGODB_KEY, {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
   })
   .then(() => console.log("MongoDB connected"))
   .catch((error) => console.log(error));
const socket = require("./modules/socket");

socket(io);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/account", accountRouter);
app.use("/register", registerRouter);
app.use("/chat", chatRouter);

server.listen(PORT, () => {
   console.log(`server is ruinnig on ${PORT}`);
});

// var upload = multer({ storage: storage });
// app.post("/img", upload.single("image"), function (req, res, next) {
//    res.json({ urlPath: `http://localhost:8000/${req.file.path}` });
// });
