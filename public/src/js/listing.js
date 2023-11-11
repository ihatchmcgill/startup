class Listing {
    title;
    category;
    availability;
    contactMethod;
    budget;
    photos;
    author;

    constructor(){
        this.title = ''
        this.category = ''
        this.availability = ''
        this.contactMethod = ''
        this.budget = ''
        this.photos = []
        this.author = ''
    }

}

async function createListing(){
    const listing = new Listing()
    
    //set attributes
    listing.author = localStorage.getItem('userName')
    listing.title = document.getElementById('title').value
    listing.availability = document.getElementById('availability').value
    listing.category = document.getElementById('category').value
    listing.budget = document.getElementById('budget').value
    listing.contactMethod = document.getElementById('contact-method').value

    try{
        await saveListing(listing)
    }catch(e){
        //unable to store in db properly
    }
}


async function saveListing(listing){
    let listings
    try {
        const response = await fetch('/api/listing', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(listing),
        });
    }catch(e){
        //backend service failed, use local
        if(!localStorage.getItem('listings')){
            listings = []
        }
        else{
            listings = JSON.parse(localStorage.getItem('listings'))
        }
            listings.push(listing)
            localStorage.setItem('listings', JSON.stringify(listings))
    }
}