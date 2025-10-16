import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityLog {
  id: string;
  date: string;
  code: string;
  redirectUrl: string;
  location: string;
  status: 'Success' | 'Expired' | 'Invalid';
}

interface AnalyticsTableProps {
  activities: ActivityLog[];
}

const statusColors = {
  Success: 'bg-green-100 text-green-800 hover:bg-green-100',
  Expired: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Invalid: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export default function AnalyticsTable({ activities }: AnalyticsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity (Last 20 Redirects)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Code</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Redirect URL</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Location</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    No recent activity
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm whitespace-nowrap">
                      {activity.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {activity.code}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <a
                        href={activity.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {activity.redirectUrl}
                      </a>
                    </td>
                    <td className="py-3 px-4">{activity.location}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={statusColors[activity.status]}
                        variant="secondary"
                      >
                        {activity.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}