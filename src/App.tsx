import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ResourcesPage from './pages/ResourcesPage';
import UsersPage from './pages/UsersPage';
import InventoryPage from './pages/InventoryPage';
import ReservationsPage from './pages/ReservationsPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/resources" replace />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;