import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { auth } from "../utils/firebase";
import {FcGoogle} from "react-icons/fc"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

    const signInWithGoogle = async () => {
      await signOut(auth);
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(async (res) => {
          const idToken = await res.user.getIdToken();
          await axios.post(loginRoute, {
            tokenId: idToken, 
          }).then((result)=>{
            localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, result.data.token);
            localStorage.setItem("user_id", result.data.userId);
            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.token}`;
            navigate("/");
          })
        })
        .catch((err) => {
           toast.error(err, toastOptions);
        });
  };


  return (
    <>
      <FormContainer>
        <div className="form">
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>CHATTY</h1>
          </div>
          <button
            className="ui-button"
            type="button"
            onClick={ () =>  signInWithGoogle()}
          >
            <div>
            <FcGoogle/>
            </div>
            <div style={{"marginLeft":"10px"}}>
            Login with Google
            </div>
          </button>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  .form .ui-button{
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
    }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  
`;
