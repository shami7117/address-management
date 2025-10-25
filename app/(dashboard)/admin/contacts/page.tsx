// ====================================
// app/(dashboard)/admin/contacts/page.tsx - Updated Page
// ====================================

"use client";

import { useState } from "react";
import { ContactTable } from "@/components/admin/Contact/ContactTable";
import { ContactDialog } from "@/components/admin/Contact/ContactDialog";
import { ContactCard } from "@/components/admin/Contact/ContactCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { Contact } from "@/lib/api/contacts";
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useToggleContactActive,
  useDeleteContact,
} from "@/hooks/useContacts";

export default function ContactsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch contacts
  const { data: contacts = [], isLoading, error } = useContacts();

  // Mutations
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const toggleMutation = useToggleContactActive();
  const deleteMutation = useDeleteContact();

  const handleSaveContact = async (contactData: any) => {
    try {
      if (contactData.id) {
        // Update existing contact
        await updateMutation.mutateAsync({
          id: contactData.id,
          data: {
            name: contactData.name,
            title: contactData.title,
            email: contactData.email,
            phone: contactData.phone,
            photo_url: contactData.photo,
            active: contactData.active,
          },
        });
      } else {
        // Create new contact
        await createMutation.mutateAsync({
          name: contactData.name,
          title: contactData.title,
          email: contactData.email,
          phone: contactData.phone,
          photo_url: contactData.photo,
          active: contactData.active,
        });
      }
      setDialogOpen(false);
      setEditingContact(null);
    } catch (error) {
      // Error is handled by the mutation's onError
      console.error("Failed to save contact:", error);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    // open confirm dialog for the selected contact
    setDeletingContactId(id);
    setDeleteDialogOpen(true);
  };

  // confirm delete from dialog
  const confirmDeleteContact = async () => {
    if (!deletingContactId) return;
    try {
      await deleteMutation.mutateAsync(deletingContactId);
    } finally {
      setDeletingContactId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    await toggleMutation.mutateAsync(id);
  };

  const handleNewContact = () => {
    setEditingContact(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContact(null);
  };

  // Transform Contact to match component props
  const transformedContacts = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    title: contact.title,
    email: contact.email,
    phone: contact.phone,
    photo: contact.photo_url,
    active: contact.active,
  }));

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Master Contacts
              </h1>
              <Button 
                onClick={handleNewContact} 
                className="w-full sm:w-auto"
                disabled={createMutation.isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Contact
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Error loading contacts: {error.message}
              </div>
            )}

            {/* Desktop Table View */}
            {!isLoading && !error && (
              <>
                <div className="hidden md:block">
                  <ContactTable
                    contacts={transformedContacts}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onToggleActive={handleToggleActive}
                  />
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {transformedContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={handleEditContact}
                      onDelete={handleDeleteContact}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <ContactDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        contact={editingContact ? {
          id: editingContact.id,
          name: editingContact.name,
          title: editingContact.title,
          email: editingContact.email,
          phone: editingContact.phone,
          photo: editingContact.photo_url,
          active: editingContact.active,
        } : null}
        onSave={handleSaveContact}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletingContactId(null);
              }}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteContact}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
