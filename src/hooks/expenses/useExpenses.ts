import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  createExpense,
  deleteExpense,
  listCategories,
  listExpenses,
  updateCategory,
  updateExpense,
} from '@/api/endpoints/expensesApi';
import type { AuditProperty } from '@/types/audit';
import type {
  UpdateExpenseCategoryInput,
  UpdateExpenseInput,
  CreateExpenseInput,
} from '@/types/expense';

export const expenseKeys = {
  all: ['expenses'] as const,
  list: (from: string, to: string, property?: AuditProperty) =>
    [...expenseKeys.all, 'list', from, to, property ?? 'all'] as const,
  categories: (includeInactive: boolean) => ['expenseCategories', includeInactive] as const,
};

export function useExpenses(from: string, to: string, property?: AuditProperty) {
  return useQuery({
    queryKey: expenseKeys.list(from, to, property),
    queryFn: () => listExpenses(from, to, property),
  });
}

export function useExpenseCategories(includeInactive = false) {
  return useQuery({
    queryKey: expenseKeys.categories(includeInactive),
    queryFn: () => listCategories(includeInactive),
  });
}

// An expense changes the net shown on the dashboard and the Revenue screen, so those refresh too.
function useInvalidateMoney() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    queryClient.invalidateQueries({ queryKey: ['revenueSummary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
}

export function useCreateExpense() {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: (data: CreateExpenseInput) => createExpense(data),
    onSuccess: invalidate,
  });
}

export function useUpdateExpense() {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseInput }) => updateExpense(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: invalidate,
  });
}

// A renamed category changes the names shown on expenses and on the monthly breakdown.
function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['expenseCategories'] });
    queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    queryClient.invalidateQueries({ queryKey: ['revenueSummary'] });
  };
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseCategoryInput }) =>
      updateCategory(id, data),
    onSuccess: invalidate,
  });
}
