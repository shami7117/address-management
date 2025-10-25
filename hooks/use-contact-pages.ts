// hooks/use-contact-pages.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactPagesApi, contactPagesAPI, ContactPage, CreateContactPageData, UpdateContactPageData } from '@/lib/api/contact-pages';
import { toast } from 'sonner';

export const CONTACT_PAGES_QUERY_KEY = ['contact-pages'];
export const CONTACT_REASONS_QUERY_KEY = ['contact-reasons'];

export function useContactPages() {
  return useQuery({
    queryKey: CONTACT_PAGES_QUERY_KEY,
    queryFn: contactPagesApi.getAll,
  });
}

export function useContactReasons() {
  return useQuery({
    queryKey: CONTACT_REASONS_QUERY_KEY,
    queryFn: contactPagesAPI.fetchReasons,
  });
}

export function useCreateContactPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactPagesApi.create,
    onSuccess: (newPage) => {
      queryClient.setQueryData<ContactPage[]>(CONTACT_PAGES_QUERY_KEY, (old = []) => [
        ...old,
        newPage,
      ]);
      toast.success('Contact page created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateContactPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contactPagesApi.update(id, data),
    onSuccess: (updatedPage) => {
      queryClient.setQueryData<ContactPage[]>(CONTACT_PAGES_QUERY_KEY, (old = []) =>
        old.map((page) => (page.id === updatedPage.id ? updatedPage : page))
      );
      toast.success('Contact page updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useTogglePublishContactPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactPagesApi.togglePublish,
    onSuccess: (updatedPage) => {
      queryClient.setQueryData<ContactPage[]>(CONTACT_PAGES_QUERY_KEY, (old = []) =>
        old.map((page) => (page.id === updatedPage.id ? updatedPage : page))
      );
      const action = updatedPage.is_published ? 'published' : 'unpublished';
      toast.success(`Contact page ${action} successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteContactPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactPagesApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ContactPage[]>(CONTACT_PAGES_QUERY_KEY, (old = []) =>
        old.filter((page) => page.id !== deletedId)
      );
      toast.success('Contact page deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
