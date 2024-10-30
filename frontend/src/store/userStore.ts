import { create } from "zustand";
import { IUser } from "../types/user.type";

interface UserState {
  user: IUser | null;
  setUser: (by: IUser | null) => void;

  nft: any;
  setNft: (by: any) => void;

  address: string | null;
  setAddress: (by: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  nft: null,
  setNft: (nft) => set({ nft }),

  address: "UQAiKYu9BZ8cCdC8vF5hlxXw4B5xoBlWjLT21Sc3KYmv5lx3",
  setAddress: (address) => set({ address }),
}));
