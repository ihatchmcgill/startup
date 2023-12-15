import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Create } from './create/create';
import { Account } from './account/account';
import { Company } from './company/company';
import { Listing } from './listing/listing';
import { Feed } from './feed/feed';
import { Messages } from './messages/messages';
import { About } from './about/about';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  const [authState, setAuthState] = React.useState('Unauthenticated');

  return (
    <BrowserRouter>
      <div className='body'>
        <div className="header">
            <h1>Bargo Jobs</h1>
            <nav>
                <menu>
                    {authState === 'Authenticated' && (<li className='nav-item'><NavLink className='nav-link' to=''>Sign Out</NavLink></li>)}
                    {authState === 'Authenticated' && (<li className='nav-item'><NavLink className='nav-link' to='account'>My Account</NavLink></li>)}
                    {authState === 'Authenticated' && (<li className='nav-item'><NavLink className='nav-link' to='feed'>Feed</NavLink></li>)}
                    {authState === 'Authenticated' && (<li className='nav-item'><NavLink className='nav-link' to='listing'>Create a Listing</NavLink></li>)}
                    {authState === 'Authenticated' && (<li className='nav-item'><NavLink className='nav-link' to='company'>Company Page</NavLink></li>)}
                    {authState === 'Authenticated' && (<li className='nav-item'><NavLink className='nav-link' to='messages'>Messages</NavLink></li>)}
                    {authState === 'Unauthenticated' && (<li className='nav-item'><NavLink className='nav-link' to=''>Login</NavLink></li>)}
                    {authState === 'Unauthenticated' && (<li className='nav-item' id="switch-item"><NavLink className='nav-link' to='create'>Not a member? Create an account</NavLink></li>)}
                    <li className='nav-item'><NavLink className='nav-link' to='about'>About</NavLink></li>
                </menu>
            </nav>
        </div>
        <Routes>
            <Route
            path='/'
            element={
              <Login
                updateAuthState={(authState) => {
                  setAuthState(authState);
                }}
              />
            }
            exact
          />
            <Route path='/create' element={<Create 
            updateAuthState={(authState) => {
              setAuthState(authState);
            }}/>} />
            <Route path='/account' element={<Account />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/listing' element={<Listing />} />
            <Route path='/company' element={<Company />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
        <footer>
          <a href="https://github.com/ihatchmcgill/startup-bargo">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  )
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}