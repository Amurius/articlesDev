import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './modification.css';
import axios from "axios";

export default function Modification() {
  const { articleID } = useParams();
  const [utilisateur, setUtilisateur] = useState();
  const [article, setArticle] = useState();
  const [textes, setTextes] = useState();
  const [image, setImage] = useState();
  const [template, setTemplate] = useState();
  const [langage, setLangage] = useState();
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState();

  useEffect(() => {
    fetch('http://localhost:3000/api/articles/articleUser', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ "articleNom": articleID })
    }).then((response) => response.json()).then((unArticle) => {
      setArticle(unArticle.article[0])
      setTextes(unArticle.textes);
      setImage(unArticle.image);
      setTemplate(unArticle.template[0])
      setLangage(unArticle.langage)
      if (unArticle.image[0] != undefined) {
        setPosition(unArticle.image[0].im_placement)
      }
    })
  }, [])
  useEffect(() => {
    fetch('http://localhost:3000/api/session/user', {
      method: "GET",
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    }).then((response) => response.json()).then((compte) => {
      setUtilisateur(compte)
    })
  }, [])

  const Update = (e) => {
    e.preventDefault()
    var titre = document.querySelector('.titre').value
    const sujet = document.querySelector('.langage').value
    var articleMaj = new Array();
    var texte = new Array();

    for (var i = 0; i < template.te_nbr_texte; i++) {
      let texteID = 'texte' + i
      let texteContent = document.getElementById(texteID).value
      if (textes[i]){
        var id = textes[i].txt_id
      } else {
        var id = null
      }
      texte.push({'txt_id' : id, 'content' : texteContent});

    }

    articleMaj.push({ "articleID": article.ar_id, "titre": titre, "langage": sujet, "contenu": texte });

    fetch('http://localhost:3000/api/articles/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "article": articleMaj })
    }).then((response) => response.json()).then((update) => {
      if (update.success) {
        if (file != null){
          var data = new FormData();
          const url = 'http://localhost:3000/api/files/updatefile';
          data.append('file', file)
          data.append('fileName', file.name)
          data.append('filePosition', position)
          data.append('imageID', image[0].im_id)
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          }
          axios.post(url, data, config).then((response) => response.json()).then((data) => {
            if (data.success) {
              alert("Mise à jour réussie");
            }else {
              alert("Erreur lors de la mise à jour de l'image veuillez vérifier le fichier envoyé")
            }
          });
        } else {
          alert("Mise à jour réussie sans modification d'image");
        }
      } else {
        alert("Erreur lors de la mise à jour du texte veuillez vérifier les informations")
      }
    })
  }

  const fileChange = (e) => {
    setFile(e.target.files[0]);
  }
  const positionChange = (e) => {
    if (e.target.value == 'left') {
      setPosition(e.target.value)
      document.getElementById("divImgVright").id = "divImgVleft";
    } else if (e.target.value == 'right') {
      setPosition(e.target.value)
      document.getElementById("divImgVleft").id = "divImgVright";
    } else {
      var idAvant = "divImgH" + position
      var id = "divImgH" + e.target.value
      document.getElementById(idAvant).id = id;
      setPosition(e.target.value);
    }
  }

  if (utilisateur && article && textes && template && image && langage) {
    if (utilisateur.id == article.ar_us_id) {
      const text = []
      for (var i = 0; i < template.te_nbr_texte; i++) {
        var textarea = <textarea className="textes" id={'texte'+i}/>
        if (textes[i] != undefined) {
          textarea = <textarea className="textes" id={'texte'+i} defaultValue={textes[i].txt_contenu} />;
        }
        text.push(textarea)
      }
      return (
        <>
          {image[0] ?
            <div className="divPositionSelector" id="modifPosition">
              <label>Position de l'image</label>
              <select id="positionSelector" onChange={positionChange} defaultValue={position}>
                <option value="haut">Haut</option>
                <option value="milieu">Milieu</option>
                <option value="bas">Bas</option>
              </select>
            </div>
            :
            <>

            </>
          }
          <form id="formModif" onSubmit={Update}>
            <div className="formArticle" id="divModif">
              <h1>Titre de votre article</h1>
              <input className="titre" type="texte" defaultValue={article.ar_titre} />
              <h3>Zones de texte</h3>
              <div className="divTextes">
                {text}
                {image[0] ?
                  <img id={'divImg' + template.te_position_img.toString().substring(0, 1).toUpperCase() + image[0].im_placement} src={'../../' + image[0].im_lien} />
                  :
                  <>

                  </>
                }
              </div>
              <div className="divValidation">
                <div className="divLangage">
                  <label className="sujet">Quel est le sujet de l'article ?</label>
                  <select className="langage" name="langage" defaultValue={langage[article.ar_la_id-1].la_nom}>
                    {langage.map(langue => <option value={langue.la_nom}> {langue.la_nom}</option>)}
                  </select>
                </div>
              </div>
              {image[0] ? <div id="divInputFile"><label>Choisissez votre image ici :</label><input type="file" id="inputFile" onChange={fileChange} /></div>
                :
                <>

                </>
              }
              <input type="submit" value='Update' className="submit"/>
            </div>
          </form>
        </>
      )
    } else if (utilisateur.admin === 1) {
      const text = []
      for (var i = 0; i < template.te_nbr_texte; i++) {
        var textarea = <textarea className="textes" id={'texte'+i}/>
        if (textes[i] != undefined) {
          textarea = <textarea className="textes" id={'texte'+i} defaultValue={textes[i].txt_contenu} />;
        }
        text.push(textarea)
      }
      return (
        <>
          {image[0] ?
            <div className="divPositionSelector" id="modifPosition">
              <label>Position de l'image</label>
              <select id="positionSelector" onChange={positionChange} defaultValue={position}>
                <option value="haut">Haut</option>
                <option value="milieu">Milieu</option>
                <option value="bas">Bas</option>
              </select>
            </div>
            :
            <>

            </>
          }
          <form id="formModif" onSubmit={Update}>
            <div className="formArticle" id="divModif">
              <h1>Titre de votre article</h1>
              <input className="titre" type="texte" defaultValue={article.ar_titre}/>
              <h3>Zones de texte</h3>
              <div className="divTextes">
                {text}
                {image[0] ?
                  <img id={'divImg' + template.te_position_img.toString().substring(0, 1).toUpperCase() + image[0].im_placement} src={'../../' + image[0].im_lien} />
                  :
                  <>

                  </>
                }
              </div>
              <div className="divValidation">
                <div className="divLangage">
                  <label className="sujet">Quel est le sujet de l'article ?</label>
                  <select className="langage" name="langage" defaultValue={langage[article.ar_la_id-1].la_nom}>
                    {langage.map(langue => <option value={langue.la_nom}> {langue.la_nom}</option>)}
                  </select>
                </div>
              </div>
              {image[0] ? <div id="divInputFile"><label>Choisissez votre image ici :</label><input type="file" id="inputFile" onChange={fileChange} /></div>
                :
                <>

                </>
              }
              <input type="submit" value='Update' className="submit"/>
            </div>
          </form>
        </>
      )
    }
  }
}