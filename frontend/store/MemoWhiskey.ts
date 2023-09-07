import { create } from "zustand";

type WhiskeyType = {
  name: string;
  abv: string;
  wbCode: string;
};

const initInfo: WhiskeyType = {
  name: "",
  abv: "",
  wbCode: "",
};

interface WhiskeyStore {
  whiskey: WhiskeyType;
  updateWhiskey: (updateId: keyof WhiskeyType, updateValue: string) => void;
  resetWhiskey: () => void;
}

export const useWhiskeyStore = create<WhiskeyStore>((set) => ({
  whiskey: initInfo,

  updateWhiskey: (updateId: keyof WhiskeyType, updateValue: string) =>
    set((prev: { whiskey: WhiskeyType }) => {
      const updatedWhiskey = {
        ...prev.whiskey,
        [updateId]: updateValue,
      };
      return { whiskey: updatedWhiskey };
    }),

  resetWhiskey: () => set(() => ({ whiskey: initInfo })),
}));
