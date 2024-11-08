export type WineEntry = {
  type: 'Wine' | 'Cider';
  abv: number;
  style: 'Sparkling' | 'Still';
  unitsSold: number;
  containerSize: number;
}

export type FormData = {
    tradingName: string;
    tradingAddress0: string;
    tradingAddress1: string;
    tradingAddress2: string,
    postcode: string;
    periodFrom: string;
    periodTo: string;
    urn: string;
    fullName: string;
    capacity: string;
    wineEntries: WineEntry[];
  };
  
  export type ProcessPDFResponse = {
    url?: string;
    error?: string;
    status: "success" | "error";
  };

  export type FormErrors = Partial<{
    [K in keyof Omit<FormData, 'wineEntries'>]: string;
  } & {
    wineEntries: Array<Partial<Record<keyof WineEntry, string>>>;
  }>;