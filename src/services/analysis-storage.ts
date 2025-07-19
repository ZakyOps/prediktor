import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { ComparativeAnalysis } from "@/services/gemini";

// Ajouter une analyse
export async function saveAnalysisToFirestore(userId: string, analysis: ComparativeAnalysis) {
  await addDoc(collection(db, "analyses"), {
    userId,
    createdAt: new Date().toISOString(),
    ...analysis
  });
}

// Récupérer toutes les analyses d'un utilisateur
export async function getUserAnalyses(userId: string) {
  const q = query(
    collection(db, "analyses"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
