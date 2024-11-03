import { create } from "zustand";
import { INft } from "../types/nft";
import { IAllinace, IUser, IWallet } from "../types/user.type";

interface UserState {
  user: IUser | null;
  setUser: (by: IUser | null) => void;

  nft: INft[] | null;
  setNft: (by: any) => void;

  address: string | null;
  setAddress: (by: string) => void;

  setWallet: (by: IWallet) => void;

  alliance: IAllinace[] | null;
  setAlliance: (by: IAllinace[]) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  nft: null,
  setNft: (nft) => set({ nft }),

  address: "UQAiKYu9BZ8cCdC8vF5hlxXw4B5xoBlWjLT21Sc3KYmv5lx3",
  setAddress: (address) => set({ address }),

  setWallet: (wallet) => {
    const user = get().user;
    if (!user) return;

    return set({ user: { ...user, wallet } });
  },

  alliance: null,
  setAlliance: (alliance) => set({ alliance }),
}));
