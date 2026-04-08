import { Suspense } from 'react';
import LandPage from '@/pages/Land';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LandPage />
    </Suspense>
  );
}
