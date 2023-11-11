const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use('/src/api', apiRouter);


// Placeholder for login endpoint
apiRouter.put('/login', (req, res) => {
  
});

// Endpoint to get messages for a specific user
apiRouter.get('/messages', (req, res) => {
  //get the chatId
  const chatId = req.query.chat_id
  const messages = getMessages(chatId)
  res.send(messages)
})

// Endpoint to save a new message 
apiRouter.post('/message', (req, res) => {
  const message = saveMessage(req.body)
  res.send(messages)
});

// Endpoint to get listings for a user
apiRouter.get('/listings', (req, res) => {
  //get the username
  const username = req.params.username

  //TODO: use username to lookup user in DB, pass user to getListings

  console.log('getting all listings')
  //listings are stored in db and getListings filters them to be tailored to user
  const listings = getListings(username)
  res.send(listings)
})

// Endpoint to create a new listing 
apiRouter.post('/listing', (req, res) => {
  console.log('creating listing...')
  const listing = saveListing(req.body)
  res.send(listing)
});

//Endpoint to get all the reviews for specific servicer
apiRouter.get('/reviews', (req, res) => {
  //get the username
  const username = req.params.username

  //reviews are stored in the servicer table
  const reviews = getReviews(username)
  res.send(reviews)
})

//Endpoint to save a new review
apiRouter.post('/review', (req, res) => {
  //get the username
  const username = req.params.username

  //reviews are stored in the servicer table
  saveReview(username, req.body)
  res.send(review)
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


//use a chatId to determine all messages within a chat
let messages = []

//input example messages
messages.push({chatId: '1', user: 'alice_123', authorName: 'Alice Adams', message: 'Hello there!', timestamp: Date.now()})
messages.push({chatId: '2', user: 'bbBoy2', authorName: 'Bob Billy', message: 'Can you help me with this job?', timestamp: Date.now()})
messages.push({chatId: '3', user: 'meowcat4', authorName: 'Cat Cathy', message: 'What is your best price for this job?', timestamp: Date.now()})

function getMessages(requestedChatId){
  let userMessages = []
  messages.forEach(message => {
    if((message.chatId === requestedChatId)){
      userMessages.push(message)
    }
  })
  console.log(userMessages)
  return userMessages
}


function saveMessage(message){
  messages.push(message)
  return message
}

let listings = []
function getListings(username){
  //use specific information about the user to retrieve listings
  //use db to implement this
  //db table holds different listings with categories
  console.log(listings)
  return listings;
}

function saveListing(listing){
  listings.push(listing)
  console.log('listings pushed', listings)
  return listing;
}


let reviews = []
function getReviews(username){
  //get specific reviews for user from db
  return reviews
}

function saveReview(username, review){
  reviews.push({servicer: username, review: review})
}
