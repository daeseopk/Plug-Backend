module.exports = function socket(io) {
   io.on("connection", (socket) => {
      console.log("connect");
      socket.on("message", (msg) => {
         console.log(msg);
         io.emit("message", msg);
      });
   });
};
