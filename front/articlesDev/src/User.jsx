import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './users.css';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);


export default function Users() {
  const { user } = useParams();
  const [data, setData] = useState();
  const [articles, setArticles] = useState();
  const [admin, setAdmin] = useState(null);
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/articles/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user })
    }).then((response) => response.json()).then(respArticles => {
      setArticles(respArticles.themes);
      var nbr = [];
      var theme = [];
      respArticles.articlesParTheme.map((nombre) => {
        theme.push(nombre.la_nom)
        nbr.push(nombre.nb)
      })
      var tableau = {
        labels: theme,
        datasets: [{
          label: "Nombre d'article",
          data: nbr,
          backgroundColor: [
            'rgba(255, 0, 0, 0.3)',
            'rgba(34, 139, 34, 0.3)',
            'rgba(54, 162, 235, 0.3)',
            'rgba(255, 206, 86, 0.3)',
            'rgba(75, 192, 192, 0.3)',
            'rgba(0,0,128, 0.3)',
            'rgba(75, 0, 130, 0.3)',
            'rgba(255, 159, 64, 0.3)',
          ],
          borderColor: [
            'rgba(255, 0, 0, 1)',
            'rgba(34, 139, 34, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(0,0,128, 1)',
            'rgba(75, 0, 130, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        }]
      }
      setData(tableau)
    })

  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/api/session/user', {
      method: "GET",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    }).then((response) => response.json()).then((compte) => {
      if (compte.admin === 1) {
        setAdmin(compte.admin);
      } else if (compte.id == user) {
        setUtilisateur(compte.id)
      }
    })
  }, [])

  const Supprimer = (e) => {
    e.preventDefault();
    var titre = e.target.value;
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      fetch("http://localhost:3000/api/articles/supprimer", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre: titre })
      }).then(response => response.json()).then(data => {
        if (data.success) {
          alert("Suppression réussi !")
          window.location.reload();
        } else {
          alert("erreur de suppression");
        }
      })
    } else {

    }
  }
  if ( articles){
    console.log(articles);
  }
  
  if (data) {
    return (
      <>
        <div id="divChart">
          <div id="chart">
            <Doughnut data={data} />
          </div>
          {utilisateur == user ?
            <>
              <div id="divArticlesUser">
                <h1>Voici tous les articles écrits</h1>
                <div id="divArticles">
                  <div>
                    {articles && articles.map((article, index) => <p>Titre de l'article : <b>{article.ar_titre}</b>, thème : <b>{article.la_nom}</b></p>)}
                  </div>
                  <div id="divBtnSuppr">
                    {articles && articles.map((article, index) => <button onClick={Supprimer} value={article.ar_titre}>Supprimer</button>)}
                  </div>
                  <div id="divBtnModif">
                    {articles && articles.map((article, index) => <Link to={'/user/modification/'+article.ar_titre.toString().replaceAll(' ','_')} className='hlModif'>Modifier</Link>)}
                  </div>
                </div>
              </div>
            </>
            :
            <>
            </>
          }
          {admin === 1 ?
            <>
              <div id="divArticlesUser">
                <h1>Voici tous les articles écrits</h1>
                <div id="divArticles">
                  <div>
                    {articles && articles.map((article, index) => <p>Titre de l'article : <b>{article.ar_titre}</b>, thème : <b>{article.la_nom}</b></p>)}
                  </div>
                  <div id="divBtnSuppr">
                    {articles && articles.map((article, index) => <button onClick={Supprimer} value={article.ar_titre} className="btnBtn">Supprimer</button>)}
                  </div>
                  <div id="divBtnModif">
                    {articles && articles.map((article, index) => <Link to={'/user/modification/'+article.ar_titre.toString().replaceAll(' ','_')} className='hlModif btnLink'>Modifier</Link>)}
                  </div>
                </div>
              </div>
            </>
            :
            <>
            </>
          }
        </div>
      </>
    )
  }
}