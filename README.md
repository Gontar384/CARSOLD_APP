## [ENG]
# Hello World!

CAR$OLD is car advertising portal, build to be affordable for everyone. It's fullstack web application, written with
SpringBoot (Java) and React (TypeScript and Tailwind for styling), using PostgreSQL as database. It's highly related to
Google Cloud Project, because it uses its APIs and buckets to validate and store data. Running app locally is possible
and I'll show you a full tutorial towards the end of this text. However it takes up some time to set up and I can confidently
recommend visiting the site instead, where you can test it!

### Application is currently available at: [carsold.pl](https://carsold.pl/search?page=0&size=10)
deployed using Render(backend), Netlify(frontend) and Neon(database)

![Search](https://storage.googleapis.com/carsold-app-imgs-test/config/img1.png)
 
### App presentation video: [youtube.com](https://www.youtube.com/watch?v=rXg3ulcCdlM)

It's utterly responsive, with all features working 100% correctly on PC and mobile. Visual layer is full of animated components, 
and UI/UX features. It's available in two languages: polish and english. 

Let me shortly walk you through its functionality!

### Unauthorized user features
- Searching offers: user can either use navigation bar input or go to search page and use up to 20 filter options, sorting included;
- Watching any offer: offer display shows images, which can be viewed in normal or fullscreen mode, which is fully interactive.
  Below, there are some key car details. On the right, there are more details and user contact information;
- Changing language (Polish and English available);

![SearchUsingFilters](https://storage.googleapis.com/carsold-app-imgs-test/config/img2.png)

### Authentication
- Registration (creating an account): e-mail and username are validated (internal mechanisms and external API), password
  must meet requirements. User has to activate account, by clicking link he's received via e-mail;
- Authentication: it's possible to login using e-mail or username;
- OAuth2: user can authenticate via Google OAuth2;
- Password recovery: when password is forgotten, user may provide e-mail address and then he'll receive message with link
  to change his password;

![Authentication](https://storage.googleapis.com/carsold-app-imgs-test/config/img3.png)  

### Authorized user features
- Adding offer: user can add offer by filling all required fields in form and must meet all data requirements. It is possible
  to add up to 8 images per offer. Image size (max. 5MB) and format are validated, they are also initially checked by
  NSFW model and offer content is scanned for toxic content by external API. User may add up to 20 offers and edit each offer once
  per 5 minutes;
- Changing profile picture (image is validated for inappropriate content by AI external API);
- My offers: place where user sees his offers, also monitors views and follows counts for each. They can be edited or deleted
  from here;
- Followed: there are offers user has followed;
- Messages: chats bar on the left and chat window on the right (user can write to others, starting conversation through offer
  display). It uses WebSockets, so messages appears immediately, also it tells if interlocutor has seen last message. It is
  possible to delete conversation or block user. If user is not in this tab, he'll get a notification when receiving a message;
- Settings: here it's possible to change contact details (Name, Phone number and Location, all validated by APIs)
  and set them public (to be displayed in user's every offer), it's also possible to change password or delete account;
- Admin (for ADMIN display and use only): place where admin sees other users' reports and he can verify any potentially
  inappropriate offer;
- In Offer display: user can report offer, follow it or write to seller. Admins can delete offer or user from here;
- toggling dark mode;

![OfferDisplay](https://storage.googleapis.com/carsold-app-imgs-test/config/img4.png)
![AccountDetails](https://storage.googleapis.com/carsold-app-imgs-test/config/img5.png)
![OfferForm](https://storage.googleapis.com/carsold-app-imgs-test/config/img6.png)
![Messages](https://storage.googleapis.com/carsold-app-imgs-test/config/img7.png)

### Secure data management
- CAR$OLD uses various ways to manage and protect data, following professional standards and best norms:
- All data are always checked initially in frontend and backend, including external APIs checks like:
  Perspective Comment Analyser, Cloud Natural Language, Cloud Vision, Places;
- Reporting mechanism: user is always able to report inappropriate offer, so then admin can verify and delete it
  or even delete seller's account if necessary;
- Images are held in Google Cloud Storage, there are only ULRs on app's database;
- It uses DTOs for data transfers;
- Database has normalized structures;
- Data flow is fully optimized;

### User account security
- Since it's SPA (Single Page Application), it's completely stateless: no server-side sessions and no CSRF token is used;
- JWT is generated using a secure Base64-encoded HMAC key and stored in HttpOnly cookie to prevent XSS. Token is renewed
  every 5 minutes and user will be informed and logged out when it expires;
- CORS is properly configured, and with cookies set as Secure and SameSite=Lax, this mitigates CSRF risks;
- OAuth2 login is implemented with custom success and failure handlers, and a custom authorization request
  repository, which creates Google token, essential for Google authorization. It let application stay totally
  stateless even then. After OAuth2 authentication, JWT is still issued and stored in HttpOnly cookie;
- External APIs and services have separate access keys that are securely provided via environment variables;
- Passwords are stored in a hashed form using BCryptEncoder;

### Request-Response flow
- Follows REST standards;
- Uses the best error/exception logging practices, by having error handlers for frontend and backend;
- Includes anti-spam mechanisms and is optimized for performance and efficiency;

### Tests
The project includes unit tests for the frontend (Jest) and both unit and integration tests for the backend (Mockito and SpringBootTest).

## Running locally
If you want to run CAR$OLD locally, you should clone my repo. I recommend to use InteliiJ. It would work properly with
Java 22 and Node 22.11.0. Apart from doing ```npm install``` for all React dependencies and installing Maven dependencies,
you'll have to:
- Create key for JWT creation: Base64-encoded byte array format;
- Provide e-mail for SMTP (gmail recommended) and password (App passwords);
- Database (PostgreSQL recommended) with its URL, user and password;
- GCP with properly configured services:
1) OAuth2 with: Authorized JavaScript origins: `http://localhost:5173` and Authorized redirect URIs:
   `http://localhost:8080/login/oauth2/code/google`. Also non-sensitive scopes set like: ./auth/userinfo.email,
   ./auth/userinfo.profile, openid. Then you need Client ID and Client Secret;
2) Service account for Cloud Storage and bucket created with such settings: "Public access: Public to internet",
   role "allUsers: Storage Object Viewer" and you'll need key in .json file, which you should put in app resources.
   It is also necessary to put this configuration commands in Cloud Console for CORS configuration:
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
5) Perspective Comment Analyser API access (to be granted on their page) and then API key for it;
6) Cloud Natural Language API key;
7) Places (New) API key;
8) Maps JavaScript API key;

### You'll need two .env files - for frontend and backend, filled with those environment variables:

Backend (located in root, next to src)  

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

#OAuth2-Google
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
Then you must put path to .env file in app run configuration.

Frontend (located in /frontend)

```
VITE_BACKEND_URL=http://localhost:8080
VITE_MAPS_APIKEY=
VITE_CONTACT_EMAIL=carsold.contact@gmail.com
```

Then run ```npm run dev``` in the terminal inside the /frontend directory (React) and start the CarsoldApplication class (Spring Boot).

The project includes a Dockerfile used for containerizing the backend (Spring Boot). It's primarily used for deploying the application, 
but it can also be used to run the backend locally. You still need to provide a .env file with the required environment variables.

## CAR$OLD App is developed and owned solely by me
Commercial use, redistribution, or representation of this application under any individual, group, or organization is strictly 
not permitted. You are welcome to view and explore the app in a non-commercial, read-only capacity.
All rights to manage, modify, distribute, or license CAR$OLD App are fully reserved by the author.

## [POL]
# Witam wszystkich!

CAR$OLD to samochodowy portal ogłoszeniowy, stworzony z myślą o tym, by był dostępny dla każdego. To pełnoprawna aplikacja
webowa (fullstack), napisana w Spring Boot (Java) i React (TypeScript + Tailwind CSS), z bazą danych PostgreSQL. Projekt jest mocno
zintegrowany z Google Cloud, wykorzystując jego API oraz zasoby, takie jak buckety, do walidacji i przetrzymywania danych. 
Uruchomienie aplikacji lokalnie jest możliwe i dalej pokażę, jak to zrobić. Jednakże zajmuje to sporo czasu, dlatego mocno rekomenduję
odwiedzenie strony internetowej, gdzie można ją przetestować!

### Aplikacja jest dostępna pod adresem: [carsold.pl](https://carsold.pl/search?page=0&size=10)
wdrożona przy użyciu Render(backend), Netlify(frontend) i Neon(baza danych)

### Wideo prezentujące aplikację: [youtube.com](https://www.youtube.com/watch?v=ImOQ-unvxQ0)

Jest ona w pełni responsywna, a wszystkie funkcje działają w 100% poprawnie na komputerach i urządzeniach mobilnych. Interfejs 
użytkownika zawiera wiele animowanych komponentów i rozwiązań UX/UI. Aplikacja dostępna jest w dwóch językach: polskim i angielskim.

Pozwól, że krótko Ci przedstawię jej funkcjonalność!

### Funkcjonalność dla użytkownika niezalogowanego
- Wyszukiwanie ofert: można korzystać z wyszukiwarki w pasku nawigacyjnym lub przejść na stronę wyszukiwania i użyć do 20 różnych
  filtrów, wraz z sortowaniem;
- Podgląd oferty: każda zawiera zdjęcia (zwykły podgląd lub pełnoekranowy, interaktywny), podstawowe dane techniczne auta,
  a po prawej dodatkowe szczegóły oraz dane kontaktowe sprzedawcy;
- Zmiana języka interfejsu (język polski i angielski);

### Uwierzytelnianie
- Rejestracja: adres e-mail oraz nazwa użytkownika są weryfikowane (zarówno wewnętrznie, jak i z pomocą zewnętrznych API). Hasło musi
  spełniać określone wymagania. Aktywacja konta następuje poprzez kliknięcie w link otrzymany e-mailem;
- Logowanie: możliwe przez e-mail lub nazwę użytkownika;
- OAuth2 (Google): logowanie z wykorzystaniem konta Google;
- Resetowanie hasła: możliwość odzyskania dostępu poprzez e-mail i link resetujący;

### Funkcjonalność dla użytkownika zalogowanego
- Dodawanie oferty: wypełnienie formularza z wymaganymi danymi, walidacja zdjęć (do 8, maks. 5MB każde, formaty plików). Oferta
  przechodzi wstępną weryfikację przez AI (modele NSFW i analiza treści). Użytkownik może mieć ich maks. 20 i edytować każdą raz
  na 5 minut;
- Zmiana zdjęcia profilowego (obrazek jest analizowany pod kątem nieodpowiednich treści przez zewnętrzne API AI);
- Moje oferty: lista własnych ofert z licznikami wyświetleń i obserwacji, z możliwością edycji i usuwania;
- Ulubione: lista śledzonych ofert;
- Wiadomości: lewy panel z czatami, prawy z wybraną konwersacją. Wiadomości są wysyłane w czasie rzeczywistym (WebSockety)
  i zawierają informację o przeczytaniu przez rozmówcę. Można usuwać rozmowy i blokować użytkowników. Gdy użytkownik nie jest na
  tej zakładce, a ktoś do niego napisze, przychodzi mu powiadomienie;
- Ustawienia: zmiana danych kontaktowych (Imię, Numer telefonu, Lokalizacja – walidowane przez API), możliwość ich udostępnienia we
  wszystkich ofertach. Można także zmienić hasło i usunąć konto;
- Admin (panel administratora, tylko dla kont ADMIN): dostęp do zgłoszeń innych użytkowników i możliwość weryfikacji ofert pod
  kątem naruszeń;
- W podglądzie oferty: użytkownik może zgłosić, śledzić ofertę lub napisać do sprzedającego. Admin może usunąć ogłoszenie
  lub konto użytkownika;
- Tryb ciemny (dark mode);

### Bezpieczne zarządzanie danymi
- CAR$OLD korzysta z profesjonalnych standardów w zakresie ochrony danych:
- Dane są walidowane zarówno po stronie frontendu, jak i backendu, z użyciem zewnętrznych API jak:
  Perspective Comment Analyser, Cloud Natural Language, Cloud Vision, Places;
- Mechanizm zgłaszania ofert: każdy użytkownik może zgłosić ofertę, a administrator ma możliwość jej weryfikacji i ewentualnego
  usunięcia;
- Zdjęcia są przechowywane w Google Cloud Storage, w bazie znajdują się tylko ich URL-e;
- Wymiana danych opiera się na DTO;
- Struktura bazy danych jest znormalizowana;
- Przepływ danych jest zoptymalizowany;

### Bezpieczeństwo konta użytkownika
- Aplikacja jest typu SPA (Single Page Application), dlatego działa całkowicie bezstanowo i nie wykorzystuje sesji
  po stronie serwera ani tokenów CSRF;
- JWT jest generowany przy pomocy zabezpieczonego, Base64-enkodowanego klucza HMAC i przechowywany w ciasteczku HttpOnly,
  co zapobiega atakom XSS. Token odnawia się co 5 minut, a po jego wygaśnięciu użytkownik zostaje poinformowany i wylogowany;
- CORS jest poprawnie skonfigurowany, co w połączeniu z ciasteczkami ustawionymi na Secure i SameSite=Lax minimalizuje
  ryzyko ataków CSRF;
- OAuth2 z własnymi handlerami oraz customowym request repository, dzięki któremu token potrzebny do autoryzacji Google
  jest tworzony i przesyłany jako HttpOnly cookie, przez co zachowujemy bezstanowość. Po pomyślnej autoryzacji OAuth2,
  token JWT również jest wydawany i zapisywany w ciasteczku HttpOnly;
- Zewnętrzne API oraz serwisy mają oddzielne klucze dostępu, które są bezpiecznie przekazywane przez zmienne środowiskowe;
- Hasła są przechowywane w postaci zhaszowanej przy użyciu BCryptEncodera;

### Przepływ HTTP request–response
- Wykorzystuje standardy REST;
- Stosuje najlepsze praktyki logowania błędów i wyjątków, dzięki obsłudze błędów po stronie frontendu i backendu;
- Zawiera mechanizmy antyspamowe i ogólnie optymalizuje cały proces;

### Testy
Projekt zawiera testy jednostkowe dla frontendu (Jest) oraz testy jednostkowe i integracyjne dla backendu (Mockito, SpringBootTest).

### Uruchamianie lokalnie
Jeśli chcesz uruchomić projekt lokalnie, sklonuj repozytorium. Zalecam użycie IntelliJ z Java 22 oraz Node 22.11.0. Oprócz
uruchomienia ```npm install``` dla zależności Reacta i instalacji zależności Mavena, należy: 
- Utworzyć klucz JWT w formacie Base64-encoded byte array;
- Podać dane logowania SMTP (zalecane Gmail i hasło aplikacji);
- Skonfigurować bazę danych (zalecane PostgreSQL) z URL, loginem i hasłem;
- Utworzyć projekt na Google Cloud z aktywnymi usługami:
1) OAuth2 z ustawieniami: Authorized JavaScript origins: `http://localhost:5173` oraz Authorized redirect URIs:
   `http://localhost:8080/login/oauth2/code/google` oraz non-sensitive scopes: ./auth/userinfo.email,
   ./auth/userinfo.profile, openid. Dodatkowo, potrzebujesz Client ID i Client Secret;
2) Konto serwisowe do Google Cloud Storage + bucket z ustawieniami: "Public access: Public to internet",
   role "allUsers: Storage Object Viewer" oraz dodać klucz w pliku .json do folderu resources w aplikacji. 
   W konsoli Google Cloud należy wykonać konfigurację CORS:
   echo '[
   {
     "origin": ["*"], 
     "responseHeader": ["Content-Type"], 
     "method": ["GET", "HEAD", "OPTIONS"], 
     "maxAgeSeconds": 3600
   }
   ]' > cors.json
   gsutil cors set cors.json gs://nazwa-twojego-bucketa
