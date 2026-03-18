/**
 * Primary CTA — orange filled button from Figma auth / landing patterns.
 */
export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
