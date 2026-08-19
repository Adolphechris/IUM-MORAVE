import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type Course = {
  id: number;
  code: string;
  title: string;
  credits: number;
  semester: number;
};

type Track = {
  id: number;
  code?: string;
  title: string;
  description: string;
  careers?: string[];
};

type Program = {
  id: number;
  code: string;
  title: string;
  level: string;
  durationMonths: number;
  description?: string;
  tracks: Track[];
  courses?: Course[];
};

type FacultyData = {
  id: number;
  code: string;
  name: string;
  description: string;
  dean?: string;
  heroImage?: string;
  programs: Program[];
  allTracks: Track[];
  globalCareers: string[];
};

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

// ─── BANQUE DE DONNÉES ACADÉMIQUES COMPLÈTE & RICHE (FALLBACK & SEED) ───
const FACULTIES_DATABASE: Record<string, FacultyData> = {
  '1': {
    id: 1,
    code: 'FST / FSINT',
    name: 'Faculté des Sciences Informatiques & Nouvelles Technologies',
    description: 'La Faculté des Sciences Informatiques et Nouvelles Technologies de l\'IUM-MORAVE forme les ingénieurs, concepteurs et experts du numérique de demain. Grâce à un cursus rigoureux alliant théorie fondamentale, travaux pratiques sur serveurs et projets d\'innovation, nos diplômés maîtrisent le développement logiciel, la cybersécurité, la science des données et les réseaux de télécommunication.',
    dean: 'Prof. Dr. Ir. Emmanuel Morave',
    heroImage: '/images/student-laptop.jpg',
    globalCareers: ['Ingénieur Génie Logiciel', 'Architecte Réseaux & Cloud', 'Expert en Cybersécurité', 'Data Scientist / Analyste IA', 'Chef de Projet Informatique', 'Administrateur Systèmes & Base de Données'],
    programs: [
      {
        id: 1,
        code: 'LIC-SINT',
        title: 'Licence en Sciences Informatiques & Nouvelles Technologies',
        level: 'Licence (Bac+3)',
        durationMonths: 36,
        description: 'Programme fondamental du système LMD permettant d\'acquérir une maîtrise solide des langages de programmation, de la modélisation informatique, des bases de données et des architectures matérielles et réseaux.',
        tracks: [
          {
            id: 1,
            code: 'SINT-DEV',
            title: 'Filière : Génie Logiciel & Développement d\'Applications',
            description: 'Conception d\'applications web, mobiles et d\'entreprises. Maîtrise des architectures microservices, des bases de données SQL/NoSQL et des méthodes de développement modernes.',
            careers: ['Développeur Full-Stack', 'Concepteur d\'Applications Mobiles', 'Analyste Développeur Enterprise']
          },
          {
            id: 2,
            code: 'SINT-RC',
            title: 'Filière : Réseaux Informatiques, Systèmes & Cybersécurité',
            description: 'Administration des infrastructures réseaux, virtualisation des serveurs, sécurité opérationnelle, pare-feu et protection des systèmes d\'information contre les cyberattaques.',
            careers: ['Administrateur Réseaux & Sécurité', 'Ingénieur Systèmes Linux/Windows', 'Consultant en Sécurité des SI']
          },
          {
            id: 3,
            code: 'SINT-IA',
            title: 'Filière : Intelligence Artificielle & Science des Données',
            description: 'Analyse de données massives (Big Data), apprentissage automatique (Machine Learning) et automatisation des processus décisionnels.',
            careers: ['Ingénieur Data / IA', 'Analyste BI (Business Intelligence)', 'Concepteur d\'Algorithmes']
          }
        ],
        courses: [
          { id: 1, code: 'INF101', title: 'Algorithmique & Structures de Données Avancées', credits: 6, semester: 1 },
          { id: 2, code: 'INF102', title: 'Programmation Orientée Objet (Java / C++)', credits: 6, semester: 1 },
          { id: 3, code: 'INF103', title: 'Architecture des Ordinateurs & Systèmes d\'Exploitation', credits: 5, semester: 1 },
          { id: 4, code: 'INF201', title: 'Conception de Bases de Données & SQL', credits: 6, semester: 2 },
          { id: 5, code: 'INF202', title: 'Réseaux Informatiques & Protocoles TCP/IP', credits: 5, semester: 2 },
          { id: 6, code: 'INF301', title: 'Développement Web Moderne (React / Node.js / Next.js)', credits: 6, semester: 3 },
          { id: 7, code: 'INF302', title: 'Sécurité des Systèmes d\'Information & Cryptographie', credits: 5, semester: 4 },
          { id: 8, code: 'INF401', title: 'Stage Professionnel & Mémoire de Fin de Cursus LMD', credits: 15, semester: 6 },
        ]
      },
      {
        id: 101,
        code: 'MST-SINT',
        title: 'Master en Ingénierie Informatique & Cybersécurité',
        level: 'Master (Bac+5)',
        durationMonths: 24,
        description: 'Formation supérieure spécialisée visant l\'expertise de haut niveau en gestion des systèmes complexes, audit de sécurité et direction technique.',
        tracks: [
          {
            id: 10,
            code: 'MST-CYBER',
            title: 'Spécialité : Gouvernance & Sécurité des Systèmes d\'Information',
            description: 'Audit de sécurité, normes ISO 27001, tests d\'intrusion (Pentesting) et gestion des risques technologiques.',
            careers: ['Chief Information Security Officer (CISO)', 'Auditeur Sécurité']
          },
          {
            id: 11,
            code: 'MST-CLOUD',
            title: 'Spécialité : Cloud Computing & DevOps',
            description: 'Déploiement continu, orchestration des conteneurs (Docker, Kubernetes) et architecture cloud scalable.',
            careers: ['DevOps Engineer', 'Architecte Cloud']
          }
        ]
      }
    ],
    allTracks: [],
  },

  '2': {
    id: 2,
    code: 'FSEG',
    name: 'Faculté des Sciences Économiques et de Gestion',
    description: 'La Faculté des Sciences Économiques et de Gestion forme les futurs leaders financiers, entrepreneurs, comptables agréés et économistes du développement. Elle dispense des compétences théoriques et pratiques de premier ordre pour naviguer avec succès dans le monde des affaires et des marchés financiers en Afrique.',
    dean: 'Prof. Dr. Mwamba Kabamba',
    heroImage: '/images/student-arcade.jpg',
    globalCareers: ['Directeur Financier (CFO)', 'Expert-Comptable / Auditeur', 'Analyste Économique', 'Gestionnaire de Portefeuille', 'Entrepreneur / Chef d\'Entreprise', 'Consultant en Management'],
    programs: [
      {
        id: 2,
        code: 'LIC-SEG',
        title: 'Licence en Sciences Économiques et de Gestion',
        level: 'Licence (Bac+3)',
        durationMonths: 36,
        description: 'Programme LMD axé sur les principes micro et macro-économiques, la comptabilité générale et analytique, le droit des affaires et le management des organisations.',
        tracks: [
          {
            id: 4,
            code: 'SEG-FC',
            title: 'Filière : Finance, Comptabilité & Audit',
            description: 'Maîtrise des normes comptables SYSCOHADA, analyse financière des bilans, gestion de la trésorerie et audit financier.',
            careers: ['Comptable d\'Entreprise', 'Auditeur Junior', 'Analyste Financier']
          },
          {
            id: 5,
            code: 'SEG-MO',
            title: 'Filière : Management & Gestion des Organisations',
            description: 'Stratégie d\'entreprise, gestion des ressources humaines, marketing et pilotage de projets d\'affaires.',
            careers: ['Chef de Projet', 'Responsable RH', 'Responsable Commercial']
          },
          {
            id: 6,
            code: 'SEG-ECO',
            title: 'Filière : Économie de Développement & Commerce International',
            description: 'Analyse des politiques publiques, commerce international, microfinance et développement économique régional.',
            careers: ['Économiste de Projet', 'Consultant en Développement', 'Chargé d\'Études']
          }
        ],
        courses: [
          { id: 10, code: 'ECO101', title: 'Microéconomie & Théorie du Consommateur', credits: 6, semester: 1 },
          { id: 11, code: 'ECO102', title: 'Comptabilité Générale SYSCOHADA I & II', credits: 6, semester: 1 },
          { id: 12, code: 'ECO103', title: 'Statistiques Descriptives & Probabilités', credits: 5, semester: 1 },
          { id: 13, code: 'ECO201', title: 'Analyse Financière & Diagnostic d\'Entreprise', credits: 6, semester: 2 },
          { id: 14, code: 'ECO202', title: 'Macroéconomie & Politiques Économiques', credits: 5, semester: 2 },
          { id: 15, code: 'ECO301', title: 'Gestion Budgétaire & Comptabilité Analytique', credits: 6, semester: 3 },
          { id: 16, code: 'ECO302', title: 'Stage d\'Imprégnation Professionnelle & Rapport LMD', credits: 15, semester: 6 },
        ]
      }
    ],
    allTracks: []
  },

  '3': {
    id: 3,
    code: 'FDSP',
    name: 'Faculté de Droit et Sciences Politiques',
    description: 'La Faculté de Droit et Sciences Politiques forme les juristes, avocats, magistrats, diplômés en relations internationales et cadres administratifs de demain. Elle offre une compréhension rigoureuse du droit congolais, du droit international et des institutions publiques.',
    dean: 'Prof. Dr. Kasongo Mukendi',
    heroImage: '/images/auditorium-exam.jpg',
    globalCareers: ['Avocat au Barreau', 'Magistrat / Juge', 'Juriste d\'Entreprise', 'Diplomate / Relations Internationales', 'Conseiller Juridique', 'Notaire / Huissier de Justice'],
    programs: [
      {
        id: 3,
        code: 'LIC-DSP',
        title: 'Licence en Droit & Sciences Politiques',
        level: 'Licence (Bac+3)',
        durationMonths: 36,
        description: 'Formation académique complète couvrant le droit privé, le droit public, le droit constitutionnel, le droit pénal et les théories politiques.',
        tracks: [
          {
            id: 7,
            code: 'DSP-PRIV',
            title: 'Filière : Droit Privé & des Affaires',
            description: 'Droit des obligations, droit commercial OHADA, droit du travail et droit des sociétés.',
            careers: ['Juriste d\'Affaires', 'Conseiller en Droit Social', 'Avocat Privatiste']
          },
          {
            id: 8,
            code: 'DSP-PUB',
            title: 'Filière : Droit Public & Administration',
            description: 'Droit administratif, droit constitutionnel, finances publiques et contentieux administratif.',
            careers: ['Cadre de l\'Administration Publique', 'Conseiller Juridique d\'État', 'Juriste Publiciste']
          },
          {
            id: 9,
            code: 'DSP-RI',
            title: 'Filière : Relations Internationales & Diplomatie',
            description: 'Droit international public, géopolitique, organisations internationales et négociation diplomatique.',
            careers: ['Diplomate', 'Analyste Géopolitique', 'Chargé de Mission ONG']
          }
        ],
        courses: [
          { id: 20, code: 'DRT101', title: 'Introduction Générale à l\'Étude du Droit', credits: 6, semester: 1 },
          { id: 21, code: 'DRT102', title: 'Droit Constitutionnel & Institutions Politiques', credits: 6, semester: 1 },
          { id: 22, code: 'DRT201', title: 'Droit des Obligations (Contrats & Responsabilité)', credits: 6, semester: 2 },
          { id: 23, code: 'DRT202', title: 'Droit Commercial Général (OHADA)', credits: 5, semester: 2 },
          { id: 24, code: 'DRT301', title: 'Droit Pénal Général & Procédure Pénale', credits: 6, semester: 3 },
          { id: 25, code: 'DRT302', title: 'Mémoire de Fin d\'Études & Clinique Juridique LMD', credits: 15, semester: 6 },
        ]
      }
    ],
    allTracks: []
  },

  '4': {
    id: 4,
    code: 'FMS',
    name: 'Faculté de Médecine et Santé Publique',
    description: 'La Faculté de Médecine et Santé Publique de l\'IUM-MORAVE forme les médecins généralistes, les spécialistes de santé communautaire, les épidémiologistes et les gestionnaires de santé. Elle s\'appuie sur des exigences cliniques de haut niveau pour répondre aux besoins sanitaires de la nation.',
    dean: 'Prof. Dr. Tshibangu Kalala',
    heroImage: '/images/student-campus.jpg',
    globalCareers: ['Médecin Généraliste', 'Spécialiste en Santé Publique', 'Épidémiologiste de Terrain', 'Gestionnaire d\'Établissement Hospitalier', 'Chargé de Projets Sanitaires (OMS/UNICEF)', 'Chercheur en Médecine'],
    programs: [
      {
        id: 4,
        code: 'DOC-MED',
        title: 'Doctorat en Médecine Générale',
        level: 'Doctorat d\'État (Bac+7)',
        durationMonths: 84,
        description: 'Cursus complet préparant à l\'exercice de la profession médicale, intégrant l\'anatomie, la physiologie, la sémiologie, la chirurgie, la pédiatrie, la gynécologie et les stages hospitaliers.',
        tracks: [
          {
            id: 12,
            code: 'MED-CLIN',
            title: 'Filière : Médecine Clinique & Chirurgie',
            description: 'Diagnostic, prise en charge médicale des pathologies, chirurgie générale et urgences.',
            careers: ['Médecin Clinicien', 'Urgentiste', 'Interne en Hôpital']
          },
          {
            id: 13,
            code: 'MED-SP',
            title: 'Filière : Santé Publique & Épidémiologie',
            description: 'Prévention sanitaire, lutte contre les épidémies, politique de santé et gestion des programmes sanitaires.',
            careers: ['Médecin de Santé Publique', 'Directeur d\'Hôpital', 'Épidémiologiste']
          }
        ],
        courses: [
          { id: 30, code: 'MED101', title: 'Anatomie Humaine Descriptive & Topographique', credits: 8, semester: 1 },
          { id: 31, code: 'MED102', title: 'Biologie Médicale & Biochimie Clinique', credits: 6, semester: 1 },
          { id: 32, code: 'MED201', title: 'Physiologie Humaine & Sémiologie Médicale', credits: 8, semester: 2 },
          { id: 33, code: 'MED301', title: 'Pharmacologie & Thérapeutique', credits: 6, semester: 3 },
          { id: 34, code: 'MED401', title: 'Stages Cliniques Intensifs en Milieu Hospitalier', credits: 30, semester: 8 },
        ]
      }
    ],
    allTracks: []
  },

  '5': {
    id: 5,
    code: 'FTH',
    name: 'Faculté de Théologie et Sciences des Religions',
    description: 'La Faculté de Théologie et Sciences des Religions de l\'IUM-MORAVE offre une formation académique, théologique, éthique et pastorale d\'excellence. Elle forme les leaders spirituels, exégètes, aumôniers, enseignants et cadres d\'organisations confessionnelles.',
    dean: 'Prof. Dr. Samuel Ntumba',
    heroImage: '/images/library-study.jpg',
    globalCareers: ['Pasteur / Leader Spirituel', 'Aumônier Militaire & Hospitalier', 'Enseignant-Chercheur en Théologie', 'Conseiller Éthique & Médiateur', 'Directeur d\'Organisation Confessionnelle (ONG)', 'Expert en Dialogue Interreligieux'],
    programs: [
      {
        id: 5,
        code: 'LIC-THEO',
        title: 'Licence en Théologie & Sciences des Religions',
        level: 'Licence (Bac+3)',
        durationMonths: 36,
        description: 'Cursus complet couvrant la théologie systématique, l’exégèse biblique, l’histoire de l’Église, l’éthique chrétienne, le grec ancien et l’hébreu biblique.',
        tracks: [
          {
            id: 14,
            code: 'FT-PAST',
            title: 'Filière : Théologie Pratique & Ministère Pastoral',
            description: 'Direction ecclésiale, homilétique, accompagnement pastoral et leadership spirituel.',
            careers: ['Pasteur Ministre', 'Aumônier', 'Responsable de Ministère']
          },
          {
            id: 15,
            code: 'FT-BIBL',
            title: 'Filière : Exégèse Biblique & Langues Orientales',
            description: 'Analyse textuelle approfondie, hébreu biblique, grec ancien et herméneutique.',
            careers: ['Exégète', 'Traducteur Biblique', 'Professeur de Théologie']
          },
          {
            id: 16,
            code: 'FT-ETH',
            title: 'Filière : Éthique, Société & Médiation',
            description: 'Éthique appliquée, bioéthique, éthique sociale et médiation culturelle et confessionnelle.',
            careers: ['Conseiller Éthique', 'Médiateur Interculturel', 'Cadre ONG Confessionnelle']
          }
        ],
        courses: [
          { id: 40, code: 'THO101', title: 'Introduction à la Théologie & Herméneutique', credits: 6, semester: 1 },
          { id: 41, code: 'THO102', title: 'Grec Biblique & Hébreu Fondamental', credits: 6, semester: 1 },
          { id: 42, code: 'THO201', title: 'Exégèse de l\'Ancien et du Nouveau Testament', credits: 6, semester: 2 },
          { id: 43, code: 'THO202', title: 'Histoire Générale du Christianisme & des Religions', credits: 5, semester: 2 },
          { id: 44, code: 'THO301', title: 'Théologie Systématique & Éthique Chrétienne', credits: 6, semester: 3 },
          { id: 45, code: 'THO302', title: 'Mémoire de Licence & Stage Pastoral LMD', credits: 15, semester: 6 },
        ]
      }
    ],
    allTracks: []
  }
};


