// hooks/useContactPageMembers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactPagesAPI, contactPagesApi } from '@/lib/api/contact-pages';
import { toast } from 'sonner';

export function useContactPageMembers(pageId: string) {
  const queryClient = useQueryClient();

  const contactPage = useQuery({
    queryKey: ['contact-page', pageId],
    queryFn: () => contactPagesApi.getById(pageId),
    staleTime: 30000,
    enabled: !!pageId,
  });

  const members = useQuery({
    queryKey: ['contact-page-members', pageId],
    queryFn: () => contactPagesAPI.getMembers(pageId),
    staleTime: 30000,
  });

  const availableContacts = useQuery({
    queryKey: ['available-contacts', pageId],
    queryFn: () => contactPagesAPI.getAvailableContacts(pageId),
    staleTime: 30000,
  });

  const updateContactPage = useMutation({
    mutationFn: (data: any) => contactPagesApi.update(pageId, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['contact-page', pageId] });
      const previous = queryClient.getQueryData(['contact-page', pageId]);
      
      queryClient.setQueryData(['contact-page', pageId], (old: any) => ({
        ...old,
        ...newData,
      }));
      
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-page', pageId] });
      queryClient.invalidateQueries({ queryKey: ['contact-pages'] });
      toast.success('Contact page updated successfully');
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['contact-page', pageId], context?.previous);
      toast.error(error.message);
    },
  });

  const togglePublish = useMutation({
    mutationFn: () => contactPagesApi.togglePublish(pageId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contact-page', pageId] });
      const previous = queryClient.getQueryData(['contact-page', pageId]);
      
      queryClient.setQueryData(['contact-page', pageId], (old: any) => ({
        ...old,
        is_published: !old?.is_published,
      }));
      
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-page', pageId] });
      queryClient.invalidateQueries({ queryKey: ['contact-pages'] });
      toast.success('Publish status updated');
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['contact-page', pageId], context?.previous);
      toast.error(error.message);
    },
  });

  const addMember = useMutation({
    mutationFn: (data: { contact_id: string; role: string; order_index: number }) =>
      contactPagesAPI.addMember(pageId, data),
    onMutate: async (newMember) => {
      await queryClient.cancelQueries({ queryKey: ['contact-page-members', pageId] });
      const previous = queryClient.getQueryData(['contact-page-members', pageId]);
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-page-members', pageId] });
      queryClient.invalidateQueries({ queryKey: ['available-contacts', pageId] });
      toast.success('Member added successfully');
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['contact-page-members', pageId], context?.previous);
      toast.error(error.message);
    },
  });

  const updateMember = useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: any }) =>
      contactPagesAPI.updateMember(memberId, data),
    onMutate: async ({ memberId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['contact-page-members', pageId] });
      const previous = queryClient.getQueryData(['contact-page-members', pageId]);
      
      queryClient.setQueryData(['contact-page-members', pageId], (old: any) =>
        old?.map((m: any) => m.id === memberId ? { ...m, ...data } : m)
      );
      
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-page-members', pageId] });
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['contact-page-members', pageId], context?.previous);
      toast.error('Failed to update member');
    },
  });

  const removeMember = useMutation({
    mutationFn: (memberId: string) => contactPagesAPI.removeMember(memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: ['contact-page-members', pageId] });
      const previous = queryClient.getQueryData(['contact-page-members', pageId]);
      
      queryClient.setQueryData(['contact-page-members', pageId], (old: any) =>
        old?.filter((m: any) => m.id !== memberId)
      );
      
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-page-members', pageId] });
      queryClient.invalidateQueries({ queryKey: ['available-contacts', pageId] });
      toast.success('Member removed successfully');
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['contact-page-members', pageId], context?.previous);
      toast.error('Failed to remove member');
    },
  });

const reorderMembers = useMutation({
  mutationFn: async ({
    memberId,
    order,
  }: {
    memberId: string;
    order: { member_id: string; order_index: number }[];
  }) => {
    const res = await fetch(`/api/admin/contact-pages/members/${memberId}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (!res.ok) throw new Error('Failed to reorder members');
    return res.json();
  },

  onMutate: async (variables) => {
    const { order } = variables;
    await queryClient.cancelQueries({ queryKey: ['contact-page-members', pageId] });
    const previous = queryClient.getQueryData(['contact-page-members', pageId]);

    queryClient.setQueryData(['contact-page-members', pageId], (old: any) => {
      const orderMap = new Map(order.map(o => [o.member_id, o.order_index]));
      return old
        ?.map((m: any) => ({
          ...m,
          order_index: orderMap.get(m.id) ?? m.order_index,
        }))
        .sort((a: any, b: any) => a.order_index - b.order_index);
    });

    return { previous };
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['contact-page-members', pageId] });
  },

  onError: (error, _, context) => {
    queryClient.setQueryData(['contact-page-members', pageId], context?.previous);
    toast.error('Failed to reorder members');
  },
});

  const updateMemberReasons = useMutation({
    mutationFn: ({ memberId, reason_ids }: { memberId: string; reason_ids: string[] }) =>
      contactPagesAPI.updateMemberReasons(memberId, reason_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-page-members', pageId] });
      toast.success('Reasons updated');
    },
    onError: () => {
      toast.error('Failed to update reasons');
    },
  });

  return {
    contactPage,
    updateContactPage,
    togglePublish,
    members,
    availableContacts,
    addMember,
    updateMember,
    removeMember,
    reorderMembers,
    updateMemberReasons,
  };
}