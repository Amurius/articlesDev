import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './admin.css'
function Admin() {
  const [users, setUsers] = useState()
  const [articles, setArticles] = useState()
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    fetch('http://localhost:3000/api/users/getusers').then((response) => response.json()).then((users) => {
      setUsers(users.users);
      setArticles(users.usersArticle);
   })
  }, [])
  useEffect(() => {
    fetch('http://localhost:3000/api/session/user', {
      method: "GET",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    }).then((response) => response.json()).then((compte) => {
        if (compte.admin === 1){
          setAdmin(compte.admin);
        }
        else {
          setAdmin(null)
        }
    })
  },[])
  return (
    <>
    { admin === 1 ?
      <div id='conteneurAdminUsers'>
        <h1>Voici tous les utilisateurs ayant écrit des articles</h1>
        <div id='conteneurUsers'>
          <div id='divIdUser'>
          {articles && articles.map((user, index) => <p>{user.us_id}</p>)}
          </div>
          <div id='divNoms'>
            {articles && articles.map((user, index) => <Link to={'/users/' + user.us_id} id={user.us_id}>{user.us_nom}</Link>)}
          </div>
          <div>
          {articles && articles.map((user, index) => <p>{user.us_prenom}</p>)}
          </div>
          <div>
          {articles && articles.map((user, index) => <p>{user.us_email}</p>)}
          </div>
          <div>
          {articles && articles.map((user, index) => <p>{user.us_date_inscription.toString().substring(0,10)}</p>)}
          </div>
          <p id='nbarticles'>Nb Articles</p>
          <div>
          {articles && articles.map((user, index) => <p>{user.nb}</p>)}
          </div>
        </div>
        <h1>Voici tous les utilisateurs</h1>
        <div id='conteneurUsers'>
          <div id='divIdUser'>
          {users && users.map((user, index) => <p>{user.us_id}</p>)}
          </div>
          <div id='divNoms'>
            {users && users.map((user, index) => <Link to={'/users/' + user.us_id} id={user.us_id}>{user.us_nom}</Link>)}
          </div>
          <div>
          {users && users.map((user, index) => <p>{user.us_prenom}</p>)}
          </div>
          <div>
          {users && users.map((user, index) => <p>{user.us_email}</p>)}
          </div>
          <div>
          {users && users.map((user, index) => <p>{user.us_date_inscription.toString().substring(0,10)}</p>)}
          </div>
        </div>
      </div>
      :
      <>

      </>
    }
    </>
  )
}

export default Admin