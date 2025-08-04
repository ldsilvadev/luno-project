"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

function PasswordInput({ className, type, error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-foreground/50 flex h-11 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
    </div>
  );
}

export { PasswordInput };