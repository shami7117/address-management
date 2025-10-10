// ============================================
// components/user/UserListTable.tsx
// ============================================

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserList {
  id: string;
  listName: string;
  areaCode: string;
  createdAt: Date;
  hasCheckedItems: boolean;
}

interface UserListTableProps {
  lists: UserList[];
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

export default function UserListTable({ lists }: UserListTableProps) {
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleOpen = (areaCode: string) => {
    // Navigate to user list detail page
    window.location.href = `/user/list/${areaCode}`;
    // TODO: Use Next.js router instead: router.push(`/user/list/${areaCode}`)
  };

  if (lists.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-gray-600">No lists found</p>
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
              <TableHead>List Name</TableHead>
              <TableHead>Area Code</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">{list.listName}</TableCell>
                <TableCell>{list.areaCode}</TableCell>
                <TableCell>{formatDate(list.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={list.hasCheckedItems ? 'default' : 'secondary'}>
                    {list.hasCheckedItems ? 'Has Checks' : 'No Checks'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpen(list.areaCode)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {lists.map((list) => (
          <Card key={list.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{list.listName}</CardTitle>
                  <CardDescription>Area Code: {list.areaCode}</CardDescription>
                </div>
                <Badge variant={list.hasCheckedItems ? 'default' : 'secondary'}>
                  {list.hasCheckedItems ? 'Checked' : 'Unchecked'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Created: {formatDate(list.createdAt)}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleOpen(list.areaCode)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open List
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}