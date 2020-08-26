const jwt = require("jsonwebtoken");
const User = require("../Modals/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = jwt.verify(token, "helloiamrobot");
    // console.log("deoce >>>", decode);

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    // console.log(">>>>", user);
    if (!user) {
      throw new Error();
    }
    // console.log("user form auth>>", user);
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.send({ error: "plase auth" });
  }
};
module.exports = auth;
