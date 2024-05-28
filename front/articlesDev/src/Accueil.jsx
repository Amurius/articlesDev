import { useState, useEffect } from 'react'

function Accueil() {
  useEffect(() => {
    fetch('http://localhost:3000/api/langages/getlangages').then((response) => response.json()).then(respLangages => {
      for (var i = 0; i < respLangages.length; i++) {
        var option = document.createElement('option');
        option.value = respLangages[i].la_nom
        option.innerText = respLangages[i].la_nom
        document.getElementById('filtre').appendChild(option);
      }
    })
  }, [])

  useEffect(() => {
    var langue = document.getElementById('filtre').value;
    console.log(langue)
    fetch('http://localhost:3000/api/articles/getarticles', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ langue: langue })
    }).then((response) => response.json()).then(respArticles => {
      document.getElementById('h1').innerText = "Voici tous les articles publiés sur le site :";
      document.getElementById('h3').innerText = "N'hésitez surtout pas à ajouter des articles. Toute aide est la bienvenue !";
      document.getElementById('conteneurArticles').innerHTML = "";
      respArticles.map((article) => {
        var div = document.createElement('div');
        div.className = 'divArticle';
        var h2 = document.createElement('h2');
        h2.className = 'h2Article';
        h2.innerText = article.titre;
        div.appendChild(h2);
        var div2 = document.createElement('div');
        div2.className = 'divTexteArticle';
        if (article.image != null) {
          for (var i = 0; i < article.texte.length; i++) {
            var p = document.createElement('p');
            p.innerText = article.texte[i]
            p.className = "texte" + i
            div2.appendChild(p)
          }
          if (article.image.placement == 'gauche') {
            var img = document.createElement('img');
            img.className = 'imgImageArtilcleVG'
            img.src = article.image.lien
            div2.appendChild(img)
          } else if (article.image.placement == 'droite') {
            var img = document.createElement('img');
            img.className = 'imgImageArtilcleVD'
            img.src = article.image.lien
            div2.appendChild(img)
          } else if (article.image.placement == 'haut') {
            var img = document.createElement('img');
            img.className = 'imgImageArtilcleHTop'
            img.src = article.image.lien
            div2.appendChild(img)
          } else if (article.image.placement == 'milieu') {
            var img = document.createElement('img');
            img.className = 'imgImageArtilcleHMiddle'
            img.src = article.image.lien
            div2.appendChild(img)
          } else if (article.image.placement == 'bas') {
            var img = document.createElement('img');
            img.className = 'imgImageArtilcleHBottom'
            img.src = article.image.lien
            div2.appendChild(img)
          }
        } else {
          for (var i = 0; i < article.texte.length; i++) {
            var p = document.createElement('p');
            p.innerText = article.texte[i]
            p.className = "texte" + i
            div2.appendChild(p)
          }
        }
        div.appendChild(div2)
        var divUserDate = document.createElement('div');
        divUserDate.id = "divUserDate";
        var texteUserDate = document.createElement('p');
        texteUserDate.innerText = "Article publié par " + article.user + " le " + article.date.toString().substring(0, 10)
        divUserDate.appendChild(texteUserDate);
        div.appendChild(divUserDate);
        document.getElementById('conteneurArticles').appendChild(div)
      })
    })
  }, []);

  const filtre = (e) => {
    var langue = e.target.value
    fetch('http://localhost:3000/api/articles/getarticles', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ langue: langue })
    }
    ).then((response) => response.json()).then(respArticles => {
      if (respArticles.result === "vide") {
        document.getElementById('h1').innerText = "Nous sommes désolé mais aucun contenu n'a été publié à ce sujet..."
        document.getElementById('h3').innerText = "Soyez le premier :) !"
        document.getElementById('conteneurArticles').innerHTML = "";
      }
      else if (langue === "tous") {
        document.getElementById('h1').innerText = "Voici tous les articles publiés sur le site :";
        document.getElementById('h3').innerText = "N'hésitez surtout pas à ajouter des articles. Toute aide est la bienvenue !";
        document.getElementById('conteneurArticles').innerHTML = "";
        respArticles.map((article) => {
          var div = document.createElement('div');
          div.className = 'divArticle';
          var h2 = document.createElement('h2');
          h2.className = 'h2Article';
          h2.innerText = article.titre;
          div.appendChild(h2);
          var div2 = document.createElement('div');
          div2.className = 'divTexteArticle';
          if (article.image != null) {
            for (var i = 0; i < article.texte.length; i++) {
              var p = document.createElement('p');
              p.innerText = article.texte[i]
              p.className = "texte" + i
              div2.appendChild(p)
            }
            if (article.image.placement == 'gauche') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleVG'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'droite') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleVD'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'haut') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleHTop'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'milieu') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleHMiddle'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'bas') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleHBottom'
              img.src = article.image.lien
              div2.appendChild(img)
            }
          } else {
            for (var i = 0; i < article.texte.length; i++) {
              var p = document.createElement('p');
              p.innerText = article.texte[i]
              p.className = "texte" + i
              div2.appendChild(p)
            }
          }
          div.appendChild(div2)
          var divUserDate = document.createElement('div');
          divUserDate.id = "divUserDate";
          var texteUserDate = document.createElement('p');
          texteUserDate.innerText = "Article publié par " + article.user + " le " + article.date.toString().substring(0, 10)
          divUserDate.appendChild(texteUserDate);
          div.appendChild(divUserDate);
          document.getElementById('conteneurArticles').appendChild(div)
        })
      }
      else {
        document.getElementById('h1').innerText = "Voici tous les articles publiés pour du " + langue;
        document.getElementById('h3').innerText = "N'hésitez surtout pas à ajouter des articles. Toute aide est la bienvenue !";
        document.getElementById('conteneurArticles').innerHTML = "";
        respArticles.map((article) => {
          console.log(article)
          var div = document.createElement('div');
          div.className = 'divArticle';
          var h2 = document.createElement('h2');
          h2.className = 'h2Article';
          h2.innerText = article.titre;
          div.appendChild(h2);
          var div2 = document.createElement('div');
          div2.className = 'divTexteArticle';
          if (article.image != null) {
            for (var i = 0; i < article.texte.length; i++) {
              var p = document.createElement('p');
              p.innerText = article.texte[i]
              p.className = "texte" + i
              div2.appendChild(p)
            }
            if (article.image.placement == 'gauche') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleVG'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'droite') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleVD'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'haut') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleHTop'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'milieu') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleHMiddle'
              img.src = article.image.lien
              div2.appendChild(img)
            } else if (article.image.placement == 'bas') {
              var img = document.createElement('img');
              img.className = 'imgImageArtilcleHBottom'
              img.src = article.image.lien
              div2.appendChild(img)
            }
          } else {
            for (var i = 0; i < article.texte.length; i++) {
              var p = document.createElement('p');
              p.innerText = article.texte[i]
              p.className = "texte" + i
              div2.appendChild(p)
            }
          }
          div.appendChild(div2)
          var divUserDate = document.createElement('div');
          divUserDate.id = "divUserDate";
          var texteUserDate = document.createElement('p');
          texteUserDate.innerText = "Article publié par " + article.user + " le " + article.date.toString().substring(0, 10)
          divUserDate.appendChild(texteUserDate);
          div.appendChild(divUserDate);
          document.getElementById('conteneurArticles').appendChild(div)

        })
      }
    })
  }

  useEffect(() => {
    fetch('http://localhost:3000/api/session/user', {
      method: "GET",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    }).then((response) => response.json()).then((user) => {
      if (user.admin === 1) {
      }
      if (user.id != null) {
      }
      else {
        console.log('invité')
      }
    })
  }, [])
  return (
    <>
      <div id='conteneurAccueil'>
        <h1 id='h1'>Nous sommes désolé mais aucun contenu n'a été publié à ce sujet</h1>
        <h3 id='h3'>Soyez le premier :)!</h3>
        <div id='divFiltre'>
          <label id='lbFiltre'>Quel sujet recherchez-vous ?</label>
          <select onChange={filtre} id='filtre'>
            <option value='tous'>Tous</option>
          </select>
        </div>
        <div id='conteneurArticles'>
        </div>
      </div>
    </>
  )
}

export default Accueil
