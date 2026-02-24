export const FREQUENCIES = [
  { value: "quotidien", label: "Quotidien" },
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "mensuel", label: "Mensuel" },
  { value: "ponctuel", label: "Ponctuel" },
] as const;

export const TASK_CATEGORIES = [
  { value: "temperatures", label: "Températures", icon: "thermometer" },
  { value: "nettoyage", label: "Nettoyage", icon: "spray-can" },
  { value: "tracabilite", label: "Traçabilité", icon: "clipboard-list" },
  { value: "reception", label: "Réception", icon: "package" },
  { value: "equipement", label: "Équipement", icon: "wrench" },
  { value: "general", label: "Général", icon: "check-square" },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["value"];
export type TaskFrequency = (typeof FREQUENCIES)[number]["value"];
