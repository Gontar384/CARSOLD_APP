Hi Everyone!

1.0 Overview
CARSOLD is fullstack web-app, which I worked on for some time. It is basically car aucion portal, 
where you can create your account (or log in via Google) and post your car offers and do some more!
It's target group are Polish people, but from any other country can also use it.
It has various funcitonality, works with some helper APIs (on Google Cloud Project), has solid security and manages data 
in an advanced way!
I use TypeScript with React (run with Vite) for frontend and Java with SpringBoot for backend. I also use PostgresSQL, 
managed by JPA and Hibernate, but it is available to use othe DB.
Let me walk you through:

1.1 Authentication
- You can either create account, providing real email - which is being initially checked when providing
  and later of course you will get e-mail message to confirm it, providing unique username - which is
  being checked for any toxicity by Perspective Comment Analyser API (username is so important, because
  whole security is based on a unique username). Also you need to provide vali password - which has to
  have 8 characters, including at least one big and small letter, and a number)
- or you can log in via google - using OAuth2, which imidiatelly let you use full app functionality
disclaimer: when you have registered normally, it will force you to use normal username/password
authentication, and when using OAuth2 - will force to use Google Auth
If you haved registered normally and e-mail is Google's, you can still use OAuth2 to authenticated, but
then your account will be modified as Google's only and you will have to use this type of auth.
When authenticating via Google, your username will be first part of your e-mail address.
- there are terms of use, which you can read by clicking on them when registering
- when you logged in normally, simple confirmation e-mail will be sent, where you need to click on link
so your account will be activated and you will be authenticated.
- when you forget your password, you can simply click the label on login page and you will need to provide
your e-mail, then you click on link we sent you, and need to provide new password - then password will be
changed and you will be authenticated automatically
- when you login normal way, you can use either e-mail or username for login and of course need to provide
password

1.2 Security
- Security in app is its KEY part, it's solid and well maintained. It uses CSRF token and JWT combined,
being sent/retrieved in HttpOnly cookie, so no tokens are available in localstorage/javascript etc.
Basically, app is managed by session. Session is being created on app mount (even when user is not
authenticated yet) and it's being resetted when user logs in/logs out. CSRF token is being sent in session,
on app mount and of course it's being sent in every request to server. Session can expire, then you will
get an appropriate message. When you authenticate, you will obtain JWT, and this JWT you obatain on every
app mount, when you have your authentication object held in server. It's being refreshed every 2 minutes,
when user is using app, also there is mechanism, which measures user's activity every one minute, so it will
sent simple ping to server, sustaining session. When there will be unexpected authentication errors - user
will be logged out and will need to authenticate again.
- on backend it uses authentication object, it uses UserDetailsService and UserPrincipal (with roles: USER, ADMIN)
to work with JWT Filter, also Authentication Manager for simple password auth,
- of course there is also CORS well configured, we use BCryptPasswordEncoder to hash passwords and
all possible security normes sticked with, fully integrated and configured with the highest care.

1.3 Frontend routes
- Combining two previous points, it uses BrowserRouter to manage routes. There is machanism, so on mount app
sents simple request (we use Axios for all requests) to server and it will tell it, if there is authentication
properly held in server: if not - only Public and Open routes are available for user, if it is - only Private
and Open routes are available and it works well, navigating user through paths.
- it mostly uses navigate from useNavigate, but also sometimes use <Link>, for better user experience, so he can
open some links in another window.

