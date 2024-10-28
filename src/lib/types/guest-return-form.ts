export type FormData = {
    tradingName: string;
    tradingAddress0: string;
    tradingAddress1: string;
    postcode: string;
    periodFrom: string;
    periodTo: string;
    urn: string;
    fullName: string;
    capacity: string;
  };
  
  export type ProcessPDFResponse = {
    url?: string;
    error?: string;
    status: "success" | "error";
  };