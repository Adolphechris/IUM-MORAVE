# Finance Service — IUM-MORAVE

API de gestion financière pour l'Institut Universitaire Morave.

## Fonctionnalités

- **Plans de paiement** : Création et suivi des plans de règlement des frais de scolarité.
- **Paiements** : Traitement des paiements avec génération automatique de reçus.
- **Statut financier** : Blocage/déblocage automatique des accès selon le statut financier.
- **Reçus** : Génération et vérification de reçus de paiement.

## Endpoints

| Méthode | Endpoint | Description |
|---|--------|---|
| GET | `/health` | Health check du service |
| GET | `/payment-plans` | Liste tous les plans de paiement |
| GET | `/payment-plans/:studentId` | Plan de paiement d'un étudiant |
| POST | `/payment-plans` | Crée un plan de paiement |
| POST | `/payments` | Enregistre un paiement |
| GET | `/receipts/:receiptNumber` | Récupère un reçu par son numéro |
| GET | `/student-status/:studentId` | Statut financier d'un étudiant |

## Lancement

```bash
cd services/finance-service
npm install
npm start
```

Service accessible sur `http://localhost:4003` par défaut.
