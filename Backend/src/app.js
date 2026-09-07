const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")


const app=express();
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

/** require all the routes */
const AuthRouter=require("./routes/auth.route")
const interviewRoutes=require("./routes/interview.routes")

/** using all the routes  */
app.use("/api/auth",AuthRouter)
app.use("/api/interview",interviewRoutes)



module.exports=app