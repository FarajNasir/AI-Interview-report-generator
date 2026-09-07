// const express=require("express")  type one 

// const router=express.Router()

const {Router}=require("express")

const AuthRouter=Router()
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")



/**
 * @routes POST api/auth/register
 * @description register new user 
 */
AuthRouter.post("/register",authController.registerUserController)

/**
 * @routes POST api/auth/login
 * @description login user with mail and pasword
 */

AuthRouter.post("/login",authController.loginUsercontroller)

/**
 * @routes GET api/auth/login
 * @description logout user and clear cookie and token and add token in blaclist 
 */
AuthRouter.get("/logout",authController.logoutuserController)

/**
 * @routes GET api/auth/get-me
 * @description find the login user details
 */
AuthRouter.get("/get-me",authMiddleware.authUser,authController.getCurrentUsercontroller)


module.exports=AuthRouter