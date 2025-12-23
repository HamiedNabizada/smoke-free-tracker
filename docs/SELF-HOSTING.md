# Self-Hosting Anleitung

Diese Anleitung beschreibt, wie du ByeByeSmoke auf deinem eigenen Server hosten kannst.

---

## Voraussetzungen

- Webserver (Apache, nginx, oder ähnlich)
- Firebase-Account (kostenlos)
- Git

---

## 1. Repository klonen

```bash
git clone https://github.com/HamiedNabizada/smoke-free-tracker.git
cd smoke-free-tracker
```

---

## 2. Firebase Projekt erstellen

1. Gehe zu https://console.firebase.google.com
2. Klicke auf "Projekt hinzufügen"
3. Gib einen Projektnamen ein (z.B. "mein-byebyesmoke")
4. Google Analytics ist optional

---

## 3. Firebase Authentication aktivieren

1. Im Firebase-Projekt: **Authentication** -> **Get started**
2. Tab **Sign-in method**
3. **Email/Password** aktivieren
4. Speichern

---

## 4. Cloud Firestore erstellen

1. **Firestore Database** -> **Create database**
2. **Start in production mode** wählen
3. Standort wählen (z.B. `europe-west3` für Deutschland)
4. Erstellen

---

## 5. Firebase Config einrichten

### Config-Datei erstellen

```bash
cp app/js/firebase-config.example.js app/js/firebase-config.js
```

### Credentials eintragen

1. Firebase Console -> Projekteinstellungen (Zahnrad-Icon)
2. Runterscrollen zu "Deine Apps"
3. **Web-App hinzufügen** (</> Icon)
4. App-Namen eingeben
5. Firebase-SDK Konfiguration kopieren

Trage die Werte in `app/js/firebase-config.js` ein:

```javascript
export const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "DEIN_PROJEKT.firebaseapp.com",
    projectId: "DEIN_PROJEKT",
    storageBucket: "DEIN_PROJEKT.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### Alternative: Umgebungsvariablen (.env)

Für mehr Sicherheit kannst du die Credentials über `.env` verwalten:

```bash
cp .env.example .env
```

Dann `generate-firebase-config.php` nutzen um die Config zu generieren.

---

## 6. Firestore Security Rules deployen

### Option A: Firebase Console (einfach)

1. Firebase Console -> **Firestore Database** -> **Rules**
2. Kopiere den Inhalt aus `firestore.rules`
3. Einfügen und **Veröffentlichen**

---

### Option B: Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

---

## 7. Composite Index erstellen

Die App benötigt einen Index für Craving-Queries:

1. Firebase Console -> **Firestore Database** -> **Indexes**
2. **Composite** Tab -> **Create Index**
3. Konfiguration:
   - Collection: `craving_events`
   - Fields:
     - `user_id` - Ascending
     - `date` - Ascending
4. **Create**

Alternativ: Beim ersten Fehler in der Browser-Console erscheint ein Link zum automatischen Erstellen.

---

## 8. Auf Webserver deployen

Lade den kompletten Ordner auf deinen Webserver:

```bash
# Via FTP/SFTP
scp -r . user@server:/var/www/byebyesmoke/

# Oder via rsync
rsync -avz --exclude='.git' --exclude='node_modules' . user@server:/var/www/byebyesmoke/
```

**Wichtig:** `app/js/firebase-config.js` muss auf dem Server vorhanden sein!

---

## 9. HTTPS einrichten

Die App benötigt HTTPS für:
- Service Worker (PWA)
- Sichere Firebase-Verbindung

Mit Let's Encrypt (kostenlos):

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-apache

# Zertifikat erstellen
sudo certbot --apache -d deine-domain.de
```

---

## 10. Testen

1. Öffne `https://deine-domain.de/app/`
2. Registriere einen Test-Account
3. Prüfe ob alle Features funktionieren:
   - Dashboard lädt
   - Dark Mode funktioniert
   - Craving-Timer zählt
   - Daten werden gespeichert

---

## Demo-Account einrichten (optional)

Für eine "Erst mal ausprobieren"-Funktion:

### 1. User in Firebase erstellen

1. Firebase Console -> **Authentication** -> **Users** -> **Add user**
2. Email: `demo@deine-domain.de`
3. Passwort: `demo123456`

### 2. User-Dokument in Firestore erstellen

1. **Firestore Database** -> **users** -> **Add document**
2. Document ID: Die UID aus Schritt 1
3. Felder:

| Feld | Typ | Wert |
|------|-----|------|
| username | string | `Demo-Benutzer` |
| quit_date | string | `2025-11-20T10:00:00.000Z` |
| cigarettes_per_day | number | `15` |
| price_per_pack | number | `8` |
| cigarettes_per_pack | number | `20` |
| notifications_enabled | boolean | `false` |

Der Demo-Account ist automatisch schreibgeschützt.

---

## Alternative: Firebase Hosting

Statt eigenem Server kannst du auch Firebase Hosting nutzen:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Wähle: app/ als public directory
# Single-page app: No
firebase deploy
```

---

## Troubleshooting

### "Missing permissions" Fehler

- Security Rules nicht deployed
- User nicht eingeloggt
- Falscher Firebase-Projekt-Key

### Module laden nicht

- App muss über HTTP/HTTPS laufen, nicht `file://`
- Webserver korrekt konfiguriert?

### PWA installiert nicht

- HTTPS erforderlich
- `manifest.json` erreichbar?
- Service Worker registriert?

### Craving-Daten werden nicht gespeichert

- Composite Index erstellt?
- Security Rules erlauben Schreibzugriff?

---

## Updates einspielen

```bash
cd /var/www/byebyesmoke
git pull origin master
# firebase-config.js bleibt erhalten (in .gitignore)
```

Bei Security Rules Änderungen: Erneut deployen.
