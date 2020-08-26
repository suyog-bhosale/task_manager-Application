const express = require("express");
const app = express();
const userRouter = require("./src/router/user");
const taskRouter = require("./src/router/task");
require("./src/db/moongose"); //this file is importatn while interaction with databAse !!

const router = express.Router();
//parsing data from frontend
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 10000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("not word file"));
//     }
//     cb(undefined, true);
//   },
// });

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(500).send({ error: error.message });
//   }
// );

app.listen("3001", () => {
  console.log("port is runing ");
});
