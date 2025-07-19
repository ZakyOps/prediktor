import { CompanyData } from "@/services/gemini";

// Données de test pour différentes entreprises
export const testCompanies: CompanyData[] = [
  {
    year: "2024",
    revenue: 50000000, // 50M FCFA
    expenses: 35000000, // 35M FCFA
    employees: 25,
    sector: "Technologie",
    market: "National"
  },
  {
    year: "2024",
    revenue: 15000000, // 15M FCFA
    expenses: 12000000, // 12M FCFA
    employees: 8,
    sector: "Commerce",
    market: "Local"
  },
  {
    year: "2024",
    revenue: 80000000, // 80M FCFA
    expenses: 60000000, // 60M FCFA
    employees: 45,
    sector: "Services",
    market: "Régional"
  },
  {
    year: "2024",
    revenue: 25000000, // 25M FCFA
    expenses: 22000000, // 22M FCFA
    employees: 15,
    sector: "Agriculture",
    market: "Local"
  }
];

// Fonction pour obtenir des données de test aléatoires
export const getRandomTestData = (): CompanyData => {
  const randomIndex = Math.floor(Math.random() * testCompanies.length);
  return testCompanies[randomIndex];
};

// Fonction pour valider les données d'entreprise
export const validateCompanyData = (data: Partial<CompanyData>): string[] => {
  const errors: string[] = [];

  if (!data.year) errors.push("L'année est requise");
  if (!data.revenue || data.revenue <= 0) errors.push("Le chiffre d'affaires doit être positif");
  if (!data.expenses || data.expenses <= 0) errors.push("Les charges doivent être positives");
  if (!data.employees || data.employees <= 0) errors.push("Le nombre d'employés doit être positif");
  if (!data.sector) errors.push("Le secteur d'activité est requis");

  // Validation logique
  if (data.revenue && data.expenses && data.revenue < data.expenses) {
    errors.push("Le chiffre d'affaires doit être supérieur aux charges");
  }

  return errors;
};

// Fonction pour formater les montants en FCFA
export const formatFCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Fonction pour calculer la rentabilité
export const calculateProfitability = (revenue: number, expenses: number): number => {
  if (revenue === 0) return 0;
  return ((revenue - expenses) / revenue) * 100;
};

// Fonction pour calculer l'efficacité (revenus par employé)
export const calculateEfficiency = (revenue: number, employees: number): number => {
  if (employees === 0) return 0;
  return revenue / employees;
}; 