import { create } from "zustand";
import { IUser } from "../types/user.type";

interface UserState {
  user: IUser | null;
  setUser: (by: IUser) => void;

  nft: any;
  setNft: (by: any) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  nft: null,
  setNft: (nft) => set({ nft }),
}));
