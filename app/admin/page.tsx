// app/admin/page.tsx
'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ListOverview from '@/components/admin/ListOverview';
import CreateListDialog from '@/components/admin/CreateListDialog';

// Types
export interface ListItem {
  id: string;
  listName: string;
  areaCode: string;
  createdAt: Date;
}

// Mock Data
const mockLists: ListItem[] = [
  {
    id: '1',
    listName: 'Summer Campaign 2024',
    areaCode: '030',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    listName: 'Local Business Directory',
    areaCode: '040',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    listName: 'Healthcare Providers',
    areaCode: '089',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    listName: 'Restaurant Partners',
    areaCode: '069',
    createdAt: new Date('2024-03-01'),
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lists, setLists] = useState<ListItem[]>(mockLists);

  const handleCreateList = (name: string, areaCode: string) => {
    const newList: ListItem = {
      id: String(Date.now()),
      listName: name,
      areaCode: areaCode,
      createdAt: new Date(),
    };
    setLists([...lists, newList]);
  };

  const handleDelete = (id: string) => {
    setLists(lists.filter((list) => list.id !== id));
    // TODO: Connect to Supabase delete
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your lists and area codes
                </p>
              </div>
              <CreateListDialog onCreateList={handleCreateList} />
            </div>

            {/* List Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">List Overview</h2>
                <span className="text-sm text-gray-600">
                  {lists.length} {lists.length === 1 ? 'list' : 'lists'}
                </span>
              </div>
              <ListOverview
                lists={lists}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
