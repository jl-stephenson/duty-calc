"use client";
import { StepForm } from "../../../components/StepForm";
import { TradingDetailsStep } from "../form-steps/TradingDetailsStep";

export default function Step1Page() {
  return (
    <StepForm stepNumber={1} nextRoute="/guest-return/step2">
      {({ formData, handleInputChange, errors }) => (
        <TradingDetailsStep
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
        />
      )}
    </StepForm>
  );
}
