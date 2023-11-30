document.addEventListener('DOMContentLoaded', async function() {
    console.log('starting')
    localStorage.setItem('currentChatId', '1')
    await loadMessages('1')
});

function getLocalMessages(requestedChatId){
    const messages = localStorage.getItem('messages')
    //Populate local storage with placeholder messages
    let userMessages = []
    messages.forEach(message => {
        if((message.chatId === requestedChatId)){
            userMessages.push(message)
        }
    })
    return userMessages
}

async function sendMessage() {
    const messageText = document.getElementById('message-to-send').value
    await createNewMessageEl(messageText)
    //clear input text box
    const textEl = document.getElementById('message-to-send')
    textEl.value = ''
}

async function createNewMessageEl(messageText){
    const parentEl = document.getElementById('messages-id')
    const newMessageEl = document.createElement('p')
    newMessageEl.textContent = `You: ${messageText}`
    parentEl.appendChild(newMessageEl)
    const newMessage = {
        chatId: localStorage.getItem('currentChatId', '1'),
        authorUsername: localStorage.getItem('username'),
        //the user will be used to get the name from the db
        authorName: '(db placeholder)',
        message: messageText,
        timestamp: Date.now()
    }
    await storeMessage(newMessage)
}

async function storeMessage(newMessage){
    //Add new message to message array in local storage
    try{
        const response = await fetch('/src/api/message', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(newMessage),
        });
        localStorage.setItem('messages', JSON.stringify(await response.json()))
    } catch {
        const messages = JSON.parse(localStorage.getItem('messages'))
        messages.push(newMessage)
        localStorage.setItem('messages', JSON.stringify(messages))
    }
}

async function switchInbox(element){
    const chatId = element.parentNode.id
    const chatEl = document.getElementById('chat-name')
    chatEl.textContent = element.textContent
    await loadMessages(chatId)
    localStorage.setItem('currentChatId', chatId)
}

async function loadMessages(chatId){
    console.log('loadingMessages', chatId)
    const currUser = localStorage.getItem('username')
    //will eventually use a database to load messages from specific user using a chatId
    const parentEl = document.getElementById('messages-id')
    
    while(parentEl.firstChild){
        parentEl.removeChild(parentEl.firstChild)
    }

    const baseUrl = '/src/api/messages'
    const queryParams = {
        chat_id: chatId
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    console.log(urlWithParams)
    let messages = []
    try{
        const response = await fetch(urlWithParams)
        messages = await response.json()
        localStorage.setItem('messages', JSON.stringify(messages))
    } catch {
        messages = getLocalMessages(chatId)
    }
    console.log(messages)
    messages.forEach((message) => {
        //messages not from user
        if(message.authorUsername !== currUser){
            const newMessageEl = document.createElement('p')
            //This name will be gotten from the user once the database is implemented
            const name = message.authorName
            newMessageEl.textContent = `${name}: ${message.message}`
            parentEl.appendChild(newMessageEl)
        }
        //message from user
        else{
            const newMessageEl = document.createElement('p')
            newMessageEl.textContent = `You: ${message.message}`
            parentEl.appendChild(newMessageEl)
        }
    })
}