"use client";
import { FormEvent, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { GuestReturnContext } from "../app/guest-return/layout";
import { FormData } from "../lib/types/guest-return-form";
import { validateFormStep } from "../lib/utils/guest-form-validation";

interface StepFormProps {
  stepNumber: number;
  children: (args: {
    formData: FormData;
    handleInputChange: (name: keyof FormData, value: unknown) => void;
    errors: Partial<Record<keyof FormData, string>>;
  }) => ReactNode;
  nextRoute: string;
  previousRoute?: string;
}

export const StepForm = ({
  stepNumber,
  children,
  nextRoute,
  previousRoute,
}: StepFormProps) => {
  const { formData, setFormData } = useContext(GuestReturnContext);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const router = useRouter();

  const handleInputChange = (name: keyof FormData, value: unknown) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stepErrors = validateFormStep(stepNumber, formData);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      router.push(nextRoute);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children({ formData, handleInputChange, errors })}
      <div className="nav-buttons">
        {previousRoute && (
          <button type="button" onClick={() => router.push(previousRoute)}>
            Back
          </button>
        )}
        <button className="form-button" type="submit">
          Next
        </button>
      </div>
    </form>
  );
};
