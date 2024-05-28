import CreateArticle from "./CreateArticle"
import './fulltexte.css'
import { useState, useEffect } from "react";

export default function Temp1() {
  const [template, setTemplate] = useState();
  const [utilisateur, setUtilisateur] = useState();
  useEffect(() => {
    var templateNom = document.location.href.substring(document.location.href.lastIndexOf("/") + 1);
    fetch('http://localhost:3000/api/templates/gettemplate', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ "templateNom": templateNom })
    }
    ).then((response) => response.json()).then(respTemplate => {
      setTemplate(respTemplate);
      document.getElementById('displayTemplate').innerHTML = '';
      var doc = document.getElementById("displayTemplate");
      var h1 = document.createElement("h1");
      h1.innerText = "Titre de votre article"
      var input = document.createElement("input");
      input.type = "text";
      input.className = "titre";
      var h3 = document.createElement("h3");
      h3.innerText = "Zones de texte : 1 paragraphe par zone de saisie ";
      doc.appendChild(h1);
      doc.appendChild(input);
      doc.appendChild(h3);
      var div = document.createElement('div')
      div.className = "divTextes"
      // var div2 = document.createElement('div')
      // div2.id = "divImgV"
      // div2.innerText = 'Importez votre image en bas de la page'
      // div.appendChild(div2)
      for (var i = 0; i < respTemplate["zonesTexte"]; i++) {
        var textearea = document.createElement('textarea')
        textearea.className = "textes"
        textearea.id = "texte" + i
        div.appendChild(textearea)
      }
      doc.appendChild(div)
      var div3 = document.createElement('div')
      div3.className = "divValidation"
      var div4 = document.createElement('div')
      div4.className = "divLangage"
      var label = document.createElement('label')
      label.className = "sujet"
      label.innerText = "Quel est le sujet de l'article ?"
      var select = document.createElement('select')
      select.className = "langage"
      select.name = "langage"
      respTemplate["langages"].map((langue) => {
        var option = document.createElement('option')
        option.value = langue.la_nom
        option.innerText = langue.la_nom
        select.appendChild(option)
      })
      div4.appendChild(label)
      div4.appendChild(select)
      div3.appendChild(div4)
      var input = document.createElement('input')
      input.type = "submit"
      input.value = "Submit"
      div3.appendChild(input)
      doc.appendChild(div3)
    })
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/session/user', {
      method: "GET",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    }).then((response) => response.json()).then((compte) => {
      setUtilisateur(compte)
    })
  }, [])

  const Submit = (e) => {
    e.preventDefault();
    var titre = document.querySelector('.titre').value
    const langage = document.querySelector('.langage').value
    var article = new Array();
    var texte = new Array();
    // doit récupérer l'id de la personne connecté qui écrit
    if (utilisateur) {
      var userID = utilisateur.id
    } else {
      var userID = null
    }

    for (var i = 0; i < template.template[0].te_nbr_texte; i++) {
      let texteID = 'texte' + i
      let texteContent = document.getElementById(texteID).value
      texte.push(texteContent);

    }

    article.push({ "templateID": template.template[0].te_id, "titre": titre, "langage": langage, "user": userID, "contenu": texte });

    fetch('http://localhost:3000/api/articles/createarticle', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ "article": article })
    }).then((response) => response.json()).then(respArticle => {
      if (respArticle.articleID > 0) {
        alert("vous venez d'ajouter le " + respArticle.articleID + "eme article du site ! Merci de votre participation :)")
      }
      else if (respArticle.articleID === "duplicata") {
        alert("Un article du même nom à déjà été créer veuillez choisir un autre nom !")
      }
      else if (respArticle.articleID === null) {
        alert("erreur lors de l'insertion")
      }
    })
  }
  return (
    <>
      <div id='contenuCreate'>
        <CreateArticle />
        <div id="conteneurTemplate">
          <form onSubmit={Submit} className="formulaireFullText" >
            <div className="formArticle" id="displayTemplate">

            </div>
          </form>
        </div>
      </div>

    </>
  )
}