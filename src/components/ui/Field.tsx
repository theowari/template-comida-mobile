import { ChevronDown, CircleAlert } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const control =
  'w-full rounded-xl border-[1.5px] border-line-strong bg-surface px-4 text-base text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-2 hover:border-ink/35 focus:border-ink focus:shadow-[0_0_0_3px_rgb(32_32_32/0.12)] focus-visible:outline-none aria-[invalid=true]:border-brand aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgb(215_25_53/0.16)] disabled:bg-ground-2 disabled:text-ink-2';

interface FieldShellProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string | null;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, optional, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-ink">
        {label}
        {optional ? <span className="text-[13px] font-normal text-ink-2">Opcional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-snug font-medium text-brand-dark">
          <CircleAlert className="mt-px size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] leading-snug text-ink-2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string | null, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string | null;
  trailing?: ReactNode;
  leading?: ReactNode;
  containerClassName?: string;
  id?: string;
}

export function TextField({ label, optional, hint, error, trailing, leading, containerClassName, className, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell id={fieldId} label={label} optional={optional} hint={hint} error={error} className={containerClassName}>
      <div className="relative">
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(control, 'h-12', trailing ? 'pr-12' : undefined, leading ? 'pl-11' : undefined, className)}
          {...rest}
        />
        {leading ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-[15px] text-ink-2">{leading}</div>
        ) : null}
        {trailing ? <div className="absolute inset-y-0 right-0 grid w-12 place-items-center">{trailing}</div> : null}
      </div>
    </FieldShell>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  containerClassName?: string;
  children: ReactNode;
}

export function SelectField({ label, error, hint, containerClassName, className, children, ...rest }: SelectFieldProps) {
  const fieldId = useId();
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} className={containerClassName}>
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(control, 'h-12 appearance-none pr-10', className)}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-ink-2" aria-hidden />
      </div>
    </FieldShell>
  );
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  containerClassName?: string;
}

export function TextAreaField({ label, optional, hint, containerClassName, className, ...rest }: TextAreaFieldProps) {
  const fieldId = useId();
  return (
    <FieldShell id={fieldId} label={label} optional={optional} hint={hint} className={containerClassName}>
      <textarea
        id={fieldId}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        className={cn(control, 'min-h-24 resize-none py-3 leading-snug', className)}
        {...rest}
      />
    </FieldShell>
  );
}
