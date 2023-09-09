import { SelectProps } from "@mui/material";

export type ElementType = { name: string; value: number };

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
  addElement: (selectElement: ElementType) => void;
}

export interface ElementChartProps {
  id: string;
  nameList: string[];
  valueList: number[];
  isHideLabel?: boolean;
}

export interface ResultStepProps {
  handleBack: () => void;
  handleReset: () => void;
}

export interface ResetCheckDialogProps {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}
