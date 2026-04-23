import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AppState = {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  favoriteTeams: string[];
  savedNews: string[];
};

type AppContextType = AppState & {
  ready: boolean;
  signIn: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleFavoriteTeam: (id: string) => Promise<void>;
  toggleSavedNews: (id: string) => Promise<void>;
  isFavoriteTeam: (id: string) => boolean;
  isSavedNews: (id: string) => boolean;
};

const STORAGE_KEY = "rugido.appState.v1";

const defaultState: AppState = {
  isAuthenticated: false,
  username: null,
  email: null,
  favoriteTeams: ["pumas-durango", "alacranes-fc"],
  savedNews: [],
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          setState({ ...defaultState, ...parsed });
        }
      } catch {
        // ignore
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: AppState) => {
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const signIn = useCallback(
    async (email: string, name: string) => {
      await persist({
        ...state,
        isAuthenticated: true,
        email,
        username: name,
      });
    },
    [persist, state],
  );

  const signOut = useCallback(async () => {
    await persist({
      ...state,
      isAuthenticated: false,
      email: null,
      username: null,
    });
  }, [persist, state]);

  const toggleFavoriteTeam = useCallback(
    async (id: string) => {
      const set = new Set(state.favoriteTeams);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      await persist({ ...state, favoriteTeams: Array.from(set) });
    },
    [persist, state],
  );

  const toggleSavedNews = useCallback(
    async (id: string) => {
      const set = new Set(state.savedNews);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      await persist({ ...state, savedNews: Array.from(set) });
    },
    [persist, state],
  );

  const value = useMemo<AppContextType>(
    () => ({
      ...state,
      ready,
      signIn,
      signOut,
      toggleFavoriteTeam,
      toggleSavedNews,
      isFavoriteTeam: (id: string) => state.favoriteTeams.includes(id),
      isSavedNews: (id: string) => state.savedNews.includes(id),
    }),
    [ready, signIn, signOut, state, toggleFavoriteTeam, toggleSavedNews],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
