# Sicherheit

Uebersicht der implementierten Sicherheitsmassnahmen in ByeByeSmoke.

---

## Authentifizierung

### Firebase Authentication
- Email/Password Authentication
- Sichere Session-Verwaltung durch Firebase
- Automatische Token-Erneuerung

### Rate Limiting
- **5 Login-Versuche**, dann 5 Minuten Sperre
- Schuetzt vor Brute-Force-Angriffen
- Implementiert in `app/js/utils/rate-limiter.js`

---

## Datenzugriff

### Firestore Security Rules

Jeder User kann nur seine eigenen Daten lesen und schreiben:

```javascript
// Users Collection
match /users/{userId} {
  allow read, write: if request.auth != null
                     && request.auth.uid == userId;
}

// Craving Events
match /craving_events/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null
                && request.resource.data.user_id == request.auth.uid;
  allow update, delete: if request.auth != null
                        && resource.data.user_id == request.auth.uid;
}
```

### Input-Validierung

Server-seitige Validierung in Security Rules:
- Username: 3-50 Zeichen
- Cigarettes per Day: 1-200
- Craving Count: 1-1000
- Date Format: YYYY-MM-DD
- Preis: >= 0

---

## Web-Sicherheit

### Content Security Policy (CSP)

Definiert in `.htaccess`:

```apache
Content-Security-Policy: default-src 'self';
  script-src 'self' https://www.gstatic.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
```

### Weitere Security Headers

```apache
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### HTTPS

- Strenge HTTPS-Durchsetzung
- HSTS Header aktiv
- Automatische Weiterleitung von HTTP zu HTTPS

---

## Firebase API Keys

Die Firebase-Config im Frontend ist **absichtlich oeffentlich**. Das ist sicher weil:

1. **Keine geheimen Keys** - Nur oeffentliche Projekt-Identifier
2. **Schutz durch Security Rules** - Alle Daten sind server-seitig geschuetzt
3. **Authentication erforderlich** - Ohne Login kein Datenzugriff

Die echte Sicherheit kommt von:
- Firestore Security Rules (server-seitig)
- Firebase Authentication
- Input-Validierung

---

## Datenschutz (DSGVO)

### Datenminimierung
Nur notwendige Daten werden gespeichert:
- Username
- Rauchstopp-Datum
- Zigaretten/Tag, Preis/Packung
- Verlangen-Events (optional)
- Benachrichtigungs-Einstellungen

### Nutzerrechte

- **Auskunftsrecht (Art. 15):** Datenexport als JSON
- **Loeschrecht (Art. 17):** Vollstaendige Account-Loeschung
- **Datenportabilitaet (Art. 20):** Export aller Daten

### Cookies
Nur technisch notwendige Cookies:
- Firebase Session Token
- Keine Tracking-Cookies
- Keine Werbung

---

## Bekannte Einschraenkungen

### Client-Side Rendering
Die App rendert client-seitig. XSS-Schutz erfolgt durch:
- CSP Headers
- Kein `innerHTML` mit User-Input
- Firebase SDK sanitized automatisch

### LocalStorage
Einige Daten werden lokal gespeichert:
- Dark Mode Einstellung
- Taeglicher Craving-Counter
- Cache fuer Performance

Diese Daten sind nicht sensitiv und verbessern die Offline-Funktionalitaet.

---

## Security-Checkliste fuer Self-Hosting

- [ ] HTTPS mit gueltigem Zertifikat
- [ ] Firestore Security Rules deployed
- [ ] .htaccess mit Security Headers
- [ ] firebase-config.js nicht im Git-Repo
- [ ] Regelmaessige Firebase SDK Updates
- [ ] Monitoring in Firebase Console aktiviert

---

## Sicherheitslücke melden

Bei Sicherheitsproblemen bitte direkt Kontakt aufnehmen statt oeffentlich zu posten.

Kontakt: https://byebyesmoke.de/app/impressum.html
