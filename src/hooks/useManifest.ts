import { useState, useEffect } from 'react';

interface Manifest {
  translations: Record<string, Record<string, string>>;
  destinations: {
    id: string;
    name: string;
    region: string;
    safetyScore: number;
  }[];
  policies: {
    id: string;
    title: string;
    content: string;
    required: boolean;
  }[];
  emergencyContacts: {
    region: string;
    police: string;
    ambulance: string;
    touristHelp: string;
  }[];
  version: string;
}

interface UseManifestResult {
  manifest: Manifest | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useManifest = (): UseManifestResult => {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManifest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/kiosk/manifest');
      // const data = await response.json();
      
      // For this example, we'll use a mock manifest
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockManifest: Manifest = {
        translations: {
          en: {
            welcome: "Welcome to Tourist Safety Registration",
            language: "Language Selection",
            continue: "Continue",
            back: "Back",
            register: "Register Now",
          },
          hi: {
            welcome: "पर्यटक सुरक्षा पंजीकरण में आपका स्वागत है",
            language: "भाषा चयन",
            continue: "जारी रखें",
            back: "वापस",
            register: "अभी पंजीकरण करें",
          },
          bn: {
            welcome: "পর্যটক নিরাপত্তা নিবন্ধনে স্বাগতম",
            language: "ভাষা নির্বাচন",
            continue: "চালিয়ে যান",
            back: "পিছনে",
            register: "এখনই নিবন্ধন করুন",
          },
        },
        destinations: [
          { id: "shillong", name: "Shillong", region: "Meghalaya", safetyScore: 92 },
          { id: "gangtok", name: "Gangtok", region: "Sikkim", safetyScore: 95 },
          { id: "guwahati", name: "Guwahati", region: "Assam", safetyScore: 88 },
          { id: "kohima", name: "Kohima", region: "Nagaland", safetyScore: 85 },
          { id: "imphal", name: "Imphal", region: "Manipur", safetyScore: 82 },
          { id: "itanagar", name: "Itanagar", region: "Arunachal Pradesh", safetyScore: 86 },
        ],
        policies: [
          {
            id: "privacy",
            title: "Privacy Policy",
            content: "Your data is protected with blockchain technology and used only for safety purposes.",
            required: true
          },
          {
            id: "location",
            title: "Location Tracking",
            content: "Location tracking is enabled for emergency services and can be disabled in the app.",
            required: true
          },
          {
            id: "terms",
            title: "Terms of Service",
            content: "By using this service, you agree to the terms of service of the Tourist Safety System.",
            required: true
          },
        ],
        emergencyContacts: [
          {
            region: "Meghalaya",
            police: "100",
            ambulance: "108",
            touristHelp: "+91-364-2226027"
          },
          {
            region: "Sikkim",
            police: "100",
            ambulance: "108",
            touristHelp: "+91-359-2205938"
          },
          {
            region: "Assam",
            police: "100",
            ambulance: "108",
            touristHelp: "+91-361-2731662"
          },
        ],
        version: "1.0.0"
      };
      
      setManifest(mockManifest);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch manifest'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, []);

  const refetch = async () => {
    await fetchManifest();
  };

  return { manifest, isLoading, error, refetch };
};