const mongoose=require("mongoose")

const blaclistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to blacklist"],
    }
},{timestamps:true})

const Tokenblaclist=mongoose.model("Tokenblaclist",blaclistTokenSchema)
module.exports=Tokenblaclist