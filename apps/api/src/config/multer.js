import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const upload = multer({
//   dest: "uploads/",
//   fileFilter: filterCallBack,
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

const fileFilter = (req, file, cb) => {
  console.log("Inside filter function");
  console.log("req body", req.body);
  console.log("file object", file);

  try {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  } catch (error) {
    cb(new Error("Error multer related"))
  } 
} 

export { upload }