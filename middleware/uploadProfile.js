import multer from "multer";
import path from "path";
// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./uploads/profiles",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Upload Variable
const uploadProfile = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image"); // Use 'file' as the name for both images and videos

// Check File Type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }

export default uploadProfile;
