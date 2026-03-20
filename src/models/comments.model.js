import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment= mongoose.model("Comment",commentSchema)