// ====================================
// components/admin/Contact/ContactTable.tsx - With Loading States
// ====================================

import { Contact } from "@/lib/api/contacts";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface ContactTableProps {
  contacts: Array<{
    id: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    photo?: string;
    active: boolean;
  }>;
  onEdit: (contact: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => Promise<void>;
}

export function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onToggleActive,
}: ContactTableProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleToggle = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      await onToggleActive(id);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-20">Active</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No contacts found. Click "New Contact" to add one.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.photo} alt={contact.name} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-gray-600">{contact.title}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {contact.email}
                  </a>
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center  gap-2">
                    <Switch
                    className="cursor-pointer"
                      checked={contact.active}
                      onCheckedChange={() => handleToggle(contact.id)}
                      disabled={loadingStates[contact.id]}
                    />
                    {loadingStates[contact.id] && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(contact)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(contact.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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