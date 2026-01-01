import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  padding = "md",
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const baseClasses = "border border-white/10 rounded-2xl";
  const cardStyle = {
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    backgroundColor: "#0d1117"
  };
  const interactiveClasses = interactive
    ? "cursor-pointer hover:border-white/10 transition-colors"
    : "";

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      style={cardStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
