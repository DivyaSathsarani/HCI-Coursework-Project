import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RoomDesigner from "./pages/RoomDesigner";
import SaveLiveRoom from "./pages/SaveLiveRoom";
import ContactAdmin from "./pages/ContactAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Landing />} />

        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/designer"
          element={
            <ProtectedRoute>
              <RoomDesigner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/save-live"
          element={
            <ProtectedRoute>
              <SaveLiveRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <ContactAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contact"
          element={<Navigate to="/messages" replace />}
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
