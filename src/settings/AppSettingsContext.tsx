import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppLanguage = "en" | "ar";
export type AppTheme = "light" | "dark";

export interface AppSettings {
  notifications: boolean;
  audioGuide: boolean;
  haptics: boolean;
  offlineMode: boolean;
  highQuality: boolean;
  kidSafeMode: boolean;
  language: AppLanguage;
  theme: AppTheme;
}

interface AppSettingsContextValue {
  settings: AppSettings;
  resetSettings: () => void;
  setSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
}

const SETTINGS_STORAGE_KEY = "arlearn.settings";

export const defaultSettings: AppSettings = {
  notifications: true,
  audioGuide: true,
  haptics: true,
  offlineMode: false,
  highQuality: true,
  kidSafeMode: true,
  language: "en",
  theme: "light",
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(
  undefined,
);

const readStoredSettings = (): AppSettings => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!rawValue) {
    return defaultSettings;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<AppSettings>;

    return {
      ...defaultSettings,
      ...parsedValue,
    };
  } catch {
    return defaultSettings;
  }
};

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(readStoredSettings);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.style.colorScheme = settings.theme;
    document.body.dir = settings.language === "ar" ? "rtl" : "ltr";
    document.body.dataset.theme = settings.theme;
    document.body.style.colorScheme = settings.theme;
  }, [settings.language, settings.theme]);

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      settings,
      resetSettings: () => setSettings(defaultSettings),
      setSetting: (key, nextValue) => {
        setSettings((currentValue) => ({
          ...currentValue,
          [key]: nextValue,
        }));
      },
    }),
    [settings],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider.");
  }

  return context;
};
