import mongoose,{Schema} from "mongoose"
const categorySchema= new Schema({
   name:{
    type:String,
    required:true,
    unique:true,
    trim:true
   },
   description:{
    type:String,
    required:true
   },
   icon:{
    type:String,
    required:false
   }
   
},{timestamps:true})
 

export const Category= mongoose.model("Category",categorySchema)