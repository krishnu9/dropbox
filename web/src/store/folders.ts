import { create } from "zustand";

export interface Folder {
    name: string;
    id: string;
    path: string;
    userId: string;
}

interface FoldersState {
    folders: Folder[];
    setFolders: (folders: Folder[]) => void;
    currentFolder: Folder | null;
    setCurrentFolder: (folder: Folder) => void;
}

export const useFoldersStore = create<FoldersState>((set) => ({
    folders: [],
    setFolders: (folders: Folder[]) => set({ folders }),
    currentFolder: null,
    setCurrentFolder: (currentFolder: Folder) => set({ currentFolder }),
}));


