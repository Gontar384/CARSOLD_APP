# 🚘 CARSOLD

**CARSOLD is a fullstack car advertising portal** - a feature-rich platform for browsing, listing, and managing vehicle offers, built with a strong emphasis on data validation and user safety.

Live project: **[carsold.pl](https://carsold.pl)**  
Demo: **[YouTube](https://www.youtube.com/watch?v=rXg3ulcCdlM)**

---

## ✨ Features

- Search and filter offers
- Display offer: images, car details and seller info
- Add, edit, delete offers
- Save offers to favourites
- Monitor own offers: track views and follows
- Real-time chat with other users (send messages, notifications, delete and block)
- Report offer
- Polish & English language support
- Register with e-mail confirmation or Google
- Authentication: login/password or Google OAuth2
- Password recovery via e-mail
- Edit profile: contact details and profile picture
- Change password, delete account
- Admin panel: review reports, verify and remove offers or accounts
- Fully responsive - works on every device

---

## 📸 Screenshots

<p align="center">
  <img src="./CARSOLD/screenshots/image1.png" width="49%" alt="FilterOffers" />
  <img src="./CARSOLD/screenshots/image2.png" width="49%" alt="DisplayOffer" />
</p>
<p align="center">
  <img src="./CARSOLD/screenshots/image3.png" width="49%" alt="AddOffer" />
  <img src="./CARSOLD/screenshots/image4.png" width="49%" alt="Chat" />
</p>
<p align="center">
  <img src="./CARSOLD/screenshots/image5.png" width="49%" alt="Authenticate" />
  <img src="./CARSOLD/screenshots/image6.png" width="49%" alt="Mobile" />
</p>

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Java, Spring Boot (Maven) |
| Database | PostgreSQL |
| Auth | Spring Security, JWT (HttpOnly cookies), OAuth2 (Google) |
| Storage | Google Cloud Storage (signed URLs) |
| Real-time | WebSocket |
| Content moderation | Cloud Vision API, Cloud Natural Language API |
| Location | Places API, Maps JavaScript API |
| Notifications | SMTP |
| Infrastructure | Docker |

---

## ⚙️ Local Setup

### Prerequisites
- Java 22+
- Node.js 20+
- PostgreSQL
- Google Cloud Project (GCP)

### 1. Clone the repository
IntelliJ IDEA recommended for the backend.

### 2. Configure GCP

**OAuth2 Client**
- Authorized JavaScript origins: `http://localhost:5173`
- Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
- Scopes: `userinfo.email`, `userinfo.profile`, `openid`
- Save **Client ID** and **Client Secret**

**Cloud Storage**
- Create a bucket (non-public, uniform access control)
- CORS: `origin: ["http://localhost:5173"], method: ["GET", "HEAD", "OPTIONS"]`
- Create a Service Account with **Storage Object Admin** role
- Generate `cloud-storage-key.json` and place it in `/resources`

**APIs to enable** (generate restricted API keys for each, set billing quotas):
- Cloud Vision API
- Cloud Natural Language API
- Places API (New)
- Maps JavaScript API (restrict to `http://localhost:5173`)

### 3. Generate JWT secret
```bash
head -c 32 /dev/urandom | base64
```

### 4. Configure environment

Backend - create `.env` in root:
```env
ENVIRONMENT=deployment

DATASOURCE_URL=
DATASOURCE_USER=
DATASOURCE_PASSWORD=

FRONTEND_URL=http://localhost:5173

SESSION_TIME=168
JWT_SECRET_KEY=

EMAIL=
EMAIL_PASSWORD=

GOOGLE_ID=
GOOGLE_SECRET=

GOOGLE_APPLICATION_CREDENTIALS=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_BUCKET_NAME=

CLOUD_NATURAL_LANGUAGE_API_KEY=
PLACES_API_KEY=
```

Frontend - create `.env` in `/frontend`:
```env
VITE_BACKEND_URL=http://localhost:8080
VITE_MAPS_APIKEY=
VITE_CONTACT_EMAIL=carsold.contact@gmail.com
```

### 5. Run

```bash
# Backend
mvn clean install

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is licensed under a custom non-commercial license.  
See the [LICENSE](./LICENSE) file for details.
