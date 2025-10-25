// ====================================
// lib/api/contacts.ts - API Client Functions
// ====================================

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInput {
  name: string;
  title: string;
  email: string;
  phone: string;
  photo_url?: string;
  active?: boolean;
}

export interface UpdateContactInput {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  active?: boolean;
}

// Get all contacts
export async function getContacts(active?: boolean): Promise<Contact[]> {
  const params = new URLSearchParams();
  if (active !== undefined) {
    params.append("active", String(active));
  }
  
  const url = `/api/admin/contacts${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch contacts");
  }
  
  return response.json();
}

// Create a new contact
export async function createContact(input: CreateContactInput): Promise<Contact> {
  const response = await fetch("/api/admin/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create contact");
  }
  
  return response.json();
}

// Update a contact
export async function updateContact(
  id: string,
  input: UpdateContactInput
): Promise<Contact> {
  const response = await fetch(`/api/admin/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update contact");
  }
  
  return response.json();
}

// Toggle contact active status
export async function toggleContactActive(id: string): Promise<Contact> {
  const response = await fetch(`/api/admin/contacts/${id}/toggle`, {
    method: "PATCH",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to toggle contact status");
  }
  
  return response.json();
}

// Delete a contact
export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`/api/admin/contacts/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete contact");
  }
}