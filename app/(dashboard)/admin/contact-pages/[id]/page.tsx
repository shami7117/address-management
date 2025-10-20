'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, Trash2, CheckCircle, XCircle, Plus, Search, GripVertical, X, Upload } from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar'

// Types
interface ContactPage {
  id: string;
  customer_name: string;
  area_code: string;
  published: boolean;
  logo_url?: string;
  brand_color: string;
  intro_text?: string;
}

interface Contact {
  id: string;
  name: string;
  title: string;
  photo_url?: string;
  status: 'active' | 'inactive';
}

interface PageMember {
  id: string;
  contact_id: string;
  contact: Contact;
  role: 'sales' | 'operations' | 'daily';
  reason_ids: string[];
  order_index: number;
}

interface Reason {
  id: string;
  label: string;
}

const ROLE_LABELS = {
  sales: 'Sales & Contract',
  operations: 'Operations & Service',
  daily: 'Day-to-Day Contact',
};

// ContactPageHeader Component
const ContactPageHeader = ({ 
  page, 
  onPreview, 
  onTogglePublish, 
  onDelete,
  onSave 
}: { 
  page: ContactPage;
  onPreview: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  onSave: () => void;
}) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-white border-b p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{page.customer_name}</h1>
              <Badge variant={page.published ? "default" : "secondary"}>
                {page.published ? 'Published' : 'Unpublished'}
              </Badge>
            </div>
            <p className="text-gray-600">Area Code: {page.area_code}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant={page.published ? "secondary" : "default"}
              onClick={() => setPublishDialogOpen(true)}
            >
              {page.published ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              {page.published ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      <div className={`fixed inset-0 z-50 ${publishDialogOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setPublishDialogOpen(false)} />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">
              {page.published ? 'Unpublish' : 'Publish'} Contact Page
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {page.published ? 'unpublish' : 'publish'} this page?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { onTogglePublish(); setPublishDialogOpen(false); }}>
                {page.published ? 'Unpublish' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <div className={`fixed inset-0 z-50 ${deleteDialogOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteDialogOpen(false)} />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">Delete Contact Page</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this contact page? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { onDelete(); setDeleteDialogOpen(false); }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// BrandingForm Component
const BrandingForm = ({ 
  page, 
  onChange 
}: { 
  page: ContactPage;
  onChange: (updates: Partial<ContactPage>) => void;
}) => {
  const [logoPreview, setLogoPreview] = useState(page.logo_url || '');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        onChange({ logo_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Branding</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-contain border rounded" />
            )}
            <label className="cursor-pointer">
              <div className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={page.brand_color}
              onChange={(e) => onChange({ brand_color: e.target.value })}
              className="h-10 w-20 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={page.brand_color}
              onChange={(e) => onChange({ brand_color: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md w-32"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Intro Text</label>
          <textarea
            value={page.intro_text || ''}
            onChange={(e) => onChange({ intro_text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter introduction text for your contact page..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

// MasterContactList Component
const MasterContactList = ({ 
  contacts, 
  onAdd 
}: { 
  contacts: Contact[];
  onAdd: (contact: Contact) => void;
}) => {
  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Master Contacts</h3>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search contacts..."
        />
      </div>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredContacts.map(contact => (
          <div key={contact.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
              {contact.photo_url ? (
                <img src={contact.photo_url} alt={contact.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                  {contact.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{contact.name}</p>
              <p className="text-xs text-gray-600 truncate">{contact.title}</p>
            </div>
            <Button size="sm" onClick={() => onAdd(contact)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// PageMemberCard Component
const PageMemberCard = ({ 
  member, 
  reasons,
  onUpdate,
  onRemove 
}: { 
  member: PageMember;
  reasons: Reason[];
  onUpdate: (updates: Partial<PageMember>) => void;
  onRemove: () => void;
}) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="cursor-move">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
            {member.contact.photo_url ? (
              <img src={member.contact.photo_url} alt={member.contact.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {member.contact.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{member.contact.name}</h4>
            <p className="text-sm text-gray-600 truncate">{member.contact.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setRemoveDialogOpen(true)}>
            <X className="w-4 h-4 text-red-600" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <select
              value={member.role}
              onChange={(e) => onUpdate({ role: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sales">{ROLE_LABELS.sales}</option>
              <option value="operations">{ROLE_LABELS.operations}</option>
              <option value="daily">{ROLE_LABELS.daily}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Contact Reasons</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {reasons.map(reason => (
                <label key={reason.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.reason_ids.includes(reason.id)}
                    onChange={(e) => {
                      const newReasons = e.target.checked
                        ? [...member.reason_ids, reason.id]
                        : member.reason_ids.filter(id => id !== reason.id);
                      onUpdate({ reason_ids: newReasons });
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <div className={`fixed inset-0 z-50 ${removeDialogOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setRemoveDialogOpen(false)} />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">Remove Member</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove {member.contact.name} from this contact page?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { onRemove(); setRemoveDialogOpen(false); }}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// PageMembersList Component
const PageMembersList = ({ 
  members, 
  reasons,
  onUpdate,
  onRemove,
  onReorder 
}: { 
  members: PageMember[];
  reasons: Reason[];
  onUpdate: (memberId: string, updates: Partial<PageMember>) => void;
  onRemove: (memberId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Page Members</h3>
      {members.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No members added yet.</p>
          <p className="text-sm mt-1">Add contacts from the master list.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIndex !== null && draggedIndex !== index) {
                  onReorder(draggedIndex, index);
                }
                setDraggedIndex(null);
              }}
            >
              <PageMemberCard
                member={member}
                reasons={reasons}
                onUpdate={(updates) => onUpdate(member.id, updates)}
                onRemove={() => onRemove(member.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PreviewDialog Component
const PreviewDialog = ({ 
  open, 
  onOpenChange, 
  page,
  members,
  reasons 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: ContactPage;
  members: PageMember[];
  reasons: Reason[];
}) => {
  const getReasonLabels = (reasonIds: string[]) => {
    return reasonIds.map(id => reasons.find(r => r.id === id)?.label).filter(Boolean).join(', ');
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg m-4">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">Preview: {page.customer_name}</h2>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]" style={{ backgroundColor: '#f9fafb' }}>
            {/* Branding Section */}
            <div className="bg-white rounded-lg p-6 mb-6 text-center" style={{ borderTop: `4px solid ${page.brand_color}` }}>
              {page.logo_url && (
                <img src={page.logo_url} alt="Logo" className="h-20 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2" style={{ color: page.brand_color }}>{page.customer_name}</h1>
              {page.intro_text && (
                <p className="text-gray-600 max-w-2xl mx-auto">{page.intro_text}</p>
              )}
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(member => (
                <div key={member.id} className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                    {member.contact.photo_url ? (
                      <img src={member.contact.photo_url} alt={member.contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-semibold">
                        {member.contact.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.contact.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.contact.title}</p>
                  <Badge style={{ backgroundColor: page.brand_color }} className="mb-3">
                    {ROLE_LABELS[member.role]}
                  </Badge>
                  {member.reason_ids.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Contact for: {getReasonLabels(member.reason_ids)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function ContactPageEditor({ params }: { params: { id: string } }) {
  const [page, setPage] = useState<ContactPage>({
    id: params.id,
    customer_name: 'ABC Plumbing Services',
    area_code: '1234',
    published: false,
    brand_color: '#3b82f6',
    intro_text: 'Welcome to our contact page. We\'re here to help you with all your plumbing needs.',
  });

  const [masterContacts] = useState<Contact[]>([
    { id: '1', name: 'John Smith', title: 'Sales Manager', status: 'active', photo_url: '' },
    { id: '2', name: 'Sarah Johnson', title: 'Service Coordinator', status: 'active', photo_url: '' },
    { id: '3', name: 'Mike Brown', title: 'Operations Director', status: 'active', photo_url: '' },
    { id: '4', name: 'Emily Davis', title: 'Customer Support', status: 'active', photo_url: '' },
    { id: '5', name: 'David Wilson', title: 'Technical Lead', status: 'active', photo_url: '' },
  ]);

  const [reasons] = useState<Reason[]>([
    { id: '1', label: 'General Inquiry' },
    { id: '2', label: 'Technical Support' },
    { id: '3', label: 'Billing' },
    { id: '4', label: 'Emergency Service' },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [members, setMembers] = useState<PageMember[]>([
    {
      id: 'm1',
      contact_id: '1',
      contact: masterContacts[0],
      role: 'sales',
      reason_ids: ['1', '3'],
      order_index: 0,
    },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAddMember = (contact: Contact) => {
    if (members.some(m => m.contact_id === contact.id)) {
      alert('This contact is already added to the page.');
      return;
    }

    const newMember: PageMember = {
      id: `m${Date.now()}`,
      contact_id: contact.id,
      contact,
      role: 'daily',
      reason_ids: [],
      order_index: members.length,
    };
    setMembers([...members, newMember]);
  };

  const handleUpdateMember = (memberId: string, updates: Partial<PageMember>) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, ...updates } : m));
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newMembers = [...members];
    const [movedMember] = newMembers.splice(fromIndex, 1);
    newMembers.splice(toIndex, 0, movedMember);
    setMembers(newMembers.map((m, i) => ({ ...m, order_index: i })));
  };

  const handleSave = () => {
    alert('Changes saved successfully!');
  };

  const handleTogglePublish = () => {
    setPage({ ...page, published: !page.published });
  };

  const handleDelete = () => {
    alert('Contact page deleted. Redirecting...');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/> */}
      <div className="flex-1 flex flex-col">
        {/* <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)}/> */}
        <ContactPageHeader
          page={page}
          onPreview={() => setPreviewOpen(true)}
          onTogglePublish={handleTogglePublish}
          onDelete={handleDelete}
          onSave={handleSave}
        />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Branding Section */}
            <BrandingForm
              page={page}
              onChange={(updates) => setPage({ ...page, ...updates })}
            />

            {/* Members Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MasterContactList
                contacts={masterContacts.filter(c => c.status === 'active')}
                onAdd={handleAddMember}
              />
              <PageMembersList
                members={members}
                reasons={reasons}
                onUpdate={handleUpdateMember}
                onRemove={handleRemoveMember}
                onReorder={handleReorder}
              />
            </div>
          </div>
        </main>
      </div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        page={page}
        members={members}
        reasons={reasons}
      />
    </div>
  );
}