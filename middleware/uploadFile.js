import multer from "multer";
import path from "path";
// Set Storage Engine

const storage  = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set destination based on file type
    if (file.mimetype.startsWith("image")) {
      cb(null, "./uploads/images");
    } else if (file.mimetype.startsWith("video")) {
      cb(null, "./uploads/videos");
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Upload Variable
const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 20000000 }, // Limit file size to 20MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file"); // Use 'file' as the name for both images and videos

// Check File Type
function checkFileType(file, cb) {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|webp|gif|mp4|avi|mkv|mov/;
  // Check extension         
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images and Videos Only!");
  }
}


export default uploadFile;