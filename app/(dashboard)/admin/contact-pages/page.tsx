// app/admin/contact-pages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useContactPages,
  useCreateContactPage,
  useUpdateContactPage,
  useTogglePublishContactPage,
  useDeleteContactPage,
} from '@/hooks/use-contact-pages';
import { ContactPage } from '@/lib/api/contact-pages';

// Utility function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// ContactPageCard Component (Mobile)
const ContactPageCard = ({ 
  page, 
  onView,
  onEdit, 
  onTogglePublish,
  onDelete,
  isPublishing,
  isDeleting,
}: { 
  page: ContactPage;
  onView: (page: ContactPage) => void;
  onEdit: (page: ContactPage) => void;
  onTogglePublish: (page: ContactPage) => void;
  onDelete: (page: ContactPage) => void;
  isPublishing: boolean;
  isDeleting: boolean;
}) => (
  <div className="bg-white border rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{page.customer_name}</h3>
        <p className="text-sm text-gray-600">Area Code: {page.area_code}</p>
        <p className="text-xs text-gray-500 mt-1">Updated: {formatDate(page.updated_at)}</p>
      </div>
      <Badge variant={page.is_published ? "default" : "secondary"}>
        {page.is_published ? 'Published' : 'Draft'}
      </Badge>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" size="sm" onClick={() => onView(page)}>
        <Eye className="w-4 h-4 mr-1" />
        View
      </Button>
      <Button variant="outline" size="sm" onClick={() => onEdit(page)}>
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>
      <Button 
        variant={page.is_published ? "secondary" : "default"} 
        size="sm" 
        onClick={() => onTogglePublish(page)}
        disabled={isPublishing || isDeleting}
      >
        {isPublishing ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : page.is_published ? (
          <XCircle className="w-4 h-4 mr-1" />
        ) : (
          <CheckCircle className="w-4 h-4 mr-1" />
        )}
        {page.is_published ? 'Unpublish' : 'Publish'}
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => onDelete(page)}
        disabled={isPublishing || isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 mr-1" />
        )}
        Delete
      </Button>
    </div>
  </div>
);

