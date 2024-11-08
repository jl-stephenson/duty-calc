"use client";

import { useCallback } from "react";
import { DateInput } from "./DateInput";
import type { DateInputGroupProps, DatePart } from "../lib/types/date";

export function DateInputGroup({
  label,
  id,
  value,
  onInputChange,
  error,
}: DateInputGroupProps) {
  const [day, month, year] = value?.split("/") || ["", "", ""];

  const handleDatePartChange = useCallback(
    (part: DatePart, inputValue: string) => {
      const sanitizedValue = inputValue.replace(/\D/g, "");
      const newDate = {
        day: part === "day" ? sanitizedValue : day,
        month: part === "month" ? sanitizedValue : month,
        year: part === "year" ? sanitizedValue : year,
      };

      onInputChange(
        [newDate.day, newDate.month, newDate.year].filter(Boolean).join("/")
      );
    },
    [day, month, year, onInputChange]
  );

  return (
    <div className="form-field">
      <label htmlFor={`${id}-day`}>{label}</label>
      <div
        className="date-input-group"
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {(["day", "month", "year"] as const).map((part) => (
          <DateInput
            key={part}
            id={`${id}-${part}`}
            value={part === "day" ? day : part === "month" ? month : year}
            part={part}
            hasError={!!error}
            onChange={(value) => handleDatePartChange(part, value)}
          />
        ))}
        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
}
