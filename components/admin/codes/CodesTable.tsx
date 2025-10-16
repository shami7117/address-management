'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Code } from '@/app/admin/codes/page';

interface CodesTableProps {
  codes: Code[];
  onEdit: (code: Code) => void;
  onDelete: (code: Code) => void;
  onToggleActive: (id: string) => void;
}

export default function CodesTable({
  codes,
  onEdit,
  onDelete,
  onToggleActive,
}: CodesTableProps) {
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration Code</TableHead>
            <TableHead>Redirect URL</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Usage Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No codes found
              </TableCell>
            </TableRow>
          ) : (
            codes.map((code) => (
              <TableRow key={code.id}>
                <TableCell>
                  <code className="font-mono font-semibold text-sm bg-gray-100 px-2 py-1 rounded">
                    {code.code}
                  </code>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  <a
                    href={code.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {code.redirectUrl}
                  </a>
                </TableCell>
                <TableCell>{formatDate(code.expiryDate)}</TableCell>
                <TableCell>
                  <Switch
                    checked={code.active}
                    onCheckedChange={() => onToggleActive(code.id)}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{code.usageCount}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(code)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(code)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}