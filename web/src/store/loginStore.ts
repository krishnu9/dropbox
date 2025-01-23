import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LoginState {
    isLoggedIn: boolean;
    user: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const useLoginStore = create<LoginState>()(persist(
    (set) => ({
    isLoggedIn: false,
    user: null,
    login: (token) => {
        set({ isLoggedIn: true, user: token })
    },
    logout: () => set({ isLoggedIn: false, user: null}),
    }),
    {
        name: 'file-user', 
    }
));
