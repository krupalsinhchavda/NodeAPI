const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles'); // Directory where profile pictures will be stored
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname)); // Unique filename for the uploaded picture
    }
});

// Multer file filter to restrict uploads to image files only
const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
