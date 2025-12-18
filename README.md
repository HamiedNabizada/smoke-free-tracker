# Rauchentwöhnung Tracker

Web-App zum Tracking des Rauchstopps mit Statistiken, Gesundheitsmeilensteinen und Hilfefunktionen.

## Features

**Statistiken**
- Zeit rauchfrei (Tage, Stunden, Minuten)
- Gespartes Geld
- Nicht gerauchte Zigaretten
- Gewonnene Lebenszeit
- Vermiedene Schadstoffe
- Lungenregeneration (prozentual)

**Gesundheits-Avatar**
- Visuelle Darstellung der Körperregeneration
- Interaktive Organanzeige (Lunge, Herz, Blutkreislauf, Haut)
- Live-Berechnung des Regenerationsfortschritts

**Craving-Timer**
- 5-Minuten-Timer bei akutem Verlangen
- Atemübungen mit visueller Anleitung
- Wechselnde Motivationstipps

**Goal Calculator**
- Zieleingabe nach Tagen oder Geldbetrag
- Automatische Berechnung: Dauer, Ersparnis, vermiedene Zigaretten
- Fortschrittsanzeige

**Weitere Features**
- 28 Gesundheitsmeilensteine (20 Min bis 20 Jahre)
- Achievements-System
- Verlaufsdiagramm (30 Tage)
- Dark Mode
- PWA (installierbar auf Smartphone)

## Installation

**Lokal nutzen:**
1. Repository klonen oder Dateien herunterladen
2. `index.html` im Browser öffnen

**Als PWA installieren (Smartphone):**
- Android: Browser-Menü → "Zum Startbildschirm hinzufügen"
- iOS: Safari → Teilen → "Zum Home-Bildschirm"

**Auf Webserver:**
- Dateien per FTP hochladen
- Keine serverseitige Logik nötig (statische Dateien)

## Konfiguration

Rauchstopp-Datum und persönliche Daten in `js/config.js` ändern:

```javascript
export const userData = {
    quitDate: '2025-11-29T10:00:00',
    cigarettesPerDay: 12,
    pricePerPack: 10,
    cigarettesPerPack: 20
};
```

## Technologie

- Vanilla JavaScript (ES6 Module)
- HTML5/CSS3
- Chart.js für Diagramme
- Service Worker für Offline-Nutzung
- LocalStorage für Dark Mode

**Keine Abhängigkeiten außer Chart.js (CDN)**

## Dateistruktur

```
js/
├── config.js              # Konfiguration
├── app.js                 # Entry Point
├── data/                  # Daten (Meilensteine, Achievements, etc.)
├── utils/                 # Berechnungen
└── ui/                    # UI-Komponenten

css/
├── components/            # CSS pro Komponente
├── base.css               # Grundstyles
├── dark-mode.css          # Dark Mode
└── responsive.css         # Media Queries

index.html                 # Haupt-HTML
styles.css                 # CSS Import-Datei
service-worker.js          # PWA Service Worker
manifest.json              # Web App Manifest
```

## Datenschutz

Alle Daten bleiben lokal im Browser. Keine Server-Kommunikation, keine Cookies, kein Tracking.

## Gesundheitsmeilensteine (Auswahl)

| Zeit | Verbesserung |
|------|--------------|
| 20 Min | Herzfrequenz/Blutdruck normalisieren sich |
| 8 Std | Sauerstoffgehalt im Blut normal |
| 24 Std | Herzinfarktrisiko sinkt |
| 3 Tage | Nikotin vollständig aus dem Körper |
| 1 Monat | Lungenkapazität +30% |
| 1 Jahr | Herzinfarktrisiko halbiert |
| 10 Jahre | Lungenkrebsrisiko halbiert |

## Browser-Support

Chrome, Firefox, Safari, Edge (alle modernen Browser mit ES6-Module-Unterstützung)

## Lizenz

Open Source - frei nutzbar und anpassbar.

## Hinweis

Diese App ersetzt keine medizinische Beratung. Bei Problemen mit dem Rauchstopp professionelle Hilfe in Anspruch nehmen.

**Hilfsangebote:**
- BZgA Rauchfrei-Telefon: 0800 8 31 31 31
- www.rauchfrei-info.de
