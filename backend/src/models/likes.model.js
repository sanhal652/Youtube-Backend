import mongoose,{Schema} from "mongoose";

const likeSchema= new Schema({
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Videos"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    }

},{timestamps:true})

export const Likes= mongoose.model("Likes",likeSchema)