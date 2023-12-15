const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json')

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`
const client = new MongoClient(url);
const db = client.db('startup');

(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

const messageCollection = db.collection('message')
const listingCollection = db.collection('listing')
const userCollection = db.collection('user')
const reviewCollection = db.collection('review')
const chatCollection = db.collection('chat')

async function getUser(username) {
  return await userCollection.findOne({username: username});
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(request) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(request.password, 10);
  const user = {
    userId: uuid.v4(),
    username: request.username,
    password: passwordHash,
    token: uuid.v4(),
    firstName: request.firstName,
    lastName: request.lastName,
    fullName: `${request.firstName} ${request.lastName}`,
    serviceProvider: request.serviceProvider,
    category: request.category
  };

  await userCollection.insertOne(user);
  return user;
}


async function getMessages(requestedChatId){
  const sortCriteria = { timestamp: 1 }
  const userMessages = await messageCollection.find({chatId: requestedChatId}).sort(sortCriteria).toArray()
  return userMessages
}

async function saveMessage(message){
  console.log('saving message: \n', message)
  const newMessage = {
    messageId: uuid.v4(), 
    chatId: message.chatId,
    authorUsername: message.authorUsername, 
    recipientUsername: message.recipientUsername, 
    message: message.message, 
    timestamp: Date.now()
  }
  const result = await messageCollection.insertOne(newMessage);
  return result
}

async function getChats(username){
  const query ={
    $or: [
      { username1: username },
      { username2: username }
    ]
  }
  const result = await chatCollection.find(query).toArray()
  return result
}


async function getChat(chatId){
  const result = await chatCollection.find({chatId: chatId}).toArray()
  return result[0]
}

async function saveChat(chat){
  const result = await chatCollection.insertOne(chat)
  return result
}

async function getListings(category){
  let listings
  if(category === 'None'){
    listings = await listingCollection.find().toArray()
  }
  else{
    listings = listingCollection.find({category: category}).toArray()
  }
  return listings
}

async function saveListing(listing){
  const result = await listingCollection.insertOne(listing);
  return result;
}


async function getReviews(servicerUsername){
  try{
    const reviews = await reviewCollection.find({servicerUsername: servicerUsername}).toArray()
    return reviews
  }catch(e){
    console.log(`Unable to find any reviews for ${servicerUsername}`)
  }
  
}

//adds a review to an existing servicer
async function saveReview(review){
  //adds a new review to the document's reviews array
  console.log('saving review: \n', review)
  const result = await reviewCollection.insertOne(review);
  return result;
}

async function updateReviewComment(body){
  console.log(body)
  const updatedReview = body.review
  const newComment = body.newComment

    const filter = {
      reviewId: updatedReview.reviewId
    }
    const update = {
      $push: {
        comments: newComment
      }
    }
    //push item onto review's comment array
    const result = await reviewCollection.updateOne(filter, update)
    console.log('update review results: \n', result)
    return result;
}

module.exports = { getUser, getUserByToken, createUser, getMessages, saveMessage, saveChat, getChat, getChats, getListings, saveListing, getReviews, saveReview, updateReviewComment};
