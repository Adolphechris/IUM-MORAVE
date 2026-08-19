import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* ── IDENTITÉ & SEO DE BASE ─────────────────────────────── */}
        <meta charSet="UTF-8" />
        <meta name="description" content="Institut Universitaire Morave de Mwene-Ditu (IUM-MORAVE) — Établissement d'enseignement supérieur reconnu par l'État congolais. Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018. Formations LMD : Licence, Master, Doctorat. Province de Lomami, République Démocratique du Congo." />
        <meta name="keywords" content="Institut Universitaire Morave, IUM, IUM-MORAVE, Mwene-Ditu, université RDC, université Congo, enseignement supérieur RDC, Lomami, ESU, LMD, licence master doctorat, université privée Congo, agrément ESU, formation universitaire Congo" />
        <meta name="author" content="Institut Universitaire Morave de Mwene-Ditu" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="google-site-verification" content="I73eZusNlcSE4dHkAjWrxgVP54aZHTbpb9IUduLUBFE" />
        <meta name="google-site-verification" content="oXEc-8CKsWsLHbr9evojDZhrlSgjJSFUuyf4oLnoKcg" />
        <meta name="google-site-verification" content="T-Q3qt1mbofsJWPvUXY9yvZPtlq8TBf4sC_k9WTJTSE" />

        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="7 days" />
        <meta name="geo.region" content="CD-LO" />
        <meta name="geo.placename" content="Mwene-Ditu, Province de Lomami, République Démocratique du Congo" />
        <meta name="geo.position" content="-6.60;23.56" />
        <meta name="ICBM" content="-6.60, 23.56" />

        {/* ── ICÔNES ET FAVICON DU DOMAINE (BLASON IUM-MORAVE POUR GOOGLE & NAVIGATEURS) ── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo-crest.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/images/logo-crest.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo-crest.jpg" />

        {/* ── OPEN GRAPH (partage Facebook, WhatsApp, LinkedIn) ─── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Institut Universitaire Morave (IUM-MORAVE)" />
        <meta property="og:title" content="Institut Universitaire Morave de Mwene-Ditu | IUM-MORAVE" />
        <meta property="og:description" content="Établissement d'enseignement supérieur agréé par l'ESU — Agrément N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018. Programmes LMD en Droit, Sciences, Médecine, Économie, Théologie. Mwene-Ditu, RDC." />
        <meta property="og:url" content="https://iumorave-ac.org" />
        <meta property="og:image" content="https://iumorave-ac.org/images/logo-crest.jpg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:locale" content="fr_CD" />

        {/* ── TWITTER / X CARD ─────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Institut Universitaire Morave (IUM-MORAVE) | Mwene-Ditu, RDC" />
        <meta name="twitter:description" content="Université agréée ESU en RDC — Formations LMD, excellence académique, Province de Lomami." />
        <meta name="twitter:image" content="https://iumorave-ac.org/images/logo-crest.jpg" />

        {/* ── NOM DU SITE GOOGLE SEARCH (WebSite Schema) ─────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Institut Universitaire Morave",
              "alternateName": ["IUM-MORAVE", "IUM MORAVE", "Institut Universitaire Morave de Mwene-Ditu"],
              "url": "https://iumorave-ac.org/"
            })
          }}
        />

        {/* ── DONNÉES STRUCTURÉES JSON-LD (Google Knowledge Panel) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollegeOrUniversity",
              "name": "Institut Universitaire Morave Willsamal",
              "alternateName": ["IUM-MORAVE", "IUM", "Institut Universitaire Morave de Mwene-Ditu", "IUM Willsamal"],
              "description": "Établissement d'enseignement supérieur privé agréé par le Ministère de l'Enseignement Supérieur et Universitaire (ESU) de la République Démocratique du Congo. Agrément N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018.",
              "url": "https://iumorave-ac.org",
              "logo": "https://iumorave-ac.org/images/logo-crest.jpg",
              "image": "https://iumorave-ac.org/images/logo-crest.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Avenue Aérodrome, Quartier Mandam, Commune de Bondoyi, B.P. 126",
                "addressLocality": "Mwene-Ditu",
                "addressRegion": "Province de Lomami",
                "addressCountry": "CD",
                "postalCode": "126"
              },
              "founder": {
                "@type": "Person",
                "name": "Prof. Dr. Isaac Jean Claude Tshilumbayi",
                "jobTitle": "Recteur & 1er Vice-Président de l'Assemblée Nationale"
              },
              "employee": {
                "@type": "Person",
                "name": "Dr. Marc Nsalanga Kayumba",
                "jobTitle": "Directeur Général"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "admissions",
                "email": "secretariat@iumorave-ac.org",
                "url": "https://iumorave-ac.org/contact"
              },
              "foundingDate": "2018",
              "legalName": "Institut Universitaire Morave Willsamal de Mwene-Ditu",

              "identifier": {
                "@type": "PropertyValue",
                "name": "Agrément ESU",
                "value": "N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018"
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
                "https://iumorave-ac.org"
              ]
            })
          }}
        />

        {/* ── POLICES GOOGLE ───────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
