import { createContext, useContext, useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from 'react';
import { twMerge } from 'tailwind-merge';
import { useI18n } from '../../contexts/i18n';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  success?: string;
  required?: boolean;
  children: (props: {
    id: string;
    invalid: boolean;
    valid: boolean;
    describedBy: string | undefined;
  }) => ReactNode;
  className?: string;
}

interface FieldControlContextValue {
  id: string;
  invalid: boolean;
  valid: boolean;
  describedBy: string | undefined;
  errorId: string | undefined;
  required: boolean;
}

const FieldControlContext = createContext<FieldControlContextValue | null>(null);

export function Field({ label, error, hint, success, required, children, className }: FieldProps) {
  const { t } = useI18n();
  const id = useId();
  const messageId = error || success || hint ? `${id}-message` : undefined;
  const invalid = Boolean(error);
  const valid = Boolean(success && !error);
  const control = { id, invalid, valid, describedBy: messageId, errorId: error ? messageId : undefined, required: Boolean(required) };

  return (
    <div className={twMerge('space-y-2', className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-content">
        {label}
        {required && (
          <>
            <span className="ml-1 text-danger" aria-hidden="true">*</span>
            <span className="sr-only"> ({t('validation.required')})</span>
          </>
        )}
      </label>
      <FieldControlContext.Provider value={control}>
        {children({ id, invalid, valid, describedBy: messageId })}
      </FieldControlContext.Provider>
      {error ?
      <p id={messageId} role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p> :
      success ?
      <p id={messageId} role="status" className="text-xs font-medium text-positive">
          {success}
        </p> :
      hint ?
      <p id={messageId} className="text-xs leading-relaxed text-content-muted">
          {hint}
        </p> :
      null}
    </div>);

}

const controlBase =
'w-full rounded-control border bg-surface px-3.5 text-sm text-content-strong shadow-sm placeholder:text-content-subtle transition-[border-color,box-shadow,background-color] duration-fast hover:border-line-strong focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-subtle disabled:text-content-muted disabled:shadow-none';

const inputClass = (invalid?: boolean, valid?: boolean): string =>
twMerge(
  controlBase,
  'min-h-11',
  invalid
    ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
    : valid
      ? 'border-positive focus-visible:border-positive focus-visible:ring-positive/15'
      : 'border-line focus-visible:border-accent focus-visible:ring-focus/15'
);

const textareaClass = (invalid?: boolean, valid?: boolean): string =>
twMerge(
  controlBase,
  'resize-y py-2.5 leading-relaxed',
  invalid
    ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
    : valid
      ? 'border-positive focus-visible:border-positive focus-visible:ring-positive/15'
      : 'border-line focus-visible:border-accent focus-visible:ring-focus/15'
);

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  valid?: boolean;
}

export function TextInput({ invalid, valid, className, id, required, ...rest }: TextInputProps) {
  const field = useContext(FieldControlContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isValid = valid ?? field?.valid ?? false;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  return (
    <input
      {...rest}
      id={id ?? field?.id}
      required={required ?? field?.required}
      className={twMerge(inputClass(isInvalid, isValid), className)}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy}
      aria-errormessage={rest['aria-errormessage'] ?? (isInvalid ? field?.errorId : undefined)}
    />
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  valid?: boolean;
}

export function TextArea({ invalid, valid, className, id, required, ...rest }: TextAreaProps) {
  const field = useContext(FieldControlContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isValid = valid ?? field?.valid ?? false;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  return (
    <textarea
      {...rest}
      id={id ?? field?.id}
      required={required ?? field?.required}
      className={twMerge(textareaClass(isInvalid, isValid), className)}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy}
      aria-errormessage={rest['aria-errormessage'] ?? (isInvalid ? field?.errorId : undefined)}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  valid?: boolean;
}

export function Select({ invalid, valid, className, children, id, required, ...rest }: SelectProps) {
  const field = useContext(FieldControlContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isValid = valid ?? field?.valid ?? false;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  return (
    <select
      {...rest}
      id={id ?? field?.id}
      required={required ?? field?.required}
      className={twMerge(inputClass(isInvalid, isValid), 'cursor-pointer pr-9', className)}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy}
      aria-errormessage={rest['aria-errormessage'] ?? (isInvalid ? field?.errorId : undefined)}>
      {children}
    </select>);

}
