import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SalesOrderFormPage from "./pages/SalesOrderFormPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold text-slate-800">
              Sales Order Application
            </Link>
            <span className="text-xs text-slate-500">
              React + Tailwind + .NET Core
            </span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto mt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/orders/new" element={<SalesOrderFormPage />} />
            <Route path="/orders/:id" element={<SalesOrderFormPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
