# sport-events-ts — TP ING1 Tests et Déploiement

App Express + TypeScript minimale qui sert de support aux exercices du cours.
Domaine : inscription à des événements sportifs (marathon, trail, semi).

## Prérequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur en mode watch sur `http://localhost:3000` |
| `npm start` | Démarre le serveur en mode normal |
| `npm test` | Lance tous les tests Jest (unit + integration) |
| `npm run test:unit` | Tests unitaires uniquement |
| `npm run test:integration` | Tests d'intégration uniquement |
| `npm run test:coverage` | Tests + rapport de couverture (`coverage/`) |
| `npm run cypress:open` | Ouvre Cypress en mode interactif (serveur doit tourner) |
| `npm run cypress:run` | Exécute Cypress en headless |
| `npm run lint` | Vérification TypeScript (`tsc --noEmit`) |

## Structure

```
src/
├── server.ts            # bootstrap HTTP
├── app.ts               # wiring Express
├── routes/events.ts     # endpoints REST
├── services/
│   ├── events.service.ts
│   └── payment.gateway.ts   # à mocker (ex2)
├── db/index.ts          # SQLite in-memory + seed
└── public/index.html    # UI minimale (ex4)

tests/
├── unit/
│   ├── validation.test.ts          # exemple complet
│   └── events.service.test.ts      # contient ex2 (it.todo)
└── integration/
    └── events.api.test.ts          # contient ex3 (it.todo)

cypress/e2e/
├── homepage.cy.ts                  # exemple
└── registration.cy.ts              # contient ex4

.github/workflows/ci.yml            # workflow incomplet (ex5)
```

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/events` | Liste tous les événements |
| `GET` | `/api/events/:id` | Détails d'un événement |
| `POST` | `/api/events/:id/register` | Inscrit un participant `{ email, amountCents }` |

Codes d'erreur : `400` payload invalide, `404` événement inexistant, `409` complet, `402` paiement refusé.

## Troubleshooting

- **`better-sqlite3` ne compile pas** : nécessite Python + outils de build natifs. Sur macOS : `xcode-select --install`. Sur Windows : `npm install --global windows-build-tools`.
- **Cypress échoue à se lancer** : `npx cypress install` puis vérifier que `localhost:3000` répond.
