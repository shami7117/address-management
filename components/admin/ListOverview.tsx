// ============================================
// components/admin/ListOverview.tsx
// ============================================

import React from 'react';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ListItem {
  id: string;
  listName: string;
  areaCode: string;
  createdAt: Date;
}

interface ListOverviewProps {
  lists: ListItem[];
  onDelete: (id: string) => void;
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

export default function ListOverview({ lists, onDelete }: ListOverviewProps) {
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">{list.listName}</TableCell>
                <TableCell>{list.areaCode}</TableCell>
                <TableCell>{formatDate(list.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/lists/${list.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        Manage
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(list.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
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
              <CardTitle className="text-lg">{list.listName}</CardTitle>
              <CardDescription>Area Code: {list.areaCode}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Created: {formatDate(list.createdAt)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/admin/lists/${list.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Manage
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(list.id)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}