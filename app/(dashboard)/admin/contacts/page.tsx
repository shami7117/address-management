"use client";

import { useState } from "react";
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar'
import { ContactTable } from "@/components/admin/Contact/ContactTable";
import { ContactDialog } from "@/components/admin/Contact/ContactDialog";
import { ContactCard } from "@/components/admin/Contact/ContactCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo?: string;
  active: boolean;
}

export default function ContactsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Senior Manager",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      active: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Product Designer",
      email: "michael.chen@company.com",
      phone: "+1 (555) 234-5678",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      active: true,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "Marketing Director",
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 345-6789",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      active: false,
    },
    {
      id: "4",
      name: "David Kim",
      title: "Software Engineer",
      email: "david.kim@company.com",
      phone: "+1 (555) 456-7890",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      active: true,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleSaveContact = (contact: Omit<Contact, "id"> & { id?: string }) => {
    if (contact.id) {
      // Edit existing contact
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...contact, id: contact.id } : c))
      );
    } else {
      // Add new contact
      const newContact: Contact = {
        ...contact,
        id: Date.now().toString(),
      };
      setContacts((prev) => [...prev, newContact]);
    }
    setDialogOpen(false);
    setEditingContact(null);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active } : c))
    );
  };

  const handleNewContact = () => {
    setEditingContact(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} /> */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Master Contacts
              </h1>
              <Button onClick={handleNewContact} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Contact
              </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <ContactTable
                contacts={contacts}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                onToggleActive={handleToggleActive}
              />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <ContactDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        contact={editingContact}
        onSave={handleSaveContact}
      />
    </div>
  );
}