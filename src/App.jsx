import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import RoomDesigner from "./pages/RoomDesigner";
import SaveLiveRoom from "./pages/SaveLiveRoom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword/>}/>

        {/* Protected Designer Page */}
        <Route
          path="/designer"
          element={
            <ProtectedRoute>
              <RoomDesigner />
            </ProtectedRoute>
          }
        />

        {/* Protected Save Live Page */}
        <Route
          path="/save-live"
          element={
            <ProtectedRoute>
              <SaveLiveRoom />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;