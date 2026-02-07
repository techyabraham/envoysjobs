"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHonourMessage = exports.sanitizeMessage = exports.sleep = void 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
const sanitizeMessage = (value) => value.replace(/[<>]/g, "").trim();
exports.sanitizeMessage = sanitizeMessage;
const isHonourMessage = (value) => value.trim().toLowerCase() === "i honour you";
exports.isHonourMessage = isHonourMessage;
