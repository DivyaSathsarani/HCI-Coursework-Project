import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

/**
 * Brand mark + wordmark. Matches Figma Furnish header/footer.
 * When logged in, logo links to /designer; otherwise to /.
 */
export function FurnishLogo({
  to,
  textClassName = "text-gray-900",
  className = "",
}) {
  const { isAuthenticated } = useAuth();
  const href = to ?? (isAuthenticated ? "/designer" : "/");
  return (
    <Link to={href} className={`flex items-center gap-2 shrink-0 ${className}`}>
      <div className="bg-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
        <span className="text-white font-bold text-sm leading-none">F</span>
      </div>
      <span className={`text-xl font-semibold tracking-tight ${textClassName}`}>
        Furnish
      </span>
    </Link>
  );
}
