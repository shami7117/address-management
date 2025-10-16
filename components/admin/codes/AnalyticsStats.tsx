import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, MousePointerClick, Award } from 'lucide-react';

interface StatsData {
  totalCodes: number;
  activeCodes: number;
  inactiveCodes: number;
  totalRedirects: number;
  mostUsedCode: {
    code: string;
    count: number;
  };
}

interface AnalyticsStatsProps {
  data: StatsData;
}

export default function AnalyticsStats({ data }: AnalyticsStatsProps) {
  const stats = [
    {
      title: 'Total Codes Created',
      value: data.totalCodes.toLocaleString(),
      icon: Activity,
      description: `${data.activeCodes} active, ${data.inactiveCodes} inactive`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active vs Inactive',
      value: `${data.activeCodes}/${data.inactiveCodes}`,
      icon: TrendingUp,
      description: `${((data.activeCodes / data.totalCodes) * 100).toFixed(1)}% active`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Redirects',
      value: data.totalRedirects.toLocaleString(),
      icon: MousePointerClick,
      description: 'All-time usage count',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Most Used Code',
      value: data.mostUsedCode.code,
      icon: Award,
      description: `${data.mostUsedCode.count.toLocaleString()} redirects`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}