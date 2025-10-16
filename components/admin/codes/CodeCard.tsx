'use client';

import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Code } from '@/app/admin/codes/page';

interface CodeCardProps {
  code: Code;
  onEdit: (code: Code) => void;
  onDelete: (code: Code) => void;
  onToggleActive: (id: string) => void;
}

export default function CodeCard({
  code,
  onEdit,
  onDelete,
  onToggleActive,
}: CodeCardProps) {
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <code className="font-mono font-bold text-lg bg-gray-100 px-3 py-1 rounded">
            {code.code}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={code.active}
            onCheckedChange={() => onToggleActive(code.id)}
          />
          <span className="text-sm text-gray-600">
            {code.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <span className="text-xs text-gray-500 uppercase font-semibold">
            Redirect URL
          </span>
          <a
            href={code.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-1 break-all"
          >
            {code.redirectUrl}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>

        <div className="flex gap-4">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Expiry Date
            </span>
            <p className="text-sm font-medium mt-1">
              {formatDate(code.expiryDate)}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Usage Count
            </span>
            <p className="text-sm font-bold mt-1">{code.usageCount}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(code)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(code)}
          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}