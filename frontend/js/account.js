document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('currUser'))
    await loadAccountInfo(user)
});

async function loadAccountInfo(user){
    const parentEl = document.getElementById('info')
    const ulElement = document.createElement("ul");

    const li1 = document.createElement("li");
    li1.innerHTML = `<h3>Name: ${user.fullName}</h3>`
    
    const li2 = document.createElement("li");
    li2.innerHTML = `<h3>Username: ${user.username}</h3>`  
    
    const li3 = document.createElement("li");
    li3.innerHTML = `<h3>Service Provider: ${user.serviceProvider}</h3>` 

    const li4 = document.createElement("li");
    li4.innerHTML = `<h3>Category: ${user.category}</h3>` 


    ulElement.appendChild(li1);
    ulElement.appendChild(li2);
    ulElement.appendChild(li3);
    ulElement.appendChild(li4);


    const buttonElement = document.createElement("button");
    buttonElement.type = "submit";
    buttonElement.setAttribute('id', 'edit-btn')
    buttonElement.textContent = "Edit Account Information";

    //TODO: Button displays pop up that allows for account editing

    parentEl.appendChild(ulElement);
    parentEl.appendChild(buttonElement);
}