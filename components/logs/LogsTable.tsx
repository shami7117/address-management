// ============================================
// components/logs/LogsTable.tsx
// ============================================

import React from 'react';
import { ArrowUpDown, CheckCircle, XCircle, Edit, ArrowUpDown as Reorder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ActivityLog {
  id: string;
  date: Date;
  action: 'check' | 'uncheck' | 'edit_comment' | 'reorder';
  actor: string;
  address: string;
  note?: string;
}

interface LogsTableProps {
  logs: ActivityLog[];
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
}

// Table Components
const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="border-b transition-colors hover:bg-muted/50">{children}</tr>
);

const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`}>
    {children}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <td className={`p-4 align-middle ${className}`}>{children}</td>
);

// Helper Functions
const formatDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const getActionBadge = (action: ActivityLog['action']) => {
  const config = {
    check: { label: 'Check', variant: 'default' as const, icon: CheckCircle },
    uncheck: { label: 'Uncheck', variant: 'secondary' as const, icon: XCircle },
    edit_comment: { label: 'Edit', variant: 'outline' as const, icon: Edit },
    reorder: { label: 'Reorder', variant: 'outline' as const, icon: Reorder },
  };
  
  const { label, variant, icon: Icon } = config[action];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

export default function LogsTable({ logs, sortOrder, onToggleSort }: LogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-gray-600">No activity logs found</p>
        <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 lg:px-3"
                  onClick={onToggleSort}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {formatDateTime(log.date)}
                </TableCell>
                <TableCell>
                  {getActionBadge(log.action)}
                </TableCell>
                <TableCell className="font-medium">{log.actor}</TableCell>
                <TableCell className="max-w-xs truncate">{log.address}</TableCell>
                <TableCell className="max-w-sm text-gray-600">
                  {log.note || '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium">
                    {log.address}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {formatDateTime(log.date)}
                  </CardDescription>
                </div>
                {getActionBadge(log.action)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Actor:</span>
                <span className="font-medium">{log.actor}</span>
              </div>
              {log.note && (
                <div className="pt-2 border-t">
                  <span className="text-xs font-medium text-gray-600">Note:</span>
                  <p className="text-sm mt-1">{log.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sort Control for Mobile */}
      <div className="mt-4 flex justify-center md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSort}
        >
          Sort {sortOrder === 'desc' ? 'Oldest First' : 'Newest First'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}