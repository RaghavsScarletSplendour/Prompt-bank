import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseClasses =
  "w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function FormInput({ label, className = "", ...props }: FormInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input className={`${baseClasses} ${className}`} {...props} />
    </div>
  );
}

export function FormTextarea({ label, className = "", ...props }: FormTextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea className={`${baseClasses} ${className}`} {...props} />
    </div>
  );
}

export function FormSelect({
  label,
  className = "",
  children,
  ...props
}: { label?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select className={`${baseClasses} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
