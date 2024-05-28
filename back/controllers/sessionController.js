const db = require('../databases/database.js');
const pswHash = require('password-hash');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

exports.sessionStart = async (req, res) => {
  let conn;
  try {
    conn = await db.pool.getConnection();
    const { email, password } = req.body;
    const query = await conn.query("SELECT us_email,us_password,us_id, us_prenom, us_admin FROM users where us_email = ?", [email])
    var us_email = query[0].us_email;
    var us_password = query[0].us_password;
    var us_id = query[0].us_id;
    var us_prenom = query[0].us_prenom;
    var us_admin = query[0].us_admin;
    if (us_email == email) {
      if (pswHash.verify(password, us_password)) {
        var token = jwt.sign({'id' : us_id, 'email': us_email, 'prenom' : us_prenom, 'admin': us_admin}, process.env.JWT_KEY, {expiresIn: '1h'} )
        res.status(200).cookie('token',token, {
          expires: new Date(Date.now() +  24 * 60 * 60 * 1000),
          httpOnly: true,
          path: "/",
          secure: false,
          sameSite: 'Lax'
      }).json({'success': "loggedin" , redirect : "../accueil"})
      } else {
        res.status(401).json({ success: 'wrongpwd' });
      }
    } else {
      console.log("pas d'email")
      res.status(404).json({ success: 'noemail' });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.getUser = (req, res) => {
  var token = req.cookies.token
  if(token){
    if (jwt.verify(token, process.env.JWT_KEY)) {    
      var decoded = jwt.decode(token)
      var boolAdmin = decoded.admin
      res.status(200).json({admin : boolAdmin, id : decoded.id, prenom : decoded.prenom});
    } else {
      res.status(404).json({error: 'Tampered Token'});
    }
  }

};

// Logout page 
exports.sessionLogout = (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({redirect : '../login'});
  }
  catch (err) {
    console.error('Erreur lors de la destruction de la session:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// exports.sessionChecker = (req, res, next) => {
//   console.log(`Session Checker: ${req.session.id}`.green);
//   console.log(req.session);
//   if (req.session.profile) {
//       console.log(`Found User Session`.green);
//       next();
//   } else {
//       console.log(`No User Session Found`.red);
//       res.redirect('/login');
//   }
// };