import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import axios from "../utils/axios";

export default function Contacts({ contacts, changeChat, current_user }) {

  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(() => {
    if(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)){
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)}`;
    }
  }, [])
  
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {current_user?.avatar_url  && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chatty</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact.user_id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={contact.avatar_url}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={current_user.avatar_url}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{current_user.name}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 2rem;
    }

    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }

    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: white;
      }
    }

    @media screen and (max-width: 767px) {
      flex-direction: column;
      justify-content: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h2 {
          font-size: 0.2rem;
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    grid-template-rows: auto 85% auto;
  }
`;

