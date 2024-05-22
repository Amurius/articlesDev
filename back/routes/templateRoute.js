const  express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/templates/gettemplates', templateController.getTemplates)
router.post('/templates/gettemplate', templateController.getTemplate)

module.exports = router;