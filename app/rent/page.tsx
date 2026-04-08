import { Suspense } from 'react';
import RentPage from '@/pages/Rent';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RentPage />
    </Suspense>
  );
}
