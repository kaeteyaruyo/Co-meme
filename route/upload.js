const multer  = require('multer')

module.exports = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 16 * 1024 * 1024,  // 16 MB
    },
    fileFilter (req, file, callback) {
      if (!file.mimetype.match(/^image/)) {
        callback(new Error().message = 'Invalid file type');
      } else {
        callback(null, true);
      }
    }
});