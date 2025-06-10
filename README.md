## [ENG]
# Hello World!

CAR$OLD is car advertising portal, build to be affordable for everyone. It's fullstack web application, written with
SpringBoot (Java) and React (TypeScript and Tailwind for styling), using PostgreSQL as database. Project is highly connected with
Google Cloud Project, which it uses APIs and buckets from. Let me shortly walk you through!

Application is deployed at: [carsold.pl](https://carsold.pl)

It's utterly responsive, with all features working 100% correctly on PC and mobile. Visual layer is full of animated components, 
and UI/UX features. It's available in two languages: polish and english.

### Unauthorized user features
- Searching offers: user can either use navigation bar input or go to search page and use up to 20 filter options, sorting included;
- Watching any offer: offer display shows images, which can be viewed in normal or fullscreen mode, which is fully interactive.
  Below, there are some key car details. On the right, there are more details and user contact information;
- Changing language;

### Authentication
- Registration (creating an account): e-mail and username are validated (internal mechanisms and external API), password
  must meet requirements. User has to activate account, by clicking link he's received via e-mail;
- Authentication: it's possible to login using e-mail or username;
- OAuth2: user can authenticate via Google OAuth2;
- Password recovery: when password is forgotten, user may provide e-mail address and then he'll receive message with link
  to change his password;

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

### Data management and protection
CAR$OLD uses various ways to manage and protect data, following professional standards and best norms:
- All data are always checked initially in frontend and backend, including external APIs checks like:
  Perspective Comment Analyser, Cloud Natural Language, Cloud Vision, Places;
- Reporting mechanism: user is always able to report inappropriate offer, so then admin can verify and delete it
  or even delete seller's account if necessary;
- Images are held in Google Cloud Storage, there are only ULRs on app's database;
- It uses DTOs for data transfers;
- Database has normalized structures;
- Data flow is fully optimized;

### Security
- Since it's SPA, session is completely stateless;
- Uses JWT, being transferred in httpOnly cookie. Token renews every 5 minutes and is checked by filter on every request;
- Has properly configured CORS;
- Passwords are hashed;
- OAuth2: has success and failure handlers, also custom request repository, which creates Google's token for
  authorization process in httpOnly cookie, to keep app entirely stateless;
- When token expires, user will be informed and logged out;

### Request-Response flow
- Follows REST standards;
- Uses the best error/exception logging practices, by having error handlers for frontend and backend;
- Includes anti-spam mechanisms and is optimized for performance and efficiency;

### Tests
Tests for frontend (Jest) and backend (Mockito/SringBootTest) are included.

## Running locally
If you want to run CAR$OLD locally, you should clone my repo. I recommend to run it in InteliiJ. It would work
properly with java 22. Apart from doing "npm install" for all React dependencies and installing maven dependencies,
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
Then you should put path to .env file in app run configuration.

Frontend (located in /frontend)

```
VITE_BACKEND_URL=http://localhost:8080
VITE_MAPS_APIKEY=
VITE_CONTACT_EMAIL=carsold.contact@gmail.com
```

## CAR$OLD App is developed and owned solely by me
Commercial use, redistribution, or representation of this application under any individual, group, or organization is strictly 
not permitted. You are welcome to view and explore the app in a non-commercial, read-only capacity.
All rights to manage, modify, distribute, or license CAR$OLD App are fully reserved by the author.

## [POL]
# Witaj Świecie!

CAR$OLD to samochodowy portal ogłoszeniowy, stworzony z myślą o tym, by był dostępny dla każdego. To pełnoprawna aplikacja
webowa (fullstack),napisana w Spring Boot (Java) i React (TypeScript + Tailwind CSS), z bazą danych PostgreSQL. Projekt jest mocno
zintegrowany z Google Cloud, wykorzystując jego API oraz zasoby (bucket-y). Pozwól, że krótko Ci go przedstawię!

Aplikacja jest dostępna pod adresem: [carsold.pl](https://carsold.pl)

Jest w pełni responsywna, a wszystkie funkcje działają w 100% poprawnie na komputerach i urządzeniach mobilnych. Interfejs 
użytkownika zawiera wiele animowanych komponentów i rozwiązań UX/UI. Aplikacja dostępna jest w dwóch językach: polskim i angielskim.

### Funkcjonalność dla użytkownika niezalogowanego
- Wyszukiwanie ofert: można korzystać z wyszukiwarki w pasku nawigacyjnym lub przejść na stronę wyszukiwania i użyć do 20 różnych
  filtrów, wraz z sortowaniem;
- Podgląd oferty: każda zawiera zdjęcia (zwykły podgląd lub pełnoekranowy, interaktywny), podstawowe dane techniczne auta,
  a po prawej dodatkowe szczegóły oraz dane kontaktowe sprzedawcy;
- Zmiana języka interfejsu;

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

### Zarządzanie i ochrona danych
CAR$OLD korzysta z profesjonalnych standardów w zakresie ochrony danych:
- Dane są walidowane zarówno po stronie frontendu, jak i backendu, z użyciem zewnętrznych API jak:
  Perspective Comment Analyser, Cloud Natural Language, Cloud Vision, Places;
- Mechanizm zgłaszania ofert: każdy użytkownik może zgłosić ofertę, a administrator ma możliwość jej weryfikacji i ewentualnego
  usunięcia;
- Zdjęcia są przechowywane w Google Cloud Storage, w bazie znajdują się tylko ich URL-e;
- Wymiana danych opiera się na DTO;
- Struktura bazy danych jest znormalizowana;
- Przepływ danych jest zoptymalizowany;

### Bezpieczeństwo
- Aplikacja działa jako SPA, więc backend i autoryzacja nie bazuje na sesji;
- JWT jest przesyłany w httpOnly cookie, odświeżany co 5 minut i weryfikowany przy każdym żądaniu;
- Poprawnie skonfigurowany CORS;
- Hasła są szyfrowane;
- OAuth2 z własnymi handlerami oraz customowym request repository, token Google jest przesyłany jako httpOnly cookie
  podczas autentykacji, by zachować bezstanowość aplikacji;
- Po wygaśnięciu tokena użytkownik zostaje automatycznie wylogowany;

### Przepływ request-response
- Wykorzystuje standardy REST;
- Stosuje najlepsze praktyki logowania błędów i wyjątków, dzięki obsłudze błędów po stronie frontendu i backendu;
- Zawiera mechanizmy antyspamowe i ogólnie optymalizuje cały proces.

### Testy
Projekt zawiera testy dla frontendu (Jest) oraz backendu (Mockito/SpringBootTest).

### Uruchamianie lokalnie
Jeśli chcesz uruchomić projekt lokalnie, sklonuj repozytorium. Zalecam uruchamianie w IntelliJ z użyciem Javy 22. Oprócz
uruchomienia "npm install" dla zależności Reacta oraz instalacji zależności Maven, należy: 
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

## Aplikacja CAR$OLD została stworzona przeze mnie i jest w pełni moją właśnością
Zabraniam wszelkiego komercyjnego użycia, redystrybucji lub reprezentowania tej aplikacji przez osoby trzecie.
Zachęcam do przeglądania i testowania aplikacji wyłącznie w celach niekomercyjnych.
Wszelkie prawa do zarządzania, modyfikacji, dystrybucji i licencjonowania aplikacji CAR$OLD są przeze mnie zastrzeżone.
