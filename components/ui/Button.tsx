"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50",
  secondary: "bg-gray-800 text-gray-100 hover:bg-gray-700 hover:text-white disabled:opacity-50",
  ghost: "text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  icon: "p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isIcon = variant === "icon";

    const baseClasses = isIcon
      ? `${variantClasses.icon} cursor-pointer`
      : `${variantClasses[variant]} ${sizeClasses[size]} rounded-lg transition-colors cursor-pointer`;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
export { Button };
export type { ButtonVariant, ButtonSize, ButtonProps };
