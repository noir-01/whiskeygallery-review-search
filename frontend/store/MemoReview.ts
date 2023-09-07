import { create } from "zustand";

type ElemenetType = { name: string; value: number };

type ReviewType = {
  elementList: ElemenetType[];
  comment: string;
  score: string;
};

type ReviewListType = [ReviewType, ReviewType, ReviewType];

interface ReviewStore {
  reviewList: ReviewListType;
  updateReview: (
    updateId: keyof ReviewType,
    step: number,
    updateValue: string | ElemenetType[]
  ) => void;
  resetReviewList: () => void;
}

const initList: ReviewListType = [
  {
    elementList: [],
    comment: "",
    score: "",
  },
  {
    elementList: [],
    comment: "",
    score: "",
  },
  {
    elementList: [],
    comment: "",
    score: "",
  },
];

export const useReviewStore = create<ReviewStore>((set) => ({
  reviewList: initList,

  updateReview: (
    updateId: keyof ReviewType,
    step: number,
    updateValue: string | ElemenetType[]
  ) =>
    set((prev: { reviewList: ReviewListType }) => {
      const updatedReview = {
        ...prev.reviewList[step],
        [updateId]: updateValue,
      };
      const updatedReviewList = prev.reviewList.map((item, index) =>
        index === step ? updatedReview : item
      ) as ReviewListType;
      return { reviewList: updatedReviewList };
    }),

  resetReviewList: () => set(() => ({ reviewList: initList })),
}));
