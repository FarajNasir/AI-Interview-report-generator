const jwt = require("jsonwebtoken");
const Tokenblaclist = require("../models/blacklist.model");
TokenBlaclisted=require("../models/blacklist.model")


async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const isTokenBlaclisted=await Tokenblaclist.findOne({token})
  if(isTokenBlaclisted){
    return res.status(401).json({
      message: "Token is blaclisted",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { authUser };