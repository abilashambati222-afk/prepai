const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists inside backend/uploads/
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Naming pattern: resume-<userId>-<timestamp>.pdf
    const userId = req.user ? req.user._id : 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${userId}-${timestamp}${ext}`);
  }
});

// Filter rules (Only PDF files accepted)
const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (mimeType === 'application/pdf' && ext === '.pdf') {
    cb(null, true);
  } else {
    const err = new Error('Invalid file format. Only PDF files are accepted.');
    err.statusCode = 400;
    cb(err, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max file limit
  }
});

module.exports = upload;
