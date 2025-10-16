'use client';

import React,{useState} from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AnalyticsStats from '@/components/admin/codes/AnalyticsStats';
import AnalyticsCharts from '@/components/admin/codes/AnalyticsCharts';
import AnalyticsTable from '@/components/admin/codes/AnalyticsTable';

// Mock data - replace with real API calls
const mockStatsData = {
  totalCodes: 1247,
  activeCodes: 892,
  inactiveCodes: 355,
  totalRedirects: 45678,
  mostUsedCode: {
    code: 'ABC123',
    count: 3456,
  },
};

const mockRedirectsOverTime = [
  { date: '10.10', redirects: 420 },
  { date: '11.10', redirects: 580 },
  { date: '12.10', redirects: 650 },
  { date: '13.10', redirects: 520 },
  { date: '14.10', redirects: 780 },
  { date: '15.10', redirects: 890 },
  { date: '16.10', redirects: 720 },
];

const mockCodeStatus = [
  { name: 'Active', value: 892 },
  { name: 'Inactive', value: 355 },
];

const mockTopCodes = [
  { code: 'ABC123', usage: 3456 },
  { code: 'XYZ789', usage: 2890 },
  { code: 'DEF456', usage: 2234 },
  { code: 'GHI012', usage: 1987 },
  { code: 'JKL345', usage: 1654 },
];

const mockActivities = Array.from({ length: 20 }, (_, i) => {
  const statuses: ('Success' | 'Expired' | 'Invalid')[] = ['Success', 'Expired', 'Invalid'];
  const cities = ['New York, US', 'London, UK', 'Tokyo, JP', 'Paris, FR', 'Sydney, AU'];
  const codes = ['ABC123', 'XYZ789', 'DEF456', 'GHI012', 'JKL345'];
  const urls = [
    'https://example.com/product/12345',
    'https://example.com/landing-page',
    'https://example.com/campaign/summer',
    'https://example.com/promo/special',
  ];

  const date = new Date();
  date.setHours(date.getHours() - i);
  
  return {
    id: `log-${i}`,
    date: date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ''),
    code: codes[Math.floor(Math.random() * codes.length)],
    redirectUrl: urls[Math.floor(Math.random() * urls.length)],
    location: cities[Math.floor(Math.random() * cities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
});

export default function AnalyticsPage() {

      const [sidebarOpen, setSidebarOpen] = useState(false);

      const handleExportCSV = () => {
    // Prepare CSV data
    const headers = ['Date', 'Code', 'Redirect URL', 'Location', 'Status'];
    const rows = mockActivities.map((activity) => [
      activity.date,
      activity.code,
      activity.redirectUrl,
      activity.location,
      activity.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}  />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)}/>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Code Analytics</h1>
              <Button onClick={handleExportCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Stats Cards */}
            <AnalyticsStats data={mockStatsData} />

            {/* Charts Section */}
            <AnalyticsCharts
              redirectsOverTime={mockRedirectsOverTime}
              codeStatus={mockCodeStatus}
              topCodes={mockTopCodes}
            />

            {/* Recent Activity Table */}
            <AnalyticsTable activities={mockActivities} />
          </div>
        </main>
      </div>
    </div>
  );
}