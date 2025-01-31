"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GuestReturnContext } from "../layout";
import { validateAllSteps } from "../../../lib/utils/guest-form-validation";
import { httpsCallable } from "firebase/functions";
import {
  initAnonymousAuth,
  getFirebaseFunctions,
} from "../../../lib/firebase/clientApp";
import {
  FormData,
  ProcessPDFResponse,
} from "../../../lib/types/guest-return-form";

export default function ReviewPage() {
  const { formData } = useContext(GuestReturnContext);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    initAnonymousAuth();
  }, []);

  const handleProcessPDF = async (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = validateAllSteps(formData);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
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

      const result = await processPDFFunction(formData);
      const data = result.data;

      if (data.status === "success" && data.url) {
        setStatus("success");
        router.push(
          `/guest-return/pdf-preview?pdfUrl=${encodeURIComponent(data.url)}`
        );
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
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleProcessPDF}>
      <h2>Review Your Details</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>

      {status === "error" && errors && (
        <p>Some errors occurred. Please check your form.</p>
      )}

      <div className="nav-buttons">
        <button className="form-button form-button--next" type="submit">
          Next
        </button>
        <button
          className="form-button form-button--back"
          type="button"
          onClick={() => router.push("/guest-return/step2")}
        >
          Back
        </button>
      </div>
    </form>
  );
}
