# Entwickler-Dokumentation

Technische Dokumentation für Entwickler, die am Projekt arbeiten oder es verstehen wollen.

---

## Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6 Modules)
- **HTML5** & **CSS3**
- **Chart.js** (via CDN) - Diagramme
- **Service Worker** - PWA/Offline-Funktionalität

### Backend & Services
- **Firebase Authentication** (Email/Password)
- **Cloud Firestore** (NoSQL Database)
- **netcup** (Hosting mit Webhook-Deployment)

---

## Architektur

### Prinzipien
- Modular aufgebaut mit ES6 Modules
- Komponenten-basiertes CSS
- Client-side Rendering
- Echtzeit-Synchronisation mit Firestore
- Offline-First mit Service Worker

### Module-System
Alle JavaScript-Dateien nutzen `import`/`export`. Die App funktioniert nur über HTTP/HTTPS (nicht `file://`).

**Entry Point:** `app/js/app.js`

---

## Projektstruktur

```
/
├── index.html              # Landing Page
├── landing.css             # Landing Page Styles
├── firestore.rules         # Firestore Security Rules
├── firebase.json           # Firebase Config
├── docs/                   # Dokumentation
├── app/                    # Haupt-App
│   ├── index.html         # App Dashboard
│   ├── login.html         # Login
│   ├── register.html      # Registrierung
│   ├── datenschutz.html   # Datenschutzerklaerung
│   ├── impressum.html     # Impressum
│   ├── info.html          # Ueber die App
│   ├── quellen.html       # Quellenangaben
│   ├── styles.css         # CSS Import File
│   ├── service-worker.js  # PWA Service Worker
│   ├── manifest.json      # PWA Manifest
│   ├── js/
│   │   ├── app.js                    # Entry Point
│   │   ├── config.js                 # User Config
│   │   ├── firebase-config.js        # Firebase Credentials
│   │   ├── firebase-auth.js          # Auth Helper Functions
│   │   ├── data/                     # Statische Daten
│   │   │   ├── milestones.js        # 28 Gesundheitsmeilensteine
│   │   │   ├── achievements.js      # Achievement-Definitionen
│   │   │   └── motivations.js       # Motivationstexte
│   │   ├── utils/
│   │   │   ├── calculations.js      # Stats & Gesundheitsberechnungen
│   │   │   ├── rate-limiter.js      # Login Rate Limiting
│   │   │   ├── offline-queue.js     # Offline Sync Queue
│   │   │   └── performance.js       # Core Web Vitals
│   │   └── ui/                       # UI Module (21 Dateien)
│   │       ├── dashboard.js
│   │       ├── tabs.js
│   │       ├── dark-mode.js
│   │       ├── milestones.js
│   │       ├── achievements.js
│   │       ├── statistics.js
│   │       ├── craving-timer.js
│   │       ├── craving-stats.js
│   │       ├── craving-heatmap.js
│   │       ├── goal-calculator.js
│   │       ├── health-avatar.js
│   │       ├── progress-visuals.js
│   │       ├── progress-goals.js
│   │       ├── happening-now.js
│   │       ├── notifications.js
│   │       ├── tutorial.js
│   │       ├── data-export.js
│   │       ├── streak.js
│   │       ├── weekly-summary.js
│   │       └── mini-games.js
│   └── css/
│       ├── base.css
│       ├── layout.css
│       ├── dark-mode.css
│       ├── demo-mode.css
│       ├── responsive.css
│       └── components/           # 23 Komponenten-CSS Dateien
└── tests/                        # Vitest Tests
```

---

## Tests

Das Projekt verwendet **Vitest** als Test-Framework.

```bash
# Tests ausfuehren
npm test

# Tests mit Watch-Mode
npm run test:watch
```

**Testabdeckung:** 301 Tests in 13 Dateien

Getestete Bereiche:
- Berechnungen (calculations.js)
- Dashboard-Logik
- UI-Komponenten (Dark Mode, Tabs, Gauges)
- Rate Limiter
- Offline Queue
- Goal Calculator
- Meilensteine & Achievements

---

## Wichtige Berechnungen

Alle Gesundheitsberechnungen in `app/js/utils/calculations.js` sind wissenschaftlich fundiert:

- **Gewonnene Lebenszeit:** 17 Min/Zigarette (Maenner), 22 Min (Frauen)
- **Kardiovaskulaere Erholung:** 0-15 Jahre Timeline
- **Lungenfunktion:** 10 Jahre Erholungskurve
- **Hautverbesserung:** Basierend auf Mailaender Studie
- **Umwelt-Impact:** Wasser, CO2, Baeume

Quellen sind in der Datei dokumentiert.

---

## Code Style

- Keine ueberfluessigen Emojis im Code
- Einfache, menschliche Commit-Messages
- Modularitaet bevorzugen
- Ueber-Engineering vermeiden
- Deutsche UI-Texte, englische Variablennamen

### Commit-Messages
```bash
# Gut
git commit -m "Add craving heatmap feature"
git commit -m "Fix login rate limiting"

# Schlecht
git commit -m "feat: Implement comprehensive craving heatmap visualization system with calendar view and statistical analysis"
```

---

## Git-Workflow

1. Auf `master` Branch arbeiten (kleine Aenderungen)
2. Fuer groessere Features: Branch erstellen
3. Committen mit kurzer, praegnanter Message
4. Pushen - Webhook deployed automatisch

```bash
git add .
git commit -m "Add feature"
git push origin master
```

---

## Lokale Entwicklung

Da die App ES6 Modules verwendet, brauchst du einen lokalen Webserver:

```bash
# Mit Python
python -m http.server 8000

# Mit Node.js
npx http-server

# Mit PHP
php -S localhost:8000
```

Dann: `http://localhost:8000/app/`

---

## Firebase Kosten

Die App ist auf minimale Firebase-Nutzung optimiert:

- **Kostenlos bis ~5.000 aktive User/Tag**
- Nur 1 Doc pro User (nicht pro Session)
- Nur 1 Doc pro Tag fuer Cravings (nicht pro Event)
- Intelligentes Caching reduziert Reads

Bei realistischer Nutzung (10-1000 User) entstehen keine Kosten.

---

## Update-Logik

```javascript
// updateDashboard() wird aufgerufen:
// 1. Bei DOMContentLoaded
// 2. Alle 60 Sekunden (setInterval)
// 3. Beim Tab-Wechsel (fuer spezifische Tabs)
```

---

## Debugging

### Haeufige Probleme

1. **Module laden nicht:** Nur ueber HTTP/HTTPS, nicht `file://`
2. **Dark Mode funktioniert nicht:** LocalStorage-Key `darkMode` pruefen
3. **Firebase-Fehler:** Console auf Permission-Errors pruefen
4. **Updates funktionieren nicht:** Tab-Switching-Logik in `tabs.js` pruefen

### Nuetzliche Console-Befehle

```javascript
// Aktuellen User pruefen
firebase.auth().currentUser

// LocalStorage ansehen
localStorage.getItem('darkMode')
localStorage.getItem('dailyCravingCount')
```
