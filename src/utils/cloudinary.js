import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dk3seqwmg",
  api_key: "642823594613213",
  api_secret: "IZuTI8hzy_kgBtYl05cVawSM7M4",
  // cloud_name: process.env.CLOUD_NAME,
  // api_key: process.env.CLOUD_API_KEY,
  // api_secret: process.env.CLOUD_API_SECRETKEY // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
