document.addEventListener('DOMContentLoaded', async function() {
    logout()
});

function logout() {
    localStorage.clear()
    fetch(`/src/api/logout`, {
      method: 'delete',
    });
  }


async function login() {
    const name = document.getElementById('username').value
    const password = document.getElementById('password').value
    console.log('logging in', name, password)
    //post request for user
    const authResponse = await authenticateUser({username: name, password: password})
    if (authResponse) {
        localStorage.setItem("currUser", JSON.stringify(authResponse))
        window.location.href = "src/feed.html";
    }else{
        alert("Login failed. Please check your credentials.");
    }
}

async function authenticateUser(creds){
    try{
        const response = await fetch('/src/api/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(creds) 
        })
        if(response.ok){
            const user = await response.json()
            return user
        }else{
            return false
        }
    }catch(e){
        console.log(e)
        return false;
    }
}


async function createAccount(){
    const servicer = document.getElementById('ser-provider').checked
    let category

    if(servicer){
        category = document.getElementById('category-text').value
    }else{
        category = 'None'
    }
    const user = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        serviceProvider: servicer,
        category: category
    }

    try{
        const response = await fetch('/src/api/createAccount', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(user) 
        })
        if(response.status === 409){
            alert('An account with that username is already created. Please try again.')
        }
        if(response.ok){
            await login()
        }
    }catch(e){
        console.log('Something went wrong creating the user')
    }

    return false;
}

async function loadCreateAccountForm(){
    //Modifies Nav and removes the form the isn't needed
    const switchEl = document.getElementById('switch-item')
    switchEl.removeChild(switchEl.firstChild)
    const newSwitchEl = document.createElement('h3')
    newSwitchEl.textContent = 'Back to login'
    newSwitchEl.setAttribute('onclick', 'loadLogin()')
    switchEl.appendChild(newSwitchEl)

    const formParentEl = document.getElementById('form-container')
    while(formParentEl.firstChild){
        formParentEl.removeChild(formParentEl.firstChild)
    }

    //Load the new user form
    const container = document.getElementById('form-container')

    const ulElement = document.createElement("ul");
    const li1 = document.createElement("li");
    li1.innerHTML = '<label>First Name: </label>' +
                    '<input type="text" id="first-name" required pattern=".*"/>';

    const li2 = document.createElement("li");
    li2.innerHTML = '<label>Last Name: </label>' +
                    '<input type="text" id="last-name" required pattern=".*">';                    

    const li3 = document.createElement("li");
    li3.innerHTML = '<label>Email: </label>' +
                    '<input type="text" id="email" required pattern=".*">';

    const li4 = document.createElement("li");
    li4.innerHTML = '<label>Username: </label>' +
                    '<input type="text" id="username" required pattern=".*">';

    const li5 = document.createElement("li");
    li5.innerHTML = '<label>Password: </label>' +
                    '<input type="password" id="password" required pattern=".*">';

    const li6 = document.createElement("li");
    const label6 = document.createElement("label")
    label6.textContent='Service Provider?'
    const checkInput = document.createElement('input')
    checkInput.setAttribute('type','checkbox')
    checkInput.setAttribute('id','ser-provider')

    checkInput.addEventListener("change", function() {
        const newLi = document.createElement("li");
        newLi.setAttribute('id','category-li')
        newLi.innerHTML = '<label>Category: </label>' +
                        '<input type="text" id="category-text" required pattern=".*">';
        if (checkInput.checked) {
        ulElement.appendChild(newLi);
        } else {
        // If unchecked, remove the additional HTML content
        ulElement.removeChild(document.getElementById('category-li'))
        }
    });

    li6.appendChild(label6)
    li6.appendChild(checkInput)

    ulElement.appendChild(li1);
    ulElement.appendChild(li2);
    ulElement.appendChild(li3);
    ulElement.appendChild(li4);
    ulElement.appendChild(li5);
    ulElement.appendChild(li6);


    const buttonElement = document.createElement("button");
    buttonElement.type = "submit";
    buttonElement.textContent = "Submit";
    buttonElement.onclick = createAccount; 

    container.appendChild(ulElement);
    container.appendChild(buttonElement);
    
}

async function loadLogin(){

    //Modifies Nav and removes the form the isn't needed
    const switchEl = document.getElementById('switch-item')
    switchEl.removeChild(switchEl.firstChild)
    const newSwitchEl = document.createElement('h3')
    newSwitchEl.textContent = 'Not a member? Create an account'
    newSwitchEl.setAttribute('onclick', 'loadCreateAccountForm()')
    switchEl.appendChild(newSwitchEl)

    const formParentEl = document.getElementById('form-container')
    while(formParentEl.firstChild){
        formParentEl.removeChild(formParentEl.firstChild)
    }

    const container = document.getElementById('form-container')

    //Load the login form
    const ulElement = document.createElement("ul");
    const li1 = document.createElement("li");
    li1.innerHTML = '<label>Username: </label>' +
                    '<input type="text" id="username" name="varText" required pattern=".*"/>';

    const li2 = document.createElement("li");
    li2.innerHTML = '<label>Password: </label>' +
                    '<input type="password" id="password" name="varPassword" required pattern=".*">';

    ulElement.appendChild(li1);
    ulElement.appendChild(li2);

    const buttonElement = document.createElement("button");
    buttonElement.type = "submit";
    buttonElement.textContent = "Submit";
    buttonElement.onclick = login; 

    container.appendChild(ulElement);
    container.appendChild(buttonElement);
}