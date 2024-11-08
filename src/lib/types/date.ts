export type DatePart = "day" | "month" | "year";

export type DateInputGroupProps = {
  label: string;
  id: string;
  value: string;
  onInputChange: (fullDate: string) => void;
  error?: string;
};
