# 🎓 CONSIGNES PERMANENTES : SÉCURITÉ, MAQUETTES & NORMES ACADÉMIQUES (ESU / LMD)

> **Règle système obligatoire pour Antigravity / AI Agents & Développeurs**  
> *Cette règle s'applique automatiquement à toute conversation, analyse ou modification du monorepo IUM-MORAVE.*

---

## 🏛️ 1. OBLIGATION DE CONSULTATION PRÉALABLE DES DOCUMENTS DE CADRAGE

Avant de répondre à toute question, de générer du code ou de modifier une fonctionnalité liée aux **notes, relevés de côtes, maquettes pédagogiques, délibérations, départements ou diplômes**, l'agent DOIT IMPÉRATIVEMENT se référer aux documents majeurs suivants :

1. 📘 **[Maquette Nationale ESU — Master ISI LMD](file:///home/adolphe/IUM-MORAVE/docs/curriculum-master-isi-lmd.md)**
   - Référentiel des 4 semestres, 120 ECTS, découpage des volumes horaires (Cours, TD, TP, TPE).
   - Barème officiel des mentions (A: Excellent, B: Très Bien, C: Bien, D: Satisfaction, E: Passable, FX: Rachat, F: Ajourné).
   - Formules de calcul des moyennes semestrielles et du GPA global.

2. 🏛️ **[Témoin Officiel : Relevé des Cotes UNILU Page 4](file:///home/adolphe/IUM-MORAVE/docs/references/modele_releve_unilu_page4_temoin.md)**
   - Échantillon de référence national : structure d'en-tête avec photo d'identité timbrée, paragraphe d'attribution officiel, tableau à double découpage horaire (`COURS` et `TD+TP+TPE`), crédits, cotes /20, synthèse de délibération, double signature (Secrétaire Académique + Doyen) et filigranes (*« Scientia splendet et conscientia »*).

3. 🔒 **[Sécurité & Validation des Relevés de Notes](file:///home/adolphe/IUM-MORAVE/docs/TRANSCRIPT_SECURITY.md)**
   - Exigences d'intégrité cryptographique HMAC-SHA-256 (`TRANSCRIPT_SIGNING_SECRET`).
   - Circuit de validation institutionnelle, traçabilité d'émission et journal d'audit.
   - Conformité avec le modèle visuel national **UNILU (Page 4)** : filigrane du blason, devise en arc, QR Code dynamique de vérification en ligne et signatures académiques.

4. 🗃️ **[Modèle de Données LMD](file:///home/adolphe/IUM-MORAVE/docs/MODELE_DE_DONNEES_LMD.md)**
   - Architecture relationnelle des facultés, départements, programmes, parcours, cours, inscriptions et attestations.

---

## 🛡️ 2. DIRECTIVES DE DÉVELOPPEMENT & DE DIALOGUE

* **Respect strict des maquettes** : Tout ajout ou modification de cours ou de crédits doit s'aligner sur la maquette officielle ESU.
* **Blason Officiel & Filigrane Central** : Le blason institutionnel de l'IUM Morave (`apps/web/public/images/logo-crest.jpg` archivé dans `docs/references/blason-ium-morave-original.jpg`) doit impérativement figurer en en-tête et en **filigrane centralisé au coeur de la page** (`top: 50%; left: 50%; transform: translate(-50%, -50%);`) avec une opacité fixée à **15% (`opacity: 0.15`)** conformément à l'échantillon témoin UNILU Page 4.
* **Fidélité au générateur PDF** : Le moteur de génération PDF (`services/core-api/src/pdf-service.js`) et le template HTML (`releve_officiel_imprimable.html`) doivent respecter scrupuleusement ces règles de centrage et de transparence.
* **Transparence dans les réponses** : L'assistant doit systématiquement s'appuyer sur ces documents de référence lors de chaque discussion académique.
