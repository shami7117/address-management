'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar'
import { useRouter } from 'next/navigation';

// Types
interface ContactPage {
  id: string;
  customer_name: string;
  area_code: string;
  published: boolean;
  last_updated: string;
  created_at: string;
}

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
  onDelete 
}: { 
  page: ContactPage;
  onView: (page: ContactPage) => void;
  onEdit: (page: ContactPage) => void;
  onTogglePublish: (page: ContactPage) => void;
  onDelete: (page: ContactPage) => void;
}) => (
  <div className="bg-white border rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{page.customer_name}</h3>
        <p className="text-sm text-gray-600">Area Code: {page.area_code}</p>
        <p className="text-xs text-gray-500 mt-1">Updated: {formatDate(page.last_updated)}</p>
      </div>
      <Badge variant={page.published ? "default" : "secondary"}>
        {page.published ? 'Published' : 'Draft'}
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
        variant={page.published ? "secondary" : "default"} 
        size="sm" 
        onClick={() => onTogglePublish(page)}
      >
        {page.published ? <XCircle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
        {page.published ? 'Unpublish' : 'Publish'}
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(page)}>
        <Trash2 className="w-4 h-4 mr-1" />
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
  onDelete 
}: { 
  pages: ContactPage[];
  onView: (page: ContactPage) => void;
  onEdit: (page: ContactPage) => void;
  onTogglePublish: (page: ContactPage) => void;
  onDelete: (page: ContactPage) => void;
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
        {pages.map((page) => (
          <tr key={page.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {page.customer_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {page.area_code}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant={page.published ? "default" : "secondary"}>
                {page.published ? 'Yes' : 'No'}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {formatDate(page.last_updated)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(page)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(page)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onTogglePublish(page)}
                >
                  {page.published ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(page)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
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
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  page?: ContactPage;
  existingAreaCodes: string[];
  onSave: (data: { customer_name: string; area_code: string }) => void;
}) => {
  const [customerName, setCustomerName] = useState(page?.customer_name || '');
  const [areaCode, setAreaCode] = useState(page?.area_code || '');
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
    handleClose();
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

  // Reset form when dialog opens with new data
  if (open && page && customerName !== page.customer_name) {
    setCustomerName(page.customer_name);
    setAreaCode(page.area_code);
    setErrors({});
  } else if (open && !page && customerName) {
    setCustomerName('');
    setAreaCode('');
    setErrors({});
  }

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
              />
              {errors.areaCode && (
                <p className="text-red-500 text-sm mt-1">{errors.areaCode}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Must be 4-5 digits and unique
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {page ? 'Update' : 'Create'}
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
  onConfirm 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  page?: ContactPage; 
  onConfirm: () => void;
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const action = page?.published ? 'unpublish' : 'publish';

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              {action === 'publish' ? 'Publish' : 'Unpublish'}
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
  onConfirm 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  page?: ContactPage; 
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
export default function ContactPagesPage() {
  const [pages, setPages] = useState<ContactPage[]>([
    {
      id: '1',
      customer_name: 'ABC Plumbing Services',
      area_code: '1234',
      published: true,
      last_updated: '2025-10-10T10:30:00Z',
      created_at: '2025-09-01T08:00:00Z',
    },
    {
      id: '2',
      customer_name: 'XYZ Electrical',
      area_code: '5678',
      published: false,
      last_updated: '2025-10-12T14:20:00Z',
      created_at: '2025-09-15T09:30:00Z',
    },
    {
      id: '3',
      customer_name: 'Pro Roofing Company',
      area_code: '9012',
      published: true,
      last_updated: '2025-10-08T16:45:00Z',
      created_at: '2025-08-20T11:00:00Z',
    },
    {
      id: '4',
      customer_name: 'Elite HVAC Solutions',
      area_code: '34567',
      published: true,
      last_updated: '2025-10-14T09:15:00Z',
      created_at: '2025-10-01T07:30:00Z',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContactPage | undefined>();
  const [targetPage, setTargetPage] = useState<ContactPage | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
const router=useRouter();
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
      setPages(pages.map(p => 
        p.id === editingPage.id 
          ? { ...p, ...data, last_updated: new Date().toISOString() }
          : p
      ));
    } else {
      const newPage: ContactPage = {
        id: Date.now().toString(),
        customer_name: data.customer_name,
        area_code: data.area_code,
        published: false,
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setPages([...pages, newPage]);
    }
  };

  const handleConfirmPublish = () => {
    if (targetPage) {
      setPages(pages.map(p => 
        p.id === targetPage.id 
          ? { ...p, published: !p.published, last_updated: new Date().toISOString() }
          : p
      ));
      setTargetPage(undefined);
    }
  };

  const handleConfirmDelete = () => {
    if (targetPage) {
      setPages(pages.filter(p => p.id !== targetPage.id));
      setTargetPage(undefined);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)}/>
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Contact Pages</h1>
              <Button onClick={handleNewPage}>
                <Plus className="w-4 h-4 mr-2" />
                New Contact Page
              </Button>
            </div>

            {pages.length === 0 ? (
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
      />

      <PublishConfirmDialog 
        open={publishDialogOpen} 
        onOpenChange={setPublishDialogOpen} 
        page={targetPage} 
        onConfirm={handleConfirmPublish} 
      />

      <DeleteContactPageDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        page={targetPage} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
}