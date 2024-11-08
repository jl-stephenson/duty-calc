const DATE_CONSTRAINTS = {
  DAY_MAX: 31,
  MONTH_MAX: 12,
  MONTHS_WITH_30_DAYS: [4, 6, 9, 11] as number[],
} as const;

const ERROR_MESSAGES = {
  required: "This date is required",
  invalidFormat: "Please enter a valid date in DD/MM/YYYY format",
  invalidDay: "Enter a valid day (1 - 31)",
  invalidMonth: "Enter a valid month (1 - 12)",
  invalidYear: "Enter a valid year (must be 4 digits)",
  februaryLeapYear: "February in a leap year has a maximum of 29 days",
  februaryNonLeapYear: "February has a maximum of 28 days",
  thirtyDayMonth: "This month has a maximum of 30 days",
  thirtyOneDayMonth: "This month has a maximum of 31 days",
  dateTooEarly: "Date must be after August 2023",
  dateTooLate: "Date cannot be after the current month",
} as const;

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const isDateInValidRange = (
  day: number,
  month: number,
  year: number
): boolean => {
  const currentDate = new Date();
  const inputDate = new Date(year, month - 1, day);
  const minDate = new Date(2023, 7, 1);
  const maxDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  return inputDate >= minDate && inputDate <= maxDate;
};

export const validateDate = (
  value: string,
): string | null => {
 if (!value) {
  return ERROR_MESSAGES.required;
 }

 const parts = value.split("/");
 if (parts.length !== 3) {
  return ERROR_MESSAGES.invalidFormat;
 }

 const [day, month, year] = parts;

 const dayNum = parseInt(day, 10);
 const monthNum = parseInt(month, 10);
 const yearNum = parseInt(year, 10);

 if (isNaN(dayNum) || dayNum < 1 || dayNum > DATE_CONSTRAINTS.DAY_MAX) {
  return ERROR_MESSAGES.invalidDay;
 }

 if (isNaN(monthNum) || monthNum < 1 || monthNum > DATE_CONSTRAINTS.MONTH_MAX) {
  return ERROR_MESSAGES.invalidMonth;
 } 

 if (isNaN(yearNum) || !(/^\d{4}$/).test(year)) {
  return ERROR_MESSAGES.invalidYear;
 }

  if (monthNum === 2) {
    if (isLeapYear(yearNum) && dayNum > 29)
      return ERROR_MESSAGES.februaryLeapYear;
    if (!isLeapYear(yearNum) && dayNum > 28)
      return ERROR_MESSAGES.februaryNonLeapYear;
  } else if (
    DATE_CONSTRAINTS.MONTHS_WITH_30_DAYS.includes(monthNum) &&
    dayNum > 30
  ) {
    return ERROR_MESSAGES.thirtyDayMonth;
  } else if (dayNum > DATE_CONSTRAINTS.DAY_MAX) {
    return ERROR_MESSAGES.thirtyOneDayMonth;
  }

  if (!isDateInValidRange(dayNum, monthNum, yearNum)) {
    const inputDate = new Date(yearNum, monthNum - 1, dayNum);
    const minDate = new Date(2023, 7, 1);

    return inputDate < minDate
      ? ERROR_MESSAGES.dateTooEarly
      : ERROR_MESSAGES.dateTooLate;
  }

  return "";
};

export const sanitizeDateInput = (value: string): string => {
  return value.replace(/\D/g, "");
}
