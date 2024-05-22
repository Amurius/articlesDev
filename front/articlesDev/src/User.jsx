import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import './users.css';
import { useNavigate } from 'react-router-dom';
Chart.register(CategoryScale);

export default function Users() {
  const { user } = useParams();
  const [articles, setArticles] = useState();
  useEffect(() => {
    fetch('http://localhost:3000/api/articles/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user })
    }).then((response) => response.json()).then(respArticles => {
      setArticles(respArticles.themes);
      console.log(respArticles)
      if (respArticles.articlesParTheme[0] === undefined) {
        document.getElementById('divChart').innerHTML = 'Aucun article a été écrit par cet utilisateur';
      } else {
        document.getElementById("myChart").style.maxHeight = "95vh";
        const ctx = document.getElementById('myChart');
        var nbr = [];
        var theme = [];
        respArticles.themes.map((th) => {
          theme.push(th.la_nom)
        })
        respArticles.articlesParTheme.map((nombre) => {
          nbr.push(nombre.nb)
        })
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: theme,
            datasets: [{
              label: "Nombre d'article",
              data: nbr
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: "Nombre d'articles par thème"
              }
            }
          },
        });
      }
    })
  }, [])
  const Supprimer = (e) => {
    e.preventDefault();
    var titre = e.target.value;
    if (confirm('Voulez-vous vraiment supprimer cet article ?')){
      fetch("http://localhost:3000/api/articles/supprimer", {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({titre : titre})
      }).then(response => response.json()).then(data => {
        if (data.success){
          alert("Suppression réussi !")
          window.location.reload();
        }else {
          alert("erreur de suppression");
        }
      })
    } else {

    }
  }
  return (
    <>
      <div id="divChart">
        <canvas id="myChart" ></canvas>
        <div id="divArticlesUser">
          <h1>Voici tous les articles écrits</h1>
          <div id="divArticles">
            <div>
              {articles && articles.map((article, index) => <p>Titre de l'article : {article.ar_titre}</p>)}
            </div>
            <div id="divBtnSuppr">
              {articles && articles.map((article, index) => <button onClick={Supprimer} value={article.ar_titre}>Supprimer</button>)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}