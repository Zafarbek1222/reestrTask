import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxOption {
  value: number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxListProps {
  legend: string;
  options: CheckboxOption[];
  selected: number[];
  onChange: (values: number[]) => void;
  error?: string;
  hint?: string;
  className?: string;
  columns?: 1 | 2;
}

export function CheckboxList({
  legend,
  options,
  selected,
  onChange,
  error,
  hint,
  className,
  columns = 1
}: CheckboxListProps) {
  const messageId = useId();
  const toggle = (value: number) => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  return (
    <fieldset
      className={twMerge('space-y-2', className)}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={error || hint ? messageId : undefined}>
      <legend className="text-sm font-semibold text-content">
        {legend}
        <span className="ml-1 text-danger" aria-hidden="true">*</span>
        <span className="sr-only"> (majburiy)</span>
      </legend>
      <div
        className={twMerge(
          'max-h-64 gap-1 overflow-y-auto rounded-control border bg-surface p-2 shadow-sm transition-colors',
          columns === 2 ? 'grid sm:grid-cols-2' : 'grid',
          error ? 'border-danger' : 'border-line'
        )}>
        
        {options.map((option) => {
          const optionDescriptionId = option.description ? `${messageId}-${option.value}` : undefined;
          return (
        <label
          key={option.value}
          className={twMerge(
            'flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2 text-sm text-content transition-colors duration-fast hover:bg-brand-subtle',
            option.disabled && 'cursor-not-allowed opacity-55 hover:bg-transparent'
          )}>
          
            <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong text-accent focus:ring-focus disabled:cursor-not-allowed"
            checked={selected.includes(option.value)}
            disabled={option.disabled}
            aria-describedby={optionDescriptionId}
            onChange={() => toggle(option.value)} />
          
            <span>
              <span className="block font-medium leading-snug">{option.label}</span>
              {option.description && <span id={optionDescriptionId} className="mt-0.5 block text-xs leading-relaxed text-content-muted">{option.description}</span>}
            </span>
          </label>
          );
        })}
      </div>
      {error ?
      <p id={messageId} role="alert" className="text-xs font-semibold text-danger">{error}</p> :
      hint ?
      <p id={messageId} className="text-xs leading-relaxed text-content-muted">{hint}</p> :
      null}
    </fieldset>);

}
