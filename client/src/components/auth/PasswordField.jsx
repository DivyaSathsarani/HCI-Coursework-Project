import { Eye, EyeOff } from "lucide-react";
import { formInputClass } from "../ui/formStyles";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  name,
  showPassword,
  onToggleShow,
  placeholder = "••••••••",
  autoComplete = "current-password",
  labelRight,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${formInputClass} pr-10`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
