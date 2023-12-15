import React from 'react';

import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export function Create({updateAuthState}) {
    const navigate = useNavigate();

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setlastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [serviceProvider, setServiceProvider] = React.useState(false)

    async function create() {
        const user = {
            username: userName,
            password: password,
            firstName: firstName,
            lastName: lastName,
            serviceProvider: serviceProvider,
            category: category
        }

        try{
            const response = await fetch('/api/createAccount', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(user) 
            })
            if(response.status === 409){
                alert('An account with that username is already created. Please try again.')
            }
            if(response.ok){
                updateAuthState('Authenticated')
                navigate('/feed')
            }
        }catch(e){
            console.log('Something went wrong creating the user')
        }

        return false;
    }


    const handleCheckboxChange = () => {
        setServiceProvider(!serviceProvider);
    }


    return (
        <>
        <div className='body'>
            <div id="form-container" className="container">
                <ul>
                    <li><label>First Name: </label>
                        <input type="text" id="first-name" required="" pattern=".*"
                            onChange={(e) => setFirstName(e.target.value)}/>
                    </li>
                    <li><label>Last Name: </label>
                        <input type="text" id="last-name" required="" pattern=".*"
                            onChange={(e) => setlastName(e.target.value)}/>
                    </li>
                    <li><label>Email: </label>
                        <input type="text" id="email" required="" pattern=".*"
                            onChange={(e) => setEmail(e.target.value)}/>
                    </li>
                    <li><label>Username: </label>
                        <input type="text" id="username" required="" pattern=".*"
                            onChange={(e) => setUserName(e.target.value)}/>
                    </li>
                    <li><label>Password: </label>
                        <input type="password" id="password" required="" pattern=".*"
                            onChange={(e) => setPassword(e.target.value)}/>
                    </li>
                    <li><label>Service Provider?</label>
                        <input type="checkbox" id="ser-provider" 
                            checked={serviceProvider}
                            onChange={handleCheckboxChange}/>
                    </li>
                    {serviceProvider &&(
                        <li><label>Category: </label>
                            <input input type="text" id="category-text" required pattern=".*"
                                   onChange={(e) => setCategory (e.target.value)}/>
                        </li>
                    )}
                </ul>
                <Button variant='primary' onClick={() => create()}>
                    Create Account
                </Button>
            </div>
        </div>
        </>
    )
}
