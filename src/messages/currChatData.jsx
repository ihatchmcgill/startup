import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './messages.css';

export default function currChatData(props) {
  const [messages, setMessages] = React.useState([])
  const [messageList, setMessageList] = React.useState([])
  const [messageToSend, setMessageToSend] = React.useState('')
  const [loadingMessages, setLoadingMessages] = React.useState(true)
  const [socket, setSocket] = React.useState(null)

  React.useEffect(() => {
    async function fetchMessages () {
      const baseUrl = '/api/messages'
      console.log(props)
      const queryParams = {
          chatId: props.currChatId
      }
      const queryString = Object.keys(queryParams)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
          .join('&')

      const urlWithParams = baseUrl + '?' + queryString;
      try{
          const response = await fetch(urlWithParams)
          if(response.ok){
            setMessages(await response.json())
          }
      } catch(e) {
          console.log(e)
      }
      finally {
        setLoadingMessages(false); // Set loading to false regardless of success or failure
      }
    }
    fetchMessages() 
  }, [ props.currUser.username, props.currChatId])

  React.useEffect(() => {
    const fetchMessageList = async () => {
      console.log(messages)
      const newMessageList = await Promise.all(
        messages.map(async (message) => {
          if (message.authorUsername === props.currUser.username) {
            return (
              <p key={message.messageId}>You: {message.message}</p>
            )
          } else {
            return (
              <p key={message.messageId}>{message.authorUsername}: {message.message}</p>
            )
          }
        })
      );
      setMessageList(newMessageList);
    };

    if (!loadingMessages) {
      configureWebsockets()
      fetchMessageList();
    }
  }, [messages, props.currUser.username, loadingMessages]);


  async function sendMessage(chatId) {
    const newMessage = {
      authorUsername: props.currUser.username,
      message: messageToSend,
      chatId: chatId,
      recipientUsername: props.otherChatUsername
    }
    try{
      const response = await fetch('/api/message', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        // Fetch updated messages after sending the new message
        const updatedMessages = await getMessages(chatId);
        setMessages(updatedMessages);
        setMessageToSend('');
        socket.send(JSON.stringify(newMessage))
      }

    } catch {
      console.log('Unable to store message in DB', e)
    }
  }

  async function getMessages(chatId){
    const baseUrl = '/api/messages'
    const queryParams = {
        chatId: chatId
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    try{
        const response = await fetch(urlWithParams)
        if(response.ok){
          const messsages = await response.json()
          return messsages
        }
    } catch(e) {
        console.log(e)
    }
  }

  function configureWebsockets(){
      // Adjust the webSocket protocol to what is being used for HTTP
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws?chatId=${props.currChatId}`);

    socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text())
      if(msg.chatId === props.currChatId){
        const updatedMessages = await getMessages(props.currChatId);
        setMessages(updatedMessages);
      }
    }
    socket.onclose = (event) => {
        console.log('closing socket for chat: ', props.currChatId)
    }

    setSocket(socket)
  }

  return (
    <>
      <div className='chat-box'>
        <div id='chat-name'>Chat</div>
        <div id='messages-id' className='messages' >{messageList}</div>
        <div className='message-controls'>
            <input type="text" id="message-to-send" placeholder="Type your message" value={messageToSend}
                   onChange={(e) => setMessageToSend(e.target.value)}></input>
            <button className="send-button" onClick={() => sendMessage(props.currChatId)}>Send</button>
        </div>
      </div>
    </>
  )
}
