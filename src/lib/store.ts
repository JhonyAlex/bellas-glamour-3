import { create } from "zustand";
import type { MOCK_MODELS } from "@/lib/constants";

export type Model = (typeof MOCK_MODELS)[number];

export type ViewType = "home" | "models" | "featured";

interface AuthModalState {
  isOpen: boolean;
  mode: "login" | "register";
}

interface AppState {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  // Age Gate
  showAgeGate: boolean;
  setShowAgeGate: (show: boolean) => void;

  // Model Profile Modal
  selectedModel: Model | null;
  setSelectedModel: (model: Model | null) => void;

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
  // Navigation
  currentView: "home",
  setCurrentView: (view) => set({ currentView: view }),

  // Age Gate
  showAgeGate: true,
  setShowAgeGate: (show) => set({ showAgeGate: show }),

  // Model Profile Modal
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),

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
