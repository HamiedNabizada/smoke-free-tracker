# ByeByeSmoke

**Dein digitaler Begleiter für ein rauchfreies Leben**

Eine Progressive Web App (PWA) zum Tracking deines rauchfreien Fortschritts mit Gesundheitsmeilensteinen, Statistiken und Tools zur Bewältigung von Verlangen.

🌐 **Live:** [byebyesmoke.de](https://byebyesmoke.de)

---

## Features

### Fortschritt & Statistiken
- **Live-Tracking**: Echtzeit-Updates für rauchfreie Tage, gespartes Geld und vermiedene Zigaretten
- **Visuelle Fortschrittsanzeige**: Wachsender Baum, sich füllendes Sparschwein und Zigaretten-Friedhof
- **Editierbare Ziele**: Passe deine Fortschrittsziele individuell an
- **Detaillierte Stats**: 8 verschiedene Statistik-Karten inklusive Lungengesundheit und gewonnener Lebenszeit

### Gesundheit & Motivation
- **28 Gesundheitsmeilensteine**: Von 20 Minuten bis 20 Jahren mit detaillierten Erklärungen
- **Health Avatar**: Animierte Visualisierung der Körper-Regeneration
- **"Was passiert JETZT"**: Zeigt aktuelle Regenerationsphase in Echtzeit
- **Tägliche Motivation**: Wechselnde motivierende Texte

### SOS & Hilfe
- **Craving-Timer**: 5-Minuten-Timer mit geführten Atemübungen
- **Verlangen-Statistik**: Tracking überwundener Cravings mit Kalender-Ansicht
- **Tipps gegen Verlangen**: 6 praktische Strategien
- **Shocking Facts**: 12 abschreckende Fakten über Rauchen

### Fortgeschrittene Features
- **Achievements-System**: Erfolge freischalten beim Erreichen von Meilensteinen
- **Goal Calculator**: Berechne Fortschritt nach Tagen oder Geld
- **Push-Benachrichtigungen**: Optional bei Meilensteinen und tägliche Motivation
- **Datenexport**: DSGVO-konform (JSON), Share-Funktion und Badge-Generator
- **Dark Mode**: Vollständiger Dark-Mode für alle Features
- **Tutorial**: Integrierte Anleitung mit PWA-Installationsguide

### Progressive Web App
- **Offline-fähig**: Funktioniert auch ohne Internetverbindung
- **Installierbar**: Als App auf Smartphone installieren (iOS & Android)
- **Responsive**: Optimiert für Mobile und Desktop

---

## Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6 Modules)
- **HTML5** & **CSS3**
- **Chart.js** für Diagramme
- **Service Worker** für PWA-Funktionalität

### Backend & Services
- **Firebase Authentication** (Email/Password)
- **Cloud Firestore** (NoSQL Database)
- **Firebase Hosting** (optional)

### Architektur
- Modular aufgebaut mit ES6 Modules
- Komponenten-basiertes CSS
- Client-side rendering
- Echtzeit-Synchronisation mit Firestore

---

## Installation & Setup

### 1. Repository klonen

```bash
git clone https://github.com/HamiedNabizada/smoke-free-tracker.git
cd smoke-free-tracker
```

### 2. Firebase Setup

1. Erstelle ein Firebase-Projekt: https://console.firebase.google.com
2. Aktiviere **Authentication** (Email/Password)
3. Erstelle eine **Firestore Database**
4. Kopiere die Firebase Config:

```bash
cp app/js/firebase-config.example.js app/js/firebase-config.js
```

5. Trage deine Firebase Credentials ein in `app/js/firebase-config.js`

### 3. Firestore Security Rules deployen

Kopiere den Inhalt von `firestore.rules` in Firebase Console → Firestore Database → Rules

### 4. Lokal testen

Da die App ES6 Modules verwendet, benötigst du einen lokalen Webserver:

```bash
# Mit Python
python -m http.server 8000

# Mit Node.js (http-server)
npx http-server

# Mit PHP
php -S localhost:8000
```

Öffne dann `http://localhost:8000/app/`

### 5. Demo-Account erstellen (optional)

Siehe `.claude/DEMO_ACCOUNT_SETUP.md` für Anleitung

---

## Deployment

### Netcup Webhook (aktuell)

Das Projekt ist für automatisches Deployment via Webhook konfiguriert:

1. Push zu GitHub
2. Webhook triggert automatisches Deployment
3. Live unter [byebyesmoke.de](https://byebyesmoke.de)

### Alternative: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Projekt-Struktur

```
/
├── index.html              # Landing Page
├── landing.css             # Landing Page Styles
├── app/                    # Haupt-App
│   ├── index.html         # App Dashboard
│   ├── login.html         # Login
│   ├── register.html      # Registrierung
│   ├── datenschutz.html   # Datenschutzerklärung
│   ├── impressum.html     # Impressum
│   ├── info.html          # Über die App
│   ├── styles.css         # CSS Import File
│   ├── service-worker.js  # PWA Service Worker
│   ├── manifest.json      # PWA Manifest
│   ├── js/
│   │   ├── app.js                    # Entry Point
│   │   ├── config.js                 # User Config
│   │   ├── firebase-config.js        # Firebase Credentials
│   │   ├── firebase-auth.js          # Auth Helper Functions
│   │   ├── data/                     # Static Data
│   │   │   ├── milestones.js        # 28 Health Milestones
│   │   │   ├── achievements.js      # Achievement Definitions
│   │   │   └── motivations.js       # Motivational Texts
│   │   ├── utils/
│   │   │   ├── calculations.js      # Stats Calculations
│   │   │   └── rate-limiter.js      # Login Rate Limiting
│   │   └── ui/                       # UI Modules
│   │       ├── dashboard.js
│   │       ├── tabs.js
│   │       ├── dark-mode.js
│   │       ├── milestones.js
│   │       ├── achievements.js
│   │       ├── statistics.js
│   │       ├── craving-timer.js
│   │       ├── craving-stats.js
│   │       ├── goal-calculator.js
│   │       ├── health-avatar.js
│   │       ├── progress-visuals.js
│   │       ├── progress-goals.js
│   │       ├── happening-now.js
│   │       ├── notifications.js
│   │       ├── tutorial.js
│   │       └── data-export.js
│   └── css/
│       ├── base.css
│       ├── layout.css
│       ├── dark-mode.css
│       ├── demo-mode.css
│       ├── responsive.css
│       └── components/           # Component-specific CSS
└── .claude/
    ├── CLAUDE.md                # Project Documentation
    ├── DEMO_ACCOUNT_SETUP.md    # Demo Account Guide
    └── FIRESTORE_RULES_DEPLOYMENT.md
```

---

## Sicherheit

### Implementierte Maßnahmen

- **Firestore Security Rules**: Server-seitige Zugriffskontrolle
- **Input Validation**: Client-seitig für alle User-Inputs
- **Rate Limiting**: 5 Login-Versuche, dann 5 Min Sperre
- **Content Security Policy**: XSS-Schutz via Meta-Tags
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **HTTPS Only**: Strenge HTTPS-Durchsetzung

### Keine Secrets im Code

Firebase Config ist öffentlich (nur Public API Keys). Die echte Sicherheit kommt von:
- Firestore Security Rules (serverseitig)
- Firebase Authentication

---

## Datenschutz (DSGVO)

- **Datenminimierung**: Nur notwendige Daten werden gespeichert
- **Datenexport**: User können alle Daten als JSON exportieren (Art. 15)
- **Account-Löschung**: Vollständige Datenlöschung möglich
- **Transparenz**: Datenschutzerklärung erklärt alle Datenverarbeitung
- **Keine Cookies**: Außer technisch notwendige (Firebase Session)

Gespeicherte Daten:
- Username, Rauchstopp-Datum
- Zigaretten/Tag, Preis/Packung
- Verlangen-Events (optional)
- Benachrichtigungs-Einstellungen

---

## Browser-Support

- Chrome/Edge (empfohlen)
- Firefox
- Safari (iOS & macOS)
- Alle modernen Browser mit ES6-Module-Support

---

## Lizenz

Dieses Projekt ist privat und nicht zur freien Verwendung lizenziert.

---

## Kontakt

**Entwickler:** Hamied Nabizada
**Website:** [byebyesmoke.de](https://byebyesmoke.de)

---

## Entwicklung

### Neue Features hinzufügen

1. Branch erstellen: `git checkout -b feature/mein-feature`
2. Entwickeln und testen
3. Committen: `git commit -m "Add feature"`
4. Pushen: `git push origin feature/mein-feature`
5. Pull Request erstellen

### Code-Style

- Keine Emojis in Code (nur in UI wenn explizit gewünscht)
- Einfache, menschliche Commit-Messages
- Modularität bevorzugen
- Über-Engineering vermeiden

### Wichtige Dateien

- `.claude/CLAUDE.md`: Vollständige Projektdokumentation für KI-Assistenten
- `firestore.rules`: Security Rules (muss deployed werden!)
- `.htaccess`: Server-Konfiguration mit Security Headers

---

## Roadmap

Mögliche zukünftige Features:
- Verlangen-Heatmap (Kalender mit Cravings)
- Tagebuch/Notizen-Funktion
- Mini-Games zur Ablenkung
- Anonymer User-Vergleich
- Persönliche Sparziele
- Motivations-Feed (User-Stories)

---

**Mit ❤️ entwickelt für alle die rauchfrei werden wollen**
