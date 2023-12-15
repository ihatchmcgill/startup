import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from '../login/login';
import { Account } from '../account/account';
import { Company } from '../company/company';
import { Listing } from '../listing/listing';
import { Feed } from '../feed/feed';
import { Messages } from '../messages/messages';
import { About } from '../about/about';

export function NavBar() {
  return (
    <BrowserRouter>
        <div className="header">
            <h1>Bargo Jobs</h1>
            <nav>
                <menu>
                    <li className='nav-item'><NavLink className='nav-link' to='login'>Sign Out</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='account'>My Account</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='feed'>Feed</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='listing'>Create a Listing</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='company'>Company Page</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='messages'>Messages</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='about'>About</NavLink></li>
                </menu>
            </nav>
        </div>
        <Routes>
            <Route path='/' element={<Login />} exact />
            <Route path='/account' element={<Account />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/listing' element={<Listing />} />
            <Route path='/company' element={<Company />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }