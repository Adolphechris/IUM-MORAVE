# Design System - IUM-MORAVE (ébauche)

Date: 2026-08-01

Objectif
--------
Fournir une bibliothèque réutilisable de composants UI, tokens et guidelines pour garantir cohérence et rapidité de développement.

Design tokens
-------------
- Couleurs (voir docs/IDENTITE_VISUELLE.md)
- Typographie (families, sizes, weights)
- Spacing scale
- Border radius
- Elevation / shadows

Composants prioritaires
-----------------------
- Boutons (primary / secondary / ghost / disabled)
- Form controls (inputs, selects, checkboxes, radios)
- Cartes (news, faculty, program)
- Navbar / mobile menu
- Footer
- Alerts / notifications
- Modal / dialogs
- Lists / tables

Documentation
-------------
- Chaque composant doit inclure: spécification, variants, état (hover/focus/disabled), accessibilité (ARIA), example HTML/CSS/React.

Livrables initiaux
------------------
- docs/DESIGN_SYSTEM.md (ce document)
- UI kit (Figma / SVG library) — à ajouter dans repo or referenced design files
- Catalogue de composants (MD + exemples)

Prochaine étape
---------------
- Compléter tokens color/typo dans docs/IDENTITE_VISUELLE.md
- Prototyper les composants de base dans Storybook ou Figma
