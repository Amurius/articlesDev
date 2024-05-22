const db = require('../databases/database.js');

exports.uploadFile = async (req,res) => {
  const file = req.file;
  const articleID = req.body.articleID
  const position = req.body.filePosition
  let conn
  try {
    conn = await db.pool.getConnection();
    const path = "../src/assets/"+file.filename;
    const name = file.filename;
    const query = conn.query("INSERT INTO images (im_titre,im_lien,im_placement,im_ar_id) VALUES (?,?,?,?)", [name,path,position,articleID]);
    res.status(200).json({ fileUrl: path });
  } catch (err) {
    console.error(err);
    res.status(500)
  }
  finally {
    if (conn) {
      conn.release();
    }
  } 
}