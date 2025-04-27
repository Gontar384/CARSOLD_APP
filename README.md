# Hi Everyone!

CAR$OLD is a fullstack web-app, which I worked on for some time now. It's car aucion portal, where you can create account
(or log in via Google) and post your offers, search for cars, send messages to other users and some more!
It's target group are mostly Polish people, but it is written in english, so everyone can use it.
It has various funcitonality, works with some helper APIs (on Google Cloud Project), has solid security and manages data 
in an advanced way!
It uses TypeScript with React (runs with Vite) for Frontend and Java with SpringBoot for Backend. It uses PostgresSQL DB
by default managed with JPA and Hibernate, but can also use other DB. 
Let me simply walk you through!

## Authentication
- you can either create account, providing real email - which is being initially checked when providing
  and later of course you will get e-mail confirmation message. You also have to provide unique username - which
  is being checked for any toxicity by Perspective Comment Analyser API (username is so important, because
  whole security is based on a unique username). Also you need to provide valid password, which has to
  have 8 characters, including at least one big and small letter, and a number;
- or you can log in via google - using OAuth2, which imidiatelly let you use full app functionality;
- disclaimer: when you have registered normally, it will force you to use normal username/password
  authentication, and when using OAuth2, it will force to use Google Auth;
  If you haved registered normally and e-mail is Google's, you can still use OAuth2 to authenticate, but
  then your account will be marked as Google's only and you'll have to use this type of auth.
  When authenticating via Google, your username will be first part of your e-mail address;
- when you forget your password, you can click the label on login page and you'll need to provide
  your e-mail, then you click on link we sent you, and need to provide new password - then password will be
  changed and you'll be authenticated automatically;
- whole register/login process is supported by live-responsive comms;
- you can authenticate using e-mail/username;
- there are terms of use, which you can read on register page under link;

## Security
- security in app is its KEY part, it's solid and well maintained. It uses CSRF token and JWT combined,
  being sent/retrieved in HttpOnly cookie, so no tokens are available in localstorage/Javascript.
  Basically, app is managed by session. Session is being created on app mount (even when user is not
  authenticated yet) and it's being resetted when user logs in/logs out. CSRF token is being sent in session
  on app mount and of course it's being sent in every request to server and validated. When you authenticate,
  you will obtain JWT, and then you obatain it on every app mount, when you have your authentication object held
  in server. It's being refreshed every 2 minutes, when user is using app. Also there is mechanism, which measures
  user's activity every one minute, so it will sent simple ping to server, sustaining session. When there will be
  unexpected authentication errors or session will expire - userwill be logged out and will need to authenticate again.
- on backend it uses SecurityContextHolder to hold authentication object, it uses UserDetailsService and UserPrincipal
  (with roles: USER, ADMIN) to work with JWT Filter, also Authentication Manager for simple password auth,
- of course there is also CORS configured, it uses BCryptPasswordEncoder to hash passwords and all possible security normes
  sticked with, fully integrated and configured with the highest care.

## Frontend routes
- reffering to two previous points, on Frontend it uses BrowserRouter to manage routes. There is machanism, so on mount app
  sents simple request (we use Axios for all requests) to server and it will tell, if there is authentication object
  properly held in server: if not - only Public and Open routes are available, if it is - only Private and Open routes are
  available, works automatically, navigating user through paths when needed;
- it mostly uses navigate from useNavigate, but also sometimes use <Link>, for better user experience, so he can
  open some links in another window.

## User Account Details
- when you authenticate you gain full functionality. You will first see your profile, with headers:
- My offers: there are your offers displayed, where you can manage them, edit, delete, see how many people diplayed
  and how many followed (uses pagination);
- Followed: there appear offers, that you follow
- Messages: there are all conversations you have with users, these are managed fully responsive, when other user writes -
  you get notificated automatically, thanks to WebSockets. Also user is able to see if receiver has seen message and
  it offers some more well mnanaged funcionality!
