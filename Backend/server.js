require("dotenv").config()
const app=require("./src/app")
const connectToDB=require("./src/config/database")
const invokeGemini=require("./src/services/ai.service")


async function startServer() {
    try {
        await connectToDB()
        app.listen(3000,()=>{
            console.log("server is running on port 3000")
        })
    } catch (error) {
        process.exitCode = 1
    }
}

startServer()