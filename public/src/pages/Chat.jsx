import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [this_user, setThisUser] = useState(undefined);
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(localStorage.getItem("user_id"));
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      // socket.current = io(host);
      // socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
        const data = await axios.get(`${allUsersRoute}`);
        const this_user=data.data.find((i)=>i.user_id==currentUser);
        setThisUser(this_user)
        if(this_user?.avatar_url){
          const other_users=data.data.filter((i)=>i.user_id!=currentUser);
          setContacts(other_users);
        }
        else {
          navigate("/setAvatar");
        } 
      }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} current_user={this_user} />
          {currentChat === undefined ? (
            <Welcome current_user={this_user} />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (max-width: 720px) {
       grid-template-columns: 1fr;
       grid-template-rows: 1.5fr 3fr;
      height: 100vh;
      width: 100vw;
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
