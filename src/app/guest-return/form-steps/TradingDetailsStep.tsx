import { FormData } from "../../../lib/types/guest-return-form";
import { DateInputGroup } from "../../../components/DateInputGroup";

type StepProps = {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
};

export function TradingDetailsStep({
  formData,
  onInputChange,
  errors,
}: StepProps) {
  return (
    <div className="form-step-wrapper">
      <h2>Trading Details</h2>
      <div className="form-field">
        <label htmlFor="tradingName">Trading Name</label>
        <input
          className={`form-text-input ${errors.tradingName ? "error" : ""}`}
          type="text"
          id="tradingName"
          name="tradingName"
          value={formData.tradingName}
          onChange={(e) => onInputChange("tradingName", e.target.value)}
          required
        />
        {errors.tradingName && (
          <p className="form-error">{errors.tradingName}</p>
        )}
      </div>

      <div className="form-field">
        <label id="addressLabel">Address</label>
        <div
          className="address-inputs"
          role="group"
          aria-labelledby="addressLabel"
        >
          <input
            className={`form-text-input ${
              errors.tradingAddress0 ? "error" : ""
            }`}
            type="text"
            id="tradingAddress0"
            name="tradingAddress0"
            value={formData.tradingAddress0}
            onChange={(e) => onInputChange("tradingAddress0", e.target.value)}
            required
            aria-label="Address line 1"
          />
          <input
            className="form-text-input"
            type="text"
            id="tradingAddress1"
            name="tradingAddress1"
            value={formData.tradingAddress1}
            onChange={(e) => onInputChange("tradingAddress1", e.target.value)}
            required
            aria-label="Address line 2"
          />
          <input
            className="form-text-input"
            type="text"
            id="tradingAddress2"
            name="tradingAddress2"
            value={formData.tradingAddress2}
            onChange={(e) => onInputChange("tradingAddress2", e.target.value)}
            required
            aria-label="Address line 3"
          />
        </div>
      </div>

      <div className="form-field postcode">
        <div></div>
        <div className="postcode-field">
          <label htmlFor="postcode">Postcode</label>
          <input
            className={`form-text-input ${errors.postcode ? "error" : ""}`}
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={(e) => onInputChange("postcode", e.target.value)}
            required
          />
        </div>

        {errors.tradingAddress0 && (
          <p className="form-error">{errors.tradingAddress0}</p>
        )}
        {errors.postcode && !errors.tradingAddress0 && (
          <p className="form-error">{errors.postcode}</p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="urn">URN</label>
        <input
          className={`form-text-input ${errors.urn ? "error" : ""}`}
          type="text"
          id="urn"
          name="urn"
          value={formData.urn}
          onChange={(e) => onInputChange("urn", e.target.value)}
        />
        {errors.urn && <p className="form-error">{errors.urn}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="fullName">Full Name</label>
        <input
          className={`form-text-input ${errors.fullName ? "error" : ""}`}
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          required
        />
        {errors.fullName && <p className="form-error">{errors.fullName}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="capacity">Capacity</label>
        <input
          className={`form-text-input ${errors.capacity ? "error" : ""}`}
          type="text"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={(e) => onInputChange("capacity", e.target.value)}
          required
        />
        {errors.capacity && <p className="form-error">{errors.capacity}</p>}
      </div>
      <DateInputGroup
        label="Period From"
        id="period-from"
        value={formData.periodFrom}
        onInputChange={(value) => onInputChange("periodFrom", value)}
        error={errors.periodFrom}
      />

      <DateInputGroup
        label="Period To"
        id="period-to"
        value={formData.periodTo}
        onInputChange={(value) => onInputChange("periodTo", value)}
        error={errors.periodTo}
      />
    </div>
  );
}
