import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

//Connectiong our backend to the cloudinary account.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//Create our cloudinary storage.

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LinkedIn_DEV",
    allowedFormats: ["png", "jpg", "jpeg", "avif", "gif", "mp4", "pdf"],
    resource_type: "auto", // Automatically determine type based on the file extension.
  },
});

export { cloudinary, storage };
