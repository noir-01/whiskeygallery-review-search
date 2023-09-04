import { SelectProps } from "@mui/material";

export type ElemenetType = { name: string; value: number };

export type ReviewType = {
  elementList: ElemenetType[];
  comment: string;
  score: string;
};

export interface ReviewSliderProps {
  title: string;
  value: number;
  onClick: (value: string) => void;
  handleChangeElementValue: (id: string, newValue: number) => void;
}

export type DropDownOptionProps = SelectProps & {
  optionList: { value: string; content: string }[];
};

export interface ElementPartBoxProps {
  title: string;
  nameList: string[];
  list: string[];
  addElement: (selectElement: ElemenetType) => void;
}

export interface ElementChartProps {
  id: string;
  nameList: string[];
  valueList: number[];
}

export interface ResultStepProps {
  abv: string;
  firstStepReview: ReviewType;
  secondStepReview: ReviewType;
  thridStepReview: ReviewType;
  wbCode: string;
  whiskey: string;
  handleBack: () => void;
  handleReset: () => void;
}

export interface ReviewStepperProps {
  step: number;
  review: ReviewType;
  handleUpdateReview: (step: number, review: ReviewType) => void;
}
