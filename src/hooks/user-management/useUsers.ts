import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/api/endpoints/userManagementApi';
import type { CreateUserPayload, UpdateUserPayload } from '@/api/endpoints/userManagementApi';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) => createUser(data),
    onSuccess: newUser => {
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) => updateUser(id, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: deletedId => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}
