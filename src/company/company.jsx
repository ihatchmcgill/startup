import React from 'react';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './company.css';

import CompanyLogo from './company.png'

export function Company() {
  const [reviews, setReviews] = React.useState([]);
  const [replyText, setReplyText] = React.useState('');


  React.useEffect(() => {
    async function fetchReviews () {
      try{
        const user = JSON.parse(localStorage.getItem('currUser'))
        //GET endpoint for all reviews
        const baseUrl = '/api/reviews'
        const queryParams = {
            username: user.username
        }
        const queryString = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&')
  
        const urlWithParams = baseUrl + '?' + queryString;
        const response = await fetch(urlWithParams)
  
        if(response.ok){
          setReviews(await response.json())
          localStorage.setItem('reviews', JSON.stringify(reviews))
        }
      } catch(e) {
        console.log(e)
        setReviews(JSON.parse(localStorage.getItem('reviews')))
      }
    }
    fetchReviews()
  }, []);

    const reviewItems = [];
    let i = 0
    reviews.forEach((review) => {
      const comments = []
      if(review.comments){
        let i = 0
        review.comments.forEach((comment) => {
            comments.push(
              <div key={i} className='comment'>
                <p className='comment-text'>{comment.commentAuthorUsername}: {comment.description}</p>
              </div>
            )
            i++
        })
      }
      reviewItems.push(
        <div key={i} id='review-item' className='review-item' >
          <p className='review-stars'>{review.rating} Stars</p>
          <div id='review-author' className='review-description-author'>{review.authorUsername}</div>
          <div className='review-comments'>{comments}</div>
          <div className='review-controls'>
            <input type='text' className='review-response' placeholder='Reply to this review'
                   onChange={(e) => setReplyText(e.target.value)}></input>
            <Button className='send-button' variant='primary' onClick={() => handleReply(review.id)}>Reply</Button>
          </div>
        </div>
      )
      i++
  })


  async function handleReply(reviewId){
    const user = JSON.parse(localStorage.getItem('currUser'))
    const newComment = {commentAuthorUsername: user.username, description: replyText}
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, comments: [...review.comments, newComment] } : review
    );

    
    setReviews(updatedReviews);
    setReplyText('')
    await storeComment(reviewId, newComment)
}


  async function storeComment(reviewId, newComment){
    let reviewToFind
    reviews.forEach(review => {
      if(review.id == reviewId){
        reviewToFind = review
      }
    })


    await fetch('/src/api/updateReviewComment', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(
          { 
          review: reviewToFind,
          newComment: newComment
      })
      }).then(response => {
        return true
      }).catch(error =>{
        localStorage.setItem('reviews', JSON.stringify(reviews))
        return true
})
  }

  return (
    <>
    <div className='body'>
      <div className="page-info">
        <h2>My Company</h2>
      </div>
      <div className="page-body">
        <div id="company-info" className="company-info">
          <div className="company-desc">
            <p>Here you will be able to see info about your company. This is the page customers will see when exploring your
              business. 
            </p>
          </div>
          <div className="company-icon">
            <img src={CompanyLogo} alt="Company Logo"/>
          </div>
        </div>
        <div id="map">
          <div id='map-container'>
          {/* <iframe
              width="75%"
              height="200"
              style="border:0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAnmKhBYlMKvrX8p1tth3F3VGfKKddvI6I&q=BYU+Creamery,Provo+UT">
            </iframe> */}
          </div>
        </div>
        <div className="reviews">
          <h2>Reviews</h2>
          <p>Customers can read and leave reviews, and your overall rating is shown.</p>
          <div id="review-items-list">{reviewItems}</div>
        </div>
      </div>
    </div>
    </>
  );
}