// =============================================
// FILE: app/wallboard/[slug]/page.tsx
// =============================================
import { notFound } from 'next/navigation';
import WallboardHeader from '@/components/wallboard/WallboardHeader';
import WallboardProgress from '@/components/wallboard/WallboardProgress';
import WallboardTable from '@/components/wallboard/WallboardTable';

// Mock data fetch - replace with your actual database query
async function getWallboardData(slug: string) {
  // Example query:
  // const data = await db.query(`
  //   SELECT al.*, a.address_text, a.comment, a.checked, a.updated_at
  //   FROM address_lists al
  //   LEFT JOIN addresses a ON a.list_id = al.id
  //   WHERE al.wallboard_url = $1
  // `, [slug]);
  
  // Mock data for demonstration
  const mockData = {
    id: 1,
    name: 'Downtown Canvassing Route',
    areaCode: '45000',
    updatedAt: new Date('2025-10-10T14:30:00'),
    addresses: [
      { id: 1, addressText: 'Vestergade 12, 1456 København', comment: 'Ring doorbell twice', checked: true },
      { id: 2, addressText: 'Nørrebrogade 45, 2200 København', comment: '', checked: true },
      { id: 3, addressText: 'Amagerbrogade 78, 2300 København', comment: 'Closed on weekends', checked: false },
      { id: 4, addressText: 'Østerbrogade 23, 2100 København', comment: '', checked: true },
      { id: 5, addressText: 'Frederiksborggade 5, 1360 København', comment: 'Ask for manager', checked: false },
      { id: 6, addressText: 'Strøget 89, 1150 København', comment: '', checked: true },
      { id: 7, addressText: 'Gammel Kongevej 34, 1610 København', comment: '', checked: false },
      { id: 8, addressText: 'Istedgade 67, 1650 København', comment: 'Business hours only', checked: true },
    ],
  };

  // Simulate slug not found
  if (slug !== 'demo-route-123') {
    return null;
  }

  return mockData;
}

export default async function WallboardPage({ params }: { params: { slug: string } }) {
  const data = await getWallboardData(params.slug);

  if (!data) {
    notFound();
  }

  const totalAddresses = data.addresses.length;
  const checkedAddresses = data.addresses.filter(a => a.checked).length;
  const progressPercentage = totalAddresses > 0 ? (checkedAddresses / totalAddresses) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WallboardHeader
          name={data.name}
          areaCode={data.areaCode}
          updatedAt={data.updatedAt}
        />

        <div className="mt-8">
          <WallboardProgress
            percentage={progressPercentage}
            checked={checkedAddresses}
            total={totalAddresses}
          />
        </div>

        <div className="mt-8">
          <WallboardTable addresses={data.addresses} />
        </div>
      </div>
    </div>
  );
}