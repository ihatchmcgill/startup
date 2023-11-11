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
    const comment = {author: localStorage.getItem('username'), description: inputField.value}
    if(reviewAuthor){
        try{
            await storeComment(comment, reviewAuthor)
        }catch(e){
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
    const reviewArr = JSON.parse(localStorage.getItem('reviews'))
    reviewArr.forEach((review) => {
        if(review.author === reviewAuthor){
            review.comments.push(comment)
            localStorage.setItem('reviews', JSON.stringify(reviewArr))
            return
        }
    })
}


async function loadReviews(){
    //Uses the database to retrieve company reviews
    const parentEl = document.getElementById('review-items-list')
    const reviewArr = JSON.parse(localStorage.getItem('reviews'))

    let i = 0
    reviewArr.forEach((review) => {
        
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
        divReviewDesc.textContent = `${review.author}: ${review.description}`

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
                commentText.textContent = `${comment.author}: ${comment.description}`

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


function populateSampleReviews() {
    const reviewItem1 = {rating: 5, author: 'Alice Adams', description: 'Love your work!', timestamp: Date.now(), comments: []}
    const reviewItem2 = {rating: 4, author: 'Bob Billy', description: 'Can\'t wait to work with you more in the future', timestamp: Date.now(), comments: []}
    const reviewItem3 = {rating: 1, author: 'Cat Cathy', description: 'Difficult to contact and was slow to respond', timestamp: Date.now(), comments: []}

    let reviewArr = []
    reviewArr.push(reviewItem1)
    reviewArr.push(reviewItem2)
    reviewArr.push(reviewItem3)

    return reviewArr
}

document.addEventListener('DOMContentLoaded', function() {
    let reviews = localStorage.getItem('reviews')
    if(!reviews){
        reviews = populateSampleReviews()
        localStorage.setItem('reviews', JSON.stringify(reviews))
    }
    loadReviews()
});