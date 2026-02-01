export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sanitizeMessage = (value: string) =>
  value.replace(/[<>]/g, "").trim();

export const isHonourMessage = (value: string) =>
  value.trim().toLowerCase() === "i honour you";
