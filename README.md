# Projet RabbitMQ Distributed Calculator

Ce projet simule un système de calcul distribué utilisant RabbitMQ, réalisé en TypeScript. Il permet d'envoyer des requêtes de calcul (addition, soustraction, multiplication, division, ou toutes à la fois) à des workers spécialisés, puis de récupérer et d'afficher les résultats.

## Structure du projet

```
rabbitmq-eval/
├── src/
│   ├── client/
│   │   ├── sender.ts      # Client qui envoie des requêtes de calcul
│   │   └── receiver.ts    # Client qui affiche les résultats
│   ├── worker/
│   │   ├── addWorker.ts   # Worker addition
│   │   ├── subWorker.ts   # Worker soustraction
│   │   ├── mulWorker.ts   # Worker multiplication
│   │   └── divWorker.ts   # Worker division
│   ├── utils/
│   │   └── types.ts       # Types partagés
│   └── config/
│       └── env.ts         # Chargement de la config RabbitMQ
├── .env                   # Fichier d'environnement (à créer)
├── package.json           # Dépendances et scripts
├── tsconfig.json          # Config TypeScript (à ajouter si besoin)
└── README.md
```

## Prérequis

- Node.js ou Bun
- RabbitMQ (local ou distant)
- TypeScript

## Installation

1. **Cloner le dépôt**
2. **Installer les dépendances** :
   ```bash
   npm install
   # ou
   bun install
   ```
3. **Créer un fichier `.env` à la racine** :
   ```env
   RABBITMQ_URL=amqp://localhost
   ```

4. **Lancer RabbitMQ** (exemple Docker) :
   ```bash
   docker run -d --hostname my-rabbit --name rabbitmq -p 5672:5672 rabbitmq:3
   ```

## Lancement du projet

### 1. Lancer les 4 workers (un par opération)

```bash
npx ts-node src/worker/addWorker.ts
npx ts-node src/worker/subWorker.ts
npx ts-node src/worker/mulWorker.ts
npx ts-node src/worker/divWorker.ts
```

Ou via les scripts npm :
```bash
npm run worker:add
npm run worker:sub
npm run worker:mul
npm run worker:div
```

### 2. Lancer le client qui envoie les requêtes

```bash
npx ts-node src/client/sender.ts
# ou
npm run sender
```

### 3. Lancer le client qui affiche les résultats

```bash
npx ts-node src/client/receiver.ts
# ou
npm run receiver
```

## Démo

1. Démarrez RabbitMQ (voir ci-dessus).
2. Lancez les 4 workers dans 4 terminaux différents :
   - `addWorker.ts` (addition)
   - `subWorker.ts` (soustraction)
   - `mulWorker.ts` (multiplication)
   - `divWorker.ts` (division)
3. Lancez le client `sender` dans un autre terminal : il enverra les requêtes dans la bonne queue selon l’opération, ou dans toutes les queues si l’opération est `all`.
4. Lancez le client `receiver` dans un autre terminal pour voir les résultats s'afficher en temps réel.

Exemple de sortie dans le terminal receiver :
```
[RESULT] 12 add 7 = 19
[RESULT] 15 mul 3 = 45
[RESULT] 20 div 4 = 5
```

## Scripts npm disponibles

Ajoutez dans votre `package.json` :
```json
"scripts": {
  "sender": "ts-node src/client/sender.ts",
  "receiver": "ts-node src/client/receiver.ts",
  "worker:add": "ts-node src/worker/addWorker.ts",
  "worker:sub": "ts-node src/worker/subWorker.ts",
  "worker:mul": "ts-node src/worker/mulWorker.ts",
  "worker:div": "ts-node src/worker/divWorker.ts"
}
```

## Qualité & Améliorations
- Code typé et commenté
- Possibilité d'ajouter d'autres opérations ou une interface graphique
- Facilement extensible

## Auteur
Projet réalisé dans le cadre du module RabbitMQ pour l'Institut de Physique Nucléaire NGI.
