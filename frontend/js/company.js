async function reply(buttonEl){
    const user = JSON.parse(localStorage.getItem('currUser'))

    //get index of particular reply
    let reviewIndex = buttonEl.id.match(/\d+?/)
    reviewIndex = parseFloat(reviewIndex[0])
    
    const parentEl = document.getElementById(`review-item${reviewIndex}`)
    const inputField = parentEl.querySelector('.review-response')
    const reviewAuthor = parentEl.querySelector('#review-author').textContent
    console.log(reviewAuthor)
    //don't create elements without input text
    if(!inputField.value){
        return
    }

    //create comment
    const reviewComment = document.createElement('div')
    reviewComment.setAttribute('class', 'comment')

    const commentText = document.createElement('p')
    commentText.setAttribute('class', 'comment-text')
    commentText.textContent = `${user.username}: ${inputField.value}`

    reviewComment.appendChild(commentText)

    const reviewItemComments = parentEl.querySelector('.review-comments')
    reviewItemComments.appendChild(reviewComment)

    //store comment
    const comment = {commentAuthorUsername: user.username, description: inputField.value}


    try{
        await storeComment(comment, reviewAuthor)
    }catch(e){
        //failed to save comment
        console.log(e)
    }
    
    //clear input field
    inputField.value = ''
}


async function storeComment(comment, reviewAuthorUsername ){
    const user = JSON.parse(localStorage.getItem('currUser'))

    let reviews = []
    try{
        //GET endpoint for all reviews
        const baseUrl = '/src/api/reviews'
        const queryParams = {
            username: user.username
        }
        const queryString = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&')

        const urlWithParams = baseUrl + '?' + queryString;
        const response = await fetch(urlWithParams)

        if(response.ok){
            reviews = await response.json()
        }
    } catch(e) {
        console.log(e)
        reviews = JSON.parse(localStorage.getItem('reviews'))
    }

    console.log('storing comment')

    for(const review of reviews)  {
        console.log('searching for:', reviewAuthorUsername)
        console.log('checking review:', review.authorUsername)
        if(review.authorUsername === reviewAuthorUsername){
            console.log('found correct review')
            review.comments.push(comment)
            await fetch('/src/api/updateReviewComment', {
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(
                        { 
                        review: review,
                        newComment: comment
                    })
            }).then(response => {
                return true
            }).catch(error =>{
                localStorage.setItem('reviews', JSON.stringify(reviews))
                return true
            })

        }
        return false
    }
}


async function loadReviews(reviews){
    //Uses the database to retrieve company reviews
    const parentEl = document.getElementById('review-items-list')

    let i = 0
    reviews.forEach((review) => {
        //begin creating the review items to populate the html list
        const divReviewItem = document.createElement('div')
        divReviewItem.setAttribute('class', 'review-item')
        divReviewItem.setAttribute('id', `review-item${i}`)
        //review title
        const textReviewStars = document.createElement('p')
        textReviewStars.setAttribute('class', 'review-stars')
        textReviewStars.textContent = `${review.rating} Stars`

        //review description
        const divReviewAuth = document.createElement('div')
        divReviewAuth.setAttribute('id', 'review-author')
        divReviewAuth.setAttribute('class', 'review-description-author')
        divReviewAuth.textContent = `${review.authorUsername}`

        //review description
        const divReviewDesc = document.createElement('div')
        divReviewDesc.setAttribute('class', 'review-description')
        divReviewDesc.textContent = `${review.description}`

        //appending children to parent list
        divReviewItem.appendChild(textReviewStars)
        divReviewItem.appendChild(divReviewAuth)
        divReviewItem.appendChild(divReviewDesc)

        //iterate through review comments and create elements for those
        const commentsArr = review.comments
        
        const divReviewComments = document.createElement('div')
        divReviewComments.setAttribute('class', 'review-comments')
        if(commentsArr){
            commentsArr.forEach((comment) => {
                const reviewComment = document.createElement('div')
                reviewComment.setAttribute('class', 'comment')

                const commentText = document.createElement('p')
                commentText.setAttribute('class', 'comment-text')
                commentText.textContent = `${comment.commentAuthorUsername}: ${comment.description}`

                reviewComment.appendChild(commentText)
                divReviewComments.appendChild(reviewComment)
            })
        }

        divReviewItem.appendChild(divReviewComments)

        const divReviewControls = document.createElement('div')
        divReviewControls.setAttribute('class', 'review-controls')
        
        const inputField = document.createElement('input')
        inputField.setAttribute('type', 'text')
        inputField.setAttribute('class', 'review-response')
        inputField.setAttribute('placeholder', 'Reply to this review')

        const sendButton = document.createElement('button')
        sendButton.setAttribute('class', 'send-button')
        sendButton.setAttribute('id', `send-button${i}`)
        sendButton.setAttribute('onclick', 'reply(this)')
        sendButton.textContent = 'Reply'

        divReviewControls.appendChild(inputField)
        divReviewControls.appendChild(sendButton)

        divReviewItem.appendChild(divReviewControls)

        parentEl.appendChild(divReviewItem)
        i++
    })
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

document.addEventListener('DOMContentLoaded', async function() {
    //Init Map
    const mapParentEl = document.getElementById('map')
    const container = document.createElement('div');
    container.setAttribute('id', 'map')

    container.innerHTML = `
      <iframe
        width="75%"
        height="200"
        style="border:0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAnmKhBYlMKvrX8p1tth3F3VGfKKddvI6I&q=BYU+Creamery,Provo+UT">
      </iframe>
    `
    mapParentEl.appendChild(container)

    const user = JSON.parse(localStorage.getItem('currUser'))

    let reviews = []
    try{
        const baseUrl = '/src/api/reviews'
        const queryParams = {
            username: user.username
        }
        const queryString = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&')

        const urlWithParams = baseUrl + '?' + queryString;
        const response = await fetch(urlWithParams)
        if(response.ok){
            reviews = await response.json()
            localStorage.setItem('reviews', JSON.stringify(reviews))
        }
    } catch(e){
        console.log(e)
        reviews = localStorage.getItem('reviews')
    }
    await loadReviews(reviews)
});