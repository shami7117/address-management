'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Types
interface Reason {
  id: string;
  label: string;
  description?: string;
  created_at: string;
}

// ReasonCard Component (Mobile)
const ReasonCard = ({ 
  reason, 
  onEdit, 
  onDelete 
}: { 
  reason: Reason; 
  onEdit: (reason: Reason) => void; 
  onDelete: (reason: Reason) => void;
}) => (
  <div className="bg-white border rounded-lg p-4 space-y-3">
    <div>
      <h3 className="font-semibold text-lg">{reason.label}</h3>
      {reason.description && (
        <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
      )}
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(reason)} className="flex-1">
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(reason)} className="flex-1">
        Delete
      </Button>
    </div>
  </div>
);

// ReasonTable Component (Desktop)
const ReasonTable = ({ 
  reasons, 
  onEdit, 
  onDelete 
}: { 
  reasons: Reason[]; 
  onEdit: (reason: Reason) => void; 
  onDelete: (reason: Reason) => void;
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
        {reasons.map((reason) => (
          <tr key={reason.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {reason.label}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {reason.description || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(reason)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(reason)}>
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ReasonDialog Component
const ReasonDialog = ({ 
  open, 
  onOpenChange, 
  reason, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  reason?: Reason; 
  onSave: (data: { label: string; description?: string }) => void;
}) => {
  const [label, setLabel] = useState(reason?.label || '');
  const [description, setDescription] = useState(reason?.description || '');

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({ label: label.trim(), description: description.trim() || undefined });
    handleClose();
  };

  const handleClose = () => {
    setLabel('');
    setDescription('');
    onOpenChange(false);
  };

  // Reset form when dialog opens with new data
  if (open && reason && label !== reason.label) {
    setLabel(reason.label);
    setDescription(reason.description || '');
  } else if (open && !reason && label) {
    setLabel('');
    setDescription('');
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-lg p-6 m-4">
          <h2 className="text-xl font-semibold mb-4">
            {reason ? 'Edit Reason' : 'New Reason'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason label"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason description (optional)"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!label.trim()}>
              {reason ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DeleteReasonDialog Component
const DeleteReasonDialog = ({ 
  open, 
  onOpenChange, 
  reason, 
  onConfirm 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  reason?: Reason; 
  onConfirm: () => void;
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function ReasonsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reasons, setReasons] = useState<Reason[]>([
    {
      id: '1',
      label: 'General Inquiry',
      description: 'General questions about products or services',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      label: 'Technical Support',
      description: 'Technical issues or bug reports',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      label: 'Billing',
      description: 'Questions about invoices, payments, or subscriptions',
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      label: 'Feature Request',
      created_at: new Date().toISOString(),
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<Reason | undefined>();
  const [deletingReason, setDeletingReason] = useState<Reason | undefined>();

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
      setReasons(reasons.map(r => 
        r.id === editingReason.id 
          ? { ...r, ...data }
          : r
      ));
    } else {
      const newReason: Reason = {
        id: Date.now().toString(),
        label: data.label,
        description: data.description,
        created_at: new Date().toISOString(),
      };
      setReasons([...reasons, newReason]);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingReason) {
      setReasons(reasons.filter(r => r.id !== deletingReason.id));
      setDeletingReason(undefined);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Contact Reasons</h1>
              <Button onClick={handleNewReason}>
                <Plus className="w-4 h-4 mr-2" />
                New Reason
              </Button>
            </div>

            {reasons.length === 0 ? (
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
      />

      <DeleteReasonDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        reason={deletingReason} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
}