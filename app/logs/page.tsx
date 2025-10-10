// app/logs/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import LogsSearchBar from '@/components/logs/LogsSearchBar';
import LogsFilterTabs from '@/components/logs/LogsFilterTabs';
import LogsTable from '@/components/logs/LogsTable';

// Types
export interface ActivityLog {
  id: string;
  date: Date;
  action: 'check' | 'uncheck' | 'edit_comment' | 'reorder';
  actor: string;
  address: string;
  note?: string;
}

export type LogAction = 'all' | 'check' | 'uncheck' | 'edit_comment' | 'reorder';

// Mock Data
const mockLogs: ActivityLog[] = [
  {
    id: '1',
    date: new Date('2024-03-15T14:30:00'),
    action: 'check',
    actor: 'John Doe',
    address: 'Østerågade 12, København',
    note: 'Verified location',
  },
  {
    id: '2',
    date: new Date('2024-03-15T13:45:00'),
    action: 'edit_comment',
    actor: 'Jane Smith',
    address: 'Åboulevarden 45, Århus',
    note: 'Updated contact information',
  },
  {
    id: '3',
    date: new Date('2024-03-15T12:20:00'),
    action: 'uncheck',
    actor: 'John Doe',
    address: 'Ærtevej 89, Ålborg',
    note: 'Needs re-verification',
  },
  {
    id: '4',
    date: new Date('2024-03-15T11:15:00'),
    action: 'reorder',
    actor: 'Admin User',
    address: '123 Main Street, Berlin',
    note: 'Reorganized priority list',
  },
  {
    id: '5',
    date: new Date('2024-03-15T10:30:00'),
    action: 'check',
    actor: 'Jane Smith',
    address: 'Nørregade 67, Odense',
  },
  {
    id: '6',
    date: new Date('2024-03-15T09:45:00'),
    action: 'edit_comment',
    actor: 'John Doe',
    address: 'Søndergade 23, Esbjerg',
    note: 'Added warehouse details',
  },
  {
    id: '7',
    date: new Date('2024-03-14T16:20:00'),
    action: 'check',
    actor: 'Admin User',
    address: 'Vestergade 34, Vejle',
  },
  {
    id: '8',
    date: new Date('2024-03-14T15:10:00'),
    action: 'uncheck',
    actor: 'Jane Smith',
    address: 'Østergade 78, Randers',
    note: 'Address not accessible',
  },
  {
    id: '9',
    date: new Date('2024-03-14T14:05:00'),
    action: 'reorder',
    actor: 'John Doe',
    address: 'Midtgade 12, Horsens',
    note: 'Changed processing order',
  },
  {
    id: '10',
    date: new Date('2024-03-14T13:30:00'),
    action: 'check',
    actor: 'Admin User',
    address: 'Brogade 56, Silkeborg',
  },
  {
    id: '11',
    date: new Date('2024-03-14T12:15:00'),
    action: 'edit_comment',
    actor: 'Jane Smith',
    address: 'Skolegade 89, Roskilde',
    note: 'Updated opening hours',
  },
  {
    id: '12',
    date: new Date('2024-03-14T11:00:00'),
    action: 'check',
    actor: 'John Doe',
    address: 'Kirkegade 23, Næstved',
  },
];

export default function ActivityLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<LogAction>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and search logic
  const filteredLogs = useMemo(() => {
    let filtered = [...mockLogs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.address.toLowerCase().includes(query) ||
          log.actor.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          (log.note && log.note.toLowerCase().includes(query))
      );
    }

    // Apply action type filter
    if (filterTab !== 'all') {
      filtered = filtered.filter((log) => log.action === filterTab);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const comparison = a.date.getTime() - b.date.getTime();
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [searchQuery, filterTab, sortOrder, mockLogs]);

  const handleToggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
              <p className="mt-1 text-sm text-gray-600">
                Track all changes and actions across the system
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <LogsSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <LogsFilterTabs activeTab={filterTab} onTabChange={setFilterTab} />
            </div>

            {/* Logs Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Activity History</h2>
                <span className="text-sm text-gray-600">
                  {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <LogsTable
                logs={filteredLogs}
                sortOrder={sortOrder}
                onToggleSort={handleToggleSort}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
