type DateInputGroupProps = {
  label: string;
  id: string;
  value: string;
  onChange: (fullDate: string) => void;
  error?: string;
};

type DateParts = {
  day: string;
  month: string;
  year: string;
};

export function DateInputGroup({
  label,
  id,
  value,
  onChange,
  error,
}: DateInputGroupProps) {
  const [day, month, year] = value?.split("/") || ["", "", ""];

  const handleDatePartChange = (part: keyof DateParts, value: string) => {
    if (value === "") {
      const newDateParts: DateParts = { day, month, year };
      newDateParts[part] = "";
      const newDate = Object.values(newDateParts).filter(Boolean).join("/");
      onChange(newDate);
      return;
    }

    let isValid = false;
    const normalizedValue = value.replace(/\D/g, "");

    switch (part) {
      case "day":
        isValid = /^\d{1,2}$/.test(normalizedValue);
        if (parseInt(normalizedValue) > 31) {
          isValid = false;
        }
        break;
      case "month":
        isValid = /^\d{1,2}$/.test(normalizedValue);
        if (parseInt(normalizedValue) > 12) isValid = false;
        break;
      case "year":
        isValid = /^\d{1,4}$/.test(normalizedValue);
        break;
    }

    if (!isValid) return;

    const newDateParts: DateParts = {
      day: day || "",
      month: month || "",
      year: year || "",
    };
    newDateParts[part] = normalizedValue;

    const formattedParts: DateParts = {
      day: newDateParts.day ? newDateParts.day : "",
      month: newDateParts.month ? newDateParts.month : "",
      year: newDateParts.year || "",
    };

    const newDate = Object.values(formattedParts).filter(Boolean).join("/");

    onChange(newDate);
  };

  return (
    <div>
      <label htmlFor={`${id}-day`}>{label}</label>
      <div role="group" aria-labelledby={`${id}-label`}>
        <div>
          <input
            type="text"
            id={`${id}-day`}
            value={day || ""}
            onChange={(e) => handleDatePartChange("day", e.target.value)}
            placeholder="DD"
            maxLength={2}
            aria-label="Day"
          />
        </div>
        <div>
          <input
            type="text"
            id={`${id}-month`}
            value={month || ""}
            onChange={(e) => handleDatePartChange("month", e.target.value)}
            placeholder="MM"
            maxLength={2}
            aria-label="Month"
          />
        </div>
        <div>
          <input
            type="text"
            id={`${id}-year`}
            value={year || ""}
            onChange={(e) => handleDatePartChange("year", e.target.value)}
            placeholder="YYYY"
            maxLength={4}
            aria-label="Year"
          />
        </div>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}
