import mongoose,{Schema} from "mongoose";

const commentSchema= new Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    videos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Videos"
    }
    
},{timestamps:true})

export const Comment= mongoose.model("Comment",commentSchema)