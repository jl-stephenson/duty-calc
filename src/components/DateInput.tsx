"use client";

import React from "react";
import { DatePart } from "../lib/types/date";

type DateInputProps = {
  id: string;
  value: string;
  part: DatePart;
  hasError: boolean;
  onChange: (value: string) => void;
};

export const DateInput = React.memo(function DateInput({
  id,
  value,
  part,
  hasError,
  onChange,
}: DateInputProps) {
  const getPlaceholder = () => {
    switch (part) {
      case "day":
        return "DD";
      case "month":
        return "MM";
      case "year":
        return "YYYY";
    }
  };

  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={getPlaceholder()}
      maxLength={part === "year" ? 4 : 2}
      aria-label={part.charAt(0).toUpperCase() + part.slice(1)}
      className={`${part}-input ${hasError ? "error" : ""}`}
    />
  );
});
