"use client";
import { StepForm } from "../../../components/StepForm";
import { DutyDetailsStep } from "../form-steps/DutyDetailsStep";

export default function Step2Page() {
  return (
    <StepForm
      stepNumber={2}
      nextRoute="/guest-return/review"
      previousRoute="/guest-return/step1"
    >
      {({ formData, handleInputChange }) => (
        <DutyDetailsStep
          formData={formData}
          onInputChange={handleInputChange}
        />
      )}
    </StepForm>
  );
}
