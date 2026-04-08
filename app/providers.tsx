"use client";

import { ToastContainer } from 'react-toastify';
import { PropertyTypesProvider } from '@/contexts/PropertyTypesContext';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PropertyTypesProvider>
      {children}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </PropertyTypesProvider>
  );
}