// ContactPagesTable Component (Desktop)
const ContactPagesTable = ({ 
  pages, 
  onView,
  onEdit,
  onTogglePublish,
  onDelete,
  publishingId,
  deletingId,
}: { 
  pages: ContactPage[];
  onView: (page: ContactPage) => void;
  onEdit: (page: ContactPage) => void;
  onTogglePublish: (page: ContactPage) => void;
  onDelete: (page: ContactPage) => void;
  publishingId: string | null;
  deletingId: string | null;
}) => (
  <div className="bg-white border rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Customer Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Area Code
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Published
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Updated
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {pages.map((page) => {
          const isPublishing = publishingId === page.id;
          const isDeleting = deletingId === page.id;
          const isDisabled = isPublishing || isDeleting;

          return (
            <tr key={page.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {page.customer_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {page.area_code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={page.is_published ? "default" : "secondary"}>
                  {page.is_published ? 'Yes' : 'No'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(page.updated_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(page)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(page)}
                    disabled={isDisabled}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onTogglePublish(page)}
                    disabled={isDisabled}
                  >
                    {isPublishing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : page.is_published ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(page)}
                    disabled={isDisabled}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
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

// ContactPageDialog Component
const ContactPageDialog = ({ 
  open, 
  onOpenChange, 
  page,
  existingAreaCodes,
  onSave,
  isSaving,
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  page?: ContactPage;
  existingAreaCodes: string[];
  onSave: (data: { customer_name: string; area_code: string }) => void;
  isSaving: boolean;
}) => {
  const [customerName, setCustomerName] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [errors, setErrors] = useState<{ customerName?: string; areaCode?: string }>({});

  const validate = () => {
    const newErrors: { customerName?: string; areaCode?: string } = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!areaCode.trim()) {
      newErrors.areaCode = 'Area code is required';
    } else if (!/^\d{4,5}$/.test(areaCode)) {
      newErrors.areaCode = 'Area code must be 4-5 digits';
    } else if (existingAreaCodes.includes(areaCode) && areaCode !== page?.area_code) {
      newErrors.areaCode = 'Area code already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ customer_name: customerName.trim(), area_code: areaCode.trim() });
  };

  const handleClose = () => {
    setCustomerName('');
    setAreaCode('');
    setErrors({});
    onOpenChange(false);
  };

  const handleAreaCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 5);
    setAreaCode(numericValue);
    if (errors.areaCode) {
      setErrors({ ...errors, areaCode: undefined });
    }
  };

  // Initialize / reset form when dialog opens or page changes
  useEffect(() => {
    if (open) {
      setCustomerName(page?.customer_name || '');
      setAreaCode(page?.area_code || '');
      setErrors({});
    } else {
      // clear when dialog closes
      setCustomerName('');
      setAreaCode('');
      setErrors({});
    }
  }, [open, page]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-lg p-6 m-4">
          <h2 className="text-xl font-semibold mb-4">
            {page ? 'Edit Contact Page' : 'New Contact Page'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) {
                    setErrors({ ...errors, customerName: undefined });
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
                disabled={isSaving}
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={areaCode}
                onChange={(e) => handleAreaCodeChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.areaCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 4-5 digit area code"
                maxLength={5}
                disabled={isSaving || !!page}
              />
              {errors.areaCode && (
                <p className="text-red-500 text-sm mt-1">{errors.areaCode}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Must be 4-5 digits and unique {page && '(cannot be changed)'}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {page ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                page ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PublishConfirmDialog Component
const PublishConfirmDialog = ({ 
  open, 
  onOpenChange, 
  page, 
  onConfirm,
  isConfirming,
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  page?: ContactPage; 
  onConfirm: () => void;
  isConfirming: boolean;
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const action = page?.is_published ? 'unpublish' : 'publish';

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => !isConfirming && onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 m-4">
          <h2 className="text-xl font-semibold mb-2 capitalize">{action} Contact Page</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to {action} this page?
          </p>
          {page && (
            <div className="bg-gray-50 rounded p-3 mb-6">
              <p className="font-medium">{page.customer_name}</p>
              <p className="text-sm text-gray-600">Area Code: {page.area_code}</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isConfirming}>
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {action === 'publish' ? 'Publishing...' : 'Unpublishing...'}
                </>
              ) : (
                action === 'publish' ? 'Publish' : 'Unpublish'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DeleteContactPageDialog Component
const DeleteContactPageDialog = ({ 
  open, 
  onOpenChange, 
  page, 
  onConfirm,
  isConfirming,
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  page?: ContactPage; 
  onConfirm: () => void;
  isConfirming: boolean;
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => !isConfirming && onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 m-4">
          <h2 className="text-xl font-semibold mb-2">Delete Contact Page</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this contact page? This cannot be undone.
          </p>
          {page && (
            <div className="bg-gray-50 rounded p-3 mb-6">
              <p className="font-medium">{page.customer_name}</p>
              <p className="text-sm text-gray-600">Area Code: {page.area_code}</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
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
export default function ContactPagesPage() {
  const router = useRouter();
  const { data: pages = [], isLoading, error } = useContactPages();
  const createMutation = useCreateContactPage();
  const updateMutation = useUpdateContactPage();
  const togglePublishMutation = useTogglePublishContactPage();
  const deleteMutation = useDeleteContactPage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContactPage | undefined>();
  const [targetPage, setTargetPage] = useState<ContactPage | undefined>();

  const existingAreaCodes = pages
    .filter(p => p.id !== editingPage?.id)
    .map(p => p.area_code);

  const handleNewPage = () => {
    setEditingPage(undefined);
    setDialogOpen(true);
  };

  const handleView = (page: ContactPage) => {
    router.push(`/admin/contact-pages/${page.id}`);
  };

  const handleEdit = (page: ContactPage) => {
    setEditingPage(page);
    setDialogOpen(true);
  };

  const handleTogglePublish = (page: ContactPage) => {
    setTargetPage(page);
    setPublishDialogOpen(true);
  };

  const handleDelete = (page: ContactPage) => {
    setTargetPage(page);
    setDeleteDialogOpen(true);
  };

  const handleSave = (data: { customer_name: string; area_code: string }) => {
    if (editingPage) {
      updateMutation.mutate(
        { id: editingPage.id, data: { customer_name: data.customer_name } },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingPage(undefined);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const handleConfirmPublish = () => {
    if (targetPage) {
      togglePublishMutation.mutate(targetPage.id, {
        onSuccess: () => {
          setPublishDialogOpen(false);
          setTargetPage(undefined);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (targetPage) {
      deleteMutation.mutate(targetPage.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setTargetPage(undefined);
        },
      });
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load contact pages</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Contact Pages</h1>
              <Button onClick={handleNewPage} disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                New Contact Page
              </Button>
            </div>

            {isLoading ? (
              <div className="bg-white border rounded-lg p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading contact pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="bg-white border rounded-lg p-12 text-center">
                <p className="text-gray-500 mb-4">No contact pages yet</p>
                <Button onClick={handleNewPage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first contact page
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <ContactPagesTable 
                    pages={pages} 
                    onView={handleView}
                    onEdit={handleEdit}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDelete}
                    publishingId={togglePublishMutation.isPending ? targetPage?.id || null : null}
                    deletingId={deleteMutation.isPending ? targetPage?.id || null : null}
                  />
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {pages.map((page) => (
                    <ContactPageCard 
                      key={page.id} 
                      page={page}
                      onView={handleView}
                      onEdit={handleEdit}
                      onTogglePublish={handleTogglePublish}
                      onDelete={handleDelete}
                      isPublishing={togglePublishMutation.isPending && targetPage?.id === page.id}
                      isDeleting={deleteMutation.isPending && targetPage?.id === page.id}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <ContactPageDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        page={editingPage}
        existingAreaCodes={existingAreaCodes}
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <PublishConfirmDialog 
        open={publishDialogOpen} 
        onOpenChange={setPublishDialogOpen} 
        page={targetPage} 
        onConfirm={handleConfirmPublish}
        isConfirming={togglePublishMutation.isPending}
      />

      <DeleteContactPageDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        page={targetPage} 
        onConfirm={handleConfirmDelete}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}