import type { AuditProperty } from './audit';

export interface Expense {
  id: string;
  property: AuditProperty;
  // IST calendar date, YYYY-MM-DD. Set by the server to today; never sent by the app.
  date: string;
  amount: number;
  description: string;
  categoryId: string | null;
  categoryName: string | null;
  // A user id, not a name.
  createdBy: string;
  // UTC with a trailing Z.
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  property: AuditProperty;
  amount: number;
  description: string;
  categoryId?: string | null;
}

// property and date cannot be changed; the server rejects them with a 400.
export interface UpdateExpenseInput {
  amount?: number;
  description?: string;
  // null clears the category.
  categoryId?: string | null;
}

export interface ExpenseListResponse {
  results: Expense[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  active: boolean;
}

export interface ExpenseCategoryListResponse {
  results: ExpenseCategory[];
}

export interface UpdateExpenseCategoryInput {
  name?: string;
  active?: boolean;
}
