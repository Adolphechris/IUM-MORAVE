import type { NextApiRequest, NextApiResponse } from 'next';

// Base de connaissances intelligente de l'IUM-MORAVE pour le Chatbot
const KNOWLEDGE_BASE = {
  facultes: `L'IUM-MORAVE compte 5 grandes facultés organisées selon le système LMD (Licence, Master, Doctorat) :
1. 💻 **Faculté des Sciences et Technologies (FST)** : Génie Logiciel, Réseaux, Mathematiques Appliquées, Informatique.
2. 📊 **Faculté des Sciences Économiques et de Gestion (FSEG)** : Finance, Comptabilité, Management, Économie.
3. ⚖️ **Faculté de Droit et Sciences Politiques (FDSP)** : Droit Privé, Droit Public, Relations Internationales & Diplomatie.
4. 🩺 **Faculté de Médecine et Santé Publique (FMS)** : Doctorat en Médecine Générale, Santé Communautaire, Épidémiologie.
5. 📖 **Faculté de Théologie et Sciences des Religions (FTH)** : Théologie Pratique, Exégèse Biblique, Éthique, Ministère Pastoral.`,

  admissions: `📝 **Conditions d'Admission à l'IUM-MORAVE** :
- Être titulaire d'un Diplôme d'État (ou équivalent reconnu).
- Fournir les pièces suivantes :
  1. Copie du Diplôme d'État ou Attestation de réussite.
  2. Bulletins de 5ème et 6ème des humanités.
  3. Extrait d'acte de naissance & Certificat de bonne conduite, vie et mœurs.
  4. 4 photos passeport récentes.
- Les inscriptions s'effectuent au Secrétariat Général Académique sur le campus ou en nous contactant directement par e-mail à secretariat@iumorave-ac.org.`,

  agrement: `⚖️ **Agrément & Reconnaissance Officielle** :
L'Institut Universitaire Morave est un établissement d'enseignement supérieur dûment agréé et reconnu par l'État Congolais sous l'**Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018**. Nos diplômes et relevés de notes ont une valeur juridique et académique totale en RDC et à l'international.`,

  localisation: `📍 **Localisation & Campus** :
L'IUM-MORAVE est situé dans la ville de Mwene-Ditu, Province de Lomami, République Démocratique du Congo.
Boîte Postale : B.P. 126 Mwene-Ditu.`,

  contact: `📧 **Contact & Secrétariat** :
- **E-mail Secrétariat** : secretariat@iumorave-ac.org
- **E-mail Contact Général** : contact@iumorave-ac.org
- Vous pouvez poser directement vos questions ici ou nous laisser un message via l'onglet Contact.`
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

  if (query.includes('facult') || query.includes('programme') || query.includes('cours') || query.includes('filiere') || query.includes('branche')) {
    responseText = KNOWLEDGE_BASE.facultes;
  } else if (query.includes('inscr') || query.includes('admiss') || query.includes('dossier') || query.includes('condition') || query.includes('frais')) {
    responseText = KNOWLEDGE_BASE.admissions;
  } else if (query.includes('agrem') || query.includes('legal') || query.includes('officiel') || query.includes('reconnaiss') || query.includes('esu') || query.includes('arrete')) {
    responseText = KNOWLEDGE_BASE.agrement;
  } else if (query.includes('ou') || query.includes('adresse') || query.includes('situ') || query.includes('ville') || query.includes('lomami') || query.includes('mwene')) {
    responseText = KNOWLEDGE_BASE.localisation;
  } else if (query.includes('contact') || query.includes('mail') || query.includes('telephone') || query.includes('joindre') || query.includes('ecrire')) {
    responseText = KNOWLEDGE_BASE.contact;
  } else if (query.includes('bonjour') || query.includes('salut') || query.includes('coucou') || query.includes('hello')) {
    responseText = `Bonjour et bienvenue sur le portail de l'**Institut Universitaire Morave (IUM-MORAVE)** ! 🎓\n\nJe suis l'assistant virtuel académique de l'université. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos facultés, les conditions d'admission, l'agrément ESU ou la localisation du campus.`;
  } else {
    responseText = `Merci pour votre question ! L'**IUM-MORAVE** forme des cadres d'excellence en Sciences & Technologies, Économie, Droit, Médecine et Théologie sous l'Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018.\n\nVous pouvez nous contacter directement par e-mail à **secretariat@iumorave-ac.org** ou consulter la rubrique nos facultés pour plus de détails.`;

  }

  return res.status(200).json({
    reply: responseText,
    timestamp: new Date().toISOString()
  });
}
