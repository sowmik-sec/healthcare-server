import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dfllcpvi5",
  api_key: "619164431581856",
  api_secret: "8WWPLusHYN0SbCpe3s9oiQPMCdg", // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: any) => {
  return new Promise(async (resolve, reject) => {
    const uploadResult = await cloudinary.uploader
      .upload(file.path, {
        public_id: file.originalname,
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
    resolve(uploadResult);
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
