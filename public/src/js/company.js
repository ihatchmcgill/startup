async function reply(buttonEl){

    //get index of particular reply
    let reviewIndex = buttonEl.id.match(/\d+?/)
    reviewIndex = parseFloat(reviewIndex[0])
    
    const parentEl = document.getElementById(`review-item${reviewIndex}`)
    const inputField = parentEl.querySelector('.review-response')
    const description = parentEl.querySelector('.review-description')
    const reviewAuthor = getAuthorUser(description.textContent)
    //don't create elements without input text
    if(!inputField.value){
        return
    }

    //create comment
    const reviewComment = document.createElement('div')
    reviewComment.setAttribute('class', 'comment')

    const commentText = document.createElement('p')
    commentText.setAttribute('class', 'comment-text')
    commentText.textContent = `${localStorage.getItem('username')}: ${inputField.value}`

    reviewComment.appendChild(commentText)

    const reviewItemComments = parentEl.querySelector('.review-comments')
    reviewItemComments.appendChild(reviewComment)

    //store comment
    const comment = {user: localStorage.getItem('username'), description: inputField.value}
    if(reviewAuthor){
        try{
            await storeComment(comment, reviewAuthor)
        }catch{
            //failed to save comment
        }
    }

    //clear input field
    inputField.value = ''
}

function getAuthorUser(description){
    const index = description.indexOf(':')
    if (index !== -1) {
        return description.substring(0, index);
      } else {
        // Character not found, return the original string
        return null;
    }
}

async function storeComment(comment, reviewAuthor){
    let reviews = []
    try{
        const response = await fetch('/src/api/reviews')
        reviews = await response.json()
    } catch {
        reviews = JSON.parse(localStorage.getItem('reviews'))
    }

    reviews.some((review) =>  {
        if(review.authorName === reviewAuthor){
            review.comments.push(comment)
            fetch('/src/api/updateReview', {
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(review),
            }).then(response => {
                return true
            }).catch(error =>{
                localStorage.setItem('reviews', JSON.stringify(reviews))
                return true
            })

        }
    })
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
        const divReviewDesc = document.createElement('div')
        divReviewDesc.setAttribute('class', 'review-description')
        divReviewDesc.textContent = `${review.authorName}: ${review.description}`

        //appending children to parent list
        divReviewItem.appendChild(textReviewStars)
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
                commentText.textContent = `${comment.user}: ${comment.description}`

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
        sendButton.textContent = 'Send'

        divReviewControls.appendChild(inputField)
        divReviewControls.appendChild(sendButton)

        divReviewItem.appendChild(divReviewControls)

        parentEl.appendChild(divReviewItem)
        i++
    })
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


    let reviews = []
    try{
        const response = await fetch('/src/api/reviews')
        reviews = await response.json()
        localStorage.setItem('reviews', JSON.stringify(reviews))
    } catch {
        reviews = localStorage.getItem('reviews')
    }
    await loadReviews(reviews)
});