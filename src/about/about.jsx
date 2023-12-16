import React from 'react';

import './about.css';

export function About() {
  return (
    <>
    <div className='body'>
        <div className="page-info">
            <h2>About Us</h2>
        </div>
        <div className="content">
            <div className="page-body">
                <section className="about-section">
                    <h2>About Bargo</h2>
                    <p>
                        Bargo Jobs is committed to connecting customers with service providers. We strive to make this process as painless as possible. By using our service, you are putting yourself one step closer to your dreams.
                    </p>
                </section>
                <section className="features-section">
                    <h2>Features</h2>
                    <ul>
                        <li>Customer reviews</li>
                        <li>Instant messaging</li>
                        <li>Personalized feeds</li>
                        <li>Safe and Secure Payments with Contract Generation</li>
                        <li>And more!</li>
                    </ul>
                </section>
                <section className="contact-section">
                    <h2>Contact Us</h2>
                    <p>For inquiries or more information about Bargo Jobs, please email us at <a href="mailto:info@example.com">info@example.com</a>.</p>
                </section>
            </div>
        </div>
    </div>
    </>
  );
}