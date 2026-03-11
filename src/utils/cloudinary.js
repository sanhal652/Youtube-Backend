import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'       //for file handling, mainly to manage file system

  cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

const uploadCloudinary = async (localFilePath)=>
{
   try {
    if(localFilePath)
    {
       const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type: 'auto'
       })
       //console.log("File has been successfully", response.url);
       fs.unlinkSync(localFilePath)
       console.log(response)
       return response;

    }
    else return null
   } catch (error) {
       fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as the upload operation failed
       return null
   }
}

   export {uploadCloudinary}