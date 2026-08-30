Here is the updated README with the GPL-3.0 license:

---

# StockScore – Tournament Software for Stocksport

**StockScore** is a Progressive Web App (PWA) for managing and running Stocksport tournaments. It runs entirely in the browser and is fully offline-capable – ideal for sports venues without a reliable internet connection.

Live version: [https://stockscore.uoul.net/](https://stockscore.uoul.net/)

---

## Features

### Tournament Management

- Create tournament – name, number of courts, date
- Run tournament – schedule, results, tables
- Delete tournament – remove tournaments no longer needed

### Import / Export

- Export tournaments as JSON files (backup / transfer)
- Import JSON files (restoration / device migration)

### Per Tournament

| Area | Description |
|---|---|
| Manage teams | Add, edit, and delete teams |
| Generate schedule | Automatic creation of the match schedule based on number of teams and courts |
| Maintain results | Enter and correct match results per fixture |
| Results table | Live standings with current ranking of all teams |

### Printouts

The following printouts can be generated directly from the app:

- **Court strips** – overview of fixtures per court
- **Team strips** – overview of fixtures per team
- **Results list** – final ranking of the tournament

The print functions use the browser's built-in print capability and can be sent to any local printer.

---

## Offline Capability

StockScore is implemented as a Progressive Web App (PWA):

- Service Workers cache all resources – the app works without an internet connection after a single initial load
- Web App Manifest – install on the home screen (smartphone/tablet) or as a desktop app
- Local storage – all tournament data is stored in the browser (no server, no cloud required)
- No dependency on external services

### Installation as an App

1. Open StockScore in the browser
2. Open the browser menu and select "Add to Home Screen" (Android) or "Install" (Chrome/Edge)
3. The app now launches standalone like a native application

---

## Technology Stack

| Component | Technology |
|---|---|
| App type | Progressive Web App (PWA) |
| Offline caching | Service Worker / Cache API |
| Data storage | Browser storage (IndexedDB / LocalStorage) |
| Import/Export | JSON |
| Print output | Browser print function (`window.print()`) |
| Backend | none – entirely client-side |

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

You are free to use, modify, and distribute this software, provided that any distributed copies or derivative works are also licensed under GPL-3.0 and include the corresponding source code. See the [full license text](https://www.gnu.org/licenses/gpl-3.0.html) for details.
