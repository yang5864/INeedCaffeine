import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PROFILE, normalizeProfile } from "../utils/profile.js";

const STORAGE_KEY = "ineedcaffeine.profile.v1";

function readProfile() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? normalizeProfile(JSON.parse(value)) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function writeProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function useProfile() {
  const [profile, setProfile] = useState(readProfile);

  useEffect(() => {
    writeProfile(profile);
  }, [profile]);

  const updateProfile = useCallback((updates) => {
    setProfile((current) => normalizeProfile({ ...current, ...updates }));
  }, []);

  return {
    profile,
    updateProfile,
  };
}
