import { Link } from 'react-router-dom';
import './createarticle.css'
import { useEffect, useState } from 'react';
export default function CreateArticle() {
  const [templates, setTemplates] = useState();
  useEffect(() =>{
    fetch('http://localhost:3000/api/templates/gettemplates').then((response) => response.json()).then(respTemplates => {
      setTemplates(respTemplates)
    })
  }, []);
  
  return (
    <>
      <div id="conteneurChoixTemplate">
        <div id='titreChoixTemplate'>
          <h1 id='choixTemplate'>Choix du Template</h1>
        </div>
        {templates && templates.map((template, index) => <Link to={"/CreateArticle/"+template.te_nom} className='hlChoixTemplate' >{template.te_nom.replaceAll('_',' ')}</Link>)}
      </div>
    </>
  )
}