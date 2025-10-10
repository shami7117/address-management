// ============================================
// components/user/AddressProcessingTable.tsx
// ============================================

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProcessingAddress {
  id: string;
  address: string;
  comment: string;
  checked: boolean;
  lastChanged: Date;
}

interface AddressProcessingTableProps {
  addresses: ProcessingAddress[];
  onUpdateComment: (id: string, comment: string) => void;
  onToggleCheck: (id: string, checked: boolean) => void;
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

export default function AddressProcessingTable({
  addresses,
  onUpdateComment,
  onToggleCheck,
}: AddressProcessingTableProps) {
  const [editingComments, setEditingComments] = useState<{ [key: string]: string }>({});

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleCommentChange = (id: string, value: string) => {
    setEditingComments({ ...editingComments, [id]: value });
  };

  const handleCommentBlur = (id: string, originalComment: string) => {
    const newComment = editingComments[id];
    if (newComment !== undefined && newComment !== originalComment) {
      onUpdateComment(id, newComment);
    }
    // Clean up editing state
    const { [id]: removed, ...rest } = editingComments;
    setEditingComments(rest);
  };

  const getCommentValue = (id: string, originalComment: string) => {
    return editingComments[id] !== undefined ? editingComments[id] : originalComment;
  };

  if (addresses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-gray-600">No addresses found</p>
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
              <TableHead>Address</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="w-24">Checked</TableHead>
              <TableHead>Last Changed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="font-medium max-w-xs">
                  {address.address}
                </TableCell>
                <TableCell>
                  <Input
                    value={getCommentValue(address.id, address.comment)}
                    onChange={(e) => handleCommentChange(address.id, e.target.value)}
                    onBlur={() => handleCommentBlur(address.id, address.comment)}
                    placeholder="Add comment..."
                    className="max-w-sm"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={address.checked}
                    onCheckedChange={(checked) =>
                      onToggleCheck(address.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(address.lastChanged)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-medium flex-1">
                  {address.address}
                </CardTitle>
                {address.checked && (
                  <Badge variant="default" className="shrink-0">Checked</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Comment
                </label>
                <Input
                  value={getCommentValue(address.id, address.comment)}
                  onChange={(e) => handleCommentChange(address.id, e.target.value)}
                  onBlur={() => handleCommentBlur(address.id, address.comment)}
                  placeholder="Add comment..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`checked-${address.id}`}
                    checked={address.checked}
                    onCheckedChange={(checked) =>
                      onToggleCheck(address.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`checked-${address.id}`}
                    className="text-sm font-medium"
                  >
                    Checked
                  </label>
                </div>
                <span className="text-xs text-gray-600">
                  {formatDate(address.lastChanged)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
