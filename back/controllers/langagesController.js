const db = require('../databases/database');

exports.getLangages = async (req, res) => {
  let conn
  try {
    conn = await db.pool.getConnection();
    const query = await conn.query("SELECT * FROM langages");
    res.status(200).json(query);
  } catch (err) {
    console.error(err);
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}