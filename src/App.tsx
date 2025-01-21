import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SSSPForm from "./pages/SSSPForm";
import CompanySettings from "./pages/CompanySettings";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create-sssp" element={<SSSPForm />} />
        <Route path="/edit-sssp/:id" element={<SSSPForm />} />
        <Route path="/company-settings" element={<CompanySettings />} />
      </Routes>
    </Router>
  );
}

export default App;