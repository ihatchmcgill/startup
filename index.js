const express = require('express');
const app = express();
const DB = require('./database/database.js');


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
apiRouter.get('/messages', async (req, res) => {
  //get the chatId
  const chatId = req.query.chat_id
  const messages = await DB.getMessages(chatId)
  console.log(messages)
  res.send(messages)
})

// Endpoint to save a new message 
apiRouter.post('/message', async (req, res) => {
  const result = await DB.saveMessage(req.body)
  res.send(result)
});

// Endpoint to get listings for a user
apiRouter.get('/listings', async (req, res) => {
  //get the username
  const username = req.query.username

  //TODO: use username to lookup user in DB, pass user to getListings
  //const user = await DB.getUser(username)

  console.log('getting all listings')
  //listings are stored in db and getListings filters them to be tailored to user
  const listings = await DB.getListings(username)
  res.send(listings)
})

// Endpoint to create a new listing 
apiRouter.post('/listing', async (req, res) => {
  console.log('creating listing...')
  const listing = await DB.saveListing(req.body)
  console.log('listing created')
  res.send(listing)
});

//Endpoint to get all the reviews for specific servicer
apiRouter.get('/reviews', async (req, res) => {
  //get the username
  const servicerName = req.query.username

  //reviews are stored in the servicer table
  const reviews = await DB.getReviews(servicerName)
  res.send(reviews)
})

//Endpoint to save a new review
apiRouter.post('/review', async (req, res) => {
  //get the username
  const servicerUsername = req.params.username

  const review = await DB.saveReview(req.body)
  res.send(review)
})

apiRouter.post('/updateReviewComment', async (req, res) => {
  console.log('adding review comment')
  //reviews are stored in the servicer table
  const result = await DB.updateReviewComment(req.body)
  res.send(result)
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
messages.push({chatId: '1', authorUsername: 'alice_123', authorName: 'Alice Adams', message: 'Hello there!', timestamp: Date.now()})
messages.push({chatId: '2', authorUsername: 'bbBoy2', authorName: 'Bob Billy', message: 'Can you help me with this job?', timestamp: Date.now()})
messages.push({chatId: '3', authorUsername: 'meowcat4', authorName: 'Cat Cathy', message: 'What is your best price for this job?', timestamp: Date.now()})

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

reviews.push({reviewId: 0, rating: 5, authorUsername: 'alice_123', authorName: 'Alice Adams', serivcerUsername: 'Isaac', description: 'Love your work!', timestamp: Date.now(), comments: []})
reviews.push({reviewId: 1, rating: 4, authorUsername: 'bbBoy2', authorName: 'Bob Billy', serivcerUsername: 'Isaac', description: 'Can\'t wait to work with you more in the future', timestamp: Date.now(), comments: []})
reviews.push({reviewId: 2, rating: 1, authorUsername: 'meowcat4', authorName: 'Cat Cathy', serivcerUsername: 'Isaac', description: 'Difficult to contact and was slow to respond', timestamp: Date.now(), comments: []})

function getReviews(username){
  //get specific reviews for user from db
  return reviews
}

function saveReview(username, review){
  reviews.push({servicer: username, review: review})
  return review
}

function updateReview(updatedReview){
  console.log(reviews)
  console.log(updatedReview)
  const index = reviews.findIndex(review => review.authorName === updatedReview.authorName);

  if (index !== -1) {
    // Found a matching review, update it
    reviews.splice(index, 1, updatedReview);
  }
}
