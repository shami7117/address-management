// app/user/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SearchBar from '@/components/user/SearchBar';
import FilterTabs from '@/components/user/FilterTabs';
import UserListTable from '@/components/user/UserListTable';

// Types
export interface UserList {
  id: string;
  listName: string;
  areaCode: string;
  createdAt: Date;
  hasCheckedItems: boolean;
}

// Mock Data
const mockUserLists: UserList[] = [
  {
    id: '1',
    listName: 'Summer Campaign 2024',
    areaCode: '030',
    createdAt: new Date('2024-03-15'),
    hasCheckedItems: true,
  },
  {
    id: '2',
    listName: 'Local Business Directory',
    areaCode: '040',
    createdAt: new Date('2024-02-20'),
    hasCheckedItems: false,
  },
  {
    id: '3',
    listName: 'Healthcare Providers',
    areaCode: '089',
    createdAt: new Date('2024-01-10'),
    hasCheckedItems: true,
  },
  {
    id: '4',
    listName: 'Restaurant Partners',
    areaCode: '069',
    createdAt: new Date('2024-03-01'),
    hasCheckedItems: false,
  },
  {
    id: '5',
    listName: 'Tech Startups Berlin',
    areaCode: '030',
    createdAt: new Date('2024-02-15'),
    hasCheckedItems: true,
  },
  {
    id: '6',
    listName: 'Retail Stores Munich',
    areaCode: '089',
    createdAt: new Date('2024-01-25'),
    hasCheckedItems: false,
  },
];

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'checked' | 'unchecked'>('all');

  // Filter and search logic
  const filteredLists = useMemo(() => {
    let filtered = [...mockUserLists];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (list) =>
          list.listName.toLowerCase().includes(query) ||
          list.areaCode.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (filterTab === 'checked') {
      filtered = filtered.filter((list) => list.hasCheckedItems);
    } else if (filterTab === 'unchecked') {
      filtered = filtered.filter((list) => !list.hasCheckedItems);
    }

    return filtered;
  }, [searchQuery, filterTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Search and manage your lists
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <FilterTabs activeTab={filterTab} onTabChange={setFilterTab} />
            </div>

            {/* Results Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lists</h2>
                <span className="text-sm text-gray-600">
                  {filteredLists.length} {filteredLists.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <UserListTable lists={filteredLists} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
