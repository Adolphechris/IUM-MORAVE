25. GESTION DES EMAILS INSTITUTIONNELS

Objectif

Créer une identité numérique officielle.

Prévoir :

emails @domaine.cd ;

comptes étudiants ;

comptes enseignants ;

administration.

Exemples :

rectorat@...

scolarite@...

contact@...

## MVP : notifications transactionnelles

Le MVP contient une abstraction de message institutionnel dans
`services/core-api`. L'endpoint administratif `POST /notifications/preview`
construit un message avec un expéditeur institutionnel et fournit un aperçu en
développement. Il n'envoie pas de courriel réel sans un fournisseur configuré.

Avant la production :

1. choisir et intégrer un fournisseur transactionnel approuvé ;
2. stocker ses secrets uniquement dans le gestionnaire de secrets ;
3. configurer SPF, DKIM et DMARC pour le domaine officiel ;
4. créer des modèles validés pour inscription, notes, délibération et
   communication administrative ;
5. consigner l'état de livraison sans enregistrer de contenu sensible
   inutilement.
