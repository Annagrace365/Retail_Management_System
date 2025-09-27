import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Suppliers from './pages/Suppliers';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute requiredRole="staff">
                <Layout>
                  <Customers />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <ProtectedRoute requiredRole="inventory_manager">
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute requiredRole="staff">
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute requiredRole="staff">
                <Layout>
                  <Payments />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/suppliers" 
            element={
              <ProtectedRoute requiredRole="inventory_manager">
                <Layout>
                  <Suppliers />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;