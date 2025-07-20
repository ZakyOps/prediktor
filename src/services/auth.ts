import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebase";

const auth = getAuth(app);

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export { auth }; 