import type { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_ium_morave_2026_super_secure_key';

const mockDashboardData = {
  totals: {
    students: 3420,
    teachers: 148,
    programs: 24,
    deliberations: 18,
    diplomasIssued: 850
  },
  recentAuditEvents: [
    { action: 'DELIBERATION_FINALIZED', resource: 'Licence 3 Informatique', createdAt: new Date().toISOString() },
    { action: 'DIPLOMA_ISSUED', resource: 'Diplôme N° IUM-2026-0042', createdAt: new Date().toISOString() },
    { action: 'GRADE_SUBMITTED', resource: 'UE Algorithmique avancée', createdAt: new Date().toISOString() }
  ],
  upcomingEvents: [
    { id: 1, title: 'Session d\'Examens du 1er Semestre', startsAt: '2026-09-15' },
    { id: 2, title: 'Jury de Délibération Master 2', startsAt: '2026-10-01' }
  ],
  enrollments: [
    { id: 1, studentEmail: 'jean.kabamba@ium-morave.edu', studentName: 'Jean Kabamba', matricule: '2026-SINT-042', academicYear: '2025-2026', programTitle: 'Licence en Sciences Informatiques', status: 'Inscrit' },
    { id: 2, studentEmail: 'marie.tshilombo@ium-morave.edu', studentName: 'Marie Tshilombo', matricule: '2026-MED-018', academicYear: '2025-2026', programTitle: 'Doctorat en Médecine Générale', status: 'Inscrit' },
    { id: 3, studentEmail: 'patrick.mwamba@ium-morave.edu', studentName: 'Patrick Mwamba', matricule: '2026-DROIT-099', academicYear: '2025-2026', programTitle: 'Licence en Droit Privé & Judiciaire', status: 'En attente' }
  ],
  deliberations: [
    { id: 101, enrollmentId: 1, studentName: 'Jean Kabamba', matricule: '2026-SINT-042', decision: 'ADMIS (Mention Distinction)', weightedAverage: 16.4, finalizedAt: '2026-07-20' },
    { id: 102, enrollmentId: 2, studentName: 'Marie Tshilombo', matricule: '2026-MED-018', decision: 'ADMIS (Mention Grande Distinction)', weightedAverage: 17.8, finalizedAt: '2026-07-22' }
  ],
  diplomas: [
    { diplomaNumber: 'IUM-2026-0042', studentName: 'Jean Kabamba', programTitle: 'Licence en Sciences Informatiques', level: 'Licence (LMD)', mention: 'Distinction', issuedDate: '2026-07-25' },
    { diplomaNumber: 'IUM-2026-0018', studentName: 'Marie Tshilombo', programTitle: 'Doctorat en Médecine Générale', level: 'Doctorat', mention: 'Grande Distinction', issuedDate: '2026-07-26' }
  ]
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès refusé : Jeton d\'authentification manquant.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès interdit : privilèges administrateur requis.' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
  }

  return res.status(200).json(mockDashboardData);
}
