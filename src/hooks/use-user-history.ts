import { useEffect, useState } from "react";
import { getUserAnalyses } from "@/services/analysis-storage";
import { getUserPredictions } from "@/services/prediction-storage";
import { useAuth } from "@/contexts/AuthContext";

export function useUserHistory() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAnalyses([]);
      setPredictions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getUserAnalyses(user.uid),
      getUserPredictions(user.uid)
    ]).then(([a, p]) => {
      setAnalyses(Array.isArray(a) ? a : []);
      setPredictions(Array.isArray(p) ? p : []);
      setLoading(false);
    });
  }, [user]);

  return {
    lastAnalysis: Array.isArray(analyses) && analyses.length > 0 ? analyses[0] : null,
    lastPrediction: Array.isArray(predictions) && predictions.length > 0 ? predictions[0] : null,
    loading
  };
} 