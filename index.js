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
  //get the username
  const username = req.params.username
  const chatId = req.params.chat_id

  const messages = getMessages(username, chatId)
  res.send(messages)
})

// Endpoint to save a new message 
apiRouter.post('/message', (req, res) => {
  const username = req.params.username
  const chatId = req.params.chat_id

  const message = saveMessage(username, chatId, req.body)
  res.send(message)
});

// Endpoint to get listings for a user
apiRouter.get('/listings', (req, res) => {
  //get the username
  const username = req.params.username

  //listings are stored in db and getListings filters them to be tailored to user
  const listings = getListings(username)
  res.send(listings)
})

// Endpoint to create a new listing 
apiRouter.post('/listing', (req, res) => {
  const listing = createListing(req.body)
  res.send(listing)
});





// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});