const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');
const authCookieName = 'token';

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

//Create a new User
apiRouter.post('/createAccount', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body);
    // Set the cookie
    setAuthCookie(res, user.token);
    res.send({
      id: user.userId,
    });
  }
});

apiRouter.post('/login', async (req, res) => {
  const user = await DB.getUser(req.body.username)
  console.log(req.body)
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send(user);
    }else{
      console.log('invalid password')
      res.status(401).send({ msg: 'Unauthorized' });
    }
  }else{
    console.log('No user found')
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Endpoint to get user
secureApiRouter.get('/user', async (req, res) => {
  //get the chatId
  const username = req.query.username
  const user = await DB.getUser(username)
  res.send(user)
})

secureApiRouter.get('/chats', async (req, res) => {
  //get the chatId
  const username = req.query.username
  const chats = await DB.getChats(username)
  res.send(chats)
})

secureApiRouter.get('/chat', async (req, res) => {
  //get the chatId
  const chatId = req.query.chatId
  const chats = await DB.getChat(chatId)
  res.send(chats)
})

// Endpoint to get messages for a specific user
secureApiRouter.get('/messages', async (req, res) => {
  //get the chatId
  const chatId = req.query.chatId
  const messages = await DB.getMessages(chatId)
  console.log(messages)
  res.send(messages)
})

// Endpoint to save a new message 
secureApiRouter.post('/message', async (req, res) => {
  const result = await DB.saveMessage(req.body)
  res.send(result)
});

// Endpoint to get listings for a user
secureApiRouter.get('/listings', async (req, res) => {
  //get the username
  const category = req.query.category

  //TODO: use username to lookup user in DB, pass user to getListings
  //const user = await DB.getUser(username)

  console.log('getting all listings')
  //listings are stored in db and getListings filters them to be tailored to user
  const listings = await DB.getListings(category)
  console.log(listings)
  res.send(listings)
})

// Endpoint to create a new listing 
secureApiRouter.post('/listing', async (req, res) => {
  console.log('creating listing...')
  const listing = await DB.saveListing(req.body)
  console.log('listing created')
  res.send(listing)
});

//Endpoint to get all the reviews for specific servicer
secureApiRouter.get('/reviews', async (req, res) => {
  //get the username
  const servicerName = req.query.username

  //reviews are stored in the servicer table
  const reviews = await DB.getReviews(servicerName)
  res.send(reviews)
})

//Endpoint to save a new review
secureApiRouter.post('/review', async (req, res) => {
  //get the username
  const servicerUsername = req.params.username

  const review = await DB.saveReview(req.body)
  res.send(review)
})

secureApiRouter.post('/updateReviewComment', async (req, res) => {
  console.log('adding review comment')
  //reviews are stored in the servicer table
  const result = await DB.updateReviewComment(req.body)
  res.send(result)
})

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(server);