3) Włączyć Cloud Vision;
4) Uzyskać dostęp (na stronie API) oraz klucz do Perspective Comment Analyser API;
5) Klucz do Cloud Natural Language API;
6) Klucz do Google Places API;
7) Klucz do Maps JavaScript API;

### Potrzebujesz dwóch plików .env – dla frontendu i backendu:

Backend (w katalogu głównym, obok src):
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

#OAuth2-Google
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
Należy umieścić path do .env w konfiguracji uruchamiania aplikacji.

Frontend (w folderze /frontend):
```
VITE_BACKEND_URL=http://localhost:8080
VITE_MAPS_APIKEY=
VITE_CONTACT_EMAIL=carsold.contact@gmail.com
```

Następnie należy wpisać ```npm run dev``` w terminalu w katalogu /frontend (React) i uruchomić klasę CarsoldApplication (Spring Boot).

Projekt zawiera Dockerfile służący do konteneryzacji backendu(Spring Boot). Jest on wykorzystywany do deployowania aplikacji, ale można
go także użyć do lokalnego uruchomienia backendu. Wciąż jednak musimy zapewnić plik .env ze zmiennymi środowiskowymi.

## Aplikacja CAR$OLD została stworzona przeze mnie i jest w pełni moją właśnością
Zabraniam wszelkiego komercyjnego użycia, redystrybucji lub reprezentowania tej aplikacji przez osoby trzecie.
Zachęcam do przeglądania i testowania aplikacji wyłącznie w celach niekomercyjnych.
Wszelkie prawa do zarządzania, modyfikacji, dystrybucji i licencjonowania aplikacji CAR$OLD są przeze mnie zastrzeżone.
