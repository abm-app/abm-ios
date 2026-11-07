import type { AnyAuditEventType, MoneyEventType } from '@/types/audit';
import { formatRupees } from './formatters';

export const MONEY_EVENT_LABELS: Record<MoneyEventType, string> = {
  expense_created: 'Expense Added',
  expense_updated: 'Expense Edited',
  expense_deleted: 'Expense Deleted',
  expense_category_created: 'Category Added',
  expense_category_updated: 'Category Updated',
  petty_cash_added: 'Petty Cash Added',
  petty_cash_removed: 'Petty Cash Removed',
};

export function isMoneyEventType(type: AnyAuditEventType): type is MoneyEventType {
  return type in MONEY_EVENT_LABELS;
}

type Fields = Record<string, unknown>;

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

// "Generator diesel · ₹1,500" for an expense, "Tea · spent ₹100" for petty cash, the name for a category.
// Deleted events keep the record in `before`; the others keep it in `after`.
export function getMoneyEventSummary(type: MoneyEventType, before: Fields, after: Fields): string {
  const source = type === 'expense_deleted' ? before : after;

  if (type === 'expense_category_created' || type === 'expense_category_updated') {
    return text(source.name);
  }

  if (type === 'petty_cash_added' || type === 'petty_cash_removed') {
    const income = Number(source.income ?? 0);
    const expense = Number(source.expense ?? 0);
    const amount =
      expense > 0 ? `spent ${formatRupees(expense)}` : `received ${formatRupees(income)}`;
    return [text(source.description), amount].filter(Boolean).join(' · ');
  }

  const amount = typeof source.amount === 'number' ? formatRupees(source.amount) : '';
  return [text(source.description), amount].filter(Boolean).join(' · ');
}
