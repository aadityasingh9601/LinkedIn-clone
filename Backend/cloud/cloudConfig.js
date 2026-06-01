import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "LinkedIn_DEV",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

const parseJsonBody = (req) => {
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === "string") {
      try {
        req.body[key] = JSON.parse(req.body[key]);
      } catch {

      }
    }
  }
};

const singleUpload = (fieldName) => {
  return async (req, res, next) => {
    const single = upload.single(fieldName);
    single(req, res, async (err) => {
      if (err) return next(err);
      parseJsonBody(req);
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.buffer);
          req.file.path = result.secure_url;
          req.file.filename = result.public_id;
        } catch (cloudinaryErr) {
          return next(cloudinaryErr);
        }
      }
      next();
    });
  };
};

const multiFieldsUpload = (fields) => {
  return async (req, res, next) => {
    const multi = upload.fields(fields);
    multi(req, res, async (err) => {
      if (err) return next(err);
      parseJsonBody(req);
      if (req.files) {
        const promises = [];
        for (const files of Object.values(req.files)) {
          for (const file of files) {
            promises.push(
              uploadToCloudinary(file.buffer).then((result) => {
                file.path = result.secure_url;
                file.filename = result.public_id;
              }),
            );
          }
        }
        await Promise.all(promises);
      }
      next();
    });
  };
};

export { cloudinary, singleUpload, multiFieldsUpload, uploadToCloudinary };