1.4 What you see when you authenticate (User account maintaince)
- when you authenticate you gain full functionality. You will first see your profile, with headers:
- My offers - there are your offers displayed, where you can manage them, edit, delete, see how many people diplayed
and how many followed
- Followed - there appear offers, that you follow
- Messages - there are all conversations you have with users, these are managed fully responsive, when other user writes -
you get notificated aumatically, thanks to WebSockets. Also users will be able to see if their receiver has seen message
and some more well mnanaged funcionality!
- Settings - there are your account settings, you can add your details, which will appear on every offer you have. You add:
Name - it is checked by Cloud Natural Language API, which checks if it's related to Person, resulting in simple check for
valid name
Phone - it uses libphonenumber, so it formats number automatically (by default it adds area code for Poland, but if you
provide other, will format number acordingly to it, e.g. Germany, USA and every else!)
City - it use Places API, so it will suggest place, when typing in and also check for its validity
Public button - it switches on/off contact details visibility
You can also change your password here, with fully responsive inputs, also you can delete your account (where you need to
confirm it by providing password or typing in simple phrase (OAuth2)
- Info where is app details basically
- Admin (only when user role has this role) - you will see offer reports here. App has moderation mechanism, which let user
report offer and then adming can check for any reports, then go to offer and simply delete it
- You will also see your username (which unfortunatelly you cannot change, for security reasons and to provide any bugs)
and profile pic, which you can add/delete. When you add profile pic, it is being first checked by Cloud Vision API for
any sensitive content, also it cannot exceed memory size. Then it is being sent to Cloud Storage and app only get link URL
saved.

1.5 Navbar (what you see all the time)
- You see app logo - it navigates you to Home page, which is simply displaing 3 random offers and just navigating user
through app
- Search Bar, which lets you type in any search value, which will serach through offers titles and finds you any offer you
query for. Next to it you have box button, which navigates you to Search filters themself, which we will talk about later.
- Add offer button - adding offer (will talk later)
- Login/Register button / User Info button. It lets user to navigate through basically account details, also let logout
and also provide DarkMode, which you can simply turn on/off
When app shrinks, options hide to left side bar, which you can unroll and it has same functionality. Also, when you are on
mobile device, there will be similar bar, but on the bottom

1.6 Fully responsive design
- I use Taiwind, which let me professionally design app fully responsive for every possible device. You can use it on PC 
on any mobile (smaller, bigger, doesn't matter, down to 320px wide). It uses different types of layout, everything to 
maintaing fully responsive. It detects either it is mobile or PC. This way all the animations are designed the way to
works on click and touch event and I prevented any bugs. Animatios are nicely done, they are creative I would say and 
I paid a lot time to do some
- there are live banners, which shows up to inform user (also cookie usage inform banner)
- LOADING animation which are nicely done to maintain perfect layout and great user experience
- Button anti-spam mechanisms - all buttons, which are performing any request sending, are being blocked foa a short period
of time to prevent any spam/bugs

1.7 More functionality
- You can add offers, which is pretty complex process - there are a lot custom-designed fields, which are fully responsive,
you'll be told if you have to provide any more info or if info is wrong, it is being validated a lot
- you will see which Contact Info you provided and you can change it so it will be displayed
- Images are maintaned nicely, you can either drag over and drop or simply click to add, then you can change its order,
- when adding offer, title and description are being checked by Perspective Comment Analyzer API for any toxicity, images
are being sent and saved on Cloud Storage
- you can edit offer, but you can do this every 5 minutes to prevent too much data flow going through
- when you search using Search Bar or Filters, offers will be queried using Specifications and returned using Pagination
- you can add filters, reset them, sort offer
- jumping onto offer - what you see is every info user has provided:
You see images added, which you can either swipe by dragging or just clicking. Also you can open images in a big screen.
As you can see over images, there are some icons. If you are offer's owner, there will be none, but if you watch other
user's offer, there will be flag on the left - when you click on, you can report offer. On the right there is hearth, so
you can follow offer. When you are admin, you will have trashcan on left, so you can delete offer, as a moderator.
Under images you have all offer information. On the right, you have title, price, time of adding offer and of course -
user information. App uses Maps JavaSript API to display Google map, based on location set previously in settings Contact Info.
There you have button, which clicking on you can either you can open conversation with user or you can edit offer - depends
if you are offer's owner
- Messages sending: 
- when you go to Messages, on the left you have conversations bar, on the right - choosen conversation
- when you've opened conversation with user, you can send message. User will get live - notification, because app uses WebSockets,
which you subscribe to message topic on initial. When you're not on conversation, there will be notification, when you're on
conversation - message will appear here. Also you've have message notification (conversation count) on navbar. When you click
to respond on input, that is trigger, which sends information that user has seen message. So when being on conversation, you
subscribe to message-seen topic. Also when message is not seen - accordingly it will be font-bold on conversations bar.
You can also delete conversation and block user.

1.8 Data management/flow
I've tried to use everything I could to make application and data maintance work fast and with no complications:
- as I mentioned before, it uses JPA and Hibernate to maintain Entities and data in DB. If you look at them, you will see that
they have multiple relations between. Sometimes I also use simple QUERIES in Repositories
- I decided to not hold whole images in my DB, so I hold them in Google Cloud Storage, I only hold links in my DB
- I use multiple technologies and APIs to prevent saving sensitive data (Perspective Comment Analyser API,
Cloud Natural Language API, Cloud Vision API), also I have admin moderation mechanism, which in any case can get reports from
users and can delete offer with inappropriate content
- I use multiple DTOs for data transfers
- Cleanups: I provide cleanups in case when user deletes offer or account, for example when offer is being deleted - it also
deletes that offer from other users followed offers and when account is being deleted - all offers are being deleted,
offers from users followed offers and also when user followed any offers and it counted as follow on them - it is being
substracted. Of course when deleting offer or account, all conversations and messages are being dropped as well. And of
course all images (profilePics, offerImages) are being deleted on Google Cloud Storage, according to specific folder names.  

1.9 Request/Response flow
On Frontend I use Services, which I have all of the API calls used. In here I use Error Handler, which based on status coming with 
response, throws specific errors. Then, I use those service api calls on other components, custom hooks or global providers and 
I log them here in catch blocks, looking for specific errors, that are being thrown by errorHandler. Sometimes I also ommit 
errorHandler and base on plain statuses. 
On Backend I use Controllers, which sent ResponseEntities with default, positive respose codes. If any exception is being thrown -
I have well-configured GlobalExceptionHandler, which catch any exceptions thrown by services and then returns appropriate 
error status code. I use a lot custom exceptions also. Overall logs in my app are well-maintainted and I put a lot of effort on
them.

2.0 Running App/Configuration
If you want to run app locally, you need to clone repo. I used java 22, it should work on it with no problems.
You need to have this type of configuration:

2.1 Resources/application.yml:

# Database Connection Configuration
spring:
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

  # SMTP Server Configuration (email sending)
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${EMAIL}
    password: ${EMAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

  # OAuth2 Configuration
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_ID}
            client-secret: ${GOOGLE_SECRET}

  # Google Cloud Storage and Vision Configuration
  cloud:
    gcp:
      project-id: ${GOOGLE_CLOUD_PROJECT}
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# Session Configuration (CSRF)
server:
  servlet:
    session:
      cookie:
        name: CSRF
      timeout: PT${SESSION_TIME:24}H

# Off DB Logs (broken ones)
logging:
  level:
    org.hibernate: warn
    com.zaxxer.hikari: warn

2.2 .env files

----------------------------Backend in root dir (same as dockerFile is atm.)-------------------------------------

#DATABASE
DATASOURCE_URL=
DATASOURCE_USER=
DATASOURCE_PASSWORD=

#FRONTEND
FRONTEND_URL= #by default you would use http://localhost:5173/

#SESSION LENGTH TIME IN HOURS
SESSION_TIME=

#JWT SECRET KEY
JWT_SECRET_KEY=

#EMAIL
EMAIL=
EMAIL_PASSWORD=

#OAUTH2-GOOGLE
GOOGLE_ID=
GOOGLE_SECRET=

#Google Cloud Storage and Vision
GOOGLE_APPLICATION_CREDENTIALS=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_BUCKET_NAME=

#Google Perspective API
PERSPECTIVE_API_KEY=

#Google Cloud Natural Language API
CLOUD_NATURAL_LANGUAGE_API_KEY=

#Google Places API
PLACES_API_KEY=


----------------------------Frontend in /frontend/-------------------------------------

VITE_BACKEND_URL= # by default you would put: http://localhost:8080/
VITE_MAPS_APIKEY=


2.3 Google Cloud Project

You need to open an Google Cloud project and add those APIS to you library:
- Cloud Storage
- Cloud Vision API
- Cloud Natural Language API
- Perspective Comment Analyzer API (you need to send request to use this outside, then can be added to Google)
- Places API (New)
- Maps JavaScript API
Then you need to set API Keys for Perspective, Cloud Natural Language, Places and Maps JavaScript APIs.

For Cloud Storage you need to configure service account with proper roles (can be owner) and make your bucket publicly accessible to read
by users. You need to properly put its credentials file in 
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

You will need to create configure OAuth2 Client (when running locally with http://localhost:5173 and http://localhost:8080/login/oauth2/code/google)

And when done so, you need to fill those .env files with all needed credentials. 

When putting that on server, there will be some modifications needed also. For example you need to set Cookies Secure: true in CookieService and also change
ws -> wss in WebSocket configuration. Also need to change configuration of OAuth2 in Google Cloud Project.

That is it basically. I've shown most important details. For any questions, contact me here or by mail: gontarek384@gmail.com

If you want to watch quick video overview, visit this video:

I prohibit and don't agree on using CARSOLD App commercially by any other entity or under any other's name. I am the only author I and reserve only rights 
to use CARSOLD App.










  
