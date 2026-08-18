const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const projectId = process.env.FIREBASE_PROJECT_ID || 'iumorave';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@iumorave.iam.gserviceaccount.com';
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!privateKey) {
  console.error('FIREBASE_PRIVATE_KEY environment variable is required to run seed script.');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    })
  });
}

const db = getFirestore();

async function seed() {
  console.log('Seeding initial data into Firebase Firestore...');

  // Seed Users
  const users = [
    {
      id: 'admin-1',
      email: 'admin@ium-morave.edu',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'IUM',
      passwordHash: '$2a$10$wT8d06q8a8Q5W0uM8gX8uO4M/1g2f3e4d5c6b7a8b9c0d1e2f3g4h'
    },
    {
      id: 'student-1',
      email: 'jean.kabamba@ium-morave.edu',
      role: 'student',
      firstName: 'Jean',
      lastName: 'Kabamba',
      matricule: '2026-SINT-042'
    },
    {
      id: 'teacher-1',
      email: 'prof.mukendi@ium-morave.edu',
      role: 'teacher',
      firstName: 'Prof.',
      lastName: 'Mukendi'
    }
  ];

  for (const user of users) {
    await db.collection('users').doc(user.id).set(user, { merge: true });
    console.log(`- User seeded: ${user.email}`);
  }

  // Seed Sample Diplomas
  const diplomas = [
    {
      id: 'IUM-2026-0042',
      studentName: 'Jean Kabamba',
      matricule: '2026-SINT-042',
      programTitle: 'Licence en Sciences Informatiques',
      level: 'Licence (LMD)',
      mention: 'Distinction',
      issuedDate: '2026-07-25',
      weightedAverage: 16.4,
      documentSignature: 'SIG-IUM-2026-SECURE-HMAC-0042'
    },
    {
      id: 'IUM-2026-0018',
      studentName: 'Marie Tshilombo',
      matricule: '2026-MED-018',
      programTitle: 'Doctorat en Médecine Générale',
      level: 'Doctorat',
      mention: 'Grande Distinction',
      issuedDate: '2026-07-26',
      weightedAverage: 17.8,
      documentSignature: 'SIG-IUM-2026-SECURE-HMAC-0018'
    }
  ];

  for (const diploma of diplomas) {
    await db.collection('diplomas').doc(diploma.id).set(diploma, { merge: true });
    console.log(`- Diploma seeded: ${diploma.id}`);
  }

  // Seed Sample Transcripts
  const transcripts = [
    {
      id: 'TR-2026-0042',
      studentName: 'Jean Kabamba',
      matricule: '2026-SINT-042',
      programTitle: 'Licence en Sciences Informatiques',
      academicYear: '2025-2026',
      weightedAverage: 16.4,
      decision: 'ADMIS (Mention Distinction)',
      issuedAt: '2026-07-25T10:00:00Z',
      integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      documentSignature: 'SIG-IUM-2026-SECURE-HMAC'
    }
  ];

  for (const transcript of transcripts) {
    await db.collection('transcripts').doc(transcript.id).set(transcript, { merge: true });
    console.log(`- Transcript seeded: ${transcript.id}`);
  }

  console.log('Firebase Firestore seeding complete!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
