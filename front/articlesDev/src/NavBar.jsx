import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './navbar.css'
import { useNavigate } from 'react-router-dom';
export default function NavBar({ variable, setVariables }) {
  const navigate = useNavigate();
  const [logged, setLogged] = useState();
  const [admin, setAdmin] = useState();
  const [utilisateur, setUtilisateur] = useState(null);
  useEffect(() => {
    fetch('http://localhost:3000/api/session/user', {
      method: "GET",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    }).then((response) => response.json()).then((user) => {
      if (user.admin === 1) {
        setAdmin(user.admin);
      }
      if (user.id != null) {
        setUtilisateur(user)
      }
      else {
        console.log('invité')
        setAdmin(false)
      }
    })
  }, [variable])

  const logout = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/api/session/logout', {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include'
    }).then((response) => response.json()).then((log) => {
      setUtilisateur(null)
      setAdmin(null)
      navigate(log.redirect)
    })
  }
  return (
    <>
      <div id="NavBar">
        <p id='pageTitre'>DevOup's</p>
        <div id='conteneurLiens'>
          <Link to='/Accueil' className='hlNav'>Accueil </Link>
          <Link to='/CreateArticle' className='hlNav'>Ecrire un Article </Link>
          {utilisateur == null ?
            <>
              <Link to='/login' className='hlNav'>Login </Link>
              <Link to='/signin' className='hlNav'>Sign In </Link>
            </>
            :
            <>
              <Link to={'/users/' + utilisateur.id} className='hlNav'>Compte de {utilisateur.prenom}</Link>
              <Link className='hlNav' onClick={logout}>Logout</Link>
            </>
          }
          {admin === 1 ?
            <>
              <Link to='/server/admin/inprogress' className='hlNav'>Administration</Link>
            </>
            :
            <>

            </>
          }
        </div>
      </div>
    </>
  )
}