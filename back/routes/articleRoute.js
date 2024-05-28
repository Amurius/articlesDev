const  express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.post('/articles/createarticle', articleController.createArticle)
router.post('/articles/getarticles', articleController.getArticles)
router.post('/articles/user', articleController.getArticleUser)
router.post('/articles/articleUser', articleController.getArticleModif)
router.delete('/articles/supprimer', articleController.deleteArticle)
router.patch('/articles/update', articleController.updateArticle)
module.exports = router;