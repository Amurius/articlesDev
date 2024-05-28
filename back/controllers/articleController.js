const db = require('../databases/database.js');

exports.createArticle = async (req, res) => {
  let conn
  const titre = req.body.article[0].titre;
  const te_id = req.body.article[0].templateID;
  const langage = req.body.article[0].langage;
  const contenu = req.body.article[0].contenu;
  var user = req.body.article[0].user;
  if (user == null) {
    user = 27;
  }
  try {
    conn = await db.pool.getConnection();
    var query = await conn.query("SELECT COUNT(*) as duplicata FROM articles WHERE ar_titre = ?", [titre])
    let date = new Date();
    if (query[0].duplicata == 0) {
      var query = await conn.query("SELECT la_id FROM langages WHERE la_nom = ?", [langage])
      la_id = query[0].la_id;
      query = await conn.query('INSERT INTO articles (ar_titre,ar_te_id,ar_la_id,ar_us_id,ar_date) VALUES (?, ?, ?,?,?); ', [titre, te_id, la_id, user,date]);
      query = await conn.query('SELECT ar_id from articles order by ar_id desc limit 1');
      var lastID = query[0].ar_id
      for (var i = 0; i < contenu.length; i++) {
        query = await conn.query('INSERT INTO textes (txt_contenu,txt_ar_id) VALUES (?, ?)', [contenu[i], lastID])
      }
      res.status(200).json({ "articleID": lastID });
    }
    else {
      res.status(200).json({ "articleID": "duplicata" });
    }
    conn.close();
  } catch (err) {
    console.error(err);
    conn = await db.pool.getConnection();
    query = await conn.query('DELETE FROM articles WHERE ar_titre = ?', [titre]);
    res.status(200).json({ "articleID": null });
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.getArticles = async (req, res) => {
  let conn
  try {
    conn = await db.pool.getConnection();
    if (req.body.langue === "tous") {
      var query = await conn.query('SELECT ar_titre,ar_us_id,ar_id,ar_date,te_nbr_images from articles inner join templates on ar_te_id = te_id;');
      var queryContenusTexte = await conn.query("SELECT txt_contenu,txt_ar_id FROM textes inner join articles on txt_ar_id = ar_id GROUP BY txt_id;")
      var users = await conn.query('SELECT us_prenom, us_id from users;');
      var queryImage = await conn.query("SELECT im_lien, im_placement, im_ar_id from images");
      var articles = []
      query.map(article => {
        var titre = article.ar_titre;
        var prenom;
        users.map((user) => {
          if (user.us_id == article.ar_us_id){
            prenom = user.us_prenom;
          }
        })
        var articleID = article.ar_id;
        var date = article.ar_date
        var texte = [];
        queryContenusTexte.map(contenu => {
          if (contenu.txt_ar_id == articleID) {
            texte.push(contenu['txt_contenu']);
          }
        })
        if (article.te_nbr_images > 0){
          var img = {}
          queryImage.map(image => {
            if (articleID == image.im_ar_id){
              img = {"lien" : image.im_lien, "placement" : image.im_placement}
            }
          })
          var articleRenvoi = { titre: titre, user: prenom, date: date, texte: texte, image: img}
        } else {
          var articleRenvoi = { titre: titre, user: prenom, date: date, texte: texte, image : null}
        }
        articles.push(articleRenvoi)
      })
    } else {
      var query = await conn.query('SELECT la_id from langages WHERE la_nom = ?;', [req.body.langue]);
      la_id = query[0].la_id;
      query = await conn.query('SELECT ar_titre,ar_us_id,ar_id,ar_date,te_nbr_images FROM articles inner join templates on ar_te_id = te_id WHERE ar_la_id = ?;', [la_id]);
      const nombre = await conn.query('SELECT COUNT(*) as nbRequest FROM articles WHERE ar_la_id = ?;', [la_id]);
      var users = await conn.query('SELECT us_prenom, us_id from users;');
      var queryImage = await conn.query("SELECT im_lien, im_placement, im_ar_id from images");
      if (nombre[0].nbRequest == 0) {
        res.status(200).json({ result: "vide" })
      }
      else {
        var queryContenusTexte = await conn.query('SELECT txt_contenu,txt_ar_id FROM textes inner join articles on txt_ar_id = ar_id INNER JOIN langages ON articles.ar_la_id = ? GROUP BY txt_id;', [la_id]);
        var articles = []
        query.map(article => {
          var titre = article.ar_titre;
          var prenom;
          users.map((user) => {
            if (user.us_id == article.ar_us_id){
              prenom = user.us_prenom;
            }
          })
          var articleID = article.ar_id;
          var date = article.ar_date
          var texte = [];
          queryContenusTexte.map(contenu => {
            if (contenu.txt_ar_id == articleID) {
              texte.push(contenu['txt_contenu']);
            }
          })
          if (article.te_nbr_images > 0){
            var img = {}
            queryImage.map(image => {
              if (articleID == image.im_ar_id){
                img = {"lien" : image.im_lien, "placement" : image.im_placement}
              }
            })
            var articleRenvoi = { titre: titre, user: prenom, date: date, texte: texte, image: img}
          } else {
            var articleRenvoi = { titre: titre, user: prenom, date: date, texte: texte, image : null}
          }
          articles.push(articleRenvoi)
        })
      }
    }
    res.status(200).json(articles);
  }
  catch (err) {
    console.error(err);
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.getArticleUser = async (req,res) => {
  let conn
  userID = req.body.user
  try {
    conn = await db.pool.getConnection();
    const themes = await conn.query("SELECT ar_titre,la_nom FROM articles inner join langages on ar_la_id = la_id WHERE ar_us_id = ?",[userID])
    const nbArticlesTheme = await conn.query("SELECT COUNT(*) as nb, la_nom FROM articles inner join langages on ar_la_id = la_id where ar_us_id = ? GROUP BY la_nom",[userID])
    nbArticlesTheme.map( (value) => {
      value.nb = value.nb.toString()
    }
    );
    // console.log(themes)
    // console.log(nbArticlesTheme)
    res.status(200).json({"themes" : themes, "articlesParTheme" :nbArticlesTheme})
  }
  catch (err) {
    console.error(err);
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.deleteArticle = async (req, res) => {
  let conn
  articleTitre = req.body.titre
  try {
    conn = await db.pool.getConnection();
    const select = await conn.query("SELECT te_nbr_images, ar_id from articles inner join templates on ar_te_id = te_id where ar_titre = ?", [articleTitre])
    var nbImages = select[0].te_nbr_images
    var arID = select[0].ar_id
    const textes = await conn.query("DELETE FROM textes WHERE txt_ar_id = ?", [arID])
    if (nbImages >0){
      const images = await conn.query("DELETE FROM images WHERE im_ar_id = ?", [arID])
    }
    const article = await conn.query("DELETE from articles where ar_titre = ?",[articleTitre])
    res.status(200).json({success : true})
  }
  catch (err) {
    console.error(err);
    res.status(500).json({success : false})
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.getArticleModif = async (req,res) => {
  let conn 
  var articleTitre = req.body.articleNom.replaceAll('_',' ')
  try {
    conn = await db.pool.getConnection();
    const query = await conn.query("SELECT * FROM articles WHERE ar_titre = ?", [articleTitre])
    const template = await conn.query("SELECT * FROM templates WHERE te_id = ?", [query[0].ar_te_id])
    const textes = await conn.query("SELECT * FROM textes WHERE txt_ar_id = ?", [query[0].ar_id])
    const image = await conn.query("SELECT * FROM images WHERE im_ar_id = ?", [query[0].ar_id])
    const langage = await conn.query("SELECT * from langages")
    res.status(200).json({"article":query, "textes":textes, "image":image, "template" : template, "langage" : langage});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({success : false})
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.updateArticle = async (req,res) => {
  let conn
  const titre = req.body.article[0].titre;
  const ar_id = req.body.article[0].articleID;
  const langage = req.body.article[0].langage;
  const contenu = req.body.article[0].contenu;
  try {
    conn = await db.pool.getConnection()
    var query = await conn.query("SELECT la_id FROM langages WHERE la_nom = ?", [langage])
    var la_id = query[0].la_id;
    const updateArticle = await conn.query("UPDATE articles SET ar_titre = ?, ar_la_id = ? WHERE ar_id = ?; ", [titre, la_id, ar_id])
    for ( var i=0; i<contenu.length; i++) {
      if (contenu[i].txt_id === null ){
        var insertTexte = await conn.query("INSERT INTO textes (txt_contenu,txt_ar_id) VALUES ( ?, ? )", [contenu[i].content, ar_id]);
      }else {
        var updateTextes = await conn.query("UPDATE textes SET txt_contenu = ? WHERE txt_id = ?", [contenu[i].content, contenu[i].txt_id])
      }
    }
    res.status(200).json({success : true})
  }
  catch (err) {
    console.error(err);
    res.status(500).json({success : false})
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}