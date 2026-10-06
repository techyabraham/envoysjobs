"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";

interface SignupPageProps {
  onNavigate?: (page: string) => void;
  onSignup?: (data: { firstName: string; lastName: string; email: string; password: string }) => void;
}

export function SignupPage({ onNavigate, onSignup }: SignupPageProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.firstName.trim().length < 2) nextErrors.firstName = "Enter your first name";
    if (form.lastName.trim().length < 2) nextErrors.lastName = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address";
    if (form.password.length < 8) nextErrors.password = "Use at least 8 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSignup?.({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password
    });
  };

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-secondary">
      <div className="p-4">
        <button type="button" onClick={() => onNavigate?.("home")} className="flex items-center gap-2 text-foreground-secondary transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </button>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <img src="/envoysjobs.com-logo.png" alt="EnvoysJobs" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-foreground">EnvoysJobs</span>
            </div>
            <h1 className="text-3xl font-semibold">Join the community</h1>
            <p className="mt-2 text-foreground-secondary">Create your account. You can choose how to take part next.</p>
          </div>

          <form onSubmit={submit} className="space-y-6 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First name" autoComplete="given-name" placeholder="First name" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} error={errors.firstName} />
              <Input label="Last name" autoComplete="family-name" placeholder="Last name" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} error={errors.lastName} />
            </div>
            <Input type="email" label="Email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => update("email", event.target.value)} error={errors.email} />
            <Input type="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={(event) => update("password", event.target.value)} error={errors.password} />
            <Button type="submit" variant="primary" size="lg" className="w-full">Create account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground-secondary">Already have an account? <button type="button" onClick={() => onNavigate?.("login")} className="font-medium text-deep-blue hover:underline">Sign in</button></p>
          <p className="mt-8 text-center text-sm text-foreground-tertiary">Built with honour for RCCG The Envoys</p>
        </div>
      </main>
    </div>
  );
}
