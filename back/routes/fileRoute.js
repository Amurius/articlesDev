const  express = require('express');
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../front/articlesDev/src/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/files/uploadfile', upload.single('file'), fileController.uploadFile)
router.post('/files/updatefile', upload.single('file'), fileController.updateFile)

module.exports = router;