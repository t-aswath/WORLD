import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  id: string;
  name: string;
  email: string;
  type: "INS" | "STF";
}

interface AuthStoreState {
  auth: AuthState | null;
  setAuth: (state: AuthState | null) => void;
}

const useAuthContext = create<AuthStoreState>()(
  persist(
    (set) => ({
      auth: null,
      setAuth: (state) => {
        set({ auth: state });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);


interface InstitutionSearchStore {
  searchName: string;
  setSearchName: (state: string | null) => void;
}
const useInstitutionSearchStore = create<InstitutionSearchStore>((set) => ({
  searchName: '',
  setSearchName: (state) => set({ searchName: state || '' })
}));

export { useAuthContext, useInstitutionSearchStore };
