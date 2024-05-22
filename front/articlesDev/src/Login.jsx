import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate();
  const [formulaire, setFormulaire] = useState({
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
    fetch("http://localhost:3000/api/session/connection", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(formulaire)
    }).then(response => response.json()).then(data => {
      if (data.success == "loggedin") {
        navigate(data.redirect);
      }
    });
  };
  return (
    <>
      <div id='conteneurLogin'>
        <div id='conteneurFormLogin'>
          <h1 id="login">Login</h1>
          <form id="formLogin" onSubmit={sendInfo}>
            <p>Email</p>
            <input type="text" name="email" onChange={setValue} placeholder="example@email.com"></input>
            <p>Mot de passe</p>
            <input type="password" name="password" onChange={setValue} placeholder="bcAalX&oe67"></input>
            <br />
            <input type="submit" name="submit"></input>
          </form>
        </div>
      </div>
    </>
  )
}