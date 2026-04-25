import { getAccessoriesGrouped } from '@/lib/queries';
import AccessoriesClient from './AccessoriesClient';

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function AccessoriesPage() {
  const { menWatches, womenWatches, bags } = await getAccessoriesGrouped();

  return (
    <AccessoriesClient
      menWatches={menWatches}
      womenWatches={womenWatches}
      bags={bags}
    />
  );
}
