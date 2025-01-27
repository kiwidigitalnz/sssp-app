import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SSSPForm from "./pages/SSSPForm";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import { TopNav } from "./components/layout/TopNav";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/create-sssp"
            element={
              <ProtectedRoute>
                <SSSPForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-sssp/:id"
            element={
              <ProtectedRoute>
                <SSSPForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function WrappedApp() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default WrappedApp;