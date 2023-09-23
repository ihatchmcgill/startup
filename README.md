# Bargo Jobs

## Elevator Pitch
When it comes to taking care of the jobs that you need done, there isn't anything that gets in the way more than needing to reach out to dozens of servicers to compare prices, quality, and timelines. With Bargo Jobs, we focus on eliminating the time it takes to get your jobs done. Like a social media platform, Bargo connects clients with servicers and uses your preferences to find you the very best ones for the job. At Bargo Jobs, we help your dreams become reality.

## Design
The website will function similar to a simple social media site, where both servicers and clients can create accounts and start connecting with one another. Clients will create listing for jobs that they need done and include informations about the project. Bargo will then find servicers in the area that will be a good fit and give them the opporunity to contact the client and begin negotiating their offer. Once both parties are agreed and locked in, the client pays the servicer and they move forward completing the project. 

### Sketches
A simple servicer page may look something like this:
![Servicer Page](images\servicerPage.png)

Clients can leave reviews, follow, or message servicers directly. 

A servicers feed will be populated with potential jobs they may be interested in:
![Servicer Feed](images\servicerFeed.png)


## Key Features
* Secure login through HTTP
* Ability for users to modify profiles
* Live feed updates
* Search bar and filtered lists
* Direct messaging between clients and servicers
* Personalized feeds
* Rate/Review system for both clients and servicers
* Job listing creation for clients
* Payment Management
* Contract generation for users

## Technologies
The following technologies will be implemented in the following ways.

- **HTML** - Uses correct HTML structure for application. Multiple HTML pages for clients and servicers. This include pages for reviews, listings, feeds, and messaging.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Allows application to display resources dynamic and adjust styling as needed. Makes all backend calls and webservice calls. I plan use webservices to help with location data and calculating distances.
- **Service** - Backend service with endpoints for:
  - login
  - creating an account
  - making payments
  - posting a job listing
- **DB** - Store users, listings, feeds, and messages in database.
- **Login** - Register and login users. Credentials securely stored in database. Users may browse but are unable to create job listings or make offers on jobs without logging in.
- **WebSocket** - As clients and servicers communicate through messaging, web sockets send live data.
- **React** - Application ported to use the React web framework.




