import { FormData } from "../types/guest-return-form";


function isValidDate(dateStr: string): boolean {
  // Check format
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return false;
  }

  const [day, month, year] = dateStr.split("/").map(Number);

  // Check year is reasonable (e.g., between 2000 and 2100)
  if (year < 2000 || year > 2100) {
    return false;
  }

  // Check month is valid
  if (month < 1 || month > 12) {
    return false;
  }

  // Check day is valid for the given month
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  return true;
}

function areDatesInOrder(fromDate: string, toDate: string): boolean {
  if (!isValidDate(fromDate) || !isValidDate(toDate)) {
    return false;
  }

  const [fromDay, fromMonth, fromYear] = fromDate.split("/").map(Number);
  const [toDay, toMonth, toYear] = toDate.split("/").map(Number);

  const from = new Date(fromYear, fromMonth - 1, fromDay);
  const to = new Date(toYear, toMonth - 1, toDay);

  return from <= to;
}

function isValidUrn(urn: string): boolean {
  return /^\d{12}$/.test(urn);
}

export function validateStep(step: number, formData: FormData): boolean {
  switch (step) {
    case 1:
      return Boolean(
        formData.tradingName && formData.tradingAddress0 && formData.postcode
      );
    case 2:
      if (!formData.periodFrom || !formData.periodTo || !formData.urn) {
        return false;
      }
      if (!isValidUrn(formData.urn)) {
        return false;
      }

      return (
        isValidDate(formData.periodFrom) &&
        isValidDate(formData.periodTo) &&
        areDatesInOrder(formData.periodFrom, formData.periodTo)
      );
    case 3:
      return Boolean(formData.fullName && formData.capacity);
    default:
      return true;
  }
}

export const fieldValidators = {
  periodFrom: (value: string) => isValidDate(value),
  periodTo: (value: string) => isValidDate(value),
  urn: (value: string) => isValidUrn(value),
  dateRange: (from: string, to: string) => areDatesInOrder(from, to),
};

// Helper function to get specific validation error messages
export function getValidationError(
  field: keyof FormData | "dateRange",
  value: string | string[]
): string | null {
  switch (field) {
    case "periodFrom":
    case "periodTo":
      if (!value) return "Date is required";
      if (!isValidDate(value as string))
        return "Please enter a valid date in DD/MM/YYYY format";
      return null;

    case "urn":
      if (!value) return "URN is required";
      if (!isValidUrn(value as string)) return "URN must be exactly 12 digits";
      return null;

    case "dateRange": {
      const [from, to] = value as string[];
      if (!areDatesInOrder(from, to))
        return "Period From must be before or equal to Period To";
      return null;
    }

    default:
      return null;
  }
}
