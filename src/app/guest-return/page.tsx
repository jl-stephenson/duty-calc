"use client";
import { useState } from "react";
import {
  FormData,
  ProcessPDFResponse,
} from "../../lib/types/guest-return-form";
import {
  validateFormStep,
  validateAllSteps,
} from "../../lib/utils/guest-form-validation";
import { TradingDetailsStep } from "./form-steps/TradingDetailsStep";
import { httpsCallable } from "firebase/functions";
import { PDFPreview } from "./form-steps/PDFPreview";
import { getFirebaseFunctions } from "../../lib/firebase/clientApp";
import { DutyDetailsStep } from "./form-steps/DutyDetailsStep";

const INITIAL_FORM_DATA: FormData = {
  tradingName: "",
  tradingAddress0: "",
  tradingAddress1: "",
  tradingAddress2: "",
  postcode: "",
  periodFrom: "",
  periodTo: "",
  urn: "",
  fullName: "",
  capacity: "",
  wineEntries: [],
};

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const handleInputChange = (name: keyof FormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    const stepErrors = validateFormStep(step, formData);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateAll = (): boolean => {
    const allErrors = validateAllSteps(formData);
    if (Object.keys(allErrors).length > 0) {
      setError(`Please check all fields are filled correctly.`);
      setErrors(allErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const handleProcessPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPdfUrl(null);

    if (!validateAll()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const functions = getFirebaseFunctions();
      const processPDFFunction = httpsCallable<FormData, ProcessPDFResponse>(
        functions,
        "process_pdf"
      );

      console.log(formData);

      const result = await processPDFFunction(formData);
      const data = result.data;

      if (data.status === "success" && data.url) {
        setPdfUrl(data.url);
        setStatus("success");
      } else if (data.error) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error)
        );
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error calling function", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setStatus("error");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TradingDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <DutyDetailsStep
            formData={formData}
            onInputChange={(name, value: unknown) => handleInputChange(name, value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="guest-form-wrapper">
      <form className="guest-form-flex" onSubmit={handleProcessPDF}>
        {renderStep()}
        {error && <p>{error}</p>}

        {status === "success" && pdfUrl && <PDFPreview pdfUrl={pdfUrl} />}

        {currentStep < 3 ? (
          <button className="form-button" type="button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="form-button" type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
