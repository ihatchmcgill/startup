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
app.use(`/api`, apiRouter);


// Placeholder for login endpoint
apiRouter.put('/login', (req, res) => {
  
});

// Endpoint to get messages for a specific user
apiRouter.get('/messages', (req, res) => {
  //get the chatId
  const chatId = req.params.chat_id

  const messages = getMessages(chatId)
  res.send(messages)
})

// Endpoint to save a new message 
apiRouter.post('/message', (req, res) => {
  const message = saveMessage(req.body)
  res.send(message)
});

// Endpoint to get listings for a user
apiRouter.get('/listings', (req, res) => {
  //get the username
  const username = req.params.username

  //TODO: use username to lookup user in DB, pass user to getListings


  //listings are stored in db and getListings filters them to be tailored to user
  const listings = getListings(username)
  res.send(listings)
})

// Endpoint to create a new listing 
apiRouter.post('/listing', (req, res) => {
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
  const review = saveReview(username, req.body)
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
function getMessages(chatId){
  let userMessages = []
  for(message in messages){
    if((message.chatId === chatId)){
      userMessages.push(message)
    }
  }
  return userMessages
}


function saveMessage(message){
  messages.push(message)
}

let listings = []
function getListings(username){
  //use specific information about the user to retrieve relavant listings
  //use db to implement this
  return listings;
}

function saveListing(listing){
  listings.push(listing)
}


let reviews = []
function getReviews(username){
  //get specific reviews for user from db
  return reviews
}

function saveReview(review){
  reviews.push(review)
}
