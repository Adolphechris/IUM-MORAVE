import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* ── IDENTITÉ & SEO DE BASE ─────────────────────────────── */}
        <meta charSet="UTF-8" />
        <meta name="description" content="Institut Universitaire Morave de Mwene-Ditu (IUM-MORAVE) — Établissement d'enseignement supérieur reconnu par l'État congolais. Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018. Formations LMD : Licence, Master, Doctorat. Province de Lomami, République Démocratique du Congo." />
        <meta name="keywords" content="Institut Universitaire Morave, IUM, IUM-MORAVE, Mwene-Ditu, université RDC, université Congo, enseignement supérieur RDC, Lomami, ESU, LMD, licence master doctorat, université privée Congo, agrément ESU, formation universitaire Congo" />
        <meta name="author" content="Institut Universitaire Morave de Mwene-Ditu" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="7 days" />
        <meta name="geo.region" content="CD-LO" />
        <meta name="geo.placename" content="Mwene-Ditu, Province de Lomami, République Démocratique du Congo" />
        <meta name="geo.position" content="-6.60;23.56" />
        <meta name="ICBM" content="-6.60, 23.56" />

        {/* ── OPEN GRAPH (partage Facebook, WhatsApp, LinkedIn) ─── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Institut Universitaire Morave (IUM-MORAVE)" />
        <meta property="og:title" content="Institut Universitaire Morave de Mwene-Ditu | IUM-MORAVE" />
        <meta property="og:description" content="Établissement d'enseignement supérieur agréé par l'ESU — Agrément N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018. Programmes LMD en Droit, Sciences, Médecine, Économie. Mwene-Ditu, RDC." />
        <meta property="og:url" content="https://ium-morave.vercel.app" />
        <meta property="og:image" content="https://ium-morave.vercel.app/images/logo-crest.jpg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:locale" content="fr_CD" />

        {/* ── TWITTER / X CARD ─────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Institut Universitaire Morave (IUM-MORAVE) | Mwene-Ditu, RDC" />
        <meta name="twitter:description" content="Université agréée ESU en RDC — Formations LMD, excellence académique, Province de Lomami." />
        <meta name="twitter:image" content="https://ium-morave.vercel.app/images/logo-crest.jpg" />

        {/* ── DONNÉES STRUCTURÉES JSON-LD (Google Knowledge Panel) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollegeOrUniversity",
              "name": "Institut Universitaire Morave de Mwene-Ditu",
              "alternateName": ["IUM-MORAVE", "IUM", "Institut Universitaire Morave"],
              "description": "Établissement d'enseignement supérieur privé agréé par le Ministère de l'Enseignement Supérieur et Universitaire (ESU) de la République Démocratique du Congo. Agrément N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 avril 2018.",
              "url": "https://ium-morave.vercel.app",
              "logo": "https://ium-morave.vercel.app/images/logo-crest.jpg",
              "image": "https://ium-morave.vercel.app/images/logo-crest.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "B.P. 126",
                "addressLocality": "Mwene-Ditu",
                "addressRegion": "Province de Lomami",
                "addressCountry": "CD",
                "postalCode": "126"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "admissions",
                "url": "https://ium-morave.vercel.app/contact"
              },
              "foundingDate": "2018",
              "legalName": "Institut Universitaire Morave de Mwene-Ditu",
              "identifier": {
                "@type": "PropertyValue",
                "name": "Agrément ESU",
                "value": "N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018"
              },
              "numberOfStudents": {
                "@type": "QuantitativeValue",
                "value": 3000,
                "unitText": "étudiants inscrits"
              },
              "hasCredential": {
                "@type": "EducationalOccupationalCredential",
                "name": "Agrément Ministère de l'Enseignement Supérieur et Universitaire (ESU)",
                "credentialCategory": "Autorisation officielle d'enseignement supérieur",
                "recognizedBy": {
                  "@type": "GovernmentOrganization",
                  "name": "Ministère de l'Enseignement Supérieur et Universitaire (ESU)",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "CD"
                  }
                }
              },
              "sameAs": [
                "https://ium-morave.vercel.app"
              ]
            })
          }}
        />

        {/* ── POLICES GOOGLE ───────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* ── FAVICON & ICÔNES ─────────────────────────────────── */}
        <link rel="icon" type="image/jpg" href="/images/logo-crest.jpg" />
        <link rel="apple-touch-icon" href="/images/logo-crest.jpg" />
        <meta name="theme-color" content="#071e38" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
