const db = require('../databases/database.js');

exports.getTemplates = async (req, res) => {
  let conn
  try {
    conn = await db.pool.getConnection();
    const templates = await conn.query('SELECT * FROM templates');
    res.status(200).json(templates)
    conn.close();
  } catch (err) {
    console.error(err);
  }
}

exports.getTemplate = async (req, res) => {
  let conn
  try {
    conn = await db.pool.getConnection();
    const nom = req.body.templateNom;
    const template = await conn.query('SELECT * FROM templates WHERE te_nom = ?', [nom]);
    var zones = template[0].te_nbr_texte;
    // var zones = "<h1>Titre de votre article</h1> <input type='text' id='titre'/> <h3>Zones de texte : 1 paragraphe par zone de saisie </h3>"
    // if (template[0].te_nbr_images == 0){
    //   zones += "<div id='divTextes'>"
    //   for (var i = 0; i < template[0].te_nbr_texte; i++) {
    //     input = "<textarea id='texte" + i + "' class='textes'></textarea>";
    //     zones = zones + input
    //   }
    // }
    // else {
    //   if (template[0].te_position_img == "verticale"){
    //     zones += "<div id='divTextesImage'>"
    //     zones += "<div id='divImgV'><input type='file'></div>";
    //     for (var i = 0; i < template[0].te_nbr_texte; i++) {
    //       input = "<textarea id='texte" + i + "' class='textes'></textarea>";
    //       zones = zones + input
    //     }
    //   }
    // }
    // zones = zones + "</div> <div id='divValidation'><div id='divLangage' > <label id='sujet'>Quel est le sujet de l'article ?</label> <select name='langage' id='langage'>";
    // langages.map((langage) => {
      //   zones = zones + "<option value=" + langage.la_nom + ">" + langage.la_nom + "</option>";
      // })
      // zones += "</select> </div> <input type='submit' value='Submit'/> </div>";
    const langages = await conn.query('SELECT * FROM langages')
    res.status(200).json({ "template": template, "zonesTexte": zones, "langages": langages})
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