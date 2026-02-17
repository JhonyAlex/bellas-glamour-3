import { create } from "zustand";

export type ViewType = "home" | "models" | "featured";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  email_verified: boolean;
  age_verified: boolean;
  is_banned: boolean;
  created_at: Date;
  profile: {
    id: string;
    stage_name: string;
    slug: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

interface AuthModalState {
  isOpen: boolean;
  mode: "login" | "register";
}

interface AppState {
  // Auth
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  isAuthLoading: boolean;
  setIsAuthLoading: (loading: boolean) => void;

  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  // Age Gate
  showAgeGate: boolean;
  setShowAgeGate: (show: boolean) => void;

  // Auth Modal
  authModal: AuthModalState;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;

  // Admin Panel
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;

  // Mobile Menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  isAuthLoading: true,
  setIsAuthLoading: (loading) => set({ isAuthLoading: loading }),

  // Navigation
  currentView: "home",
  setCurrentView: (view) => set({ currentView: view }),

  // Age Gate
  showAgeGate: true,
  setShowAgeGate: (show) => set({ showAgeGate: show }),

  // Auth Modal
  authModal: { isOpen: false, mode: "login" },
  openAuthModal: (mode = "login") =>
    set({ authModal: { isOpen: true, mode } }),
  closeAuthModal: () =>
    set({ authModal: { isOpen: false, mode: "login" } }),

  // Admin Panel
  showAdminPanel: false,
  setShowAdminPanel: (show) => set({ showAdminPanel: show }),

  // Mobile Menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Filters
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  priceRange: [0, 50],
  setPriceRange: (range) => set({ priceRange: range }),
}));
