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

module.exports = { faculties, programs, tracks };
