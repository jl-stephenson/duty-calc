"use client";
import { useState } from "react";
import {
  FormData,
  ProcessPDFResponse,
} from "../../lib/types/guest-return-form";
import { validateStep } from "../../lib/utils/guest-form-validation";
import { TradingDetailsStep } from "./form-steps/TradingDetailsStep";
import { PeriodDetailsStep } from "./form-steps/PeriodDetailsStep";
import { PersonalDetailsStep } from "./form-steps/PersonalDetailsStep";
import { httpsCallable } from "firebase/functions";
import { PDFPreview } from "./form-steps/PDFPreview";
import Card from "../../ui/card";
import { getFirebaseFunctions } from "../../lib/firebase/clientApp";

const INITIAL_FORM_DATA: FormData = {
  tradingName: "",
  tradingAddress0: "",
  tradingAddress1: "",
  postcode: "",
  periodFrom: "",
  periodTo: "",
  urn: "",
  fullName: "",
  capacity: "",
};

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAllSteps = (): boolean => {
    // Validate all steps from 1 to 3
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step, formData)) {
        setError(
          `Validation failed for step ${step}. Please check all fields are filled correctly.`
        );
        setCurrentStep(step); // Optionally return to the invalid step
        return false;
      }
    }
    return true;
  };

  const handleProcessPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPdfUrl(null);

    if (!validateAllSteps()) {
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

  const handleNext = () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TradingDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <PeriodDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <PersonalDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="guest-form-grid">
      <Card>
        <h2>Guest Return Form - Step {currentStep}</h2>
        <form onSubmit={handleProcessPDF}>
          {renderStep()}
          {error && <p>{error}</p>}

          {status === "success" && pdfUrl && <PDFPreview pdfUrl={pdfUrl} />}

          {currentStep < 3 ? (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </form>
      </Card>
    </div>
  );
}
