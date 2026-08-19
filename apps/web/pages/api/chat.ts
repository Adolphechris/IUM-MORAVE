import type { NextApiRequest, NextApiResponse } from 'next';

// Base de connaissances complète et officielle de l'IUM-MORAVE pour le Chatbot IA
const KNOWLEDGE_BASE = {

  facultes: `L'**Institut Universitaire Morave Willsamal (IUM-MORAVE)** compte **8 facultés** organisées selon le système LMD (Licence, Master, Doctorat) :

1. 💻 **Faculté des Sciences et Technologies (FST)** : Génie Logiciel & IA, Réseaux & Télécommunications, Informatique de Gestion, Mathématiques Appliquées.
2. 📊 **Faculté des Sciences Économiques et de Gestion (FSEG)** : Finance & Économie du Développement, Comptabilité & Audit, Management & Entrepreneuriat.
3. ⚖️ **Faculté de Droit et Sciences Politiques (FDSP)** : Droit Privé & des Affaires (OHADA), Droit Public & Administration, Relations Internationales & Diplomatie, Sciences Administratives.
4. 🩺 **Faculté de Médecine et Santé Publique (FMS)** : Doctorat en Médecine Générale, Santé Communautaire & Épidémiologie *(en partenariat avec l'ISTM)*.
5. 📖 **Faculté de Théologie et Sciences des Religions (FTH)** : Théologie Pratique, Exégèse Biblique & Langues Orientales (Grec & Hébreu), Éthique & Médiation.
6. 🌱 **Faculté des Sciences Agronomiques & Développement Rural (FSA)** : Phytotechnie, Zootechnie, Économie Agricole & Sécurité Alimentaire.
7. 📰 **Faculté des Sciences de l'Information et de la Communication (FSIC)** : Journalisme & Médias, Communication des Organisations & Relations Publiques.
8. 🎓 **Faculté des Sciences de l'Éducation (FSE)** : Psychopédagogie, Didactique, Administration & Inspection Scolaire.

Consultez chaque faculté en détail sur **iumorave-ac.org/facultes**.`,

  direction: `🏛️ **Direction & Gouvernance de l'IUM-MORAVE** :

- **Recteur** : Prof. Dr. **Isaac Jean Claude Tshilumbayi** — Professeur des Universités & **1er Vice-Président de l'Assemblée Nationale de la RDC**.
- **Directeur Général** : Dr. **Marc Nsalanga Kayumba**.
- **Partenaire Médical** : **ISTM** (Institut Supérieur des Techniques Médicales) — pour les stages hospitaliers, journées scientifiques et cérémonies de collation des grades conjointes.`,

  admissions: `📝 **Conditions d'Admission à l'IUM-MORAVE** :
- Être titulaire d'un **Diplôme d'État** (ou équivalent reconnu par l'ESU).
- Fournir les pièces suivantes :
  1. Copie du Diplôme d'État ou Attestation de réussite.
  2. Bulletins de 5ème et 6ème des humanités.
  3. Extrait d'acte de naissance & Certificat de bonne conduite, vie et mœurs.
  4. 4 photos passeport récentes.
- Les inscriptions s'effectuent au **Secrétariat Général Académique** sur le campus ou par e-mail à **secretariat@iumorave-ac.org**.`,

  agrement: `⚖️ **Agrément & Reconnaissance Officielle** :
L'**Institut Universitaire Morave Willsamal** est dûment agréé et reconnu par l'État Congolais sous l'**Arrêté Ministériel N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018** du Ministère de l'Enseignement Supérieur et Universitaire (ESU).
Nos diplômes, relevés de notes et certificats ont une valeur juridique et académique totale en RDC et sont reconnus à l'international. Chaque document est vérifiable via QR Code sur **iumorave-ac.org/verify**.`,

  localisation: `📍 **Localisation & Adresse du Campus** :
- **Adresse** : Avenue Aérodrome, Quartier Mandam, Commune de Bondoyi, **Mwene-Ditu**
- **Province** : Lomami, République Démocratique du Congo
- **Boîte Postale** : B.P. 126 Mwene-Ditu
- **Coordonnées GPS** : -6.60°N, 23.56°E`,

  contact: `📧 **Contact & Secrétariat** :
- **E-mail Secrétariat** : secretariat@iumorave-ac.org
- **E-mail Contact Général** : contact@iumorave-ac.org
- **Formulaire en ligne** : iumorave-ac.org/contact
- **Vérification de diplômes** : iumorave-ac.org/verify`,

  actualites: `📰 **Actualités & Jalons Académiques Récents** :
- 🎓 **Août 2026** : Collation des grades pour **120 nouveaux diplômés** (IUM & ISTM).
- 📅 **Octobre 2025** : Lancement officiel de l'année académique 2025-2026.
- 📝 **Août 2025** : Soutenance remarquable du mémoire de **Donat Sam Ngeleka** (FSIC) sur *"Le désintérêt des jeunes pour les médias traditionnels"*.
- 🔬 **Mai 2025** : Grande journée scientifique conjointe IUM-ISTM.
- 🏛️ **Mai 2024** : Hommage académique au Recteur Prof. Dr. Isaac Jean Claude Tshilumbayi pour son élection au poste de **1er Vice-Président de l'Assemblée Nationale**.
- 🎓 **Novembre 2022** : Collation des grades pour **88 lauréats** gradués et licenciés.`
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message requis' });
  }

  const query = message.toLowerCase();

  let responseText = '';

  if (query.includes('recteur') || query.includes('directeur') || query.includes('gouvern') || query.includes('tshilumbayi') || query.includes('nsalanga') || query.includes('direction') || query.includes('autorit')) {
    responseText = KNOWLEDGE_BASE.direction;
  } else if (query.includes('actu') || query.includes('evenement') || query.includes('diplome') || query.includes('promo') || query.includes('collation') || query.includes('ngeleka') || query.includes('laureats') || query.includes('nouvelles')) {
    responseText = KNOWLEDGE_BASE.actualites;
  } else if (query.includes('facult') || query.includes('programme') || query.includes('cours') || query.includes('filiere') || query.includes('branche') || query.includes('formation') || query.includes('lmd') || query.includes('agrono') || query.includes('journalis') || query.includes('educati') || query.includes('theolog') || query.includes('medecin') || query.includes('droit') || query.includes('economie')) {
    responseText = KNOWLEDGE_BASE.facultes;
  } else if (query.includes('inscr') || query.includes('admiss') || query.includes('dossier') || query.includes('condition') || query.includes('frais') || query.includes('piec')) {
    responseText = KNOWLEDGE_BASE.admissions;
  } else if (query.includes('agrem') || query.includes('legal') || query.includes('officiel') || query.includes('reconnaiss') || query.includes('esu') || query.includes('arrete') || query.includes('minesu') || query.includes('83/minesu')) {
    responseText = KNOWLEDGE_BASE.agrement;
  } else if (query.includes('ou') || query.includes('adresse') || query.includes('situ') || query.includes('ville') || query.includes('lomami') || query.includes('mwene') || query.includes('campus') || query.includes('aerodrome') || query.includes('bondoyi') || query.includes('mandam')) {
    responseText = KNOWLEDGE_BASE.localisation;
  } else if (query.includes('contact') || query.includes('mail') || query.includes('telephone') || query.includes('joindre') || query.includes('ecrire') || query.includes('secretariat')) {
    responseText = KNOWLEDGE_BASE.contact;
  } else if (query.includes('bonjour') || query.includes('salut') || query.includes('coucou') || query.includes('hello') || query.includes('bonsoir')) {
    responseText = `Bonjour et bienvenue sur le portail de l'**Institut Universitaire Morave Willsamal (IUM-MORAVE)** ! 🎓\n\nJe suis votre assistant virtuel académique. Je peux répondre à vos questions sur :\n- 🏛️ La **direction & le Recteur** de l'université\n- 🎓 Nos **8 facultés** et programmes LMD\n- 📝 Les **conditions d'admission**\n- ⚖️ Notre **agrément officiel ESU**\n- 📍 La **localisation du campus**\n- 📰 Les **actualités & événements académiques**\n\nComment puis-je vous aider aujourd'hui ?`;
  } else {
    responseText = `Merci pour votre question ! 🎓\n\nL'**Institut Universitaire Morave Willsamal (IUM-MORAVE)** est une université privée agréée par l'État congolais (Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018), dirigée par le Recteur **Prof. Dr. Isaac Jean Claude Tshilumbayi** et le DG **Dr. Marc Nsalanga Kayumba**.\n\nNous proposons **8 facultés** en formation LMD sur notre campus de Mwene-Ditu, Province de Lomami.\n\nPour toute information complémentaire, écrivez-nous à **secretariat@iumorave-ac.org** ou consultez **iumorave-ac.org**.`;
  }

  return res.status(200).json({
    reply: responseText,
    timestamp: new Date().toISOString()
  });
}
