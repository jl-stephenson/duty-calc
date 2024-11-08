import { FormData } from "../../../lib/types/guest-return-form";
import { DateInputGroup } from "../../../components/DateInputGroup";

type PeriodDetailsStepProps = {
  formData: FormData;
  onInputChange: (name: keyof FormData, value: string) => void;
  errors?: Partial<Record<keyof FormData, string>>;
};

export function PeriodDetailsStep({ formData, onInputChange, errors = {}, }: PeriodDetailsStepProps) {

  return (
    <div>
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