- Settings: there are your account settings, you can add contact details, which will appear on every offer you have. You add:
  Name: it is checked by Cloud Natural Language API, which checks if it's related to "Person", resulting in simple check for
  valid name;
  Phone: it uses libphonenumber, so it formats number automatically (by default it adds area code for Poland, but if you
  provide other, it'll format number acordingly to it, e.g. Germany, USA and others);
  City: it use Places API, so it will suggest place, when typing in and also checks for its validity;
  Public: it switches On/Off contact details visibility;
  You can also change your password here, with fully responsive inputs, also you can delete your account (where you need to
  confirm it by providing password or typing in simple phrase (for OAuth2);
- Info: app details basically (e.g. app version, developer contact details);
- Admin (only when user role is ADMIN) - you will see offer reports here. App has moderation mechanism, which let user
  report offer and then admin can check for reports, then go to offer and simply delete it if something is inappropriate;
- you will also see your username (which unfortunatelly cannot be changed, for security reasons and to prevent bugs)
  and profile pic, which you can add/delete. When you add profile pic, it is being firstly checked by Cloud Vision API for
  any sensitive content, also it cannot exceed memory size. Then it is being sent to Cloud Storage and app only get URL link
  saved.

## Layout and NavBar
- you see app logo - it navigates you to Home page, which is simply displaing 3 random offers and just navigating user
  through app;
- search bar, which lets you type in any search value, which will serach through offers and finds you any offer you by it's title;
  On the right you have small button, which navigates you to search filters, which we will talk about later.
- Add Offer button - adding offer (will talk about later);
- Login/Register button / User Info button with dropdown. It let user to navigate through account details, also let logout
  and provides Dark mode, which you can turn On/Off;
  When app shrinks, options hide to left side bar, which you can unroll and functionality remains the same. Also, when you are on
  mobile device, there will be similar bar, but at the bottom.

## Fully responsive design
- I use Taiwind, which let me professionally design app fully responsive for every possible device. You can use it on PC 
  on any mobile (smaller, bigger, doesn't matter, down to 320px wide). It uses different types of layout, everything to 
  maintaing fully responsive. It detects either if it's mobile or PC, making all the animations work perfectly fine onClick and
  onTouch events and preventing any bugs. Also it has some keyboard use support. Animatios are nicely done, they are creative I would say. 
I paid a lot time to do some;
- there are live banners, which shows up to inform user (also cookie usage inform banner when you first visit site);
- loading animations, are nicely done to maintain perfect layout and great user experience, when something is being fetched/loaded;
- buttons anti-spam mechanisms - all buttons, which are performing any request sending, are being blocked for a short period
  of time to prevent any spam/bugs.

## More functionality
- you can add offer, which is pretty complex process - there are a lot custom-designed inputs, which are fully responsive.
  You'll be told if you have to provide any more details or if provided info is wrong. Values are being hardly validated;
- images are maintaned nicely, you can either drag over and drop or simply click to add, then you can change its order,
- when adding offer, title and description are being checked by Perspective Comment Analyzer API for any toxicity, images
  are being sent and saved on Cloud Storage;
- you can edit offer, but you can do this every 5 minutes to prevent too much data flow going through;
- when you search using search bar or Filters, offers will be queried using Specifications and returned using Pagination;
- you can add filters up to twenty filters, reset them, sort offers by order, popularity;
- jumping onto offer - what you see is every info user has provided:
  you see images added, which you can either swipe by dragging or just clicking. Also you can open images in a big screen.
  Over images are some buttons. If you are offer's owner, there will be none, but if you watch other user's offer, there will
  be flag on the left - when you click on, you can report offer. On the right there is heart, so you can follow
  offer. When you are admin, you'll have trashcan on left, so you can delete offer, as a part of moderating functionality.
  Under images you have all offer information. On the right, you have title, price, time of adding offer and of course -
  user information. App uses Maps JavaSript API to display Google map, based on location set previously in settings.
  There you have green button, which clicking on you can either open conversation (if you its not your offer) or you can edit offer
  (if its yours);
- messages sending: when you go to Messages, on the left you have conversations bar, on the right - choosen conversation
  When you've opened conversation with user, you can send message. User will get live - notification, because app uses WebSockets,
  which user subscribes to on initial. When you're not in conversation, there will be notification, but when you're on
  conversation - message will appear here in window. Also you'll have message notification (conversation count) on navbar marked.
  When you click on input to write something, that is trigger, which sends information that user has seen message. So when being
  on conversation, user is also subscribed to message-seen topic. Also when message is not seen - accordingly it will be font-bold
  on conversations bar. You can also delete conversation and block user.

## Data management/flow
I've tried to use everything I could to make application and data maintance work fast and with no complications:
- as I mentioned before, it uses JPA and Hibernate to maintain Entities and data in DB. If you look at them, you will see that
  they have multiple relations between. Sometimes I also use simple QUERIES for DB in repositories;
- I decided to not hold whole images in my DB, so I hold them in Google Cloud Storage, I only hold links in my DB;
- I use multiple technologies and APIs to prevent saving unwanted, sensitive or inappropriate data (Perspective Comment Analyser API,
  Cloud Natural Language API, Cloud Vision API), also I have admin moderation mechanism, which in any case can get reports from
  users and can delete offer;
- I use DTOs for data transfers;
- cleanups: I provide cleanups in case when user deletes offer or account, for example when offer is being deleted - it also
  deletes that offer from other users followed offers and when account is being deleted - all users offers are being dropped as well,
  those offers from users followed offers also and when user followed any offers and it counted as their follow - then follow is being taken back.
  Of course when deleting offer or account, all conversations and messages are being dropped as well. And of course all images
  (profilePics, offerImages) are being deleted on Google Cloud Storage, according to specific catalogues and folder names.  

## Request/Response flow
- On Frontend I use services, where I have all API calls. In there I use Error Handler, which based on status coming with 
  response, throws specific errors. Then, I use those service calls on other components, custom hooks or global providers and 
  I log them here in catch blocks, looking for specific errors, that are being thrown by Error Handler. Sometimes I also ommit 
  Error Handler and base on plain statuses;
- On Backend I use Controllers, which send ResponseEntities with default, positive respose statuses. If any exception is being thrown, it
  is thrown in Services. I use a lot custom exceptions. I have well-configured GlobalExceptionHandler, which catch any exceptions thrown
  and then returns appropriate error status code. Overall error loggin is so important for me and I put a lot of effort on them.

## Tests
- I created unit and integration tests for backend services and controllers, using Mockito and SpringBootTest. When running a integration tests,
  .env are being obtained using DotEnv, but for Google Cloud Service you'll need to provide its dir, so basically GOOGLE_APPLICATION_CREDENTIALS
  on test run configuration;
- on frontend I also tested some custom hooks, global providers and components, using jest.

## Running App/Configuration
If you want to run app locally, you need to clone my repo. I used java 22, it should work on it fine. You need to have this configuration:

### Resources/application.yml:

#Database Connection Configuration spring:

  datasource:
    url: ${DATASOURCE_URL}
    username: ${DATASOURCE_USER}
    password: ${DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver # or your DB driver and configuration
    hikari:
      minimum-idle: 5
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    open-in-view: false

  #SMTP Server Configuration (email sending)
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${EMAIL}
    password: ${EMAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

  #OAuth2 Configuration
  
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_ID}
            client-secret: ${GOOGLE_SECRET}

  #Google Cloud Storage and Vision Configuration cloud:
  
  gcp:
    project-id: ${GOOGLE_CLOUD_PROJECT}
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

#Session Configuration (CSRF)

server:
  servlet:
    session:
      cookie:
        name: CSRF
      timeout: PT${SESSION_TIME:24}H

#Off DB Logs (broken ones)

logging:
  level:
    org.hibernate: warn
    com.zaxxer.hikari: warn

### .env files

-------------------------------------Backend in root dir (same dir as DockerFile is)-------------------------------------

#DATABASE

DATASOURCE_URL=;
DATASOURCE_USER=;
DATASOURCE_PASSWORD=;

#FRONTEND

FRONTEND_URL= #by default you would use http://localhost:5173/;

#SESSION LENGTH TIME IN HOURS

SESSION_TIME=;

#JWT SECRET KEY

JWT_SECRET_KEY=;

#EMAIL

EMAIL=;
EMAIL_PASSWORD=;

#OAUTH2-GOOGLE

GOOGLE_ID=;
GOOGLE_SECRET=;

#Google Cloud Storage and Vision

GOOGLE_APPLICATION_CREDENTIALS=;
GOOGLE_CLOUD_PROJECT=;
GOOGLE_CLOUD_BUCKET_NAME=;

#Google Perspective API

PERSPECTIVE_API_KEY=;

#Google Cloud Natural Language API

CLOUD_NATURAL_LANGUAGE_API_KEY=;

#Google Places API

PLACES_API_KEY=;


-------------------------------------Frontend in dir /frontend-------------------------------------

VITE_BACKEND_URL=; # by default you would put: http://localhost:8080/
VITE_MAPS_APIKEY=;


### Google Cloud Project

You need to create an Google Cloud project and add those APIs to you library:
- Cloud Storage
- Cloud Vision API
- Cloud Natural Language API
- Perspective Comment Analyzer API (you need to send request to use this outside, then can be added to Google)
- Places API (New)
- Maps JavaScript API
 
Then you need to set API Keys for Perspective, Cloud Natural Language, Places and Maps JavaScript APIs.

For Cloud Storage you need to configure service account with proper roles (can be owner) and make your bucket publicly accessible to read
by users. You need to properly put its credentials file in app. I put them in resources.
Also you will need to open Google Cloud Console and type in those commands for full functionality (it let user properly edit offer photos)

echo '[
  {
    "origin": ["*"], 
    "responseHeader": ["Content-Type"], 
    "method": ["GET", "HEAD", "OPTIONS"], 
    "maxAgeSeconds": 3600
  }
]' > cors.json

gsutil cors set cors.json gs://carsold_app_images

You'll need to create and configure OAuth2 Client (when running locally with http://localhost:5173 and http://localhost:8080/login/oauth2/code/google)

### package.json
- you'll need to run npm install to install all package.json dependencies

### others
When putting that on hosted server, there will be some modifications needed to do also. For example you need to set Cookies Secure: true; in CookieService and also change
ws -> wss in WebSocket configuration. Also you need to change configuration of OAuth2 in Google Cloud Project.

There is also DockerFile ready to use, but you have to provide .env properties when running docker if you want to export app. 

### That is it basically. I've shown most important details. For any questions, contact me here or by e-mail: gontarek384@gmail.com

### If you want to watch quick video overview, visit this:

# I don't agree on using CAR$OLD App commercially by or under any other entity. I am the only author and owner, and I reserve all rights-to-use and manage CAR$OLD App. I agree on using CAR$OLD App by anyone only as a viewer.










  
