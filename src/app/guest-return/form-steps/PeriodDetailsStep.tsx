"use client";

import { FormData } from "../../../lib/types/guest-return-form";
import { DateInputGroup } from "../../../components/DateInputGroup";
import { useState } from "react";
import { getValidationError } from "../../../lib/utils/guest-form-validation";

type StepProps = {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: string) => void;
};

interface DateErrors {
  periodFrom: string;
  periodTo: string;
}

export function PeriodDetailsStep({ formData, onInputChange }: StepProps) {
  const [dateErrors, setDateErrors] = useState<DateErrors>({
    periodFrom: "",
    periodTo: "",
  });

  const handleDateChange =
    (field: "periodFrom" | "periodTo") => (value: string) => {
      onInputChange(field, value);

      const error = getValidationError(field, value);
      setDateErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }));

      if (field === "periodTo" && formData.periodFrom && value) {
        const rangeError = getValidationError("dateRange", [
          formData.periodFrom,
          value,
        ]);
        if (rangeError) {
          setDateErrors((prev) => ({
            ...prev,
            periodTo: rangeError,
          }));
        }
      }
    };

  return (
    <div>
      <DateInputGroup
        label="Period From"
        id="period-from"
        value={formData.periodFrom}
        onChange={handleDateChange("periodFrom")}
        error={dateErrors.periodFrom}
      />

      <DateInputGroup
        label="Period To"
        id="period-to"
        value={formData.periodTo}
        onChange={handleDateChange("periodTo")}
        error={dateErrors.periodTo}
      />
      <div>
        <label htmlFor="urn">URN</label>
        <input
          type="text"
          id="urn"
          name="urn"
          value={formData.urn}
          onChange={(e) => onInputChange("urn", e.target.value)}
        />
      </div>
    </div>
  );
}
