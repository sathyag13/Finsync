import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Invalid URL */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;