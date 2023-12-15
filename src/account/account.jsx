import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './account.css';

import ProfileImage from './profile.png'

export function Account() {

  const [name, setName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [serviceProvider, setServiceProvider] = React.useState(false)

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currUser'))
    setName(user.fullName)
    setUserName(user.username)
    setServiceProvider(user.serviceProvider)
    setCategory(user.category)
  }, []);

  return (
    <>
    <div className='body'>
      <div className="page-info">
        <h2>My Account</h2>
      </div>
      <div className="content">
        <div className="page-body">
          <div id="info">
            <ul>
              <li>
                <h3>Name: {name}</h3>
              </li>
              <li>
                <h3>Username: {userName}</h3>
              </li>
              <li>
                <h3>Service Provider: {serviceProvider}</h3>
              </li>
              <li>
                <h3>Category: {category}</h3>
              </li>
            </ul>
          </div>
            <img id="profile-icon" src={ProfileImage} alt="Profile Icon" />
        </div>
        </div>
      </div>
    </>
  );
}