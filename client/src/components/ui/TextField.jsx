import { formInputClass } from "./formStyles";

export function TextField({ label, id, className = "", ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        className={`${formInputClass} ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
