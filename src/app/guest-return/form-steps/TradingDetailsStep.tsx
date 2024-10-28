import { FormData } from "../../../lib/types/guest-return-form";

type StepProps = {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: string) => void;
};

export function TradingDetailsStep({ formData, onInputChange }: StepProps) {
  return (
    <div>
      <div>
        <label htmlFor="tradingName">Trading Name</label>
        <input
          type="text"
          id="tradingName"
          name="tradingName"
          value={formData.tradingName}
          onChange={(e) => onInputChange("tradingName", e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="tradingAddress0">First Line of Address</label>
        <input
          type="text"
          id="tradingAddress0"
          name="tradingAddress0"
          value={formData.tradingAddress0}
          onChange={(e) => onInputChange("tradingAddress0", e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="tradingAddress1">Second Line of Address</label>
        <input
          type="text"
          id="tradingAddress1"
          name="tradingAddress1"
          value={formData.tradingAddress1}
          onChange={(e) => onInputChange("tradingAddress1", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="postcode">Postcode</label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          value={formData.postcode}
          onChange={(e) => onInputChange("postcode", e.target.value)}
          required
        />
      </div>
    </div>
  );
}
