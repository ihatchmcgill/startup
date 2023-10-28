function sendMessage() {
    const message = document.getElementById('message-to-send').value
    createNewMessageEl(message)
    //clear input text box
    const textEl = document.getElementById('message-to-send')
    textEl.value = ''
}

function createNewMessageEl(message){
    const parentEl = document.getElementById('messages-id')
    const newMessageEl = document.createElement('p')
    newMessageEl.textContent = `You: ${message}`
    parentEl.appendChild(newMessageEl)
}

async function switchInbox(element){
    const username = element.textContent

    //Don't load anything new if current inbox is selected
    if (localStorage.getItem('currentInboxUsername') === username){
        return
    }
    localStorage.setItem('currentInboxUsername', username)

    const chatEl = document.getElementById('chat-name')
    chatEl.textContent = element.textContent
    try{
        await loadMessages(username)
    }catch(e){
        //Something went wrong with the db
    }
    
}

async function loadMessages(username){
    //will eventually use a database to load messages from specific user
    const parentEl = document.getElementById('messages-id')
    
    while(parentEl.firstChild){
        parentEl.removeChild(parentEl.firstChild)
    }

    if(username === 'Alice Adams'){
        //Loads Alice's messages
        const sampleAliceMsg = document.createElement('p')
        const sampleUserMsg = document.createElement('p')

        sampleAliceMsg.textContent = 'Alice: Hello there!'
        sampleUserMsg.textContent = 'You: Hi! How can I help you?'

        parentEl.appendChild(sampleAliceMsg)
        parentEl.appendChild(sampleUserMsg)
    }
    else if(username === 'Bob Billy'){
        //Loads Bob's messages
        const sampleBobMsg = document.createElement('p')
        const sampleUserMsg = document.createElement('p')

        sampleBobMsg.textContent = 'Bob: Can you help me with this job?'
        sampleUserMsg.textContent = 'You: Sure! What do you need?'

        parentEl.appendChild(sampleBobMsg)
        parentEl.appendChild(sampleUserMsg)
    }
    else{
        //Loads Cat's messages
        const sampleCatMsg = document.createElement('p')
        const sampleUserMsg = document.createElement('p')

        sampleCatMsg.textContent = 'Cat: What is your best price for this job?'
        sampleUserMsg.textContent = 'You: I am not able to help you with carpentry, sorry.'

        parentEl.appendChild(sampleCatMsg)
        parentEl.appendChild(sampleUserMsg)
    }
}


document.addEventListener('DOMContentLoaded', function() {
    loadMessages('Alice Adams')
    localStorage.setItem('currentInboxUsername', 'Alice Adams')
});