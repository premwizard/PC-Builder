import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem("icpcs_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),

  login: (email, password) => {
    const mockUser = {
      username: email.split("@")[0],
      email: email,
      fullName: "Alex Mercer", // Default full name
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      preferredBrand: "NVIDIA",
      primaryUse: "gaming",
    };
    localStorage.setItem("icpcs_user", JSON.stringify(mockUser));
    set({ user: mockUser });
    return mockUser;
  },

  register: (username, email, password) => {
    const mockUser = {
      username: username,
      email: email,
      fullName: username.charAt(0).toUpperCase() + username.slice(1) + " Mercer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      preferredBrand: "NVIDIA",
      primaryUse: "gaming",
    };
    localStorage.setItem("icpcs_user", JSON.stringify(mockUser));
    set({ user: mockUser });
    return mockUser;
  },

  logout: () => {
    localStorage.removeItem("icpcs_user");
    set({ user: null });
  },

  updateProfile: (formData) => {
    set((state) => {
      if (!state.user) return {};
      const updatedUser = {
        ...state.user,
        ...formData,
      };
      localStorage.setItem("icpcs_user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));
