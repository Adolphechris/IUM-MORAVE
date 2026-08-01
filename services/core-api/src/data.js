const faculties = [
  {
    id: 1,
    code: 'FST',
    name: 'Faculté des Sciences et Technologies',
    description: 'Informatique, Mathématiques, Physique'
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
    code: 'LIC-INF',
    title: 'Licence Informatique',
    level: 'licence',
    durationMonths: 36
  },
  {
    id: 2,
    facultyId: 1,
    code: 'MST-IA',
    title: 'Master Intelligence Artificielle',
    level: 'master',
    durationMonths: 24
  }
];

const tracks = [
  {
    id: 1,
    programId: 1,
    code: 'LIC-INF-AI',
    title: 'Parcours Intelligence Artificielle',
    description: 'Option IA pour la licence informatique.'
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
