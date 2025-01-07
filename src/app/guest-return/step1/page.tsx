"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { GuestReturnContext } from "../layout";
import { handleNextStep } from "../../../lib/form-navigation";
import { TradingDetailsStep } from "../form-steps/TradingDetailsStep";
import { FormData } from "../../../lib/types/guest-return-form";

export default function Step1Page() {
  const { formData, setFormData } = useContext(GuestReturnContext);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const router = useRouter();

  const handleInputChange = (name: keyof FormData, value: unknown) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    const { errors: stepErrors, isValid } = handleNextStep(1, formData);
    setErrors(stepErrors);

    if (isValid) {
      router.push("/guest-return/step2");
    }
  };

  return (
    <form className="guest-form-flex" onSubmit={handleNext}>
      <TradingDetailsStep
        formData={formData}
        onInputChange={handleInputChange}
        errors={errors}
      />
      <button className="form-button" type="submit">
        Next
      </button>
    </form>
  );
}
