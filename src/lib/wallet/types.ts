export type WalletTransactionKind = "topup" | "booking_debit" | "booking_credit" | "payout";

export interface WalletSummary {
  id: string;
  balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  kind: WalletTransactionKind;
  note: string;
  createdAt: string;
}
