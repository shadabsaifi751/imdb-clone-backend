import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUD_API_KEY, CLOUD_API_SECRETKEY, CLOUD_NAME } from "../config/env.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRETKEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!fs.existsSync(localFilePath)) {
      console.error("File not found for Cloudinary upload:", localFilePath);
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.log(error);
    // fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
