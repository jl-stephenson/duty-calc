import { FormData } from "../../../lib/types/guest-return-form";

type StepProps = {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: string) => void;
};

export function PersonalDetailsStep({ formData, onInputChange }: StepProps) {
  return (
    <div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="capacity">Capacity</label>
        <input
          type="text"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={(e) => onInputChange("capacity", e.target.value)}
          required
        />
      </div>
    </div>
  );
}
