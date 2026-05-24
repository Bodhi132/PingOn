import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export function FormField({ id, label, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function FormInput({ id, label, className = "", ...props }: FormInputProps) {
  return (
    <FormField id={id} label={label}>
      <input
        id={id}
        className={`block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder-neutral-400 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 ${className}`}
        {...props}
      />
    </FormField>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
}

export function FormTextarea({ id, label, className = "", ...props }: FormTextareaProps) {
  return (
    <FormField id={id} label={label}>
      <textarea
        id={id}
        className={`block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder-neutral-400 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 ${className}`}
        {...props}
      />
    </FormField>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: { label: string; value: string }[];
}

export function FormSelect({ id, label, options, className = "", ...props }: FormSelectProps) {
  return (
    <FormField id={id} label={label}>
      <select
        id={id}
        className={`block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
