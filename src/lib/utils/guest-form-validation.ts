import { FormData } from "../types/guest-return-form";
import { validateDate } from "./date-validation";

export const ERROR_MESSAGES = {
  tradingName: {
    required: "Trading name is required",
    length: "Must be 2 - 100 characters",
  },
  tradingAddress: {
    required: "Trading address is required",
    length: "Must be  5 - 200 characters",
  },
  postcode: {
    required: "Postcode is required",
    format: "Please enter a valid UK postcode",
  },
  periodFrom: {
    required: "Start date is required",
  },
  periodTo: {
    required: "End date is required",
    range: "End date must be after start date",
  },
  urn: {
    required: "URN is required",
    format: "URN must be a 12 digit number",
  },
  fullName: {
    required: "Full name is required",
    length: "Must be 2 - 100 characters",
    format: "Must only contain letters and punctuation",
  },
  capacity: {
    required: "Capacity is required",
  },
} as const;

export const validateTradingDetails = (
  data: Pick<
    FormData,
    | "tradingName"
    | "tradingAddress0"
    | "tradingAddress1"
    | "postcode"
    | "urn"
    | "fullName"
    | "capacity"
    | "periodFrom"
    | "periodTo"
  >
) => {
  const errors: Partial<Record<keyof typeof data, string>> = {};

  if (!data.tradingName) {
    errors.tradingName = ERROR_MESSAGES.tradingName.required;
  } else if (data.tradingName.length < 2 || data.tradingName.length > 100) {
    errors.tradingName = ERROR_MESSAGES.tradingName.length;
  }

  if (!data.tradingAddress0) {
    errors.tradingAddress0 = ERROR_MESSAGES.tradingAddress.required;
  } else if (
    data.tradingAddress0.length < 5 ||
    data.tradingAddress0.length > 200
  ) {
    errors.tradingAddress0 = ERROR_MESSAGES.tradingAddress.length;
  }

  if (!data.postcode) {
    errors.postcode = ERROR_MESSAGES.postcode.required;
  } else if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(data.postcode)) {
    errors.postcode = ERROR_MESSAGES.postcode.format;
  }

  if (!data.urn) {
    errors.urn = ERROR_MESSAGES.urn.required;
  } else if (!/^\d{12}$/.test(data.urn)) {
    errors.urn = ERROR_MESSAGES.urn.format;
  }

  if (!data.fullName) {
    errors.fullName = ERROR_MESSAGES.fullName.required;
  } else if (data.fullName.length < 2 || data.fullName.length > 100) {
    errors.fullName = ERROR_MESSAGES.fullName.length;
  } else if (!/^[a-zA-Z\s\-'.]+$/.test(data.fullName)) {
    errors.fullName = ERROR_MESSAGES.fullName.format;
  }

  if (!data.capacity) {
    errors.capacity = ERROR_MESSAGES.capacity.required;
  }

  const periodFromError = validateDate(data.periodFrom);
  if (periodFromError) {
    errors.periodFrom = periodFromError;
  }

  const periodToError = validateDate(data.periodTo);
  if (periodToError) {
    errors.periodTo = periodToError;
  }

  if (!errors.periodFrom && !errors.periodTo) {
    const [fromDay, fromMonth, fromYear] = data.periodFrom
      .split("/")
      .map(Number);
    const [toDay, toMonth, toYear] = data.periodTo.split("/").map(Number);

    const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
    const toDate = new Date(toYear, toMonth - 1, toDay);

    if (fromDate >= toDate) {
      errors.periodTo = ERROR_MESSAGES.periodTo.range;
    }
  }

  return errors;
};

export const validateFormStep = (step: number, formData: FormData) => {
  switch (step) {
    case 1:
      return validateTradingDetails(formData);
    default:
      return {};
  }
};

export const validateAllSteps = (formData: FormData) => {
  return {
    ...validateTradingDetails(formData),
  };
};
