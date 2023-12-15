document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('currUser'))
    const chats = await getChats(user)
    if(chats.length > 0){
        await loadChats(chats, user)
        await loadMessages(chats[0].chatId)
        localStorage.setItem('currChatId', JSON.stringify(chats[0].chatId))
        const chat = await getChat(chats[0].chatId)
        setCurrChatId(chat)
        messages.configureWebsockets(chats)
    }else{
        loadNoChatMessage()
    }
});

function loadNoChatMessage(){
    const chatAreaEl = document.getElementById('chat-box-area')
    const noMessages = document.createElement('div')

    noMessages.setAttribute('class', 'no-messages')
    noMessages.innerText = "Looks like you don't have any messages in your inbox!"
    chatAreaEl.append(noMessages)

}

async function loadChats(chats, user){
    const chatAreaEl = document.getElementById('chat-box-area')
    const chatNameDiv = document.createElement('div')
    chatNameDiv.setAttribute('id', 'chat-name')

    let chatUser
    if(chats[0].username1 === user.username){
        chatUser = await getUser(chats[0].username2)
    }else{
        chatUser = await getUser(chats[0].username1)
    }
    chatNameDiv.textContent = chatUser.fullName

    const chatMessagesDiv = document.createElement('div')
    chatMessagesDiv.setAttribute('class', 'messages')
    chatMessagesDiv.setAttribute('id', 'messages-id')

    const chatMessageControls = document.createElement('div')
    chatMessageControls.setAttribute('class', 'message-controls')
    chatMessageControls.innerHTML = '<input type="text" id="message-to-send" placeholder="Type your message">' +
                                    '<button class="send-button" onclick="messages.sendMessage()">Send</button>'

    chatAreaEl.append(chatNameDiv)
    chatAreaEl.append(chatMessagesDiv)
    chatAreaEl.append(chatMessageControls)

    if(chats){
        const chatList = document.getElementById('chat-list')
        for(const chat of chats) {
            let user2
            if(user.username === chat.username1){
                user2 = await getUser(chat.username2)
            }else{
                user2 = await getUser(chat.username1)
            }
            const chatItem = document.createElement('li')
            chatItem.innerHTML = `<div class="chat-item" id=${chat.chatId}>` +
            '<img class="profile-icon" src="https://cdn-icons-png.flaticon.com/512/3106/3106773.png" alt="Profile Icon" width=50 height=50>' +
            `<p class="username" onclick="switchInbox(this)">${user2.fullName}</p>` +
            '</div>'
          chatList.append(chatItem)
        }
    }
}

