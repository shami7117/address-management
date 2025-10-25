// ====================================
// components/admin/Contact/ContactCard.tsx - Updated
// ====================================

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Mail, Phone } from "lucide-react";

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    photo?: string;
    active: boolean;
  };
  onEdit: (contact: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function ContactCard({
  contact,
  onEdit,
  onDelete,
  onToggleActive,
}: ContactCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={contact.photo} alt={contact.name} />
          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">{contact.title}</p>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <Switch
                checked={contact.active}
                onCheckedChange={() => onToggleActive(contact.id)}
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{contact.phone}</span>
            </a>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(contact)}
              className="flex-1"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(contact.id)}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}