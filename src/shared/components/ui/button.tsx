import React from "react";
import clsx from "clsx";

export type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline" | "danger" | "secondary";
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:ring-blue-500 shadow-md hover:shadow-lg",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-md hover:shadow-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variants[variant], className, "px-4 py-2")}
    >
      {children}
    </button>
  );
};

export default Button;
