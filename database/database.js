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
const userCollection = db.collection('user')
const reviewCollection = db.collection('review')

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

//create a new servicer when a new user account is created
async function createUser(userObj){
  const result = await userCollection.insertOne(userObj)
  return result;
}

async function getReviews(servicerUsername){
  console.log(servicerUsername)
  try{
    const reviews = await reviewCollection.find({servicerUsername: servicerUsername}).toArray()
    console.log(reviews)
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

module.exports = { getMessages, saveMessage, getListings, saveListing, getReviews, createUser, saveReview, updateReviewComment};
