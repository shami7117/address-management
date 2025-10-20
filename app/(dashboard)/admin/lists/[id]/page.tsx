// =============================================
// FILE: app/admin/lists/[id]/page.tsx
// =============================================
'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AddressTable from '@/components/admin/AddressTable';
import AddAddressDialog from '@/components/admin/AddAddressDialog';
import ImportCSVDialog from '@/components/admin/ImportCSVDialog';
import ExportCSVButton from '@/components/admin/ExportCSVButton';
import WallboardControls from '@/components/admin/WallboardControls';

// Types
export interface Address {
  id: string;
  address: string;
  checked: boolean;
  lastChanged: Date;
}

// Mock Data
const mockListData = {
  id: '1',
  listName: 'Summer Campaign 2024',
  areaCode: '030',
};

const mockAddresses: Address[] = [
  {
    id: '1',
    address: '123 Main Street, Berlin',
    checked: true,
    lastChanged: new Date('2024-03-15'),
  },
  {
    id: '2',
    address: '456 Oak Avenue, Hamburg',
    checked: false,
    lastChanged: new Date('2024-03-10'),
  },
  {
    id: '3',
    address: '789 Pine Road, Munich',
    checked: true,
    lastChanged: new Date('2024-02-28'),
  },
  {
    id: '4',
    address: '321 Elm Street, Frankfurt',
    checked: false,
    lastChanged: new Date('2024-03-01'),
  },
];

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [wallboardUrl, setWallboardUrl] = useState<string | null>(null);

  const handleAddAddress = (address: string) => {
    const newAddress: Address = {
      id: String(Date.now()),
      address,
      checked: false,
      lastChanged: new Date(),
    };
    setAddresses([...addresses, newAddress]);
    // TODO: Connect to Supabase
  };

  const handleImportCSV = (importedAddresses: Address[]) => {
    setAddresses([...addresses, ...importedAddresses]);
    // TODO: Connect to Supabase
  };

  const handleUpdateAddress = (id: string, field: keyof Address, value: any) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id
          ? { ...addr, [field]: value, lastChanged: new Date() }
          : addr
      )
    );
    // TODO: Connect to Supabase
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    // TODO: Connect to Supabase
  };

  const handleReorderAddresses = (reorderedAddresses: Address[]) => {
    setAddresses(reorderedAddresses);
    // TODO: Connect to Supabase to persist order
  };

  const handleGenerateWallboard = () => {
    // Generate random slug
    const randomSlug = Math.random().toString(36).substring(2, 10);
    const newWallboardUrl = `/wallboard/${randomSlug}`;
    setWallboardUrl(newWallboardUrl);
    // TODO: Connect to Supabase to persist wallboard_url
    // await supabase.from('address_lists').update({ wallboard_url: randomSlug }).eq('id', params.id);
  };

  const handleDeleteWallboard = () => {
    setWallboardUrl(null);
    // TODO: Connect to Supabase to clear wallboard_url
    // await supabase.from('address_lists').update({ wallboard_url: null }).eq('id', params.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} /> */}
      <div className="flex">
        {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Back Button & List Info */}
            <div className="mb-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Lists
              </Button>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  {mockListData.listName}
                </h1>
                <p className="text-sm text-gray-600">
                  Area Code: {mockListData.areaCode}
                </p>
              </div>
            </div>

            {/* Wallboard Controls */}
            <div className="mb-6">
              <WallboardControls
                wallboardUrl={wallboardUrl}
                onGenerate={handleGenerateWallboard}
                onDelete={handleDeleteWallboard}
              />
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <AddAddressDialog onAddAddress={handleAddAddress} />
              <ImportCSVDialog onImport={handleImportCSV} />
              <ExportCSVButton addresses={addresses} />
            </div>

            {/* Address Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Address Management</h2>
                <span className="text-sm text-gray-600">
                  {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
                </span>
              </div>
              <AddressTable
                addresses={addresses}
                onUpdateAddress={handleUpdateAddress}
                onDeleteAddress={handleDeleteAddress}
                onReorderAddresses={handleReorderAddresses}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


