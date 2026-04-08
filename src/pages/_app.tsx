import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { PropertyTypesProvider } from '../contexts/PropertyTypesContext';
import '../index.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PropertyTypesProvider>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </PropertyTypesProvider>
  );
}
