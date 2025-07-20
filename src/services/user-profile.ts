import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  function: string;
  language: string;
  timezone: string;
  
  // Entreprise
  companyName: string;
  companySize: string;
  industry: string;
  country: string;
  currency: string;
  address: string;
  website: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  
  // Intégrations
  googleSheets: boolean;
  googleAnalytics: boolean;
  geminiApi: boolean;
  
  // Sécurité
  twoFactorAuth: boolean;
  sessionTimeout: string;
  dataRetention: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
}

export class UserProfileService {
  /**
   * Charger le profil utilisateur depuis Firestore
   */
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      throw error;
    }
  }

  /**
   * Créer un nouveau profil utilisateur
   */
  static async createUserProfile(userId: string, email: string): Promise<UserProfile> {
    try {
      const newProfile: UserProfile = {
        firstName: "",
        lastName: "",
        email: email,
        phone: "",
        function: "",
        language: "fr",
        timezone: "Africa/Abidjan",
        
        companyName: "",
        companySize: "",
        industry: "",
        country: "",
        currency: "EUR",
        address: "",
        website: "",
        
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        monthlyReports: false,
        
        googleSheets: false,
        googleAnalytics: false,
        geminiApi: true,
        
        twoFactorAuth: false,
        sessionTimeout: "30",
        dataRetention: "2",
        
        createdAt: new Date(),
        updatedAt: new Date(),
        isProfileComplete: false
      };

      await setDoc(doc(db, "users", userId), newProfile);
      return newProfile;
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const updatedProfile = {
        ...profile,
        updatedAt: new Date(),
        isProfileComplete: this.isProfileComplete(profile as UserProfile)
      };

      await updateDoc(doc(db, "users", userId), updatedProfile);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  }

  /**
   * Vérifier si le profil est complet
   */
  static isProfileComplete(profile: UserProfile): boolean {
    const requiredFields = ['firstName', 'lastName', 'companyName', 'industry', 'country'];
    return requiredFields.every(field => profile[field as keyof UserProfile]);
  }

  /**
   * Calculer le pourcentage de complétion du profil
   */
  static getProfileCompletionPercentage(profile: UserProfile): number {
    const requiredFields = ['firstName', 'lastName', 'companyName', 'industry', 'country'];
    const completedFields = requiredFields.filter(field => profile[field as keyof UserProfile]);
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  /**
   * Rechercher des utilisateurs par secteur d'activité
   */
  static async getUsersByIndustry(industry: string): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, "users"),
        where("industry", "==", industry),
        where("isProfileComplete", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      const users: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      });
      
      return users;
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
      throw error;
    }
  }

  /**
   * Obtenir des statistiques sur les profils utilisateurs
   */
  static async getProfileStats(): Promise<{
    totalUsers: number;
    completeProfiles: number;
    incompleteProfiles: number;
    topIndustries: { industry: string; count: number }[];
  }> {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users: UserProfile[] = [];
      
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      });

      const completeProfiles = users.filter(user => user.isProfileComplete);
      const incompleteProfiles = users.filter(user => !user.isProfileComplete);
      
      // Calculer les industries les plus populaires
      const industryCounts: { [key: string]: number } = {};
      completeProfiles.forEach(user => {
        if (user.industry) {
          industryCounts[user.industry] = (industryCounts[user.industry] || 0) + 1;
        }
      });
      
      const topIndustries = Object.entries(industryCounts)
        .map(([industry, count]) => ({ industry, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalUsers: users.length,
        completeProfiles: completeProfiles.length,
        incompleteProfiles: incompleteProfiles.length,
        topIndustries
      };
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error);
      throw error;
    }
  }
} 