import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath)
        console.log("File has been successfully uploaded", response.url)
        return response.url

    }catch(error){
        fs.unlinkSync(localFilePath)
        return null

    }
}

export {uploadOnCloudinary}