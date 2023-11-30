const { MongoClient } = require('mongodb');
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
const servicerColleciton = db.collection('servicer')

async function getMessages(requestedChatId){
  const userMessages = await messageCollection.find({chatId: requestedChatId}).toArray()
  return userMessages
}

async function saveMessage(message){
  console.log('saving message: \n', message)
  const result = await messageCollection.insertOne(message);
  return result
}

async function getListings(user){
  //const listings = listingCollection.find({category: user.category}).toArray()

  const listings = await listingCollection.find().toArray()
  return listings
}

async function saveListing(listing){
  const result = await listingCollection.insertOne(listing);
  return result;
}

async function getReviews(servicerName){
  const servicer = await servicerColleciton.find({servicerName: servicerName}).toArray()
  return servicer[0].reviews
}

//create a new servicer when a new user account is created
async function createServicer(servicerObj){
  const result = await servicerColleciton.insertOne(servicerObj)
  return result;
}

//adds a review to an existing servicer
async function saveReview(servicerUsername, review){
  //adds a new review to the document's reviews array
  console.log('saving review: \n', review)

  const filter = {servicerName: servicerUsername}
  const update = {$push: {reviews: review}}
  const result = await servicerColleciton.updateOne(filter, update);
  return result;
}

async function updateReviewComment(review){
  const filter = {
    servicerName: body.review.servicerUsername,
    reviews: {
      $elemMatch: {
        reviewId: review.reviewId // Replace the old review with the new one.
      }
    }
  }

  var update = {
    $set: { "reviews.$[elem]": review }
  };
  
  //push item onto review's comment array
  const result = await servicerColleciton.updateOne(filter, update);
  return result;
}

module.exports = { getMessages, saveMessage, getListings, saveListing, getReviews, createServicer, saveReview, updateReviewComment};
