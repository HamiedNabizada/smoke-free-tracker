# Installation ByeByeSmoke (Public Version)

## 1. Firebase Konfiguration mit .env

**WICHTIG:** Die Firebase Credentials werden NICHT auf GitHub gepushed!

### Setup (Einmalig):

1. Kopiere `.env.example` zu `.env`
   ```bash
   cp .env.example .env
   ```

2. Öffne `.env` und trage deine Firebase Credentials ein:
   ```bash
   FIREBASE_API_KEY=dein_api_key
   FIREBASE_AUTH_DOMAIN=dein_project.firebaseapp.com
   # ... etc
   ```

3. Generiere `js/firebase-config.js` aus der `.env`:
   ```bash
   php generate-firebase-config.php
   ```

### Webhook / Auto-Deployment:

Nach jedem `git pull` auf dem Server:
```bash
cd /pfad/zu/public
php generate-firebase-config.php
```

Du kannst das z.B. in einen Post-Receive Git Hook einbauen oder in dein Deployment Script.

**Die Dateien `.env` und `js/firebase-config.js` sind in `.gitignore` und werden NICHT committet!**

## 2. Firebase Firestore Security Rules

In der Firebase Console unter "Firestore Database > Rules":

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - nur eigene Daten lesbar/schreibbar
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Craving events - nur eigene Daten lesbar/schreibbar
    match /craving_events/{document=**} {
      allow read, write: if request.auth != null &&
                           resource.data.user_id == request.auth.uid;
    }
  }
}
```

## 3. Firebase Authentication

In der Firebase Console unter "Authentication":
- Email/Password Provider aktivieren

## 4. Deployment

Lade den kompletten `public/` Ordner auf deinen Webserver hoch.

**WICHTIG:** Stelle sicher, dass `js/firebase-config.js` auf dem Server vorhanden ist!

## 5. Sicherheit

- Die `js/firebase-config.js` muss auf dem Server existieren, aber NICHT auf GitHub
- Speichere die Firebase Credentials sicher (z.B. Password Manager)
- Die Firebase Security Rules schützen die Daten in der Cloud
