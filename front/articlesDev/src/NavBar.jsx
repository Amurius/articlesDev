import { Link } from 'react-router-dom';
import './navbar.css'
export default function NavBar() {

  return (
    <>
    <div id="NavBar">
    <p id='pageTitre'>DevOup's</p>
    <div id='conteneurLiens'>
      <Link to='/Accueil' className='hlNav'>Accueil </Link>
      <Link to='/CreateArticle' className='hlNav'>Ecrire un Article </Link>
      <Link to='/login' className='hlNav'>Login </Link>
      <Link to='/signin' className='hlNav'>Sign In </Link>
    </div>
    </div>
    </>
  )
}