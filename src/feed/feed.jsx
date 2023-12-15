import React from 'react';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './feed.css';

import FeedItem from './feed.png'

export function Feed() {
  const [listings, setListings] = React.useState([])

  React.useEffect(() => {
    async function fetchListings () {
      try{
        const user = JSON.parse(localStorage.getItem('currUser'))
        //GET endpoint for all reviews
        const baseUrl = '/api/listings'
        const queryParams = {
          category: user.category
        }
        const queryString = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&')
  
        const urlWithParams = baseUrl + '?' + queryString;
        const response = await fetch(urlWithParams)
  
        if(response.ok){
          setListings(await response.json())
          localStorage.setItem('listings', JSON.stringify(listings))
        }
      } catch(e) {
        console.log(e)
        setListings(JSON.parse(localStorage.getItem('listings')))
      }
    }
    fetchListings()
  }, []);

  const listingItems = []
  let i = 0
  listings.forEach(async (listing) => {
    let listingUser = getUser(listing.authorUsername)
    const user = JSON.parse(localStorage.getItem('currUser'))
    if(listing.category === user.category){
      listingItems.push(
        <div key={i} className='feed-item'>
          <p>{listing.title}</p>
          <img src={FeedItem} alt='Listing Image'></img>
          <div className='description'>Category: {listing.category}</div>
          <div className='description'>Budget: {listing.budget}</div>
          <div className='description'>Author: {listingUser.firstName}</div>
          <Button variant='primary'>Contact Client</Button>
        </div>
      )
    }
    i++
  })

  async function getUser(username){
    const baseUrl = '/api/user'
    const queryParams = {
        username: username
    }
    const queryString = Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&')

    const urlWithParams = baseUrl + '?' + queryString;
    try{
        const response = await fetch(urlWithParams)
        const user = await response.json()
        return user
    } catch(e){
        console.log(e)
        return false;
    }
  }

  return (
    <>
    <div className='body'>
      <div className="page-info">
        <h2>My Feed</h2>
      </div>
      <div className="content">
        <div className="page-body">
          <div className="filter-area">
            <h2>Explore and Filter</h2>
            <div className="search-area">
              <input type="text" id="search-text" placeholder="Search open listings"/>
              <button id="search-button">Search</button>
            </div>
            <div className="filter">
              <input type="text" id="filter-text" placeholder="Filter"/>
              <button id="filter-button">Apply</button>
            </div>
          </div>
          <div className="feed-area" id="feed-area">{listingItems}</div>
        </div>
      </div>
    </div>
    </>
  );
}