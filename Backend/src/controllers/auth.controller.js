const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const tokenBlacklist=require("../models/blacklist.model")

/**
 * @name registerusercontroller
 * @description register a user expect mail and password
 */

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "please provide all the field",
      });
    }

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isUserExist) {
      return res.status(400).json({
        message: "user already exist with same username or same mail ",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "user registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error while registering the user",
      error,
    });
  }
}

/**
 * @name loginUsercontroller
 * @description expects mail and password
 */
async function loginUsercontroller(req, res) {
  try {
    const { email,password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "invallid email or password",
      });
    }
    const isPasswordVallid = await bcrypt.compare(password, user.password);
    if (!isPasswordVallid) {
      return res.status(400).json({
        message: "invallid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error while login user",
    });
  }
}

/**
 * @name logoutuserController
 * @description it is used to logout
 */
async function logoutuserController(req,res){
  const token=req.cookies.token
  if(token){
    await tokenBlacklist.create({token})
  }
  res.clearCookie("token")
  res.status(200).json({
    message:"user logout successfully"
  })

}

/**
 * @name getCurrentUsercontroller
 * @description find the current user details
 */
async function getCurrentUsercontroller(req,res){
   const user=await userModel.findById(req.user.id)
     res.status(200).json({
    message:"user fetched successfully",
    user:{
        id: user._id,
        username: user.username,
        email: user.email,
    }
  })
}
module.exports = {
  registerUserController,
  loginUsercontroller,
  logoutuserController,
  getCurrentUsercontroller
};
