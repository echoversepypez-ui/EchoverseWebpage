'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options,
  rows = 4,
}: FormFieldProps) => {
  const commonClassName = `w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition ${
    error ? 'border-red-500 focus:border-red-500' : ''
  }`;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={commonClassName}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={commonClassName}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={commonClassName}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

interface FormContainerProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const FormContainer = ({ children, title, description }: FormContainerProps) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-black mb-2">{title}</h2>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        {children}
      </div>
    </div>
  );
};
