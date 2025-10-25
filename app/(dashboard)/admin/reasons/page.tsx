'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner"; // or your toast library

// Types
interface Reason {
  id: string;
  label: string;
  description?: string;
  created_at: string;
}

// API Functions
const fetchReasons = async (): Promise<Reason[]> => {
  const response = await fetch('/api/admin/contact-reasons');
  if (!response.ok) {
    throw new Error('Failed to fetch reasons');
  }
  return response.json();
};

const createReason = async (data: { label: string; description?: string }): Promise<Reason> => {
  const response = await fetch('/api/admin/contact-reasons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reason');
  }
  return response.json();
};

const updateReason = async ({ id, data }: { id: string; data: { label?: string; description?: string } }): Promise<Reason> => {
  const response = await fetch(`/api/admin/contact-reasons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reason');
  }
  return response.json();
};

const deleteReason = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/contact-reasons/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete reason');
  }
};

// ReasonCard Component (Mobile)
const ReasonCard = ({ 
  reason, 
  onEdit, 
  onDelete,
  isDeleting 
}: { 
  reason: Reason; 
  onEdit: (reason: Reason) => void; 
  onDelete: (reason: Reason) => void;
  isDeleting: boolean;
}) => (
  <div className="bg-white border rounded-lg p-4 space-y-3">
    <div>
      <h3 className="font-semibold text-lg">{reason.label}</h3>
      {reason.description && (
        <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
      )}
    </div>
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onEdit(reason)} 
        className="flex-1"
        disabled={isDeleting}
      >
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => onDelete(reason)} 
        className="flex-1"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </Button>
    </div>
  </div>
);

// ReasonTable Component (Desktop)
const ReasonTable = ({ 
  reasons, 
  onEdit, 
  onDelete,
  deletingId 
}: { 
  reasons: Reason[]; 
  onEdit: (reason: Reason) => void; 
  onDelete: (reason: Reason) => void;
  deletingId: string | null;
}) => (
  <div className="bg-white border rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Label
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {reasons.map((reason) => {
          const isDeleting = deletingId === reason.id;
          return (
            <tr key={reason.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {reason.label}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {reason.description || '—'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(reason)}
                    disabled={isDeleting}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDelete(reason)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// ReasonDialog Component
const ReasonDialog = ({ 
  open, 
  onOpenChange, 
  reason, 
  onSave,
  isSaving 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  reason?: Reason; 
  onSave: (data: { label: string; description?: string }) => void;
  isSaving: boolean;
}) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  // Reset form when dialog opens/closes or reason changes
  useEffect(() => {
    if (open) {
      setLabel(reason?.label || '');
      setDescription(reason?.description || '');
    }
  }, [open, reason]);

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({ label: label.trim(), description: description.trim() || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reason ? 'Edit Reason' : 'New Reason'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Label <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter reason label"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter reason description (optional)"
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!label.trim() || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {reason ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              reason ? 'Update' : 'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// DeleteReasonDialog Component
const DeleteReasonDialog = ({ 
  open, 
  onOpenChange, 
  reason, 
  onConfirm,
  isDeleting 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  reason?: Reason; 
  onConfirm: () => void;
  isDeleting: boolean;
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (isDeleting) return;
    onOpenChange(false);
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 m-4">
          <h2 className="text-xl font-semibold mb-2">Delete Reason</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this reason? This action cannot be undone.
          </p>
          {reason && (
            <div className="bg-gray-50 rounded p-3 mb-6">
              <p className="font-medium">{reason.label}</p>
              {reason.description && (
                <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function ReasonsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<Reason | undefined>();
  const [deletingReason, setDeletingReason] = useState<Reason | undefined>();

  // Fetch reasons query
  const { data: reasons = [], isLoading, error } = useQuery({
    queryKey: ['contact-reasons'],
    queryFn: fetchReasons,
  });

  // Create reason mutation
  const createMutation = useMutation({
    mutationFn: createReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-reasons'] });
      setDialogOpen(false);
      toast.success("Reason created successfully");

    },
    onError: (error: Error) => {
      toast.error(error.message);
        
    },
  });

  // Update reason mutation
  const updateMutation = useMutation({
    mutationFn: updateReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-reasons'] });
      setDialogOpen(false);
      setEditingReason(undefined);
      toast.success("Reason updated successfully");
       
    },
    onError: (error: Error) => {
     
      toast.error(error.message);
    },
  });

  // Delete reason mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-reasons'] });
      setDeleteDialogOpen(false);
      setDeletingReason(undefined);
      toast.success("Reason deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
       
    },
  });

  const handleNewReason = () => {
    setEditingReason(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (reason: Reason) => {
    setEditingReason(reason);
    setDialogOpen(true);
  };

  const handleDelete = (reason: Reason) => {
    setDeletingReason(reason);
    setDeleteDialogOpen(true);
  };

  const handleSave = (data: { label: string; description?: string }) => {
    if (editingReason) {
      updateMutation.mutate({ id: editingReason.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingReason) {
      deleteMutation.mutate(deletingReason.id);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Contact Reasons</h1>
              <Button onClick={handleNewReason} disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                New Reason
              </Button>
            </div>

            {isLoading ? (
              <div className="bg-white border rounded-lg p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading reasons...</p>
              </div>
            ) : error ? (
              <div className="bg-white border border-red-200 rounded-lg p-12 text-center">
                <p className="text-red-600 mb-4">Failed to load reasons</p>
                <Button 
                  variant="outline" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['contact-reasons'] })}
                >
                  Retry
                </Button>
              </div>
            ) : reasons.length === 0 ? (
              <div className="bg-white border rounded-lg p-12 text-center">
                <p className="text-gray-500 mb-4">No reasons yet</p>
                <Button onClick={handleNewReason}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first reason
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <ReasonTable 
                    reasons={reasons} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    deletingId={deleteMutation.isPending ? deletingReason?.id || null : null}
                  />
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {reasons.map((reason) => (
                    <ReasonCard 
                      key={reason.id} 
                      reason={reason} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete}
                      isDeleting={deleteMutation.isPending && deletingReason?.id === reason.id}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <ReasonDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        reason={editingReason} 
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteReasonDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        reason={deletingReason} 
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}