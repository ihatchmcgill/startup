const config = require('./dbConfig.json')
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`
const client = new MongoClient(url);
const db = client.db('startup');
const messageCollection = db.collection('message')
const listingCollection = db.collection('listing')
const reviewCollection = db.collection('review')
const servicerColleciton = db.collection('servicer')

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

  function getMessages(requestedChatId){
    const userMessages = messageCollection.find({messageId: requestedChatId}).toArray()
    return userMessages
  }
  
  async function saveMessage(message){
    const result = await messageCollection.insertOne(message);
    return result
  }

  function getListings(user){
    //use specific information about the user to retrieve listings
    //use db to implement this
    //db table holds different listings with categories

    //const listings = listingCollection.find({category: user.category}).toArray()

    const listings = listingCollection.toArray()
    return listings
  }

  async function saveListing(listing){
    const result = await listingCollection.insertOne(listing);
    return result;
  }

  function getReviews(servicerName){
    const servicer = servicerColleciton.find({servicerName: servicerName}).toArray()
    console.log(servicer)
    return servicer.reviews
  }

  async function saveReview(servicerUsername, review){
    //adds a new review to the document's reviews array
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

  module.exports = { getMessages, saveMessage, getListings, saveListing, getReviews, saveReview, updateReviewComment};
