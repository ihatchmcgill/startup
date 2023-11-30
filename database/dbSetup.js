const DB = require('./database.js');
const config = require('./dbConfig.json')

async function main() {
    // Insert a document
    let messages = []
    //input example messages
    messages.push({chatId: '1', authorUsername: 'alice_123', authorName: 'Alice Adams', message: 'Hello there!', timestamp: Date.now()})
    messages.push({chatId: '2', authorUsername: 'bbBoy2', authorName: 'Bob Billy', message: 'Can you help me with this job?', timestamp: Date.now()})
    messages.push({chatId: '3', authorUsername: 'meowcat4', authorName: 'Cat Cathy', message: 'What is your best price for this job?', timestamp: Date.now()})
    
    await messages.forEach(async message => {
        await DB.saveMessage(message)
    });
    

    let reviews = []
    reviews.push({reviewId: 0, rating: 5, authorUsername: 'alice_123', authorName: 'Alice Adams', serivcerUsername: 'Isaac', description: 'Love your work!', timestamp: Date.now(), comments: []})
    reviews.push({reviewId: 1, rating: 4, authorUsername: 'bbBoy2', authorName: 'Bob Billy', serivcerUsername: 'Isaac', description: 'Can\'t wait to work with you more in the future', timestamp: Date.now(), comments: []})
    reviews.push({reviewId: 2, rating: 1, authorUsername: 'meowcat4', authorName: 'Cat Cathy', serivcerUsername: 'Isaac', description: 'Difficult to contact and was slow to respond', timestamp: Date.now(), comments: []})
    
    let servicerObj = {
        servicer: 'Isaac',
        reviews: reviews
    }

    await DB.createServicer(servicerObj)
}

main().catch(console.error)