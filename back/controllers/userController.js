const db = require('../databases/database.js');
const pswHash = require('password-hash');

exports.getUsers = async(req,res) => {
  let conn;
  try {
    conn = await db.pool.getConnection();
    const rows = await conn.query("SELECT us_id,us_nom,us_prenom,us_email,us_date_inscription,us_admin, COUNT(*) as nb FROM users inner join articles on us_id = ar_us_id group by us_id")
    rows.map( (value) => {
      value.nb = value.nb.toString()
    }
    );
    const users = await conn.query("SELECT * from users")
    res.status(200).json({"usersArticle" : rows, "users" : users})
  }
  catch(err){
    console.log(err)
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}
exports.postUser = async (req, res) => {
  let conn;
  try {
    conn = await db.pool.getConnection();
    const { nom, prenom, age, email, password } = req.body;
    const mailUtilise = await conn.query("SELECT COUNT(*) nb  FROM users WHERE us_email = ?", [email])
    var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")
    // if (reg.test(password)){
      var passwordHash = pswHash.generate(password)
    // } else {
      // res.status(500).json({ password : 0})
    // }
    let date = new Date();
    var admin = 0
    mailUtilise.map(utilise => {
      oui = utilise.nb.toString().substring(0, 1);
    })
    //verif si le mail est deja utilisé
    if (oui > 0) {
      console.log("duplicata")
      res.status(200).json({ "success": oui });
    } else {
      const query = await conn.query("INSERT INTO users (us_nom,us_prenom,us_age,us_email,us_password,us_date_inscription,us_admin) VALUES (?,?,?,?,?,?,?)", [nom, prenom, age, email, passwordHash, date, admin], function (err, result) { })
      res.status(200).json({ "success": oui })
    }
  }
  catch (err) {
    console.log(err)
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}