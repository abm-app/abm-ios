import apiClient from '../client';
import type { AuditProperty } from '@/types/audit';
import type {
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  ExpenseCategoryListResponse,
  ExpenseListResponse,
  UpdateExpenseCategoryInput,
  UpdateExpenseInput,
} from '@/types/expense';

// from / to are zero-padded YYYY-MM-DD (IST calendar dates), inclusive.
export const listExpenses = (
  from: string,
  to: string,
  property?: AuditProperty,
): Promise<Expense[]> =>
  apiClient
    .get<ExpenseListResponse>('/revenue/expenses', {
      params: { from, to, ...(property ? { property } : {}) },
    })
    .then(r => r.data.results);

export const createExpense = (data: CreateExpenseInput): Promise<Expense> =>
  apiClient.post<Expense>('/revenue/expenses', data).then(r => r.data);

export const updateExpense = (id: string, data: UpdateExpenseInput): Promise<Expense> =>
  apiClient.patch<Expense>(`/revenue/expenses/${id}`, data).then(r => r.data);

// 204 with no body
export const deleteExpense = (id: string): Promise<string> =>
  apiClient.delete(`/revenue/expenses/${id}`).then(() => id);

export const listCategories = (includeInactive = false): Promise<ExpenseCategory[]> =>
  apiClient
    .get<ExpenseCategoryListResponse>('/revenue/expense-categories', {
      params: includeInactive ? { includeInactive: 'true' } : {},
    })
    .then(r => r.data.results);

// 409 when the name already exists (any capitalisation)
export const createCategory = (name: string): Promise<ExpenseCategory> =>
  apiClient.post<ExpenseCategory>('/revenue/expense-categories', { name }).then(r => r.data);

export const updateCategory = (
  id: string,
  data: UpdateExpenseCategoryInput,
): Promise<ExpenseCategory> =>
  apiClient.patch<ExpenseCategory>(`/revenue/expense-categories/${id}`, data).then(r => r.data);
