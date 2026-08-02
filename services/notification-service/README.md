# Notification Service — IUM-MORAVE

Service de notification pour l'Institut Universitaire Morave.

## Fonctionnalités

- **Templates de notification** : Gestion centralisée des modèles d'email/SMS.
- **Envoi ciblé** : Envoi de notifications à un destinataire.
- **Envoi groupé** : Envoi de notifications à plusieurs destinataires.
- **Suivi** : Historique des notifications envoyées.

## Templates disponibles

| ID | Canal | Description |
|---|--------|---|
| `grade_published` | email | Notification lors de la publication d'une note |
| `financial_reminder` | email, sms | Rappel de paiement de frais de scolarité |
| `attendance_alert` | email | Alerte d'absence pour un cours |

## Endpoints

| Méthode | Endpoint | Description |
|---|--------|---|
| GET | `/health` | Health check |
| GET | `/templates` | Liste tous les templates |
| GET | `/templates/:id` | Détails d'un template |
| POST | `/send/:templateId` | Envoie une notification |
| POST | `/send-bulk/:templateId` | Envoie des notifications groupées |
| GET | `/notifications` | Historique des notifications |

## Lancement

```bash
cd services/notification-service
npm install
npm start
```

Service accessible sur `http://localhost:4004` par défaut.
