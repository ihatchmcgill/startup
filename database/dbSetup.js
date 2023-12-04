const DB = require('./database.js');
const config = require('./dbConfig.json')
const uuid = require('uuid');

async function main() {
    let chats = []
    const chat1Id = uuid.v4()
    const chat2Id = uuid.v4()
    const chat3Id = uuid.v4()

    chats.push({chatId: chat1Id, username1: 'alice_123', username2: 'test'})
    chats.push({chatId: chat2Id, username1: 'bbBoy2', username2: 'test'})
    chats.push({chatId: chat3Id, username1: 'meowcat4', username2: 'test'})

    await chats.forEach(async (chat) => {
        await DB.saveChat(chat)
    });

    // // Insert a document
    let messages = []
    //input example messages
    messages.push({chatId: chat1Id, authorUsername: 'alice_123', recipientUsername: 'test', message: 'Hello there!'})
    messages.push({chatId: chat2Id, authorUsername: 'bbBoy2',  recipientUsername: 'test', message: 'Can you help me with this job?'})
    messages.push({chatId: chat3Id, authorUsername: 'meowcat4', recipientUsername: 'test', message: 'What is your best price for this job?'})
    
    await messages.forEach(async message => {
        await DB.saveMessage(message)
    });
    

    // let reviews = []
    // reviews.push({reviewId: uuid.v4(), rating: 5, authorUsername: 'alice_123', servicerUsername: 'test', description: 'Love your work!', timestamp: Date.now(), comments: []})
    // reviews.push({reviewId: uuid.v4(), rating: 4, authorUsername: 'bbBoy2', servicerUsername: 'test', description: 'Can\'t wait to work with you more in the future', timestamp: Date.now(), comments: []})
    // reviews.push({reviewId: uuid.v4(), rating: 1, authorUsername: 'meowcat4', servicerUsername: 'test', description: 'Difficult to contact and was slow to respond', timestamp: Date.now(), comments: []})

    // await reviews.forEach(async review => {
    //     await DB.saveReview(review)
    // });

    // let listings = []
    // listings.push({title: 'Need help building furniture', category: 'Tester', availability: 'Monday afternoons', contactMethod: 'Text', budget: "$9,000", photos: [], authorUsername: "alice_123"})
    // listings.push({title: 'Lawncare needed', category: 'Tester', availability: 'Contact for more info', contactMethod: 'Text', budget: "$9,000", photos: [], authorUsername: "bbBoy2"})
    // listings.push({title: 'Bricklaying', category: 'Tester', availability: 'Weekdays', contactMethod: 'Text', budget: "$9,000", photos: [], authorUsername: "meowcat4"})

    // await listings.forEach(async listing => {
    //         await DB.saveListing(listing)
    //     });
}

main().catch(console.error)