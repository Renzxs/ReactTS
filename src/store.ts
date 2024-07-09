import { create } from 'zustand';

interface UserStore {
    fullname: string;
    email: string;
    password: string;
    userData: string[];

    // Setter methods
    setFullname: (fullname: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setUserData: (userData: string[]) => void;
};

export const useSignUpForm = create<UserStore>((set) => ({
    // Default values
    fullname: '',
    email: '',
    password: '',
    userData: [],

    // Setter methods
    setFullname: (value: string) => set((state) => ({ fullname: value })),
    setEmail: (value: string) => set((state) => ({ email: value })),
    setPassword: (value: string) => set((state) => ({ password: value })),
    setUserData: (value: string[]) => set((set) => ({ userData: value })),
}));