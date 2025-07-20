import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

export async function savePredictionToFirestore(userId: string, prediction: any) {
  await addDoc(collection(db, "predictions"), {
    userId,
    createdAt: new Date().toISOString(),
    ...prediction
  });
}

export async function getUserPredictions(userId: string) {
  const q = query(
    collection(db, "predictions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} 