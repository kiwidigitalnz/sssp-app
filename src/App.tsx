import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SSSPForm from "./pages/SSSPForm";
import CompanySettings from "./pages/CompanySettings";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import { TopNav } from "./components/TopNav";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-sssp" element={<SSSPForm />} />
          <Route path="/edit-sssp/:id" element={<SSSPForm />} />
          <Route path="/company-settings" element={<CompanySettings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

// Wrap the App component with Router
function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;