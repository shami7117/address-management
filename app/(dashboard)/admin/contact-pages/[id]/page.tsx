'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, Trash2, CheckCircle, XCircle, Plus, Search, GripVertical, X, Upload, Loader2,Copy } from 'lucide-react';
import { useContactPageMembers } from '@/hooks/useContactPageMembers';
import { useContactReasons, useUpdateContactPage, useTogglePublishContactPage, useDeleteContactPage } from '@/hooks/use-contact-pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';


const ROLE_LABELS = {
  sales: 'Sales & Contract',
  operations: 'Operations & Service',
  daily: 'Day-to-Day Contact',
};

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

// ContactPageHeader Component
const ContactPageHeader = ({ 
  page, 
  onPreview, 
  onTogglePublish, 
  onDelete,
  onSave,
  isSaving,
  isTogglingPublish,
  isDeleting
}: { 
  page: ContactPage;
  onPreview: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isTogglingPublish?: boolean;
  isDeleting?: boolean;
}) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Generate public URL
  const publicUrl = `${window.location.origin}/public/${page.area_code}`;

  // Copy URL to clipboard
  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <>
      <div className="bg-white border-b p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{page.customer_name}</h1>
              <Badge variant={page.published ? "default" : "secondary"}>
                {page.published ? 'Published' : 'Unpublished'}
              </Badge>
            </div>
            <p className="text-gray-600 mb-2">Area Code: {page.area_code}</p>
            
            {/* Public URL - Only shown when published */}
            {page.published && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-900 mb-1">Public URL:</p>
                  <a 
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:text-green-900 hover:underline break-all"
                  >
                    {publicUrl}
                  </a>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyUrlToClipboard}
                  className="flex-shrink-0"
                >
                  {urlCopied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={onSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
            <Button 
              variant={page.published ? "secondary" : "default"}
              onClick={() => setPublishDialogOpen(true)}
              disabled={isTogglingPublish}
            >
              {isTogglingPublish ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : page.published ? (
                <XCircle className="w-4 h-4 mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {page.published ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      <div className={`fixed inset-0 z-50 ${publishDialogOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => !isTogglingPublish && setPublishDialogOpen(false)} />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">
              {page.published ? 'Unpublish' : 'Publish'} Contact Page
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {page.published ? 'unpublish' : 'publish'} this page?
              {!page.published && (
                <span className="block mt-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                  ✓ This will make your contact page publicly accessible
                </span>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPublishDialogOpen(false)} disabled={isTogglingPublish}>
                Cancel
              </Button>
              <Button onClick={() => { onTogglePublish(); setPublishDialogOpen(false); }} disabled={isTogglingPublish}>
                {isTogglingPublish ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {page.published ? 'Unpublish' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <div className={`fixed inset-0 z-50 ${deleteDialogOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => !isDeleting && setDeleteDialogOpen(false)} />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">Delete Contact Page</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this contact page? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => { onDelete(); setDeleteDialogOpen(false); }} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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

const MasterContactList = ({ 
  pageId,
  onAdd,
  isAdding 
}: { 
  pageId: string;
  onAdd: (contactId: string) => void;
  isAdding: boolean;
}) => {
  const [search, setSearch] = useState('');
  const { availableContacts } = useContactPageMembers(pageId);

  const filteredContacts = (availableContacts.data || []).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (availableContacts.isLoading) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Master Contacts</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

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
            <Button 
              size="sm" 
              onClick={() => onAdd(contact.id)}
              disabled={isAdding}
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
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
  onUpdateRole,
  onUpdateReasons,
  onRemove,
  isUpdating,
  isRemoving
}: { 
  member: any;
  reasons: any[];
  onUpdateRole: (role: string) => void;
  onUpdateReasons: (reasonIds: string[]) => void;
  onRemove: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-white border rounded-lg p-4 relative">
        {(isUpdating || isRemoving) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
        
        <div className="flex items-start gap-3 mb-3">
          <div className="cursor-move">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{member.name}</h4>
            <p className="text-sm text-gray-600 truncate">{member.title}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setRemoveDialogOpen(true)}
            disabled={isRemoving}
          >
            <X className="w-4 h-4 text-red-600" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <select
              value={member.role}
              onChange={(e) => onUpdateRole(e.target.value)}
              disabled={isUpdating}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="sales">{ROLE_LABELS.sales}</option>
              <option value="operations">{ROLE_LABELS.operations}</option>
              <option value="daily">{ROLE_LABELS.daily}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Contact Reasons</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {reasons.map(reason => {
                const isChecked = member.reasons.some((r: any) => r.id === reason.id);
                return (
                  <label key={reason.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentIds = member.reasons.map((r: any) => r.id);
                        const newIds = e.target.checked
                          ? [...currentIds, reason.id]
                          : currentIds.filter((id: string) => id !== reason.id);
                        onUpdateReasons(newIds);
                      }}
                      disabled={isUpdating}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{reason.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <div className={`fixed inset-0 z-50 ${removeDialogOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => !isRemoving && setRemoveDialogOpen(false)} />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">Remove Member</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove {member.name} from this contact page?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRemoveDialogOpen(false)} disabled={isRemoving}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => { onRemove(); setRemoveDialogOpen(false); }}
                disabled={isRemoving}
              >
                {isRemoving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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
  pageId,
  members, 
  reasons,
  onUpdate,
  onUpdateReasons,
  onRemove,
  onReorder,
  isUpdating,
  isRemoving
}: { 
  pageId: string;
  members: any[];
  reasons: any[];
  onUpdate: (memberId: string, role: string) => void;
  onUpdateReasons: (memberId: string, reasonIds: string[]) => void;
  onRemove: (memberId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isUpdating: string | null;
  isRemoving: string | null;
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
                onUpdateRole={(role) => onUpdate(member.id, role)}
                onUpdateReasons={(reasonIds) => onUpdateReasons(member.id, reasonIds)}
                onRemove={() => onRemove(member.id)}
                isUpdating={isUpdating === member.id}
                isRemoving={isRemoving === member.id}
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
  members: any[];
  reasons: Reason[];
}) => {
  const getReasonLabels = (memberReasons: Array<{id: string, label: string}>) => {
    if (!memberReasons || memberReasons.length === 0) return '';
    return memberReasons.map(r => r.label).join(', ');
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
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-semibold" style={{ backgroundColor: page.brand_color }}>
                        {member.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.title}</p>
                  <Badge style={{ backgroundColor: page.brand_color, color: 'white' }} className="mb-3">
{ROLE_LABELS[member.role as keyof typeof ROLE_LABELS]}
                  </Badge>
                  {member.reasons && member.reasons.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Contact for: {getReasonLabels(member.reasons)}
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
function ContactPageEditorContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const pageId = params.id; // ✅ No await needed in Client Component
  
  const {
    contactPage,
    members,
    addMember,
    updateMember,
    removeMember,
    reorderMembers,
    updateMemberReasons
  } = useContactPageMembers(pageId);
  
  const { data: contactReasons, isLoading: reasonsLoading } = useContactReasons();
  const updateContactPage = useUpdateContactPage();
  const togglePublish = useTogglePublishContactPage();
  const deleteContactPage = useDeleteContactPage();
  
  const [reasons, setReasons] = useState<any[]>([]);
  const [page, setPage] = useState({
    id: pageId,
    customer_name: '',
    area_code: '',
    published: false,
    brand_color: '#3b82f6',
    intro_text: '',
  });

  // Wait for contactPage data and update state when it loads
  useEffect(() => {
    if (contactPage.data) {
      setPage({
        id: pageId,
        customer_name: contactPage.data.customer_name || '',
        area_code: contactPage.data.area_code || '',
        published: contactPage.data.is_published || false,
        brand_color: contactPage.data.brand_color || '#3b82f6',
        intro_text: contactPage.data.intro_text || 'Welcome to our contact page. We\'re here to help you with all your plumbing needs.',
      });
    }
  }, [contactPage.data, pageId]);

  console.log("contactPage", contactPage.data);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [updatingMember, setUpdatingMember] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!reasonsLoading && contactReasons) {
      setReasons(contactReasons);
    }
  }, [contactReasons, reasonsLoading]);

  const handlePageChange = (updates: Partial<ContactPage>) => {
    setPage({ ...page, ...updates });
    setHasUnsavedChanges(true);
  };

  console.log("members", members.data);
  
  const handleSave = async () => {
    try {
      await updateContactPage.mutateAsync({
        id: pageId,
        data: {
          customer_name: page.customer_name,
          area_code: page.area_code,
          logo_url: (page as any).logo_url,
          brand_color: page.brand_color,
          intro_text: page.intro_text,
        }
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleTogglePublish = async () => {
    try {
      const result = await togglePublish.mutateAsync(pageId);
      setPage({ ...page, published: result.is_published });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContactPage.mutateAsync(pageId);
      // Redirect after successful deletion
      setTimeout(() => {
        router.push('/admin/contact-pages');
      }, 1500);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAddMember = async (contactId: string) => {
    const nextOrderIndex = members.data?.length || 0;
    await addMember.mutateAsync({
      contact_id: contactId,
      role: 'daily_contact',
      order_index: nextOrderIndex,
    });
  };

  const handleUpdateMemberRole = async (memberId: string, role: string) => {
    setUpdatingMember(memberId);
    try {
      await updateMember.mutateAsync({ memberId, data: { role } });
    } finally {
      setUpdatingMember(null);
    }
  };

  const handleUpdateMemberReasons = async (memberId: string, reasonIds: string[]) => {
    setUpdatingMember(memberId);
    try {
      await updateMemberReasons.mutateAsync({ memberId, reason_ids: reasonIds });
    } finally {
      setUpdatingMember(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setRemovingMember(memberId);
    try {
      await removeMember.mutateAsync(memberId);
    } finally {
      setRemovingMember(null);
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const membersList = members.data || [];
    const newMembers = [...membersList];
    const [movedMember] = newMembers.splice(fromIndex, 1);
    newMembers.splice(toIndex, 0, movedMember);

    const order = newMembers.map((m, i) => ({
      member_id: m.id,
      order_index: i,
    }));

    await reorderMembers.mutateAsync(order);
  };

  if (members.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <ContactPageHeader
          page={page}
          onPreview={() => setPreviewOpen(true)}
          onTogglePublish={handleTogglePublish}
          onDelete={handleDelete}
          onSave={handleSave}
          isSaving={updateContactPage.isPending}
          isTogglingPublish={togglePublish.isPending}
          isDeleting={deleteContactPage.isPending}
        />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <BrandingForm
              page={page}
              onChange={handlePageChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MasterContactList
                pageId={pageId}
                onAdd={handleAddMember}
                isAdding={addMember.isPending}
              />
              <PageMembersList
                pageId={pageId}
                members={members.data || []}
                reasons={reasons}
                onUpdate={handleUpdateMemberRole}
                onUpdateReasons={handleUpdateMemberReasons}
                onRemove={handleRemoveMember}
                onReorder={handleReorder}
                isUpdating={updatingMember}
                isRemoving={removingMember}
              />
            </div>
          </div>
        </main>
      </div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        page={page}
        members={members.data || []}
        reasons={reasons}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}


// Wrapper with QueryClientProvider
// ✅ Option 1: Make the wrapper async and await params
export default async function ContactPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <>
      <ContactPageEditorContent params={resolvedParams} />
      <Toaster position="top-right" />
    </>
  );
}