const  express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.post('/articles/createarticle', articleController.createArticle)
router.post('/articles/getarticles', articleController.getArticles)
router.post('/articles/user', articleController.getArticleUser)
router.delete('/articles/supprimer', articleController.deleteArticle)
module.exports = router;