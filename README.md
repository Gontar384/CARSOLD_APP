[ENG]
# Hello World!

CAR$OLD is car advertising portal, build with purpose to be affordable for everyone. It's fullstack web application, written with
SpringBoot and React (TypeScript and Tailwind for styling), using PostgreSQL. Also this project is highly related with Google
Cloud Project, which it uses some APIs from and buckets. Let me walk you through, will try to keep it short!

Application is deployed at: [carsold.pl](https://carsold.pl)

## Functionalities
App is fully responsive, with all features working 100% well on PC and mobile. Visual layer is full of animationed components, 
and UI, UX features. It's available in two languages: polish and english. CAR$OLD base funtionalities includes:

### All users features
- search offers: user can use either navigation bar input or go to search page and use up to 20 filter options,
  including sorting;
- watch any offer: offer display has images, which can be viewed in normal or fullscreen mode. They can be swiped by
  dragging or by clicking on arrows, can be zoomed by scrolling or double-clicking in fullscreen (user may move display
  while zoomed). Under, there are some key car details. On the right there are more details and user contact information;
- change language;

### Authentication
- register (create an account): e-mail and username are validated (internal mechanisms and external API), password
  must meet requirements. User have to activate account, by clicking link he received via e-mail.
- authenticate: it is possible to login using e-mail or username;
- OAuth2: user can authenticate using Google OAuth2;
- password recovery: when password is forgotten, user provides e-mail and receive link to change password;

### Authenticated users features
- adding offer: user have to fill all required fields and meet the data details requirements. Can add up to 8 images
  in proper format. Imgages are initially checked by NSFW model and offer content is also checked by API. User may add
  up to 20 offers and may edit offer once per 5 minutes;
- profile picture change (validated by AI external API)
- My offers: place where user sees his offers, also monitors views and follows counts. They can be edited or deleted
  from here;
- Followed: there are offers followed by user;
- Messages: chats bar on the left and chat window on the right (user can write to others throught offer displays). It
  uses WebSockets, so messages appears imidiatelly. It is possible to delete conversation or block user.
- Settings: here it is possible to change contact details (Name, Phone number and Location, all validated by APIs)
  and set them public (may be displayed in user's every offer), also to change password or delete account;
- Admin (OPTIONAL FOR ADMIN ONLY): place where admins see reports, then can check potentially inappropriate offers;
- in offer display: authenticated user can report offer, follow or write to user. Admins can also delete inappropriate
  offer or even user;
- toggle dark mode;

### Data management and protection
CAR$OLD uses various way to manage data, following proffesional standards and best norms:
- all data are always checked initially in frontend and then in backend, including external APIs checks like:
  Perspective Comment Analyser, Cloud Natural Language, Cloud Vision, Places
- images are held in Google Cloud Storage, in app's database there are URLs only;
- objects has properly set relations;
- data flow and transfers are fully optimized and limited as possible;

### Security
- since it's SPA, session is fully stateless;
- it uses JWT, being transferred in httpOnly cookie with token itself renewed every 5 minutes and being checked
  by filted on every request;
- configured CORS;
- hashing passwords;
- OAuth2: configured success and failure handlers, also custom request repository to keep authenticating via Google
  by using token in httpOnly cookie to keep it fully stateless;
- when token is expired, user is being logged out;

### Request-Response flow
- request-response cycle is based on statuses and uses custom error handlers on frontend and backend to log
  errors/exceptions in a proffessional approach;
- DTOs for data transfers;
- antispam mechanisms;

### Tests
Tests for frontend (Jest) and backend (Mockito/SringBootTest) are inluded.

## Running locally
If you want to run CAR$OLD locally, you need to clone my repo. I recommend to do this using InteliiJ. It would work
properly with java 22. Apart from doing "npm install" for all React dependencies and installing maven dependencies,
you'll also have to:
- create key for JWT creation in format: Base64-encoded byte array;
- e-mail for SMTP (gmail recommended) and password (App passwords);
- database (PostgreSQL recommended) with URL, user and password;
- GCP with properly configured services:
1) OAuth2 with: Authorized JavaScript origins: `http://localhost:5173` and Authorized redirect URIs:
   `http://localhost:8080/login/oauth2/code/google`. Also non-sensitive scopes: ./auth/userinfo.email,
   ./auth/userinfo.profile, openid. Then you need Client ID and Client Secret;
2) service account for Cloud Storage and bucket created with such crucial settings: Public access: Public to internet,
   role allUsers: Storage Object Viewer and you'll need key in .json, which you should put in "resources" and also
   you need to put this configuration commands in Cloud Console:
   echo '[
   {
     "origin": ["*"], 
     "responseHeader": ["Content-Type"], 
     "method": ["GET", "HEAD", "OPTIONS"], 
     "maxAgeSeconds": 3600
   }
   ]' > cors.json
   gsutil cors set cors.json gs://your-bucket-name
4) Cloud Vision enabled;
5) Perspective Comment Analyser API access (to be granted on their page) and then API key for that;
6) Cloud Natural Language API key;
7) Places (New) API key;
8) Maps JavaScript API key;

### You'll need two .env files - for frontend and backend, filled with your environment variables:

Backend (in root)  

```
#Cookie(Secured): true = Secure cookie (HTTPS only)
DEPLOYMENT=false

#Database
DATASOURCE_URL=
DATASOURCE_USER=
DATASOURCE_PASSWORD=

FRONTEND_URL=http://localhost:5173

#JWT cookie expiration time
SESSION_TIME=168

JWT_SECRET_KEY=

#SMTP
EMAIL=
EMAIL_PASSWORD=

#OAuth2 - Google
GOOGLE_ID=
GOOGLE_SECRET=

#Google Cloud Storage and Vision
#GoogleCloudStorageJsonKeyAbsolutePath
GOOGLE_APPLICATION_CREDENTIALS=
#GoogleCloudProjectId
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_BUCKET_NAME=

#Google Perspective API
PERSPECTIVE_API_KEY=

#Google Cloud Natural Language API
CLOUD_NATURAL_LANGUAGE_API_KEY=

#Google Places API
PLACES_API_KEY=
```
Frontend (in /frontend root)

```
VITE_BACKEND_URL=http://localhost:8080
VITE_MAPS_APIKEY=
```

## CAR$OLD App is developed and owned solely by me
Commercial use, redistribution, or representation of this application under any individual, group, or organization is strictly not permitted.
You are welcome to view and explore the app in a non-commercial, read-only capacity.
All rights to manage, modify, distribute, or license CAR$OLD App are fully reserved by the author.
