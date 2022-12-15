const express = require("express");
const router = express.Router();
const fs = require("fs");

app = express();

app.use("/Stacks", express.static("Stacks"));

require("dotenv").config();

router.get("/getAllStacks", (req, res) => {
   let FrontEnd = [];
   let BackEnd = [];
   let Etc = [];
   let Mobile = [];
   let stacks = {};
   fs.readdir("Stacks", (err, folders) => {
      folders.map((folder) => {
         fs.readdir(`Stacks/${folder}`, (err, files) => {
            if (folder === "FrontEnd") {
               files.map((file) => {
                  FrontEnd.push({
                     name: file.split(".")[0],
                     url: `${process.env.API}/Stacks/${folder}/${file}`,
                  });
               });
            } else if (folder === "BackEnd") {
               files.map((file) => {
                  BackEnd.push({
                     name: file.split(".")[0],
                     url: `${process.env.API}/Stacks/${folder}/${file}`,
                  });
               });
            } else if (folder === "Etc") {
               files.map((file) => {
                  Etc.push({
                     name: file.split(".")[0],
                     url: `${process.env.API}/Stacks/${folder}/${file}`,
                  });
               });
            } else {
               files.map((file) => {
                  Mobile.push({
                     name: file.split(".")[0],
                     url: `${process.env.API}/Stacks/${folder}/${file}`,
                  });
               });
            }
            stacks.FrontEnd = FrontEnd;
            stacks.BackEnd = BackEnd;
            stacks.Etc = Etc;
            stacks.Mobile = Mobile;
            if (
               stacks.Mobile.length != 0 &&
               stacks.FrontEnd.length != 0 &&
               stacks.BackEnd.length != 0 &&
               stacks.Etc.length != 0
            ) {
               res.send(stacks);
            }
         });
      });
   });
});

module.exports = router;
