const  express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/signin/ajoutuser', userController.postUser)
router.get('/users/getusers', userController.getUsers)

module.exports = router;