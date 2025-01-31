"use client";
import { createContext, useState, ReactNode } from "react";
import { FormData } from "../../lib/types/guest-return-form";

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

export const GuestReturnContext = createContext<{
  formData: FormData;
  setFormData: (data: FormData) => void;
}>({
  formData: INITIAL_FORM_DATA,
  setFormData: () => {},
});

export default function Layout({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  return (
    <GuestReturnContext.Provider value={{ formData, setFormData }}>
      <div className="guest-form-wrapper">{children}</div>
    </GuestReturnContext.Provider>
  );
}
