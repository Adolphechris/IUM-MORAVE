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

const grades = [
  { enrollmentId: 1, courseCode: 'INF101', courseTitle: 'Algorithmique', credits: 6, score: 15, status: 'validated' },
  { enrollmentId: 1, courseCode: 'INF102', courseTitle: 'Programmation', credits: 6, score: 14, status: 'validated' },
  { enrollmentId: 1, courseCode: 'MAT101', courseTitle: 'Mathématiques discrètes', credits: 4, score: 13, status: 'validated' }
];

const deliberations = [];

module.exports = { faculties, programs, tracks, enrollments, grades, deliberations };
