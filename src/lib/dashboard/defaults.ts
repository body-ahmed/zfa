export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  category: "venue" | "vendors" | "guests" | "style" | "legal";
};

export type BudgetLine = {
  id: string;
  category: string;
  planned: number;
  spent: number;
};

export type WeddingPlan = {
  weddingDate: string;
  venue: string;
  guestCount: number;
  budgetTotal: number;
  checklist: ChecklistItem[];
  budget: BudgetLine[];
  notes: string;
};

export function createDefaultPlan(): WeddingPlan {
  return {
    weddingDate: "",
    venue: "",
    guestCount: 120,
    budgetTotal: 85000,
    notes: "",
    checklist: [
      { id: "c1", label: "Book venue and confirm deposit", done: false, category: "venue" },
      { id: "c2", label: "Shortlist photographers and schedule visits", done: false, category: "vendors" },
      { id: "c3", label: "Send save-the-date messages", done: false, category: "guests" },
      { id: "c4", label: "Choose color palette and floral mood", done: false, category: "style" },
      { id: "c5", label: "Confirm legal paperwork timeline", done: false, category: "legal" },
      { id: "c6", label: "Finalize catering tasting", done: false, category: "vendors" },
    ],
    budget: [
      { id: "b1", category: "Venue", planned: 25000, spent: 0 },
      { id: "b2", category: "Catering", planned: 18000, spent: 0 },
      { id: "b3", category: "Photography", planned: 9000, spent: 0 },
      { id: "b4", category: "Decor & flowers", planned: 12000, spent: 0 },
      { id: "b5", category: "Attire & beauty", planned: 8000, spent: 0 },
      { id: "b6", category: "Miscellaneous", planned: 13000, spent: 0 },
    ],
  };
}

export function planStorageKey(userId: string) {
  return `zaffa.plan.${userId}`;
}
