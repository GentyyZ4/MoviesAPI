# Filma25 · Expo + Flask + MySQL

The original HTML/CSS/JS project remains untouched in its own `Movies` folder. This project recreates its Filma25 design as a mobile Expo app and adds a Flask API backed by MySQL (phpMyAdmin-friendly).

## What is included

- Expo SDK 57 React Native interface: Home, Series, Coming Soon, movie details, profile, login/sign-up, plans, and contact form.
- Original poster artwork copied into `assets/movies/` for the mobile build.
- Flask API for the catalogue, accounts, favourites, contact messages, and subscription selection.
- MySQL schema plus a starter catalogue that can be imported directly through phpMyAdmin.
- Password hashes are stored with Werkzeug; passwords are never stored in clear text.

## 1. Create the database in phpMyAdmin

1. Open phpMyAdmin and choose **Import**.
2. Select [schema.sql](backend/schema.sql) and run it. It creates the `filma25` database, all tables, and starter movie records.
3. Copy `backend/.env.example` to `backend/.env` and set your own MySQL password. Leave `MYSQL_PASSWORD` empty only if your local root account has no password.

## 2. Start the Flask API

From the project folder in PowerShell:

```powershell
py -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python backend\app.py
```

Open `http://127.0.0.1:5000/api/health` to check the API. A successful response is `{"status":"ok","service":"filma25-api"}`.

## 3. Connect and start the Expo app

Set the address before starting Expo:

```powershell
# Android emulator
$env:EXPO_PUBLIC_API_URL = 'http://10.0.2.2:5000/api'

# Expo Go on a physical phone: replace with your PC's IPv4 address
# $env:EXPO_PUBLIC_API_URL = 'http://192.168.x.x:5000/api'

npx.cmd expo start
```

For a physical phone, the phone and computer must be on the same Wi-Fi network. If Windows asks, allow Python through the private-network firewall. The app intentionally displays the included catalogue until the API is reachable, so the UI remains presentable during setup.

## API routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Verify Flask/MySQL connection |
| GET | `/api/movies` | List the catalogue; accepts `type` or `collection` |
| GET | `/api/movies/:slug` | Fetch one title |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Sign in and get an access token |
| GET | `/api/me` | Get signed-in user |
| GET/POST/DELETE | `/api/favourites` | Manage a user’s favourites |
| POST | `/api/contact` | Save contact-form messages |
| POST | `/api/subscriptions` | Save basic, standard, or premium choice |

Protected routes use `Authorization: Bearer <token>`. The app manages this automatically after a successful sign-in.
