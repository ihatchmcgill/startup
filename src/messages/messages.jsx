import React from 'react';
import  CurrChatData from './currChatData'


import './messages.css';

import ProfileIcon from './profile.png'


export function Messages() {
  const [currUser, setCurrUser] = React.useState(JSON.parse(localStorage.getItem('currUser')))
  const [otherChatUsername, setOtherChatUsername] = React.useState(null)
  const [chats, setChats] = React.useState([])
  const [chatList, setChatList] = React.useState([])
  const [loadingChats, setLoadingChats] = React.useState(true)
  const [currChatId, setCurrChatId] = React.useState('')


  //Begin by getting all chat's for specified user
  React.useEffect(() => {
    async function fetchChats () {
      const baseUrl = '/api/chats'
      const queryParams = {
          username: currUser.username
      }
      const queryString = Object.keys(queryParams)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
          .join('&')

      const urlWithParams = baseUrl + '?' + queryString;
      try{
          const response = await fetch(urlWithParams)
          if(response.ok){
              setChats(await response.json())
          }
      } catch(e){
          console.log(e)
          alert('Unable to load latest chat history. Please try again later.')
          setChats(JSON.parse(localStorage.getItem('chats')))
      }finally {
        setLoadingChats(false); // Set loading to false regardless of success or failure
      }
    }
    fetchChats()
    }, [currUser.username])


  React.useEffect(() => {
    const fetchChatList = async () => {
      const newChatList = await Promise.all(
        chats.map(async (chat) => {
          let chatUser;
          if (chat.username1 === currUser.username) {
            chatUser = await getUser(chat.username2);

          } else {
            chatUser = await getUser(chat.username1);
          }
          return (
            <li key={chat.chatId}>
              <div className="chat-item" id={chat.chatId}>
                <img className="profile-icon" src={ProfileIcon} alt="Profile Icon" />
                <p className="username" onClick={async () => await handleInboxChange(chat)}>{chatUser.fullName}</p>
              </div>
            </li>
          );
        })
      );
      setChatList(newChatList);
    };

    if (!loadingChats) {
      fetchChatList();
      setCurrChatId(chats[0].chatId)

      if (chats[0].username1 === currUser.username) {
        setOtherChatUsername(chats[0].username2)

      } else {
        setOtherChatUsername(chats[0].username1)
      }

      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }, [chats, currUser.username, loadingChats]);

  async function handleInboxChange(chat){
    setCurrChatId(chat.chatId)
    if (chat.username1 === currUser.username) {
      setOtherChatUsername(chat.username2)

    } else {
      setOtherChatUsername(chat.username1)
    }
  }

  async function getUser(username){
    const baseUrl = '/api/user'
    const queryParams = {
        username: username
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    try{
        const response = await fetch(urlWithParams)
        const user = await response.json()
        return user
    } catch(e){
        console.log(e)
        return false;
    }
  }


  return (
    <>
    <div className='body'>
      <div className="page-info">
          <h2>Inbox</h2>
      </div>
      <div className="content"> 
        <div className="page-body">
            {loadingChats ? (
              <p>Loading chats...</p>
              ) : (
              <>
                <div className="message-senders">
                  <ul id="chat-list">{chatList}</ul>
                </div>
                <div id="chat-box-area" className="chatbox">
                  <CurrChatData currUser={currUser} currChatId={currChatId} otherChatUsername={otherChatUsername}/>
                </div>
              </>
            )}
        </div>
      </div>    
    </div>
    </>
  );
}