import Navbar from "./Navbar";

/**
 * Re-export Navbar for authenticated pages (RoomDesigner, SaveLiveRoom, ContactAdmin).
 * Uses shared Navbar with conditional links.
 */
export function AppNavbar() {
  return <Navbar />;
}
