import React from "react";
import { WineEntry, FormData } from "../../../lib/types/guest-return-form";
import { CloseSvg } from "../../../components/button-svgs/CloseSvg";
import { PlusSvg } from "../../../components/button-svgs/PlusSvg";

interface DutyDetailsStepProps {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: unknown) => void;
}

export const DutyDetailsStep: React.FC<DutyDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  const handleAddEntry = () => {
    if (formData.wineEntries.length < 11) {
      const newEntry: WineEntry = {
        type: "Wine",
        abv: 0.0,
        style: "Still",
        unitsSold: 0,
        containerSize: 750,
      };

      onInputChange("wineEntries", [...formData.wineEntries, newEntry]);
    }
  };

  const handleRemoveEntry = (index: number) => {
    const newEntries = formData.wineEntries.filter((_, i) => i !== index);
    onInputChange("wineEntries", newEntries);
  };

  const handleEntryChange = (
    index: number,
    field: keyof WineEntry,
    value: unknown
  ) => {
    const newEntries = [...formData.wineEntries];
    newEntries[index] = {
      ...newEntries[index],
      [field]:
        field === "abv" || field === "unitsSold" || field === "containerSize"
          ? Number(value)
          : value,
    };
    onInputChange("wineEntries", newEntries);
  };

  return (
    <div className="form-step-wrapper">
      <h2 className="form-step-title">Duty Details</h2>

      {formData.wineEntries.map((entry, index) => (
        <div key={index} className="duty-form-field">
          <div>
            <label className="duty-label" htmlFor="Type">
              Type
            </label>
            <select
              className="duty-select"
              name="Type"
              id="Type"
              value={entry.type}
              onChange={(e) => handleEntryChange(index, "type", e.target.value)}
            >
              <option value="Wine">Wine</option>
              <option value="Cider">Cider</option>
            </select>
          </div>
          <div>
            <label className="duty-label" htmlFor="abv">
              ABV (%)
            </label>
            <input
              className="form-text-input"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={entry.abv}
              onChange={(e) => handleEntryChange(index, "abv", e.target.value)}
            />
          </div>
          <div>
            <label className="duty-label" htmlFor="Style">
              Style
            </label>
            <select
              className="duty-select"
              name="Style"
              id="Style"
              value={entry.style}
              onChange={(e) =>
                handleEntryChange(index, "style", e.target.value)
              }
            >
              <option value="Still">Still</option>
              <option value="Sparkling">Sparkling</option>
            </select>
          </div>
          <div>
            <label className="duty-label" htmlFor="Units">
              Units Sold
            </label>
            <input
              className="form-text-input"
              type="text"
              id="Units"
              value={entry.unitsSold}
              onChange={(e) =>
                handleEntryChange(index, "unitsSold", e.target.value)
              }
            />
          </div>
          <div>
            <label className="duty-label" htmlFor="Container">
              Container (ml)
            </label>
            <input
              className="form-text-input"
              type="text"
              id="Container"
              value={entry.containerSize}
              onChange={(e) =>
                handleEntryChange(index, "containerSize", e.target.value)
              }
            />
          </div>
          <button
            className="duty-entry-button duty-entry-button--remove"
            type="button"
            onClick={() => handleRemoveEntry(index)}
          >
            <CloseSvg />
            <span className="visually-hidden">Remove Entry</span>
          </button>
        </div>
      ))}

      {formData.wineEntries.length < 11 && (
        <button
          className="duty-entry-button duty-entry-button--add"
          type="button"
          onClick={handleAddEntry}
        >
          <PlusSvg />
          <span className="visually-hidden">Add Entry</span>
        </button>
      )}

      {formData.wineEntries.length === 0 && (
        <p className="duty-entry-instructions">
          No entries yet. Click the 'Plus' button to add one. If you would like
          to submit a zero duty return, or only submit under and/or
          overdeclations please click 'Next'.
        </p>
      )}
    </div>
  );
};
