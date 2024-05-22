import CreateArticle from "./CreateArticle"
import { useState, useEffect } from "react";
import axios from "axios";
import './imageH.css';

export default function Temp3() {
  const [template, setTemplate] = useState();
  const [file, setFile] = useState();
  const [position, setPosition] = useState();
  useEffect(() => {
    var templateNom = document.location.href.substring(document.location.href.lastIndexOf("/") + 1);
    fetch('http://localhost:3000/api/templates/gettemplate', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ "templateNom": templateNom })
    }
    ).then((response) => response.json()).then(respTemplate => {
      setTemplate(respTemplate)
      document.getElementById('formArticle').innerHTML = '';
      var doc = document.getElementById("formArticle");
      var h1 = document.createElement("h1");
      h1.innerText = "Titre de votre article"
      var input = document.createElement("input");
      input.type = "text";
      input.id = "titre";
      var h3 = document.createElement("h3");
      h3.innerText = "Zones de texte : 1 paragraphe par zone de saisie ";
      doc.appendChild(h1);
      doc.appendChild(input);
      doc.appendChild(h3);
      var div = document.createElement('div')
      div.id = "divTextesImage"
      var div2 = document.createElement('div')
      div2.id = "divImgHhaut"
      setPosition("haut");
      div2.innerText = 'Importez votre image en bas de la page'
      div.appendChild(div2)
      for (var i = 0; i < respTemplate["zonesTexte"]; i++) {
        var textearea = document.createElement('textarea')
        textearea.className = "textes"
        textearea.id = "texte" + i
        div.appendChild(textearea)
      }
      doc.appendChild(div)
      var div3 = document.createElement('div')
      div3.id = "divValidation"
      var div4 = document.createElement('div')
      div4.id = "divLangage"
      var label = document.createElement('label')
      label.id = "sujet"
      label.innerText = "Quel est le sujet de l'article ?"
      var select = document.createElement('select')
      select.id = "langage"
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
      doc.appendChild(div3)
    })
  }, []);

  const Submit = (e) => {
    e.preventDefault();
    var titre = document.getElementById('titre').value
    const langage = document.getElementById('langage').value
    var article = new Array();
    var texte = new Array();
    // doit récupérer l'id de la personne connecté qui écrit
    var userID = null

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
        var data = new FormData();
        const url = 'http://localhost:3000/api/files/uploadfile';
        data.append('file', file)
        data.append('fileName', file.name)
        data.append('filePosition', position)
        data.append('articleID', respArticle.articleID)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
        axios.post(url, data, config).then((response) => {
          console.log(response.data)
        });
        alert("vous venez d'ajouter le " + respArticle.ArticleID + "eme article du site ! Merci de votre participation :)")
      }
      else if (respArticle.articleID === "duplicata") {
        alert("Un article du même nom à déjà été créer veuillez choisir un autre nom !")
      }
      else if (respArticle.articleID === null) {
        alert("erreur lors de l'insertion")
      }
    })
  }
  const fileChange = (e) => {
    setFile(e.target.files[0]);
  }
  const positionChange = (e) => {
    var idAvant = "divImgH" + position
    var id = "divImgH" + e.target.value
    document.getElementById(idAvant).id = id;
    setPosition(e.target.value);
  }
  return (
    <>
      <div id='contenuCreate'>
        <CreateArticle />
        <div id="conteneurTemplate">
        <div className="divPositionSelector">
            <label>Position de l'image</label>
            <select id="positionSelector" onChange={positionChange}>
              <option value="haut">Haut</option>
              <option value="milieu">Milieu</option>
              <option value="bas">Bas</option>
            </select>
            </div>
          <form onSubmit={Submit} id="formulaire">
            <div id="formArticle">

            </div>
            <div id="divInputFile"><label>Choisissez votre image ici :</label><input type="file" id="inputFile" onChange={fileChange}></input></div>
            <input type="submit" value="Submit" id="submit"></input>
          </form>
        </div>
      </div>


    </>
  )
}