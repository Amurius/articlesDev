import React from "react";
import { useState } from 'react';
import { redirect } from "react-router-dom";

export default function SignIn() {
  const [formulaire, setFormulaire] = useState({
    nom: "",
    prenom: "",
    age: null,
    email: "",
    password: "",
  })

  const setValue = (e) => {
    const { name, value } = e.target;
    setFormulaire(conteneur => ({
      ...conteneur,
      [name]: value,
    }));
  }

  const sendInfo = (e) => {
    e.preventDefault();
    if (formulaire.nom != "" && formulaire.prenom != "" && formulaire.age != "" && formulaire.email != "" && formulaire.password != "") {
      if( formulaire.age >= 18){
        fetch("http://localhost:3000/api/signin/ajoutuser", {
          method: "POST",
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(formulaire)
        }).then(response => response.json()).then(data => {
          if(data.success === "1") {
            alert("email deja utilisé")
          } else {
            alert('Ajout réussi !')
            location.replace("http://localhost:5173/")
          }
        })
      }else{
        alert("Vous devez être majeur pour vous connecter ! ")
      }
    }else{
      alert("Veuillez remplir tous les champs ! ")
    }
  };
  return (
    <>
      <div id='conteneurSignIn'>
        <div id="conteneurFormSignIn">
          <h1 id="signIn">Veuillez renseigner vos informations</h1>
          <form id="formSignIn" onSubmit={sendInfo}>
            <p>Nom</p>
            <input type="text" onChange={setValue} name="nom" placeholder="Nom"></input>
            <p>Prenom</p>
            <input type="text" onChange={setValue} name="prenom" placeholder="Prénom"></input>
            <p>Age</p>
            <input type="number" onChange={setValue} name="age" placeholder="40"></input>
            <p>Adresse email</p>
            <input type="text" onChange={setValue} name="email" placeholder="example@email.com"></input>
            <p>Mot de passe</p>
            <input type="password" onChange={setValue} name="password" placeholder="bcAalX&oe67"></input>
            <br />
            <br />
            <input type="submit" name="submit" ></input>
          </form>
        </div>
      </div>
    </>
  )
}