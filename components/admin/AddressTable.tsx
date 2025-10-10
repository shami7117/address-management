// ============================================
// components/admin/AddressTable.tsx
// ============================================

import React, { useState } from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Address {
  id: string;
  address: string;
  comment: string;
  checked: boolean;
  lastChanged: Date;
}

interface AddressTableProps {
  addresses: Address[];
  onUpdateAddress: (id: string, field: keyof Address, value: any) => void;
  onDeleteAddress: (id: string) => void;
  onReorderAddresses: (addresses: Address[]) => void;
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

const TableRow: React.FC<{ 
  children: React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  className?: string;
}> = ({ children, draggable, onDragStart, onDragOver, onDrop, className = '' }) => (
  <tr 
    className={`border-b transition-colors hover:bg-muted/50 ${className}`}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
  >
    {children}
  </tr>
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

export default function AddressTable({
  addresses,
  onUpdateAddress,
  onDeleteAddress,
  onReorderAddresses,
}: AddressTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return;

    const reordered = [...addresses];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, removed);

    onReorderAddresses(reordered);
    setDraggedIndex(null);
  };

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">&nbsp;</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="w-24">Checked</TableHead>
              <TableHead>Last Changed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address, index) => (
              <TableRow
                key={address.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className="cursor-move"
              >
                <TableCell>
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </TableCell>
                <TableCell className="font-medium">{address.address}</TableCell>
                <TableCell>
                  <Input
                    value={address.comment}
                    onChange={(e) =>
                      onUpdateAddress(address.id, 'comment', e.target.value)
                    }
                    placeholder="Add comment..."
                    className="max-w-xs"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={address.checked}
                    onCheckedChange={(checked) =>
                      onUpdateAddress(address.id, 'checked', checked)
                    }
                  />
                </TableCell>
                <TableCell>{formatDate(address.lastChanged)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAddress(address.id)}
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
        {addresses.map((address, index) => (
          <Card key={address.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {address.address}
              </CardTitle>
              <GripVertical className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Comment</label>
                <Input
                  value={address.comment}
                  onChange={(e) =>
                    onUpdateAddress(address.id, 'comment', e.target.value)
                  }
                  placeholder="Add comment..."
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`checked-${address.id}`}
                    checked={address.checked}
                    onCheckedChange={(checked) =>
                      onUpdateAddress(address.id, 'checked', checked)
                    }
                  />
                  <label
                    htmlFor={`checked-${address.id}`}
                    className="text-sm font-medium"
                  >
                    Checked
                  </label>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(address.lastChanged)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteAddress(address.id)}
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
