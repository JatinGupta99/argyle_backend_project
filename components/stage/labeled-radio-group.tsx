'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface LabeledRadioGroupProps {
  label?: string;
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function LabeledRadioGroup({
  label,
  options,
  value,
  onValueChange,
  className = '',
}: LabeledRadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label className="text-base font-medium">{label}</Label>}
      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.id} />
              <Label htmlFor={option.id} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
