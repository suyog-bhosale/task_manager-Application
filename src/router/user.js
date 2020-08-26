const express = require("express");
const router = new express.Router();
const User = require("../Modals/user");
const auth = require("../middleware/Auth");
const { remove } = require("../Modals/user");
const multer = require("multer");
const { sendEmailtoUser, sendDEletaccoint } = require("../email/email");
// const sharp = require("sharp");

//creating new user !!/siginIN
router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // sendEmailtoUser(user.email, user.name); call sunction  here to send emilas
    const token = await user.AuthTokenGenator();
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error);
  }
});

//login user !!
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByEmailandPassword(
      req.body.email,
      req.body.password
    );
    const token = await user.AuthTokenGenator();
    if (!user) {
      throw new Error("unable to login !!");
    }
    res.send({ user, token });
  } catch (error) {
    res.send(error);
  }
});

//logout

router.post("/user/logout", auth, async (req, res) => {
  try {
    //findinfn token which is lohIn
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
//logoitAll

router.post("/user/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//get user !!

router.get("/user/me", auth, async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

//update user !!

router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const Allowupdates = ["name", "age", "email", "password"];
  const isvalid = updates.every((update) => Allowupdates.includes(update));

  if (!isvalid) {
    return res.status(400).send({ error: "invalid update" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

//delete user
router.delete("/user/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // res.send(user);
    await req.user.remove();
    //removeing  user
    // sendDEletaccoint(user.email, user.name); sending cancleation email
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

///upload profile pic
//upload middlele ware !!
const upload = multer({
  // dest: "avtar", use to add in folder
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("plaese upload  image file !!"));
    }
    cb(undefined, true);
  },
});

//add profile /update profile
router.post(
  "/user/me/avtar",
  auth,
  upload.single("avtar"),
  async (req, res) => {
    req.user.avtar = req.file.buffer;
    // const buffer = await sharp(req.file.buffer)
    //   .resize({ width: 250, height: 250 })
    //   .png()
    //   .toBuffer();

    // req.user.avtar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  } //callback function for error handding !!
);

router.delete(
  "/user/me/avtar",
  auth,
  upload.single("avtar"),
  async (req, res) => {
    req.user.avtar = undefined; //delete avtar make undefiend
    await req.user.save();
    res.send();
  }
);

//getting back image bt Id

router.get("/user/:id/avtar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user && !user.avtar) {
      throw new Error();
    }
    //seting response header !!
    res.set("ContentT-ype", "image/jpg");
    res.send(user.avtar);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
