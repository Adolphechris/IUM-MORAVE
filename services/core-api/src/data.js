const faculties = [
  {
    id: 1,
    code: 'FSINT',
    name: 'Faculté des Sciences Informatiques et Nouvelles Technologies',
    description: 'Formation en informatique, systèmes numériques et technologies innovantes.'
  },
  {
    id: 2,
    code: 'FSEG',
    name: 'Faculté des Sciences Économiques et de Gestion',
    description: 'Économie, Management, Comptabilité'
  }
];

const programs = [
  {
    id: 1,
    facultyId: 1,
    code: 'LIC-SINT',
    title: 'Licence en Sciences Informatiques et Nouvelles Technologies',
    level: 'licence',
    durationMonths: 36
  },
  {
    id: 2,
    facultyId: 2,
    code: 'LIC-SEG',
    title: 'Licence en Sciences Économiques et de Gestion',
    level: 'licence',
    durationMonths: 36
  }
];

const tracks = [
  {
    id: 1,
    programId: 1,
    code: 'SINT-DEV',
    title: 'Développement logiciel et applications',
    description: 'Spécialité orientée conception, programmation et applications numériques.'
  },
  {
    id: 2,
    programId: 1,
    code: 'SINT-RC',
    title: 'Réseaux, systèmes et cybersécurité',
    description: 'Spécialité orientée infrastructures, réseaux et protection des systèmes.'
  },
  {
    id: 3,
    programId: 2,
    code: 'SEG-FC',
    title: 'Finance et comptabilité',
    description: 'Spécialité orientée gestion financière et comptabilité.'
  },
  {
    id: 4,
    programId: 2,
    code: 'SEG-MO',
    title: 'Management des organisations',
    description: 'Spécialité orientée pilotage, gestion et entrepreneuriat.'
  }
];

const courses = [
  {
    id: 1,
    trackId: 1,
    code: 'SINT101',
    title: 'Algorithmique et structures de données',
    credits: 6,
    semester: 1,
    teacherEmail: 'professeur@ium-morave.edu'
  },
  {
    id: 2,
    trackId: 1,
    code: 'SINT102',
    title: 'Programmation orientée objet',
    credits: 6,
    semester: 1,
    teacherEmail: 'professeur@ium-morave.edu'
  },
  {
    id: 3,
    trackId: 2,
    code: 'SINT103',
    title: 'Réseaux informatiques',
    credits: 5,
    semester: 2,
    teacherEmail: 'professeur@ium-morave.edu'
  },
  {
    id: 4,
    trackId: 3,
    code: 'SEG101',
    title: 'Comptabilité générale',
    credits: 5,
    semester: 1,
    teacherEmail: 'professeur@ium-morave.edu'
  }
];

const enrollments = [
  {
    id: 1,
    studentEmail: 'jean.kabamba@ium-morave.edu',
    studentName: 'Jean Kabamba',
    matricule: 'IUM/2026/0001',
    programId: 1,
    trackId: 1,
    academicYear: '2025-2026',
    status: 'active'
  }
];

const students = [
  {
    id: 1,
    enrollmentId: 1,
    email: 'jean.kabamba@ium-morave.edu',
    name: 'Jean Kabamba',
    phone: '+243 000 000 000',
    status: 'active'
  }
];

const teachers = [
  {
    id: 1,
    email: 'professeur@ium-morave.edu',
    name: 'Professeur IUM',
    department: 'Sciences Informatiques et Nouvelles Technologies'
  }
];

const calendarEvents = [
  {
    id: 1,
    title: 'Rentrée académique',
    category: 'academic',
    startsAt: '2026-09-01',
    endsAt: '2026-09-01'
  },
  {
    id: 2,
    title: 'Session des examens',
    category: 'examination',
    startsAt: '2026-12-07',
    endsAt: '2026-12-19'
  },
  {
    id: 3,
    title: 'Délibérations du premier semestre',
    category: 'administration',
    startsAt: '2026-12-22',
    endsAt: '2026-12-23'
  }
];

const documents = [
  {
    id: 1,
    title: 'Règlement intérieur',
    filePath: '/documents/reglement-interieur.pdf',
    mime: 'application/pdf',
    visibility: 'public'
  },
  {
    id: 2,
    title: 'Guide de l’étudiant',
    filePath: '/documents/guide-etudiant.pdf',
    mime: 'application/pdf',
    visibility: 'student'
  }
];

const newsItems = [
  {
    id: 1,
    slug: 'lancement-portail-ium-morave',
    title: 'Lancement du portail IUM-MORAVE',
    summary: 'Le portail institutionnel est en cours de développement.',
    content: 'L’IUM-MORAVE met progressivement en place son portail numérique pour améliorer l’accès aux informations, formations et services universitaires.',
    category: 'institution',
    publishedAt: '2026-08-01'
  },
  {
    id: 2,
    slug: 'rentree-academique-2026',
    title: 'Préparation de la rentrée académique',
    summary: 'Les informations administratives et académiques seront publiées sur le portail.',
    content: 'Les étudiants et candidats pourront consulter les dates importantes, les programmes et les documents nécessaires à la rentrée académique.',
    category: 'academic',
    publishedAt: '2026-08-05'
  }
];

const grades = [
  { enrollmentId: 1, courseCode: 'INF101', courseTitle: 'Algorithmique', credits: 6, score: 15, status: 'validated' },
  { enrollmentId: 1, courseCode: 'INF102', courseTitle: 'Programmation', credits: 6, score: 14, status: 'validated' },
  { enrollmentId: 1, courseCode: 'MAT101', courseTitle: 'Mathématiques discrètes', credits: 4, score: 13, status: 'validated' }
];

const deliberations = [];

module.exports = {
  faculties,
  programs,
  tracks,
  courses,
  enrollments,
  students,
  teachers,
  calendarEvents,
  documents,
  newsItems,
  grades,
  deliberations
};
