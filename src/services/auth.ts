import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, // C'est une bonne pratique de l'exporter aussi
  User 
} from "firebase/auth";
import { app } from "@/lib/firebase"; 

const auth = getAuth(app);

/**
 * Connecte un utilisateur et traduit les erreurs Firebase en messages clairs.
 */
export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    // Traduction des erreurs pour une meilleure expérience utilisateur
    let friendlyMessage = "Une erreur est survenue lors de la connexion.";
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = "L'adresse e-mail ou le mot de passe est incorrect.";
        break;
      case 'auth/invalid-email':
        friendlyMessage = "Le format de l'adresse e-mail n'est pas valide.";
        break;
      case 'auth/too-many-requests':
        friendlyMessage = "L'accès à ce compte a été bloqué temporairement suite à de trop nombreuses tentatives. Veuillez réessayer plus tard.";
        break;
      case 'auth/user-disabled':
        friendlyMessage = "Ce compte utilisateur a été désactivé.";
        break;
    }
    // On rejette la promesse avec notre message personnalisé
    throw new Error(friendlyMessage);
  }
}

/**
 * Déconnecte l'utilisateur actuellement authentifié.
 */
export function logout() {
  return signOut(auth);
}

/**
 * Récupère l'utilisateur actuellement connecté.
 * Note : il est souvent préférable d'utiliser onAuthStateChanged pour réagir aux changements d'état.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Exporter l'instance `auth` et `onAuthStateChanged` est utile pour les utiliser ailleurs, comme dans App.js
export { auth, onAuthStateChanged };