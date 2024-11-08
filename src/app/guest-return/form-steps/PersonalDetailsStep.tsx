import { FormData } from "../../../lib/types/guest-return-form";

type StepProps = {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
};

export function PersonalDetailsStep({ formData, onInputChange, errors }: StepProps) {
  return (
    <div>
      <div className="form-field">
        <label htmlFor="fullName">Full Name</label>
        <input
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
          type="text"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={(e) => onInputChange("capacity", e.target.value)}
          required
        />
        {errors.capacity && <p className="form-error">{errors.capacity}</p>}
      </div>
    </div>
  );
}
