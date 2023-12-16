import React from 'react';

import Button from 'react-bootstrap/Button';

import './listing.css';

export function Listing() {
  const [title, setTitle] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [availability, setAvailability] = React.useState('')
  const [contactMethod, setContactMethod] = React.useState('')
  const [budget, setBudget] = React.useState('')



  async function handleSubmit(){
    const user = JSON.parse(localStorage.getItem('currUser'))
    const listing = {
      authorUsername: user.username,
      title: title,
      category: category,
      availability: availability,
      contactMethod: contactMethod,
      budget: budget
    }
  
    try {
      const response = await fetch('/api/listing', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(listing),
      });
    }catch(e){
      //backend service failed, use local
      let listings
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


  return (
    <>
    <div className='body'>
      <div className="page-info">
        <h2>Create a Listing</h2>
      </div>
      <div className="content">
        <div className="page-body">
          <form>
            <ul>
              <li>
                <div className="input-container" >
                  <label>Category: </label>
                  <input type="text" id="category" required pattern=".*" onChange={(e) => setCategory(e.target.value)}/>
                </div>
              </li>
              <li>
                <div className="input-container">
                  <label>Listing Title: </label>
                  <input type="text" id="title" required pattern=".*" onChange={(e) => setTitle(e.target.value)}/>
                </div>
              </li>
              <li>
                <div className="input-container">
                  <label>Availability: </label>
                  <input type="text" id="availability" required pattern=".*" onChange={(e) => setAvailability(e.target.value)}/>
                </div>
              </li>
              <li>
                <div className="input-container" >
                  <label>Contact Method: </label>
                  <input type="text" id="contact-method" required pattern=".*" onChange={(e) => setContactMethod(e.target.value)}/>
                </div>
              </li>
              <li>
                <div className="input-container">
                  <label>Budget: </label>
                  <input type="text" id="budget" required pattern=".*" onChange={(e) => setBudget(e.target.value)}/>
                </div>
              </li>
            </ul>
            <h5>Upload Photos</h5>
            <Button variant='primary' type="submit" onClick={() => handleSubmit()}>Create</Button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}