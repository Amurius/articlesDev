const  express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/session/connection', sessionController.sessionStart)
router.get('/session/user', sessionController.getUser)
router.post('/session/logout', sessionController.sessionLogout)
module.exports = router;
