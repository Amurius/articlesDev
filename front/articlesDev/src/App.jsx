import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './Login';
import SignIn from './SignIn';
import NavBar from './NavBar';
import CreateArticle from './CreateArticle';
import Full_Text from './Full_Text';
import Texte4Images1V from './Texte4Images1V';
import Texte4Images1H from './Texte4Images1H';
import Accueil from './Accueil';
import Admin from './Admin';
import User from './User';
import Modification from './Modification';
import { useState } from 'react';

function App() {
  const [variable, setVariables] = useState()

  return (
    <>
      <NavBar variable={variable} setVariables={setVariables}/>
      <div id='content'>
        <Routes>
          <Route path='/login' element={<Login setVariables={setVariables}/>} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/Accueil' element={<Accueil />} />
          <Route path='/CreateArticle' element={<CreateArticle />} />
          <Route path='/CreateArticle/Full_Text' element={<Full_Text />} />
          <Route path='/CreateArticle/Texte_4_Images_1_V' element={<Texte4Images1V />} />
          <Route path='/CreateArticle/Texte_4_Images_1_H' element={<Texte4Images1H />} />
          <Route path='/server/admin/inprogress' element={<Admin />} />
          <Route path='/users/:user' element={<User />} />
          <Route path='/user/modification/:articleID' element={<Modification />} />
        </Routes>
      </div>
    </>
  )
}

export default App
