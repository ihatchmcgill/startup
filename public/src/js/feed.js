document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('userName')) {
        const userName = localStorage.getItem('userName');
        const parent = document.getElementById('user-name')

        let nameHeading = document.createElement('h1')
        nameHeading.textContent = `Welcome back ${userName}`

        parent.appendChild(nameHeading)
    }
    getFeedItems()
});


async function getFeedItems(){
    const feedArea = document.getElementById('feed-area')
    let listings
    try{
        const response = await fetch('api/listings')
        listings = response.json()
    }catch(e){
        listings = JSON.parse(localStorage.getItem('listings'))
        throw new Error('unable to retrieve listings')
    }
    loadFeed(listings)
}

function loadFeed(listings){
    const feedArea = document.getElementById('feed-area')
    
    listings.forEach((listing) => {
        const feedItem = document.createElement('div')
        feedItem.setAttribute('class', 'feed-item')

        const itemTitle = document.createElement('p')
        itemTitle.textContent = `${listing.author}\'s Post`

        const itemImg = document.createElement('img')
        itemImg.setAttribute('alt', 'listing image')
        itemImg.setAttribute('width', '100')
        itemImg.setAttribute('height', '100')
        itemImg.setAttribute('src', 'https://media.istockphoto.com/id/1291262112/photo/banana.webp?b=1&s=170667a&w=0&k=20&c=pPSsFoR1CX7oHJrr-bZPSoFIBO8PPf4SQDg3IbF-wcg=')
        
        const itemDescription = document.createElement('div')
        itemDescription.setAttribute('class', 'description')
        itemDescription.textContent = `Title: ${listing.title} Category: ${listing.category} Budget: ${listing.budget}`

        feedItem.appendChild(itemTitle)
        feedItem.appendChild(itemImg)
        feedItem.appendChild(itemDescription)

        feedArea.appendChild(feedItem)
    })
}