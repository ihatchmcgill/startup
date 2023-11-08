async function sendMessage() {
    const message = document.getElementById('message-to-send').value
    await createNewMessageEl(message)
    //clear input text box
    const textEl = document.getElementById('message-to-send')
    textEl.value = ''
}

async function createNewMessageEl(message){
    const parentEl = document.getElementById('messages-id')
    const newMessageEl = document.createElement('p')
    newMessageEl.textContent = `You: ${message}`
    parentEl.appendChild(newMessageEl)

    try{
        await storeMessage(message)
    }catch(e){
        //something went wrong with the db
        console.log('Failed to save messages')
    }
}

async function storeMessage(message){
    //Add new message to message array in local storage
    const currUsername = localStorage.getItem('userName')
    const currInboxUsername = localStorage.getItem('currentInboxUsername')
    const currInboxMessages = JSON.parse(localStorage.getItem(currInboxUsername))
    const messageToStore = {username: currUsername, message: message, timestamp: Date.now()}
    currInboxMessages.push(messageToStore)
    localStorage.setItem(currInboxUsername, JSON.stringify(currInboxMessages))
}

async function switchInbox(element){
    const inboxUsername = element.textContent

    //Don't load anything new if current inbox is selected
    if (localStorage.getItem('currentInboxUsername') === inboxUsername){
        return
    }
    localStorage.setItem('currentInboxUsername', inboxUsername)

    const chatEl = document.getElementById('chat-name')
    chatEl.textContent = element.textContent
    try{
        await loadMessages(inboxUsername)
    }catch(e){
        //Something went wrong with the db
    }
    
}

async function loadMessages(inboxUsername){
    //will eventually use a database to load messages from specific user
    const parentEl = document.getElementById('messages-id')
    
    while(parentEl.firstChild){
        parentEl.removeChild(parentEl.firstChild)
    }

    const currInboxMessages = JSON.parse(localStorage.getItem(inboxUsername))

    currInboxMessages.forEach((message) => {
        //message from sender
        if(message.username === inboxUsername){
            const newMessageEl = document.createElement('p')
            const firstName = inboxUsername.toString().split(' ')
            newMessageEl.textContent = `${firstName[0]}: ${message.message}`
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


document.addEventListener('DOMContentLoaded', function() {
    loadMessages('Alice Adams')
    localStorage.setItem('currentInboxUsername', 'Alice Adams')

    if(!localStorage.getItem('Alice Adams')){
        //Populate local storage with placeholder messages
        let aliceMessages = []
        aliceMessages.push({username: 'Alice Adams', message: 'Hello there!', timestamp: Date.now()})
        localStorage.setItem('Alice Adams', JSON.stringify(aliceMessages))
    }
    if(!localStorage.getItem('Bob Billy')){
        //Populate local storage with placeholder messages
        let bobMessages = []
        bobMessages.push({username: 'Bob Billy', message: 'Can you help me with this job?', timestamp: Date.now()})
        localStorage.setItem('Bob Billy', JSON.stringify(bobMessages))
    }
    if(!localStorage.getItem('Cat Cathy')){
        //Populate local storage with placeholder messages
        let catMessages = []
        catMessages.push({username: 'Cat Cathy', message: 'What is your best price for this job?', timestamp: Date.now()})
        localStorage.setItem('Cat Cathy', JSON.stringify(catMessages))
    }

});