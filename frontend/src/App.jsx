import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FarmProvider } from "./context/FarmContext";
import { CropProvider } from "./context/CropContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import LanguageSelect from "./pages/auth/LanguageSelect";
import Login from "./pages/auth/Login";
import FarmList from "./pages/farm/FarmList";
import CropList from "./pages/crop/CropList";
import ExpenseList from "./pages/expense/ExpenseList";
import Profile from "./pages/profile/Profile";
import Prediction from "./pages/prediction/Prediction";
import NotFound from "./pages/common/NotFound";

function App() {
  return (
    <AuthProvider>
      <FarmProvider>
        <CropProvider>
          <ExpenseProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LanguageSelect />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />

                <Route
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/farm" element={<FarmList />} />
                  <Route path="/crop" element={<CropList />} />
                  <Route path="/expense" element={<ExpenseList />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/prediction" element={<Prediction />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ExpenseProvider>
        </CropProvider>
      </FarmProvider>
    </AuthProvider>
  );
}

export default App;