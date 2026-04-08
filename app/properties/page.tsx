import { Suspense } from 'react';
import PropertiesPage from '@/pages/Properties';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PropertiesPage />
    </Suspense>
  );
}
