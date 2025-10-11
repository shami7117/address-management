// app/user/list/[areaCode]/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AddressSearchBar from '@/components/user/AddressSearchBar';
import FilterTabs from '@/components/user/FilterTabs';
import AddressProcessingTable from '@/components/user/AddressProcessingTable';

// Types
export interface ProcessingAddress {
  id: string;
  address: string;
  comment: string;
  checked: boolean;
  lastChanged: Date;
}

export interface EventLog {
  id: string;
  timestamp: Date;
  action: 'check' | 'uncheck' | 'comment';
  addressId: string;
  address: string;
  oldValue?: string;
  newValue?: string;
}

// Mock Data
const mockListData = {
  listName: 'Summer Campaign 2024',
  areaCode: '030',
};

const mockAddresses: ProcessingAddress[] = [
  {
    id: '1',
    address: 'Østerågade 12, København',
    comment: 'Primary location',
    checked: true,
    lastChanged: new Date('2024-03-15'),
  },
  {
    id: '2',
    address: 'Åboulevarden 45, Århus',
    comment: 'Secondary office',
    checked: false,
    lastChanged: new Date('2024-03-10'),
  },
  {
    id: '3',
    address: 'Ærtevej 89, Ålborg',
    comment: 'Branch location',
    checked: true,
    lastChanged: new Date('2024-02-28'),
  },
  {
    id: '4',
    address: '123 Main Street, Berlin',
    comment: '',
    checked: false,
    lastChanged: new Date('2024-03-01'),
  },
  {
    id: '5',
    address: 'Nørregade 67, Odense',
    comment: 'Warehouse',
    checked: true,
    lastChanged: new Date('2024-02-20'),
  },
  {
    id: '6',
    address: 'Søndergade 23, Esbjerg',
    comment: 'Distribution center',
    checked: false,
    lastChanged: new Date('2024-03-05'),
  },
];

export default function UserListDetailPage({ params }: { params: { areaCode: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addresses, setAddresses] = useState<ProcessingAddress[]>(mockAddresses);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'checked' | 'unchecked'>('all');

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    const total = addresses.length;
    const checked = addresses.filter(addr => addr.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    return { total, checked, percentage };
  }, [addresses]);

  // Add event to log
  const logEvent = (
    action: 'check' | 'uncheck' | 'comment',
    addressId: string,
    address: string,
    oldValue?: string,
    newValue?: string
  ) => {
    const newLog: EventLog = {
      id: String(Date.now()),
      timestamp: new Date(),
      action,
      addressId,
      address,
      oldValue,
      newValue,
    };
    setEventLogs([newLog, ...eventLogs]);
    console.log('Event logged:', newLog);
    // TODO: Send to Supabase
  };

  // Handle comment update
  const handleUpdateComment = (id: string, newComment: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    const oldComment = address.comment;
    
    setAddresses(
      addresses.map((addr) =>
        addr.id === id
          ? { ...addr, comment: newComment, lastChanged: new Date() }
          : addr
      )
    );

    logEvent('comment', id, address.address, oldComment, newComment);
    // TODO: Update in Supabase
  };

  // Handle checkbox toggle
  const handleToggleCheck = (id: string, checked: boolean) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    setAddresses(
      addresses.map((addr) =>
        addr.id === id
          ? { ...addr, checked, lastChanged: new Date() }
          : addr
      )
    );

    logEvent(checked ? 'check' : 'uncheck', id, address.address);
    // TODO: Update in Supabase
  };

  // Filter and search logic with ÆØÅ support
  const filteredAddresses = useMemo(() => {
    let filtered = [...addresses];

    // Apply search filter (supports ÆØÅ)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (addr) =>
          addr.address.toLowerCase().includes(query) ||
          addr.comment.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (filterTab === 'checked') {
      filtered = filtered.filter((addr) => addr.checked);
    } else if (filterTab === 'unchecked') {
      filtered = filtered.filter((addr) => !addr.checked);
    }

    return filtered;
  }, [addresses, searchQuery, filterTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Back Button & List Info */}
            <div className="mb-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => window.location.href = '/user'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  {mockListData.listName}
                </h1>
                <p className="text-sm text-gray-600">
                  Area Code: {params.areaCode}
                </p>
              </div>
            </div>

            {/* Progress Summary Card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold">List Progress</h3>
                        <span className="text-sm font-medium text-primary">
                          {progressStats.percentage}%
                        </span>
                      </div>
                      <Progress value={progressStats.percentage} className="h-2" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
                      {progressStats.checked}
                    </span>
                    {' / '}
                    <span className="font-medium text-gray-900">
                      {progressStats.total}
                    </span>
                    {' '}checked
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Toolbar */}
            <div className="mb-6 space-y-4">
              <AddressSearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterTabs activeTab={filterTab} onTabChange={setFilterTab} />
            </div>

            {/* Address Processing Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Address Processing</h2>
                <span className="text-sm text-gray-600">
                  {filteredAddresses.length} of {addresses.length} addresses
                </span>
              </div>
              <AddressProcessingTable
                addresses={filteredAddresses}
                onUpdateComment={handleUpdateComment}
                onToggleCheck={handleToggleCheck}
              />
            </div>

            {/* Event Log (for debugging - can be removed) */}
            {eventLogs.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                <div className="rounded-lg border bg-white p-4 max-h-64 overflow-y-auto">
                  {eventLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">{log.action.toUpperCase()}</span> - {log.address}
                      {log.action === 'comment' && (
                        <span className="ml-2">
                          "{log.oldValue}" → "{log.newValue}"
                        </span>
                      )}
                      <span className="ml-2 text-gray-400">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}