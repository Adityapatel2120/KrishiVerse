import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FarmProvider } from "./context/FarmContext";
import { CropProvider } from "./context/CropContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { PredictionProvider } from "./context/PredictionContext";
import { RevenueProvider } from "./context/RevenueContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import LanguageSelect from "./pages/auth/LanguageSelect";
import Login from "./pages/auth/Login";
import FarmList from "./pages/farm/FarmList";
import CropList from "./pages/crop/CropList";
import ExpenseList from "./pages/expense/ExpenseList";
import Profile from "./pages/profile/Profile";
import Prediction from "./pages/prediction/Prediction";
import Analytics from "./pages/analytics/Analytics";
import NotFound from "./pages/common/NotFound";

function App() {
  return (
    <AuthProvider>
      <FarmProvider>
        <CropProvider>
          <ExpenseProvider>
            <PredictionProvider>
              <RevenueProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<LanguageSelect />} />
                    <Route path="/login" element={<Login />} />

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
                      <Route path="/analytics" element={<Analytics />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </RevenueProvider>
            </PredictionProvider>
          </ExpenseProvider>
        </CropProvider>
      </FarmProvider>
    </AuthProvider>
  );
}

export default App;