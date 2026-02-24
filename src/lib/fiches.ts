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
  { id: "temperatures", label: "Contrôle des températures", icon: "🌡️" },
  { id: "hygiene", label: "Hygiène et nettoyage", icon: "🧹" },
  { id: "tracabilite", label: "Traçabilité", icon: "📋" },
  { id: "securite", label: "Sécurité alimentaire", icon: "🛡️" },
  { id: "equipements", label: "Équipements", icon: "⚙️" },
  { id: "personnel", label: "Personnel", icon: "👥" },
] as const;

export const FICHES: FicheHACCP[] = [
  {
    id: 1,
    slug: "controle-temperatures-reception",
    title: "Fiche de contrôle des températures à réception des marchandises",
    shortTitle: "Températures réception",
    description:
      "Fiche obligatoire de relevé des températures à la réception des denrées alimentaires. Vérification de la conformité des températures à la livraison selon le règlement CE 852/2004.",
    metaTitle: "Fiche contrôle températures réception HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez gratuitement la fiche HACCP de contrôle des températures à réception. Document conforme au règlement CE 852/2004, prêt à imprimer.",
    icon: "🌡️",
    category: "temperatures",
    legalBasis:
      "Règlement (CE) n° 852/2004 relatif à l'hygiène des denrées alimentaires – Annexe II, Chapitre IX. Arrêté du 21 décembre 2009 relatif aux règles sanitaires applicables aux activités de commerce de détail.",
    frequency: "À chaque réception de marchandises",
    content: [
      {
        title: "Pourquoi ce contrôle est obligatoire ?",
        text: "Le contrôle des températures à réception est une obligation légale pour tout établissement de restauration. Il permet de vérifier que la chaîne du froid n'a pas été rompue pendant le transport. Toute denrée reçue à une température non conforme doit être refusée et le fournisseur informé. Ce contrôle constitue un Point de Contrôle Critique (CCP) dans votre plan HACCP.",
      },
      {
        title: "Températures réglementaires à respecter",
        text: "Produits réfrigérés : entre 0°C et +4°C. Produits surgelés : ≤ -18°C. Viandes hachées : entre 0°C et +2°C. Produits de la pêche frais : entre 0°C et +2°C (sous glace fondante). Œufs et ovoproduits : entre +4°C et +6°C. Produits laitiers frais : entre +2°C et +6°C. Fruits et légumes frais : entre +6°C et +10°C.",
      },
      {
        title: "Comment utiliser cette fiche ?",
        text: "À chaque livraison, relevez la température de chaque lot avec un thermomètre sonde étalonné. Inscrivez la date, le fournisseur, le produit, la température relevée et indiquez si le lot est conforme. En cas de non-conformité, notez l'action corrective (refus, déclassement, etc.). Conservez ces fiches pendant 5 ans minimum.",
      },
    ],
    pdfSections: [
      {
        title: "Contrôle des températures à réception",
        fields: [
          "Date de réception",
          "Heure",
          "Fournisseur",
          "Produit / Denrée",
          "N° de lot",
          "DLC / DDM",
          "Température relevée (°C)",
          "Température attendue (°C)",
          "Conforme (Oui / Non)",
          "Action corrective si non-conforme",
          "Nom du contrôleur",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "releve-temperatures-stockage",
    title: "Fiche de relevé des températures de stockage (chambres froides, réfrigérateurs)",
    shortTitle: "Températures stockage",
    description:
      "Fiche de suivi quotidien des températures des enceintes réfrigérées. Contrôle obligatoire des chambres froides positives et négatives.",
    metaTitle: "Fiche relevé températures stockage HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de relevé des températures de stockage. Suivi quotidien obligatoire des chambres froides, conforme à la réglementation française.",
    icon: "❄️",
    category: "temperatures",
    legalBasis:
      "Règlement (CE) n° 852/2004 – Annexe II, Chapitre IX. Arrêté du 21 décembre 2009, article 10. Note de service DGAL/SDSSA/2016-648.",
    frequency: "2 fois par jour (matin et soir)",
    content: [
      {
        title: "Obligation de suivi des températures",
        text: "Tout exploitant du secteur alimentaire doit s'assurer que les températures de stockage des denrées sont maintenues conformément à la réglementation. Un relevé doit être effectué au minimum deux fois par jour (matin et soir) pour chaque enceinte réfrigérée. Les écarts doivent être signalés et des actions correctives mises en place immédiatement.",
      },
      {
        title: "Températures cibles par type d'enceinte",
        text: "Chambre froide positive : entre 0°C et +3°C. Réfrigérateur : entre 0°C et +4°C. Chambre froide négative (congélateur) : ≤ -18°C. Vitrine réfrigérée : entre +2°C et +6°C selon les produits. En cas de panne, les produits doivent être transférés ou consommés rapidement.",
      },
      {
        title: "Conseils d'utilisation",
        text: "Placez un thermomètre calibré dans chaque enceinte. Notez les relevés matin et soir. En cas de dépassement, vérifiez la fermeture des portes, l'état des joints, et le bon fonctionnement du groupe froid. Faites intervenir un technicien si nécessaire. Archivez les fiches pendant 5 ans.",
      },
    ],
    pdfSections: [
      {
        title: "Relevé des températures de stockage",
        fields: [
          "Date",
          "Enceinte / Équipement",
          "Température matin (°C)",
          "Heure relevé matin",
          "Température soir (°C)",
          "Heure relevé soir",
          "Conforme (Oui / Non)",
          "Action corrective si non-conforme",
          "Nom du responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "plan-nettoyage-desinfection",
    title: "Plan de nettoyage et de désinfection",
    shortTitle: "Nettoyage & désinfection",
    description:
      "Plan de nettoyage et désinfection complet pour restaurant. Fréquences, produits utilisés, procédures et responsables pour chaque zone de l'établissement.",
    metaTitle: "Plan de nettoyage et désinfection restaurant HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez le plan de nettoyage et désinfection HACCP pour votre restaurant. Document complet conforme au règlement CE 852/2004.",
    icon: "🧹",
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
          "Opération (nettoyage / désinfection)",
          "Produit utilisé",
          "Dosage",
          "Méthode",
          "Fréquence",
          "Temps de contact",
          "Responsable",
          "Vérification effectuée",
          "Date",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "tracabilite-produits",
    title: "Fiche de traçabilité des produits alimentaires",
    shortTitle: "Traçabilité produits",
    description:
      "Fiche de traçabilité obligatoire permettant de suivre l'origine et le parcours des denrées alimentaires de la réception à la vente.",
    metaTitle: "Fiche traçabilité produits HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche de traçabilité des produits alimentaires HACCP. Obligation légale pour tout restaurant, conforme au règlement CE 178/2002.",
    icon: "📋",
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
          "Température à réception (°C)",
          "Conforme (Oui / Non)",
          "Date d'utilisation / ouverture",
          "Contrôleur",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "protocole-lavage-mains",
    title: "Protocole de lavage des mains",
    shortTitle: "Lavage des mains",
    description:
      "Protocole détaillé de lavage des mains conforme aux exigences sanitaires. Affichage obligatoire dans toutes les zones de préparation alimentaire.",
    metaTitle: "Protocole lavage des mains HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez le protocole de lavage des mains HACCP. Affichage obligatoire en restauration, conforme au règlement CE 852/2004.",
    icon: "🧴",
    category: "hygiene",
    legalBasis:
      "Règlement (CE) n° 852/2004 – Annexe II, Chapitre I, point 4 et Chapitre VIII. Arrêté du 21 décembre 2009, article 16.",
    frequency: "Affichage permanent – Application continue",
    content: [
      {
        title: "Quand se laver les mains ?",
        text: "Le lavage des mains est obligatoire : à la prise de poste, après passage aux toilettes, après avoir touché des denrées crues (viande, poisson, œufs), après avoir manipulé des déchets ou des emballages, après s'être mouché, après une pause, entre deux tâches différentes, après avoir touché de l'argent.",
      },
      {
        title: "Les 6 étapes du lavage des mains",
        text: "1. Mouiller les mains sous l'eau tiède. 2. Appliquer du savon bactéricide. 3. Frotter les paumes, le dos des mains, entre les doigts, les pouces et les ongles pendant 30 secondes minimum. 4. Rincer abondamment à l'eau claire. 5. Sécher avec un essuie-mains à usage unique. 6. Fermer le robinet avec l'essuie-mains (si robinet non automatique).",
      },
      {
        title: "Équipements obligatoires",
        text: "Chaque poste de lavage des mains doit disposer : d'eau courante chaude et froide, de savon bactéricide, d'essuie-mains à usage unique, d'une poubelle à commande non manuelle. L'utilisation de gants ne dispense pas du lavage des mains. Les ongles doivent être courts, propres et sans vernis.",
      },
    ],
    pdfSections: [
      {
        title: "Protocole de lavage des mains",
        fields: [
          "Étape 1 : Mouiller les mains",
          "Étape 2 : Appliquer le savon bactéricide",
          "Étape 3 : Frotter 30 secondes (paumes, dos, doigts, ongles)",
          "Étape 4 : Rincer à l'eau claire",
          "Étape 5 : Sécher avec essuie-mains à usage unique",
          "Étape 6 : Fermer le robinet avec l'essuie-mains",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "fiche-non-conformite",
    title: "Fiche de non-conformité et actions correctives",
    shortTitle: "Non-conformité",
    description:
      "Fiche d'enregistrement des non-conformités détectées et des actions correctives mises en place. Document essentiel du système HACCP.",
    metaTitle: "Fiche non-conformité HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche de non-conformité HACCP avec actions correctives. Document obligatoire pour le Plan de Maîtrise Sanitaire de votre restaurant.",
    icon: "⚠️",
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
          "Date de détection",
          "Détecté par",
          "Zone / Équipement concerné",
          "Description de la non-conformité",
          "Gravité (mineure / majeure / critique)",
          "Mesure immédiate prise",
          "Analyse des causes",
          "Action corrective",
          "Responsable de l'action corrective",
          "Date de mise en œuvre",
          "Vérification de l'efficacité",
          "Date de clôture",
          "Signature du responsable",
        ],
      },
    ],
  },
  {
    id: 7,
    slug: "gestion-allergenes",
    title: "Fiche de gestion des allergènes",
    shortTitle: "Gestion allergènes",
    description:
      "Fiche de gestion des 14 allergènes majeurs à déclaration obligatoire. Traçabilité des allergènes dans les plats et information du consommateur.",
    metaTitle: "Fiche gestion allergènes HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche de gestion des 14 allergènes obligatoires HACCP. Conforme au règlement UE 1169/2011, dit règlement INCO.",
    icon: "🥜",
    category: "securite",
    legalBasis:
      "Règlement (UE) n° 1169/2011 (INCO) – Article 9 et Annexe II. Décret n° 2015-447 du 17 avril 2015. Les 14 allergènes à déclaration obligatoire.",
    frequency: "Mise à jour à chaque changement de recette ou de fournisseur",
    content: [
      {
        title: "Les 14 allergènes à déclaration obligatoire",
        text: "1. Gluten (blé, seigle, orge, avoine, épeautre). 2. Crustacés. 3. Œufs. 4. Poissons. 5. Arachides. 6. Soja. 7. Lait (lactose). 8. Fruits à coque (noix, amandes, noisettes, etc.). 9. Céleri. 10. Moutarde. 11. Graines de sésame. 12. Anhydride sulfureux et sulfites (>10mg/kg). 13. Lupin. 14. Mollusques.",
      },
      {
        title: "Obligation d'information",
        text: "Depuis le 1er juillet 2015, tout restaurateur doit informer ses clients de la présence des 14 allergènes dans ses plats. Cette information peut être faite : par écrit sur la carte/menu, via un tableau récapitulatif affiché, ou oralement (avec mention visible « allergènes : renseignez-vous auprès du personnel »). Un document écrit de référence doit être disponible.",
      },
      {
        title: "Comment utiliser cette fiche",
        text: "Pour chaque plat de votre carte, listez les allergènes présents (issus des ingrédients et de la recette). Vérifiez les étiquettes de chaque produit utilisé. Mettez à jour en cas de changement de fournisseur ou de recette. Formez votre personnel à l'information allergènes et aux risques de contamination croisée.",
      },
    ],
    pdfSections: [
      {
        title: "Tableau de gestion des allergènes",
        fields: [
          "Nom du plat",
          "Gluten", "Crustacés", "Œufs", "Poissons", "Arachides",
          "Soja", "Lait", "Fruits à coque", "Céleri", "Moutarde",
          "Sésame", "Sulfites", "Lupin", "Mollusques",
          "Observations / Remarques",
        ],
      },
    ],
  },
  {
    id: 8,
    slug: "suivi-huiles-friture",
    title: "Fiche de suivi des huiles de friture",
    shortTitle: "Huiles de friture",
    description:
      "Fiche de contrôle et suivi des huiles de friture. Test de qualité, changement et élimination conformes à la réglementation.",
    metaTitle: "Fiche suivi huiles de friture HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de suivi des huiles de friture. Contrôle de qualité obligatoire, conforme au décret 2008-184.",
    icon: "🍟",
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
        text: "Ne jamais mélanger huile neuve et huile usagée. Ne pas dépasser 180°C. Filtrer l'huile après chaque service. Couvrir la friteuse quand elle n'est pas utilisée. Changer l'huile au maximum tous les 8 à 10 bains. Ne pas ajouter de sel dans le bain de friture. Utiliser une huile adaptée à la friture (tournesol oléique, arachide).",
      },
    ],
    pdfSections: [
      {
        title: "Suivi des huiles de friture",
        fields: [
          "Date",
          "Friteuse concernée",
          "Type d'huile",
          "Contrôle visuel (couleur, mousse, odeur)",
          "Test composés polaires (%)",
          "Conforme (Oui / Non)",
          "Action (filtrage / changement)",
          "Huile neuve ajoutée (Oui / Non)",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 9,
    slug: "refroidissement-rapide",
    title: "Fiche de suivi du refroidissement rapide",
    shortTitle: "Refroidissement rapide",
    description:
      "Fiche de contrôle du refroidissement rapide des préparations chaudes. Obligation de passage de +63°C à +10°C en moins de 2 heures.",
    metaTitle: "Fiche refroidissement rapide HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de refroidissement rapide. Contrôle obligatoire du passage de +63°C à +10°C en moins de 2h.",
    icon: "🧊",
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
          "Préparation / Plat",
          "Heure début refroidissement",
          "Température début (°C)",
          "Heure fin refroidissement",
          "Température fin (°C)",
          "Durée totale",
          "Conforme < 2h (Oui / Non)",
          "Méthode utilisée",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 10,
    slug: "remise-en-temperature",
    title: "Fiche de suivi de la remise en température",
    shortTitle: "Remise en température",
    description:
      "Fiche de contrôle de la remise en température des plats. Obligation de passage à +63°C à cœur en moins d'une heure.",
    metaTitle: "Fiche remise en température HACCP restaurant – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de remise en température. Obligation d'atteindre +63°C à cœur en moins d'1h, conforme à l'arrêté du 21/12/2009.",
    icon: "🔥",
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
          "Préparation / Plat",
          "Heure début",
          "Température début (°C)",
          "Heure fin",
          "Température à cœur atteinte (°C)",
          "Durée totale",
          "Conforme ≥63°C en <1h (Oui / Non)",
          "Service immédiat ou maintien chaud",
          "Responsable",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 11,
    slug: "reception-marchandises",
    title: "Fiche de contrôle à la réception des marchandises",
    shortTitle: "Réception marchandises",
    description:
      "Fiche complète de contrôle à la réception des marchandises : état des emballages, étiquetage, DLC, aspect visuel, température et conformité.",
    metaTitle: "Fiche contrôle réception marchandises HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP de contrôle à la réception des marchandises. Vérification complète des livraisons pour votre restaurant.",
    icon: "📦",
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
          "Date et heure de livraison",
          "Fournisseur",
          "N° du bon de livraison",
          "Produit",
          "Quantité commandée / reçue",
          "DLC / DDM",
          "N° de lot",
          "État emballage (conforme / non-conforme)",
          "Aspect visuel et olfactif",
          "Température relevée (°C)",
          "Accepté / Refusé",
          "Motif de refus",
          "Contrôleur",
          "Signature",
        ],
      },
    ],
  },
  {
    id: 12,
    slug: "entretien-equipements",
    title: "Fiche d'entretien et maintenance des équipements",
    shortTitle: "Entretien équipements",
    description:
      "Fiche de suivi de l'entretien et de la maintenance préventive des équipements de cuisine. Planification et historique des interventions.",
    metaTitle: "Fiche entretien équipements cuisine HACCP – PDF gratuit",
    metaDescription:
      "Téléchargez la fiche HACCP d'entretien des équipements de cuisine. Suivi de maintenance préventive pour votre restaurant.",
    icon: "⚙️",
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
          "Type d'intervention (préventive / corrective)",
          "Description de l'intervention",
          "Intervenant (interne / prestataire)",
          "Pièces remplacées",
          "Résultat / État après intervention",
          "Prochaine intervention prévue",
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
