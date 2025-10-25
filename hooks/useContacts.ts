// ====================================
// hooks/useContacts.ts - React Query Hooks
// ====================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or your toast library
import {
  Contact,
  CreateContactInput,
  UpdateContactInput,
  getContacts,
  createContact,
  updateContact,
  toggleContactActive,
  deleteContact,
} from "@/lib/api/contacts";

// Query key factory
export const contactKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (filters?: { active?: boolean }) => 
    [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, "detail"] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

// Get contacts query
export function useContacts(active?: boolean) {
  return useQuery({
    queryKey: contactKeys.list({ active }),
    queryFn: () => getContacts(active),
  });
}

// Create contact mutation
export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("Contact created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create contact");
    },
  });
}

// Update contact mutation
export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactInput }) =>
      updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("Contact updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update contact");
    },
  });
}

// Toggle contact active status mutation
export function useToggleContactActive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleContactActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("Contact status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update contact status");
    },
  });
}

// Delete contact mutation
export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("Contact deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete contact");
    },
  });
}