export default function FacultyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const facultyIdStr = Array.isArray(id) ? id[0] : id;

    // Charger les données dynamiques si le serveur core-api répond
    fetch(`${apiUrl}/faculties/${facultyIdStr}`)
      .then(async (res) => {
        if (res.ok) {
          const apiData = await res.json();
          // Fusionner avec notre dataset riche
          const fallback = FACULTIES_DATABASE[facultyIdStr] || FACULTIES_DATABASE['1'];
          setFaculty({
            id: apiData.id || fallback.id,
            code: apiData.code || fallback.code,
            name: apiData.name || fallback.name,
            description: apiData.description || fallback.description,
            dean: fallback.dean,
            heroImage: fallback.heroImage,
            globalCareers: fallback.globalCareers,
            programs: (apiData.programs && apiData.programs.length > 0)
              ? apiData.programs.map((p: any) => ({
                  ...p,
                  tracks: p.tracks || fallback.programs[0]?.tracks || [],
                  courses: p.courses || fallback.programs[0]?.courses || [],
                }))
              : fallback.programs,
            allTracks: fallback.allTracks
          });
        } else {
          setFaculty(FACULTIES_DATABASE[facultyIdStr] || FACULTIES_DATABASE['1']);
        }
      })
      .catch(() => {
        setFaculty(FACULTIES_DATABASE[facultyIdStr] || FACULTIES_DATABASE['1']);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const activeFaculty = faculty || FACULTIES_DATABASE['1'];

  return (
    <>
      <Head>
        <title>{activeFaculty.name} | Institut Universitaire Morave (IUM-MORAVE)</title>
        <meta name="description" content={`Découvrez l'ensemble des filières, programmes LMD, spécialités et cours de la ${activeFaculty.name} de l'IUM-MORAVE à Mwene-Ditu.`} />
      </Head>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <header className="navbar">
        <div className="navbar-inner">
          <a href="/" className="brand">
            <div className="brand-crest">
              <img src="/images/logo-crest.jpg" alt="Blason Officiel IUM-MORAVE" className="crest-img" />
            </div>
            <div className="brand-text">
              <span className="brand-full">Institut Universitaire Morave</span>
              <span className="brand-short">IUM‑MORAVE</span>
            </div>
          </a>
          <nav className="nav-links">
            <a href="/">← Retour à l&apos;Accueil</a>
            <a href="/#formations">Toutes les Facultés</a>
            <a href="/contact">Admission &amp; Inscription</a>
            <a href="/espace" className="nav-cta">Espace Numérique →</a>
          </nav>
        </div>
      </header>

      {/* ── HERO DE LA FACULTÉ ───────────────────────────────── */}
      <section className="faculty-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge-row">
            <span className="code-badge">{activeFaculty.code}</span>
            <span className="hero-tag">Faculté Officielle IUM-MORAVE</span>
          </div>
          <h1>{activeFaculty.name}</h1>
          <p className="hero-desc">{activeFaculty.description}</p>

          <div className="faculty-meta-grid">
            <div className="meta-card">
              <span className="meta-icon">🎓</span>
              <div>
                <strong>Système LMD</strong>
                <span>Licence · Master · Doctorat</span>
              </div>
            </div>
            <div className="meta-card">
              <span className="meta-icon">📜</span>
              <div>
                <strong>Diplômes Homologués ESU</strong>
                <span>Agrément N°83/MINESU/2018</span>
              </div>
            </div>
            {activeFaculty.dean && (
              <div className="meta-card">
                <span className="meta-icon">🏛️</span>
                <div>
                  <strong>Doyen de la Faculté</strong>
                  <span>{activeFaculty.dean}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENU PRINCIPAL : PROGRAMMES ET FILIÈRES ──────── */}
      <main className="faculty-body">
        <div className="container">
          
          <div className="section-title-box">
            <p className="eyebrow">Offre Pédagogique Officielle</p>
            <h2>Programmes d&apos;Études &amp; Filières de la Faculté</h2>
            <p className="sub-text">
              Découvrez la liste complète et détaillée des programmes, filières spécialisées et cours dispensés au sein de cette faculté.
            </p>
          </div>

          {/* LISTE DES PROGRAMMES */}
          <div className="programs-container">
            {activeFaculty.programs.map((program) => (
              <section className="program-block" key={program.id}>
                
                <div className="program-header">
                  <div className="program-title-group">
                    <span className="program-level-badge">{program.level}</span>
                    <span className="program-code-tag">{program.code}</span>
                    <h3>{program.title}</h3>
                  </div>
                  <div className="program-duration">
                    ⏱️ Durée : <strong>{program.durationMonths / 12} ans</strong> ({program.durationMonths} mois)
                  </div>
                </div>

                {program.description && (
                  <p className="program-desc-text">{program.description}</p>
                )}

                {/* FILIÈRES & SPÉCIALITÉS */}
                <div className="tracks-section">
                  <h4 className="subsection-title">
                    📍 Filières &amp; Spécialités Disponibles ({program.tracks.length})
                  </h4>
                  <div className="tracks-grid">
                    {program.tracks.map((track) => (
                      <article className="track-card" key={track.id}>
                        <div className="track-card-header">
                          <span className="track-icon">🔹</span>
                          <div>
                            {track.code && <span className="track-code">{track.code}</span>}
                            <h5>{track.title}</h5>
                          </div>
                        </div>
                        <p className="track-desc">{track.description}</p>

                        {track.careers && track.careers.length > 0 && (
                          <div className="track-careers">
                            <strong>Débouchés de cette filière :</strong>
                            <div className="careers-tags">
                              {track.careers.map((career, i) => (
                                <span key={i} className="career-pill">✓ {career}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                {/* COURS & UNITÉS D'ENSEIGNEMENT */}
                {program.courses && program.courses.length > 0 && (
                  <div className="courses-section">
                    <h4 className="subsection-title">
                      📚 Aperçu des Unités d&apos;Enseignement (UE) &amp; Crédits
                    </h4>
                    <div className="table-responsive">
                      <table className="courses-table">
                        <thead>
                          <tr>
                            <th>Code UE</th>
                            <th>Intitulé de l&apos;Unité d&apos;Enseignement</th>
                            <th>Semestre</th>
                            <th>Crédits ECTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {program.courses.map((course) => (
                            <tr key={course.id}>
                              <td><span className="course-code">{course.code}</span></td>
                              <td className="course-title">{course.title}</td>
                              <td>Semestre {course.semester}</td>
                              <td><span className="credits-badge">{course.credits} Crédits</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </section>
            ))}
          </div>

          {/* SECTION DEBOUCHÉS ET OPPRTUNITES */}
          {activeFaculty.globalCareers && activeFaculty.globalCareers.length > 0 && (
            <section className="careers-banner">
              <div className="banner-content">
                <span className="banner-icon">🎯</span>
                <div>
                  <h3>Débouchés Professionnels &amp; Perspectives de Carrière</h3>
                  <p>Les diplômés de la {activeFaculty.name} sont préparés à occuper des postes à haute responsabilité dans le secteur privé, les administrations publiques et les organisations internationales :</p>
                  <div className="global-careers-grid">
                    {activeFaculty.globalCareers.map((item, idx) => (
                      <div className="global-career-card" key={idx}>
                        <span className="star-icon">★</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* BANDEAU ADMISSION INFO */}
          <section className="admission-notice-box">
            <div className="notice-inner">
              <div className="notice-text">
                <h3>Prêt à nous rejoindre ?</h3>
                <p>Consultez les modalités d&apos;admission ou contactez le secrétariat académique de la faculté pour plus d&apos;informations sur l&apos;ouverture des inscriptions.</p>
              </div>
              <div className="notice-action">
                <a href="/contact" className="btn btn-gold">Contacter la Scolarité →</a>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ── FOOTER INSTITUTIONNEL ────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/images/logo-crest.jpg" alt="Blason IUM-MORAVE" className="footer-crest-img" />
            <div>
              <strong>Institut Universitaire Morave</strong>
              <p>IUM‑MORAVE — L&apos;Excellence de l&apos;Enseignement Supérieur</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="/">Accueil</a>
            <a href="/#formations">Toutes les Facultés</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Institut Universitaire Morave de Mwene-Ditu (IUM-MORAVE) — Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 | B.P. 126 Mwene-Ditu, Lomami, RDC</p>
        </div>
      </footer>

      {/* ── STYLES CSS ───────────────────────────────────────── */}
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:       #071e38;
          --navy-light: #0b3d6b;
          --blue:       #0b5394;
          --sky:        #1a8cd8;
          --gold:       #f5b914;
          --gold-l:     #fde68a;
          --white:      #ffffff;
          --gray-50:    #f8fafc;
          --gray-100:   #f1f5f9;
          --gray-200:   #e2e8f0;
          --gray-500:   #64748b;
          --text:       #0f2340;
          --radius:     1rem;
          --shadow:     0 6px 24px rgba(7,30,56,.08);
        }

        body {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: var(--gray-50); color: var(--text);
          line-height: 1.65; -webkit-font-smoothing: antialiased;
        }

        /* NAVBAR */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(7,30,56,.96); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .navbar-inner {
          max-width: 1240px; margin: 0 auto; padding: .85rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .brand { display: flex; align-items: center; gap: .85rem; text-decoration: none; }
        .brand-crest {
          width: 2.75rem; height: 2.75rem; border-radius: 50%; overflow: hidden;
          border: 2px solid var(--gold); background: #fff;
        }
        .crest-img { width: 100%; height: 100%; object-fit: cover; }
        .brand-text { display: flex; flex-direction: column; }
        .brand-full { color: #fff; font-weight: 800; font-size: 1rem; }
        .brand-short { color: var(--gold); font-size: .72rem; font-weight: 700; }
        .nav-links { display: flex; align-items: center; gap: 1.5rem; }
        .nav-links a { color: rgba(255,255,255,.82); text-decoration: none; font-size: .9rem; font-weight: 500; }
        .nav-links a:hover { color: #fff; }
        .nav-cta {
          background: var(--gold) !important; color: var(--navy) !important;
          font-weight: 800 !important; padding: .55rem 1.2rem; border-radius: .5rem;
        }

        /* HERO FACULTÉ */
        .faculty-hero {
          position: relative; background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          color: #fff; padding: 5rem 1.5rem 4rem; text-align: center;
        }
        .hero-content { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-badge-row { display: flex; justify-content: center; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }
        .code-badge {
          background: var(--gold); color: var(--navy);
          font-weight: 900; font-size: .8rem; padding: .35rem .9rem; border-radius: 2rem;
        }
        .hero-tag { color: rgba(255,255,255,.8); font-size: .85rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .faculty-hero h1 { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; line-height: 1.15; margin-bottom: 1.25rem; color: #fff; }
        .hero-desc { font-size: 1.1rem; color: rgba(255,255,255,.85); line-height: 1.75; margin-bottom: 2.5rem; }

        .faculty-meta-grid {
          display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;
        }
        .meta-card {
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);
          padding: 1rem 1.5rem; border-radius: .75rem; display: flex; align-items: center; gap: .85rem; text-align: left;
        }
        .meta-icon { font-size: 1.6rem; }
        .meta-card strong { display: block; color: #fff; font-size: .95rem; }
        .meta-card span { color: var(--gold-l); font-size: .82rem; }

        /* BODY */
        .faculty-body { padding: 4.5rem 1.5rem; }
        .container { max-width: 1140px; margin: 0 auto; }
        .section-title-box { text-align: center; max-width: 750px; margin: 0 auto 3.5rem; }
        .eyebrow { color: var(--sky); font-size: .8rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: .4rem; }
        .section-title-box h2 { font-size: 2.2rem; font-weight: 800; color: var(--navy); margin-bottom: .5rem; }
        .sub-text { color: var(--gray-500); font-size: 1.05rem; }

        /* PROGRAM BLOCK */
        .program-block {
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius); padding: 2.5rem; margin-bottom: 3rem;
          box-shadow: var(--shadow);
        }
        .program-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 1.5rem; border-bottom: 2px solid var(--gray-100); padding-bottom: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .program-title-group { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; }
        .program-level-badge {
          background: #e7f3fc; color: var(--blue); font-size: .75rem; font-weight: 800;
          padding: .3rem .85rem; border-radius: 2rem; text-transform: uppercase;
        }
        .program-code-tag {
          background: #fef9c3; color: #92400e; font-size: .75rem; font-weight: 800;
          padding: .3rem .85rem; border-radius: 2rem;
        }
        .program-header h3 { font-size: 1.5rem; font-weight: 800; color: var(--navy); width: 100%; margin-top: .5rem; }
        .program-duration { background: var(--gray-50); padding: .5rem 1rem; border-radius: .5rem; font-size: .9rem; color: var(--gray-700); }
        .program-desc-text { color: var(--gray-500); font-size: 1rem; line-height: 1.7; margin-bottom: 2rem; }

        /* TRACKS GRID */
        .subsection-title { font-size: 1.15rem; font-weight: 800; color: var(--navy); margin-bottom: 1.25rem; }
        .tracks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem; }
        .track-card {
          background: var(--gray-50); border: 1px solid var(--gray-200);
          border-radius: .75rem; padding: 1.5rem; display: flex; flex-direction: column; gap: .75rem;
          transition: transform .2s, border-color .2s;
        }
        .track-card:hover { transform: translateY(-3px); border-color: var(--sky); }
        .track-card-header { display: flex; align-items: flex-start; gap: .6rem; }
        .track-icon { font-size: 1.1rem; color: var(--sky); }
        .track-code { font-size: .7rem; font-weight: 800; color: var(--sky); text-transform: uppercase; display: block; }
        .track-card h5 { font-size: 1.05rem; font-weight: 800; color: var(--navy); line-height: 1.3; }
        .track-desc { font-size: .9rem; color: var(--gray-500); line-height: 1.6; flex: 1; }
        .track-careers { margin-top: .5rem; border-top: 1px dashed var(--gray-200); padding-top: .75rem; }
        .track-careers strong { font-size: .78rem; color: var(--navy); display: block; margin-bottom: .4rem; }
        .careers-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
        .career-pill { background: #fff; border: 1px solid var(--gray-200); color: var(--gray-700); font-size: .75rem; font-weight: 600; padding: .2rem .5rem; border-radius: .3rem; }

        /* COURSES TABLE */
        .table-responsive { overflow-x: auto; margin-top: 1rem; }
        .courses-table { width: 100%; border-collapse: collapse; text-align: left; font-size: .9rem; }
        .courses-table th { background: var(--navy); color: #fff; font-weight: 700; padding: .75rem 1rem; font-size: .82rem; text-transform: uppercase; }
        .courses-table td { padding: .85rem 1rem; border-bottom: 1px solid var(--gray-200); }
        .course-code { font-weight: 800; color: var(--blue); font-size: .8rem; }
        .course-title { font-weight: 600; color: var(--navy); }
        .credits-badge { background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: .75rem; padding: .25rem .6rem; border-radius: 2rem; }

        /* CAREERS BANNER */
        .careers-banner {
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          color: #fff; border-radius: var(--radius); padding: 2.5rem; margin-bottom: 3rem; box-shadow: var(--shadow);
        }
        .banner-content { display: flex; gap: 1.5rem; align-items: flex-start; }
        .banner-icon { font-size: 2.5rem; flex-shrink: 0; }
        .banner-content h3 { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: .5rem; }
        .banner-content p { color: rgba(255,255,255,.82); font-size: .95rem; margin-bottom: 1.5rem; }
        .global-careers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .85rem; }
        .global-career-card {
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);
          padding: .75rem 1rem; border-radius: .5rem; display: flex; align-items: center; gap: .6rem; font-weight: 600; font-size: .9rem;
        }
        .star-icon { color: var(--gold); }

        /* NOTICE BOX */
        .admission-notice-box {
          background: #fff; border: 2px solid var(--gold); border-radius: var(--radius);
          padding: 2rem 2.5rem; box-shadow: var(--shadow);
        }
        .notice-inner { display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; }
        .notice-text h3 { font-size: 1.3rem; font-weight: 800; color: var(--navy); margin-bottom: .3rem; }
        .notice-text p { color: var(--gray-500); font-size: .95rem; }
        .btn-gold { background: var(--gold); color: var(--navy); font-weight: 800; padding: .85rem 1.75rem; border-radius: .5rem; text-decoration: none; display: inline-block; }

        /* FOOTER */
        .footer { background: var(--navy); color: rgba(255,255,255,.65); margin-top: 5rem; }
        .footer-inner { max-width: 1240px; margin: 0 auto; padding: 3rem 1.5rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
        .footer-brand { display: flex; align-items: center; gap: 1rem; }
        .footer-crest-img { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 2px solid var(--gold); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { color: rgba(255,255,255,.7); text-decoration: none; font-size: .88rem; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,.08); padding: 1rem 1.5rem; text-align: center; font-size: .78rem; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .program-header { flex-direction: column; gap: Standard; }
          .tracks-grid { grid-template-columns: 1fr; }
          .banner-content { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
