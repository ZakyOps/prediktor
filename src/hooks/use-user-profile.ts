import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService, UserProfile } from '@/services/user-profile';
import { useToast } from '@/hooks/use-toast';

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil utilisateur
  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let userProfile = await UserProfileService.loadUserProfile(user.uid);
      
      if (!userProfile) {
        // Créer un nouveau profil si l'utilisateur n'en a pas
        userProfile = await UserProfileService.createUserProfile(user.uid, user.email || '');
        toast({
          title: "Profil créé",
          description: "Votre profil a été créé. Complétez-le pour des analyses plus précises.",
          duration: 3000,
        });
      }
      
      setProfile(userProfile);
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Impossible de charger votre profil');
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Sauvegarder le profil utilisateur
  const saveProfile = useCallback(async (updatedProfile: Partial<UserProfile>) => {
    if (!user || !profile) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setSaving(true);
      
      const newProfile = { ...profile, ...updatedProfile };
      await UserProfileService.updateUserProfile(user.uid, newProfile);
      
      setProfile(newProfile);
      
      const isComplete = UserProfileService.isProfileComplete(newProfile);
      
      toast({
        title: "Profil sauvegardé",
        description: isComplete 
          ? "Votre profil est complet et les analyses seront plus précises." 
          : "Profil sauvegardé. Complétez-le pour des analyses plus précises.",
        duration: 3000,
      });
      
      return newProfile;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Impossible de sauvegarder le profil');
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre profil.",
        variant: "destructive",
        duration: 5000,
      });
      throw err;
    } finally {
      setSaving(false);
    }
  }, [user, profile, toast]);

  // Mettre à jour un champ spécifique
  const updateField = useCallback((field: keyof UserProfile, value: any) => {
    if (!profile) return;
    
    setProfile(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  }, [profile]);

  // Calculer le pourcentage de complétion
  const getCompletionPercentage = useCallback(() => {
    if (!profile) return 0;
    return UserProfileService.getProfileCompletionPercentage(profile);
  }, [profile]);

  // Vérifier si le profil est complet
  const isProfileComplete = useCallback(() => {
    if (!profile) return false;
    return UserProfileService.isProfileComplete(profile);
  }, [profile]);

  // Charger le profil au montage du composant
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    saving,
    error,
    loadProfile,
    saveProfile,
    updateField,
    getCompletionPercentage,
    isProfileComplete,
    refreshProfile: loadProfile
  };
}; 