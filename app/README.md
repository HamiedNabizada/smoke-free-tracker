# ByeByeSmoke - Multi-User Version

Dies ist die öffentliche Multi-User Version der ByeByeSmoke App mit Firebase Integration.

## Features

- 🔐 Firebase Authentication (Username/Passwort)
- ☁️ Cloud-Speicherung (Firestore)
- 👥 Multi-User Support
- 🌐 Offline-Funktionalität
- 📱 Progressive Web App (PWA)
- 🌙 Dark Mode
- 📊 Persönliche Statistiken
- 🏆 Erfolge & Meilensteine
- 🆘 Craving-Timer mit Tipps
- 🎯 Zielrechner

## Deployment

Diese Version kann einfach auf einen Webserver hochgeladen werden:

1. Den gesamten `public/` Ordner auf den Webserver kopieren
2. Die App ist unter `https://deine-domain.de/public/` erreichbar

## Unterschied zur privaten Version

Die private Version im Stammordner nutzt LocalStorage und ist für Single-User gedacht.
Diese Version nutzt Firebase und ist für mehrere Benutzer konzipiert.

## Firebase Konfiguration

Die Firebase Config befindet sich in `js/firebase-config.js`

## Technologie-Stack

- Vanilla JavaScript (ES6 Modules)
- Firebase Authentication
- Firebase Firestore
- Chart.js für Diagramme
- Service Worker für Offline-Support
