# Relevés de notes : sécurité et validation institutionnelle

## État du MVP

Le MVP fournit un relevé numérique signé par une empreinte HMAC-SHA-256, avec :

- un identifiant de vérification unique ;
- les notes, crédits et moyenne pondérée ;
- un horodatage d'émission ;
- un endpoint de vérification publique qui confirme l'intégrité du document ;
- une piste d'audit de l'émission dans l'API.

Le document est produit par `services/core-api` via `GET /transcripts/me` pour
l'étudiant concerné, ou via `GET /transcripts/enrollments/:id` pour un
administrateur.

## Limites à traiter avant production

Un modèle technique ne suffit pas pour déclarer la conformité d'un relevé.
Avant toute émission officielle, l'IUM-MORAVE doit faire valider par les
autorités académiques compétentes en RDC :

1. le format, les mentions obligatoires, les signatures et cachets requis ;
2. la méthode de numérotation et l'archivage des documents ;
3. le circuit de validation des notes et des délibérations ;
4. les règles de conservation et de protection des données personnelles ;
5. la valeur institutionnelle du mécanisme de vérification numérique.

## Exigences de production

- Configurer `TRANSCRIPT_SIGNING_SECRET` dans le gestionnaire de secrets.
- Utiliser une clé distincte de `JWT_SECRET`, protégée et renouvelable.
- Lier le compte de l'étudiant à une inscription académique validée ; l'adresse
  email seule ne doit jamais donner accès à un relevé.
- Persister les relevés émis, leurs versions et leurs journaux d'audit dans la
  base de données.
- Produire le PDF officiel uniquement après validation administrative.
- Mettre en place un stockage chiffré, des sauvegardes et un contrôle d'accès
  minimal par rôle.

## Vérification

L'API ne révèle que le statut de vérification et l'institution. Elle ne doit
pas exposer des notes ou des données d'étudiant à partir d'un code public.
