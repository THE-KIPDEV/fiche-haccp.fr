export interface FicheHACCP {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  category: string;
  legalBasis: string;
  frequency: string;
  content: {
    title: string;
    text: string;
  }[];
  pdfSections: {
    title: string;
    fields: string[];
  }[];
}

export const CATEGORIES = [
  { id: "hygiene", label: "Hygiène et nettoyage", icon: "spray-can" },
  { id: "tracabilite", label: "Traçabilité", icon: "clipboard-list" },
  { id: "securite", label: "Sécurité alimentaire", icon: "alert-triangle" },
  { id: "temperatures", label: "Contrôle des températures", icon: "thermometer" },
  { id: "equipements", label: "Équipements", icon: "wrench" },
] as const;

export const FICHES: FicheHACCP[] = [
  {
    id: 1,
    slug: "plan-nettoyage-desinfection",
    title: "Plan de nettoyage et de désinfection",
    shortTitle: "Nettoyage et désinfection",
    description:
      "Plan de nettoyage et désinfection complet pour restaurant. Fréquences, produits utilisés, procédures et responsables pour chaque zone de l'établissement.",
    metaTitle: "Plan de nettoyage et désinfection restaurant HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez le plan de nettoyage et désinfection HACCP pour votre restaurant. Document complet conforme au règlement CE 852/2004.",
    icon: "spray-can",
    category: "hygiene",
    legalBasis:
      "Règlement (CE) n° 852/2004 – Annexe II, Chapitre I et V. Arrêté du 21 décembre 2009, articles 12 à 14.",
    frequency: "Selon le planning défini (quotidien à mensuel)",
    content: [
      {
        title: "Pourquoi un plan de nettoyage est obligatoire ?",
        text: "Le plan de nettoyage et de désinfection (PND) est un document obligatoire dans le cadre du Plan de Maîtrise Sanitaire (PMS). Il détaille pour chaque zone et chaque équipement : quoi nettoyer, quand, comment, avec quoi, et par qui. Il doit être affiché et accessible à tout le personnel.",
      },
      {
        title: "Contenu du plan",
        text: "Le plan doit couvrir : les surfaces de travail, le matériel de cuisine, les sols et murs, les sanitaires, les poubelles, les chambres froides, la vaisselle, les véhicules de livraison le cas échéant. Pour chaque élément, précisez : le produit utilisé (nom commercial, dosage), la méthode (pulvérisation, trempage, etc.), la fréquence, le temps de contact, le rinçage éventuel, et le responsable.",
      },
      {
        title: "Méthode TACT",
        text: "Le nettoyage efficace repose sur 4 paramètres (TACT) : Température de l'eau, Action mécanique (frotter, brosser), Concentration du produit, Temps de contact. Respectez les fiches techniques des produits et les dosages recommandés. Utilisez toujours des produits homologués pour le contact alimentaire.",
      },
    ],
    pdfSections: [
      {
        title: "Plan de nettoyage et désinfection",
        fields: [
          "Zone / Équipement",
          "Opération",
          "Produit utilisé",
          "Dosage",
          "Méthode",
          "Fréquence",
          "Temps de contact",
          "Responsable",
          "Vérification",
          "Date",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "tracabilite-produits",
    title: "Fiche de traçabilité des produits alimentaires",
    shortTitle: "Traçabilité produits",
    description:
      "Fiche de traçabilité obligatoire permettant de suivre l'origine et le parcours des denrées alimentaires de la réception à la vente.",
    metaTitle: "Fiche traçabilité produits HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche de traçabilité des produits alimentaires HACCP. Obligation légale pour tout restaurant, conforme au règlement CE 178/2002.",
    icon: "clipboard-list",
    category: "tracabilite",
    legalBasis:
      "Règlement (CE) n° 178/2002, articles 18 et 19, relatif à la traçabilité des denrées alimentaires. Règlement d'exécution (UE) n° 931/2011 pour les denrées d'origine animale.",
    frequency: "À chaque réception et utilisation",
    content: [
      {
        title: "Obligation de traçabilité",
        text: "Tout exploitant du secteur alimentaire doit être en mesure d'identifier ses fournisseurs et les destinataires de ses produits (traçabilité « un pas en avant, un pas en arrière »). Cette obligation permet, en cas de crise sanitaire, de retirer rapidement les produits du marché. Les documents de traçabilité doivent être conservés pendant 5 ans.",
      },
      {
        title: "Informations à enregistrer",
        text: "Pour chaque produit réceptionné : nom du fournisseur, adresse, date de livraison, nature du produit, quantité, numéro de lot, DLC ou DDM, pays d'origine (obligatoire pour les viandes). Conservez les bons de livraison, factures et étiquettes comme justificatifs.",
      },
      {
        title: "En cas de rappel produit",
        text: "Si un de vos fournisseurs émet un rappel produit, vous devez pouvoir retrouver immédiatement si le lot concerné est encore en stock ou a été servi. Si le produit est encore en stock, isolez-le immédiatement et contactez votre fournisseur. Signalez l'incident aux autorités si nécessaire.",
      },
    ],
    pdfSections: [
      {
        title: "Traçabilité des produits",
        fields: [
          "Date de réception",
          "Fournisseur",
          "Produit",
          "N° de lot",
          "DLC / DDM",
          "Quantité reçue",
          "Origine / Pays",
          "Température (°C)",
          "Conforme (O/N)",
          "Date utilisation",
          "Contrôleur",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "fiche-non-conformite",
    title: "Fiche de non-conformité et actions correctives",
    shortTitle: "Non-conformité",
    description:
      "Fiche d'enregistrement des non-conformités détectées et des actions correctives mises en place. Document essentiel du système HACCP.",
    metaTitle: "Fiche non-conformité HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche de non-conformité HACCP avec actions correctives. Document obligatoire pour le Plan de Maîtrise Sanitaire de votre restaurant.",
    icon: "alert-triangle",
    category: "securite",
    legalBasis:
      "Règlement (CE) n° 852/2004, article 5. Codex Alimentarius – Principes généraux d'hygiène alimentaire, 7ème principe HACCP (documentation).",
    frequency: "À chaque détection de non-conformité",
    content: [
      {
        title: "Qu'est-ce qu'une non-conformité ?",
        text: "Une non-conformité est tout écart par rapport aux procédures, aux normes ou aux seuils critiques définis dans votre plan HACCP. Exemples : température de stockage trop élevée, produit reçu avec DLC dépassée, absence de nettoyage d'un équipement, nuisible détecté, corps étranger trouvé dans un aliment.",
      },
      {
        title: "Procédure de gestion",
        text: "1. Identifier et décrire la non-conformité. 2. Prendre des mesures immédiates (isoler le produit, arrêter le process). 3. Analyser les causes (méthode des 5M : Matière, Milieu, Méthode, Matériel, Main d'œuvre). 4. Définir et mettre en œuvre une action corrective. 5. Vérifier l'efficacité de l'action. 6. Enregistrer toute la démarche dans cette fiche.",
      },
      {
        title: "Conservation des fiches",
        text: "Les fiches de non-conformité doivent être archivées pendant 5 ans minimum. Elles font partie des documents pouvant être demandés lors d'un contrôle de la DDPP (Direction Départementale de la Protection des Populations). Elles démontrent votre démarche active de maîtrise des risques.",
      },
    ],
    pdfSections: [
      {
        title: "Fiche de non-conformité",
        fields: [
          "Date",
          "Détecté par",
          "Zone concernée",
          "Description",
          "Gravité",
          "Mesure immédiate",
          "Analyse causes",
          "Action corrective",
          "Responsable",
          "Date mise en œuvre",
          "Vérification",
          "Date clôture",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "suivi-huiles-friture",
    title: "Fiche de suivi des huiles de friture",
    shortTitle: "Huiles de friture",
    description:
      "Fiche de contrôle et suivi des huiles de friture. Test de qualité, changement et élimination conformes à la réglementation.",
    metaTitle: "Fiche suivi huiles de friture HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de suivi des huiles de friture. Contrôle de qualité obligatoire, conforme au décret 2008-184.",
    icon: "flame",
    category: "equipements",
    legalBasis:
      "Décret n° 2008-184 du 26 février 2008 relatif aux huiles de friture. Le taux de composés polaires ne doit pas dépasser 25%. Recommandation ANSES sur le renouvellement des bains de friture.",
    frequency: "Quotidien (contrôle visuel) + test composés polaires régulier",
    content: [
      {
        title: "Réglementation des huiles de friture",
        text: "Le seuil réglementaire de 25% de composés polaires ne doit jamais être dépassé. Au-delà, l'huile devient toxique et doit être immédiatement changée. Des tests réguliers avec des bandelettes ou un testeur électronique sont recommandés. L'huile usagée doit être collectée par un prestataire agréé (interdiction de la jeter dans les égouts).",
      },
      {
        title: "Bonnes pratiques",
        text: "La durée de vie de l'huile dépend du type d'aliment frit, de la température et du filtrage. Ne pas se fier à un nombre fixe de bains. Contrôler régulièrement avec un testeur de composés polaires : l'huile doit être changée dès que le taux approche 25% (seuil réglementaire du décret 2008-184). Filtrer l'huile après chaque service pour prolonger sa durée de vie. Ne jamais mélanger huile neuve et huile usagée. Ne pas dépasser 180°C. Couvrir la friteuse quand elle n'est pas utilisée. Ne pas ajouter de sel dans le bain de friture. Utiliser une huile adaptée à la friture (tournesol oléique, arachide).",
      },
    ],
    pdfSections: [
      {
        title: "Suivi des huiles de friture",
        fields: [
          "Date",
          "Friteuse",
          "Type d'huile",
          "Contrôle visuel",
          "Composés polaires (%)",
          "Conforme (O/N)",
          "Action",
          "Huile neuve (O/N)",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "refroidissement-rapide",
    title: "Fiche de suivi du refroidissement rapide",
    shortTitle: "Refroidissement rapide",
    description:
      "Fiche de contrôle du refroidissement rapide des préparations chaudes. Obligation de passage de +63°C à +10°C en moins de 2 heures.",
    metaTitle: "Fiche refroidissement rapide HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de refroidissement rapide. Contrôle obligatoire du passage de +63°C à +10°C en moins de 2h.",
    icon: "snowflake",
    category: "temperatures",
    legalBasis:
      "Arrêté du 21 décembre 2009, article 8. Règlement (CE) n° 852/2004 – Annexe II, Chapitre IX. Le refroidissement doit être effectué de +63°C à +10°C en moins de 2 heures.",
    frequency: "À chaque opération de refroidissement",
    content: [
      {
        title: "Règle du refroidissement rapide",
        text: "Toute préparation culinaire destinée à être servie froide ou réchauffée ultérieurement doit subir un refroidissement rapide : passage de +63°C à +10°C en moins de 2 heures, puis stockage immédiat à +3°C maximum. Cette étape est un CCP (Point de Contrôle Critique) majeur car la plage 10°C-63°C est la zone de danger de prolifération bactérienne.",
      },
      {
        title: "Équipement et méthode",
        text: "Utilisez une cellule de refroidissement rapide (obligatoire pour les grands volumes). Pour les petites quantités, un bain-marie froid (eau + glace) peut être utilisé. Ne jamais mettre un plat chaud directement au réfrigérateur (risque de réchauffer les autres denrées). Portionnez les grandes quantités pour accélérer le refroidissement.",
      },
    ],
    pdfSections: [
      {
        title: "Suivi du refroidissement rapide",
        fields: [
          "Date",
          "Préparation",
          "Heure début",
          "Temp. début (°C)",
          "Heure fin",
          "Temp. fin (°C)",
          "Durée",
          "Conforme <2h (O/N)",
          "Méthode",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "remise-en-temperature",
    title: "Fiche de suivi de la remise en température",
    shortTitle: "Remise en température",
    description:
      "Fiche de contrôle de la remise en température des plats. Obligation de passage à +63°C à cœur en moins d'une heure.",
    metaTitle: "Fiche remise en température HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de remise en température. Obligation d'atteindre +63°C à cœur en moins d'1h, conforme à l'arrêté du 21/12/2009.",
    icon: "thermometer",
    category: "temperatures",
    legalBasis:
      "Arrêté du 21 décembre 2009, article 9. La remise en température doit permettre d'atteindre +63°C à cœur en moins d'une heure. Le produit doit être servi immédiatement ou maintenu à +63°C minimum.",
    frequency: "À chaque opération de remise en température",
    content: [
      {
        title: "Règle de la remise en température",
        text: "La remise en température d'un plat préalablement refroidi doit atteindre +63°C à cœur en moins d'une heure. Le plat doit ensuite être servi immédiatement ou maintenu à une température supérieure ou égale à +63°C en bain-marie ou vitrine chaude. Un plat remis en température ne doit jamais être refroidi une seconde fois.",
      },
      {
        title: "Points de vigilance",
        text: "Utilisez un thermomètre à sonde pour vérifier la température à cœur. Ne remettez en température que la quantité nécessaire pour le service. Tout reste non consommé après remise en température doit être jeté. La traçabilité de chaque opération de remise en température est obligatoire.",
      },
    ],
    pdfSections: [
      {
        title: "Suivi de la remise en température",
        fields: [
          "Date",
          "Préparation",
          "Heure début",
          "Temp. début (°C)",
          "Heure fin",
          "Temp. à cœur (°C)",
          "Durée",
          "Conforme (O/N)",
          "Service / Maintien",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 7,
    slug: "reception-marchandises",
    title: "Fiche de contrôle à la réception des marchandises",
    shortTitle: "Réception marchandises",
    description:
      "Fiche complète de contrôle à la réception des marchandises : état des emballages, étiquetage, DLC, aspect visuel, température et conformité.",
    metaTitle: "Fiche contrôle réception marchandises HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de contrôle à la réception des marchandises. Vérification complète des livraisons pour votre restaurant.",
    icon: "package",
    category: "tracabilite",
    legalBasis:
      "Règlement (CE) n° 852/2004 – Annexe II. Règlement (CE) n° 178/2002 relatif à la traçabilité. Arrêté du 21 décembre 2009.",
    frequency: "À chaque livraison",
    content: [
      {
        title: "Points de contrôle à la réception",
        text: "À chaque livraison, vérifiez : l'état du véhicule de livraison (propreté, température), l'intégrité des emballages (pas de déchirure, pas de bosse), les dates (DLC, DDM non dépassées), la conformité de l'étiquetage (dénomination, ingrédients, allergènes, origine), l'aspect visuel et olfactif des produits, les températures (avec thermomètre sonde).",
      },
      {
        title: "Critères de refus",
        text: "Vous devez refuser une livraison si : la température est non conforme, les DLC sont dépassées ou trop courtes, les emballages sont endommagés, les produits présentent un aspect ou une odeur anormale, l'étiquetage est absent ou non conforme, le bon de livraison ne correspond pas à la commande. Notez le refus sur cette fiche et informez le fournisseur.",
      },
    ],
    pdfSections: [
      {
        title: "Contrôle à la réception des marchandises",
        fields: [
          "Date / Heure",
          "Fournisseur",
          "N° BL",
          "Produit",
          "Qté cmd / reçue",
          "DLC / DDM",
          "N° lot",
          "Emballage (O/N)",
          "Aspect / Odeur",
          "Temp. (°C)",
          "Accepté (O/N)",
          "Motif refus",
          "Contrôleur",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 8,
    slug: "entretien-equipements",
    title: "Fiche d'entretien et maintenance des équipements",
    shortTitle: "Entretien équipements",
    description:
      "Fiche de suivi de l'entretien et de la maintenance préventive des équipements de cuisine. Planification et historique des interventions.",
    metaTitle: "Fiche entretien équipements cuisine HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP d'entretien des équipements de cuisine. Suivi de maintenance préventive pour votre restaurant.",
    icon: "wrench",
    category: "equipements",
    legalBasis:
      "Règlement (CE) n° 852/2004 – Annexe II, Chapitre V. Les équipements doivent être maintenus en bon état de fonctionnement et d'entretien. L'étalonnage des instruments de mesure (thermomètres) est obligatoire.",
    frequency: "Selon le planning de maintenance défini",
    content: [
      {
        title: "Équipements concernés",
        text: "Tous les équipements de cuisine sont concernés : chambres froides, congélateurs, fours, plaques de cuisson, friteuses, lave-vaisselle, hottes aspirantes, cellules de refroidissement, trancheuses, robots, thermomètres et sondes. Le matériel de mesure (thermomètres, balances) doit être régulièrement étalonné.",
      },
      {
        title: "Types de maintenance",
        text: "Maintenance préventive : interventions planifiées pour éviter les pannes (nettoyage filtres, vérification joints, étalonnage thermomètres). Maintenance corrective : intervention suite à une panne ou un dysfonctionnement. Conservez les factures et rapports d'intervention du technicien. Maintenez un registre à jour de tous les équipements.",
      },
    ],
    pdfSections: [
      {
        title: "Suivi entretien des équipements",
        fields: [
          "Date",
          "Équipement",
          "Type (préventive / corrective)",
          "Description",
          "Intervenant",
          "Pièces remplacées",
          "Résultat / État",
          "Prochaine intervention",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
];

export function getFicheBySlug(slug: string): FicheHACCP | undefined {
  return FICHES.find((f) => f.slug === slug);
}

export function getFichesByCategory(category: string): FicheHACCP[] {
  return FICHES.filter((f) => f.category === category);
}
