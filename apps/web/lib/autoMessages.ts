export const isHonourMessage = (value: string) =>
  value.trim().toLowerCase() === "i honour you";

export const defaultQuickReplies = [
  "Thank you, I appreciate it",
  "Grateful for the opportunity",
  "May we discuss the details?"
];

export type AutoTemplate = {
  text: string;
  quickReplies: string[];
  triggerRules?: { exactMatch?: string } | Record<string, unknown>;
};

export function buildSuggestedReplies(lastReceivedText: string | null | undefined, templates: AutoTemplate[]) {
  const normalized = String(lastReceivedText || "").trim().toLowerCase();
  const fallback = [
    "Hello, I'm interested in this opportunity",
    "Thank you for reaching out",
    "I'm available to proceed"
  ];

  if (!normalized) return fallback;

  const matched = templates.find((template) => {
    const exact = (template.triggerRules as any)?.exactMatch;
    return typeof exact === "string" && exact.trim().toLowerCase() === normalized;
  });

  const suggestions = new Set<string>();
  if (matched?.quickReplies?.length) {
    matched.quickReplies.forEach((item) => suggestions.add(item));
  }
  if (isHonourMessage(normalized)) {
    suggestions.add("you are amazing");
    defaultQuickReplies.forEach((item) => suggestions.add(item));
  }
  if (!suggestions.size) {
    fallback.forEach((item) => suggestions.add(item));
  }

  return Array.from(suggestions).slice(0, 5);
}
