const  express = require('express');
const router = express.Router();
const langagesController = require("../controllers/langagesController");

router.get('/langages/getlangages', langagesController.getLangages)

module.exports = router;