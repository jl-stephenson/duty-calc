import { FormData } from "./types/guest-return-form";
import { validateFormStep } from "./utils/guest-form-validation"

export function handleNextStep(
    currentStep: number,
    formData: FormData
): { errors: Partial<Record<keyof FormData, string>>; isValid: boolean } {
    const stepErrors = validateFormStep(currentStep, formData);
    const isValid = Object.keys(stepErrors).length ===0;
    return { errors: stepErrors, isValid };
}