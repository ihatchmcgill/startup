import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './messages.css';

import ProfileIcon from './profile.png'


export function Messages() {
  const [currUser, setCurrUser] = React.useState(JSON.parse(localStorage.getItem('currUser')))
  const [chats, setChats] = React.useState([])
  const [sockets, setSockets] = React.useState([])

  React.useEffect(() => {
    async function fetchChats () {
      const user = JSON.parse(localStorage.getItem('currUser'))
      const baseUrl = '/api/chats'
      const queryParams = {
          username: user.username
      }
      const queryString = Object.keys(queryParams)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
          .join('&')

      const urlWithParams = baseUrl + '?' + queryString;
      try{
          const response = await fetch(urlWithParams)
          if(response.ok){
              setChats(await response.json())
              localStorage.setItem('chats', JSON.stringify(chats))
          }
      } catch(e){
          console.log(e)
          alert('Unable to load latest chat history. Please try again later.')
          setChats(JSON.parse(localStorage.getItem('chats')))
      }
    }
    fetchChats()
  }, []);

  let chatItems = []
  let chatList = []
  let i = 0
  chats.forEach(async (chat) =>{
    let chatUser
    if(chat.username1 === user.username){
      chatUser = await getUser(chat.username2)
    }else{
        chatUser = await getUser(chat.username1)
    }
    chatItems.push(
      <div key={i} className='chat-box'>
        <div id='chat-name'>{chatUser.fullName}</div>
        <div id='messages-id' className='messages' ></div>
        <div className='message-controls'>
          <input type="text" id="message-to-send" placeholder="Type your message"></input>
          <button className="send-button" onclick="messages.sendMessage()">Send</button>
        </div>
      </div>
    )
    chatList.push(
      <li key={chat.chatId}>
        <div className="chat-item" id={chat.chatId}></div>
        <img className="profile-icon" src={ProfileIcon} alt="Profile Icon" />
        <p className="username" onClick={() => switchInbox()}>${chatUser.fullName}</p>
      </li>
    )
    i++
  })


  return (
    <>
    <div className='body'>
      <div class="page-info">
          <h2>Inbox</h2>
      </div>
      <div class="content"> 
        <div class="page-body">
          <div class="message-senders">
            <ul id="chat-list">{chatList}</ul>
          </div>
          <div id="chat-box-area" class="chatbox">{chatItems}</div>
        </div>
      </div>    
    </div>
    </>
  );
}