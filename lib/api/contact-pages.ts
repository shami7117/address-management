// lib/api/contact-pages.ts
export interface ContactPage {
  id: string;
  customer_name: string;
  area_code: string;
  slug: string;
  is_published: boolean;
  created_at: string;
  logo_url?: string;
  updated_at: string;
}

export interface Reason {
  id: string;
  label: string;
  description?: string;
  created_at: string;
}

export interface CreateContactPageData {
  customer_name: string;
  area_code: string;
  brand_color?: string;
  intro_text?: string;
  logo_url?: string;
}

export interface UpdateContactPageData {
  customer_name?: string;
  brand_color?: string;
  intro_text?: string;
  logo_url?: string;
  is_published?: boolean;
}

export const contactPagesApi = {
  // GET all contact pages
  getAll: async (): Promise<ContactPage[]> => {
    const res = await fetch('/api/admin/contact-pages');
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to fetch contact pages');
    }
    const data = await res.json();
    return data.pages;
  },

  // GET single contact page
  getById: async (id: string): Promise<any> => {
    const res = await fetch(`/api/admin/contact-pages/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to fetch contact page');
    }
    const data = await res.json();
    return data.page;
  },

  // POST create new contact page
  create: async (data: CreateContactPageData): Promise<ContactPage> => {
    const res = await fetch('/api/admin/contact-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create contact page');
    }
    const result = await res.json();
    return result.page;
  },

  // PUT update contact page
  update: async (id: string, data: any): Promise<ContactPage> => {
    const res = await fetch(`/api/admin/contact-pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update contact page');
    }
    const result = await res.json();
    return result.page;
  },

  // PATCH toggle publish
  togglePublish: async (id: string): Promise<ContactPage> => {
    const res = await fetch(`/api/admin/contact-pages/${id}/publish`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to toggle publish status');
    }
    const result = await res.json();
    return result.page;
  },

  // DELETE contact page
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`/api/admin/contact-pages/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete contact page');
    }
  },
};

export interface PageMember {
  id: string;
  contact_id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo_url?: string;
  role: 'sales' | 'operations' | 'daily';
  order_index: number;
  reasons: { id: string; label: string }[];
}

export interface AvailableContact {
  id: string;
  name: string;
  title: string;
  photo_url?: string;
}

class ContactPagesAPI {
  async getMembers(pageId: string): Promise<PageMember[]> {
    const res = await fetch(`/api/admin/contact-pages/${pageId}/members`);
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  }

  async addMember(pageId: string, data: { contact_id: string; role: string; order_index: number }) {
    const res = await fetch(`/api/admin/contact-pages/${pageId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to add member');
    }
    return res.json();
  }

  async updateMember(memberId: string, data: { role?: string; order_index?: number }) {
    const res = await fetch(`/api/admin/contact-pages/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update member');
    return res.json();
  }

  async removeMember(memberId: string) {
    const res = await fetch(`/api/admin/contact-pages/members/${memberId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove member');
    return res.json();
  }

  async reorderMembers(memberId: any, order: { member_id: string; order_index: number }[]) {
  const res = await fetch(`/api/admin/contact-pages/members/${memberId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order }),
  });

  if (!res.ok) throw new Error('Failed to reorder members');
  return res.json();
}


  async updateMemberReasons(memberId: string, reason_ids: string[]) {
    console.log('🔍 Sending reason_ids:', reason_ids);
    console.log('🔍 First reason type:', typeof reason_ids[0], 'value:', reason_ids[0]);
    
    const res = await fetch(`/api/admin/contact-pages/members/${memberId}/reasons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason_ids }),
    });
    if (!res.ok) throw new Error('Failed to update reasons');
    return res.json();
  }

  async getAvailableContacts(pageId: string): Promise<AvailableContact[]> {
    const res = await fetch(`/api/admin/contact-pages/${pageId}/available-contacts`);
    if (!res.ok) throw new Error('Failed to fetch available contacts');
    return res.json();
  }

  async fetchReasons(): Promise<Reason[]> {
    const res = await fetch(`/api/admin/contact-reasons`);
    if (!res.ok) throw new Error('Failed to fetch reasons');
    return res.json();
  }
}

export const contactPagesAPI = new ContactPagesAPI();