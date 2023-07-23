import multer, { diskStorage } from "multer";

const multerOptions = () => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/offers");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      console.log(ext);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
    },
  });

  const upload = multer({ storage: storage });

  return upload;
};

export function uploadFiles(arrayOfFields) {
  return multerOptions().fields(arrayOfFields);
}
