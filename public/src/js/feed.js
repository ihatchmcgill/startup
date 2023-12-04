document.addEventListener('DOMContentLoaded', async function() {
    if (localStorage.getItem('currUser')) {
        const user = JSON.parse(localStorage.getItem('currUser'))
        const parent = document.getElementById('user-name')

        let nameHeading = document.createElement('h1')
        nameHeading.textContent = `Welcome back ${user.firstName}`

        parent.appendChild(nameHeading)
    }
    await getFeedItems()
});


async function getFeedItems(){
    const feedArea = document.getElementById('feed-area')
    const user = JSON.parse(localStorage.getItem('currUser'))
    let listings = []
    try{
        const baseUrl = '/src/api/listings'
        const queryParams = {
            category: user.category
        }
        const queryString = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&')

        const urlWithParams = baseUrl + '?' + queryString;
        const response = await fetch(urlWithParams)
        
        if(response.ok){
            listings = await response.json()
            localStorage.setItem('listings', JSON.stringify(listings))
        }
    }catch{
        listings = JSON.parse(localStorage.getItem('listings'))
    }
    await loadFeed(listings)
}

async function loadFeed(listings){
    const feedArea = document.getElementById('feed-area')
    console.log('loading feed')

    for(const listing of listings) {
        let user = await getUser(listing.authorUsername)
        if(listing.category === user.category){
            const feedItem = document.createElement('div')
            feedItem.setAttribute('class', 'feed-item')

            const itemTitle = document.createElement('p')
            itemTitle.textContent = `${listing.title}`

            const itemImg = document.createElement('img')
            itemImg.setAttribute('alt', 'listing image')
            itemImg.setAttribute('width', '100')
            itemImg.setAttribute('height', '100')
            itemImg.setAttribute('src', 'https://media.istockphoto.com/id/1291262112/photo/banana.webp?b=1&s=170667a&w=0&k=20&c=pPSsFoR1CX7oHJrr-bZPSoFIBO8PPf4SQDg3IbF-wcg=')
            
            const itemDescriptionCategory = document.createElement('div')
            itemDescriptionCategory.setAttribute('class', 'description')
            itemDescriptionCategory.textContent = `Category: ${listing.category}`

            const itemDescriptionBudget = document.createElement('div')
            itemDescriptionBudget.setAttribute('class', 'description')
            itemDescriptionBudget.textContent = `Budget: ${listing.budget}`

            const itemDescriptionAuthor = document.createElement('div')
            itemDescriptionAuthor.setAttribute('class', 'description')
            itemDescriptionAuthor.textContent = `Author: ${user.firstName}`


            const contactBtn = document.createElement('button')
            contactBtn.textContent = 'Contact Client'

            feedItem.appendChild(itemTitle)
            feedItem.appendChild(itemImg)
            feedItem.appendChild(itemDescriptionCategory)
            feedItem.appendChild(itemDescriptionBudget)
            feedItem.appendChild(itemDescriptionAuthor)
            feedItem.appendChild(contactBtn)

            feedArea.appendChild(feedItem)
        }
    }
}

async function getUser(username){
    const baseUrl = '/src/api/user'
    const queryParams = {
        username: username
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    try{
        const response = await fetch(urlWithParams)
        user = await response.json()
        return user
    } catch(e){
        console.log(e)
        return false;
    }
}