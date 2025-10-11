// =============================================
// FILE: components/wallboard/WallboardTable.tsx
// =============================================
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Address {
  id: number;
  addressText: string;
  comment: string;
  checked: boolean;
}

interface WallboardTableProps {
  addresses: Address[];
}

export default function WallboardTable({ addresses }: WallboardTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Address</TableHead>
              <TableHead className="w-[30%]">Comment</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="font-medium">{address.addressText}</TableCell>
                <TableCell className="text-gray-600">
                  {address.comment || <span className="text-gray-400 italic">No comment</span>}
                </TableCell>
                <TableCell>
                  {address.checked ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      Checked
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Checked</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {addresses.map((address) => (
          <div key={address.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-medium text-gray-900 flex-1">{address.addressText}</p>
              {address.checked ? (
                <Badge variant="default" className="bg-green-600 hover:bg-green-700 shrink-0">
                  Checked
                </Badge>
              ) : (
                <Badge variant="secondary" className="shrink-0">Not Checked</Badge>
              )}
            </div>
            {address.comment && (
              <p className="text-sm text-gray-600 mt-2">{address.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}