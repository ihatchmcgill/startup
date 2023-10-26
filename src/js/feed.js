document.addEventListener('DOMContentLoaded', function() {
    console.log('getting username')
    if (localStorage.getItem('userName')) {
        const userName = localStorage.getItem('userName');
        const parent = document.getElementById('user-name')

        let nameHeading = document.createElement('h1')
        nameHeading.textContent = `Welcome back ${userName}`

        parent.appendChild(nameHeading)
    }
});