//Gets messages based on a given chatId. 
async function loadMessages(chatId){
    console.log('loadingMessages', chatId)
    const user = JSON.parse(localStorage.getItem('currUser'))
    const parentEl = document.getElementById('messages-id')
    
    clearChatBox()

    const baseUrl = '/src/api/messages'
    const queryParams = {
        chatId: chatId
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    let messages = []
    try{
        const response = await fetch(urlWithParams)
        if(response.ok){
            messages = await response.json()
        }
    } catch(e) {
        console.log(e)
    }

    await displayMessageArr(parentEl, user, messages)
}

//displays messages 
async function displayMessageArr(parentEl, user, messages){
    // Display messages
    for (const message of messages) {
        // Messages not from the user
        if (message.authorUsername !== user.username) {
            const newMessageEl = document.createElement('p');
            const user2 = await getUser(message.authorUsername);
            const name = user2.firstName;
            newMessageEl.textContent = `${name}: ${message.message}`;
            parentEl.appendChild(newMessageEl);
        }
        // Message from the user
        else {
            const newMessageEl = document.createElement('p');
            newMessageEl.textContent = `You: ${message.message}`;
            parentEl.appendChild(newMessageEl);
        }
    }
}

async function getUser(username){
    const baseUrl = '/src/api/user'
    const queryParams = {
        username: username
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    try{
        const response = await fetch(urlWithParams)
        user = await response.json()
        return user
    } catch(e){
        console.log(e)
        return false;
    }
}

async function getChats(user){
    const baseUrl = '/src/api/chats'
    const queryParams = {
        username: user.username
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    let chats = []
    try{
        const response = await fetch(urlWithParams)
        if(response.ok){
            chats = await response.json()
            localStorage.setItem('chats', JSON.stringify(chats))
        }
    } catch(e){
        console.log(e)
        alert('Unable to load latest chat history. Please try again later.')
        chats = JSON.parse(localStorage.getItem('chats'))
    }
    return chats
}

async function getChat(chatId){
    const baseUrl = '/src/api/chat'
    const queryParams = {
        chatId: chatId
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    let chat
    try{
        const response = await fetch(urlWithParams)
        if(response.ok){
            chat = await response.json()
            return chat
        }
    } catch(e){
        console.log(e)
        return false
    }
}

function clearChatBox(){
    const parentEl = document.getElementById('messages-id')
    while(parentEl.firstChild){
        parentEl.removeChild(parentEl.firstChild)
    }
}

function setCurrChatId(chat){
    if(chat){
        if(chat.username1 === user.username){
            localStorage.setItem('chatOtherUsername', JSON.stringify(chat.username2))
        }else{
            localStorage.setItem('chatOtherUsername', JSON.stringify(chat.username1))
        }
    }
}

async function switchInbox(element){
    const user = JSON.parse(localStorage.getItem('currUser'))

    const chatId = element.parentNode.id
    const chatEl = document.getElementById('chat-name')
    chatEl.textContent = element.textContent

    localStorage.setItem('currChatId', JSON.stringify(chatId))
    await loadMessages(chatId)

    const chat = await getChat(chatId)
    setCurrChatId(chat)
}

class Messages {
    sockets = []

    configureWebsockets(chats){
        for(const chat of chats){
            // Adjust the webSocket protocol to what is being used for HTTP
            const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
            const socket = new WebSocket(`${protocol}://${window.location.host}/ws?chatId=${chat.chatId}`);
        
            socket.onmessage = async (event) => {
              const msg = JSON.parse(await event.data.text())
              if(msg.chatId === JSON.parse(localStorage.getItem('currChatId'))){
                await this.displayMessage(msg)
              }
            }
            socket.onclose = (event) => {
                console.log('closing socket for chat: ', chat.chatId)
            }

            this.sockets.push({socket: socket, chatId: chat.chatId})
        }
    }

    async sendMessage() {
        const chatId = JSON.parse(localStorage.getItem('currChatId'))
        const messageText = document.getElementById('message-to-send').value
        const newMessage = this.createNewMessage(messageText, chatId)

        await this.displayMessage(newMessage)
        await this.storeMessage(newMessage)
        //clear input text box
        const textEl = document.getElementById('message-to-send')
        textEl.value = ''

        const currSocket = this.getCurrSocket()
        if(currSocket){
            currSocket.send(JSON.stringify(newMessage))
        }
    }

    async displayMessage(msg){
        const user = JSON.parse(localStorage.getItem('currUser'))
        const parentEl = document.getElementById('messages-id')
        const newMessageEl = document.createElement('p')

        if (msg.authorUsername !== user.username) {
            const user2 = await getUser(msg.authorUsername);
            const name = user2.firstName;
            newMessageEl.textContent = `${name}: ${msg.message}`;
            parentEl.appendChild(newMessageEl);
        }
        // Message from the user
        else {
            newMessageEl.textContent = `You: ${msg.message}`;
            parentEl.appendChild(newMessageEl);
        }
    }
    
    async storeMessage(newMessage){
        //Add new message to message array in local storage
        try{
            const response = await fetch('/src/api/message', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(newMessage),
            });
        } catch {
            console.log('Unable to store message in DB', e)
        }
    }

    createNewMessage(messageText, chatId){
        const newMessage = {
            authorUsername: JSON.parse(localStorage.getItem('currUser')).username,
            message: messageText,
            chatId: chatId,
            recipientUsername: JSON.parse(localStorage.getItem('chatOtherUsername'))
        }
        return newMessage
    }

    getCurrSocket(){
        const currChatId = JSON.parse(localStorage.getItem('currChatId'))
        for(const socketObj of this.sockets){
            if(socketObj.chatId === currChatId){
                return socketObj.socket
            }
        }
        return null
    }
}
const messages = new Messages()

window.addEventListener('beforeunload', (event) => {
    for(const socketObj in messages.sockets){
        socketObj.socket.close()
    }
})