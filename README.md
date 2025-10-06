# Riftbound Simulator Backend

Backend Node.js + TypeScript per il simulatore del TCG "Riftbound" (League of Legends card game).

## 🚀 Setup del Progetto

### Prerequisiti
- Node.js >= 18.0.0
- npm o yarn

### Installazione

1. Clona il repository
```bash
git clone <repository-url>
cd riftbound-simulator
```

2. Installa le dipendenze
```bash
npm install
```

3. Configura le variabili d'ambiente
```bash
cp .env.example .env
# Modifica il file .env con le tue configurazioni
```

4. Avvia il server in modalità sviluppo
```bash
npm run dev
```

## 📁 Struttura del Progetto

```
src/
├── config/          # Configurazioni dell'applicazione
├── controllers/     # Controller per le route API
├── middleware/      # Middleware Express personalizzati
├── models/          # Modelli dati e tipi
├── routes/          # Definizione delle route API
├── services/        # Logica di business
├── types/           # Definizioni TypeScript
├── utils/           # Utility e helper functions
└── index.ts         # Entry point dell'applicazione
```

## 🛠️ Script Disponibili

- `npm run dev` - Avvia il server in modalità sviluppo con hot reload
- `npm run build` - Compila il progetto TypeScript
- `npm start` - Avvia il server compilato
- `npm run lint` - Esegue ESLint
- `npm run lint:fix` - Corregge automaticamente gli errori ESLint
- `npm run format` - Formatta il codice con Prettier
- `npm test` - Esegue i test Jest

## 🔧 Tecnologie Utilizzate

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipato di JavaScript
- **Express.js** - Framework web
- **Helmet** - Sicurezza HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gestione variabili d'ambiente
- **ESLint** - Linting del codice
- **Prettier** - Formattazione del codice
- **Jest** - Framework di testing

## 🌐 API Endpoints

### Health Check
- `GET /health` - Controlla lo stato del server
- `GET /` - Informazioni generali sull'API

## 📝 Sviluppo Futuro

Questo è il setup iniziale del progetto. Le funzionalità del simulatore TCG verranno implementate successivamente, inclusi:

- Sistema di autenticazione utenti
- Gestione mazzi di carte
- Logica di gioco e partite
- Sistema di matchmaking
- Database per persistenza dati
- WebSocket per gioco in tempo reale

## 🤝 Contributi

Per contribuire al progetto, segui le convenzioni di codice configurate con ESLint e Prettier.