## Priva-Sync Recruitement Task Submission - Aditya Prakash Gupta

### About the app
This is my submission to the priva-sync summer project recruitment task. Every user gets one session to chat with the AI.
#### Flow of Creating the app
```
Backend -> Frontend -> Dockerization
```
#### Snapshots
<p align="center">
  <img src="https://pub-1407f82391df4ab19514180d4be76914.r2.dev/uploads/2e02804d-affc-41a1-8846-b76f3bb98759.png" width="45%" />
  <img src="https://pub-1407f82391df4ab19514180d4be76914.r2.dev/uploads/bb4f17a8-0b19-4c94-8cee-d50d97037f18.png" width="45%" />
</p>

<p align="center">
  <img src="https://pub-1407f82391df4ab19514180d4be76914.r2.dev/uploads/66182be2-da1c-4ef1-a2bc-8ebf00845018.png" width="45%" />
  <img src="https://pub-1407f82391df4ab19514180d4be76914.r2.dev/uploads/bc947b4c-01e3-4544-8ce8-aec7a8207455.png" width="45%" />
</p>

### Tech Stack
- Backend: `golang`, `gin`, `postgresql`, `gorm`, `cors`
- Authentication: `jwt`
- Frontend: `nextjs(typescript)`, `tailwindcss`
- API used: `Gemini`
- Containerization: `Docker`

### Running the Application Locally
After cloning the app into a remote repository run, add a `.env` file in the root directory which has
```
JWT_SECRET_KEY = secret_key
GEMINI_API_KEY = gemini_key
DATABASE_URL = postgres://postgres:password@postgres:5432/privasync
```
And then run
```
docker compose up --build
```

### Backend Endpoints
- `POST` `/signup`(unprotected) - Sends a username and password field, saves the user in the db, and responses 200 when success.
- `POST` `/login`(unprotected) - Sends a username and password field and responses with a Authorization bearer token which is used for overall protection of the app. Frontend saves it in the localstorage.
- `GET` `/me` - To obtain the username field
- `POST` `/chat` - User sends a message to the AI and the AI responses with its reponse and the session id.
- `GET` `/session` - Session id of the current session
- `GET` `/sessions/:id/messages` - Messages of the session

### Frontend Routes
- `/signup`(unprotected) - adds the user to the db and redirects to login
- `/login`(uprotected) - the user logs in and the bearer token is saved in localstorage
- `/` - The interface to chat or logout.

### Miscellanaeous Features
- The JWT token is valid only for 24 Hours.
- Browser keeps the cors permission valid for 12 hours only.
- AI content is converted into markdown format.
- Shows loading message when response is send by the user and disables the textbox and submitting while the response is being recieved.
