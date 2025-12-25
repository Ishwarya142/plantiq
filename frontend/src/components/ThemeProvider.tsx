import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeProviderContext =
  createContext<ThemeProviderState | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "plantiq-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] =
    useState<"dark" | "light">("light");

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    let appliedTheme: "dark" | "light";

    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      appliedTheme = theme;
    }

    root.classList.add(appliedTheme);
    setResolvedTheme(appliedTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
        setResolvedTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
